// ctrl-f "placeholder" without the quotes to find things we need to fix before we're done

jQuery("document").ready(function() {
    var $ = jQuery.noConflict();
    console.log("Page loaded and ready.");

    // VARS & SETUP
    var jAdmins = {"admins":[]};
    var bAdmin;
    var bAdminMessageAnimationRunning = false;
    var sAdminTemplate = '<div class="admin-list-item"><h3>Name: {{name}}</h3><h3>ID: {{id}}</h3><i class="fa fa-pencil edit-item" aria-hidden="true"></i><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';
    var sEditAdminTemplate = '<div class="modal-admin-edit-form-container"><form><input type="text" placeholder="Name..." value="{{name}}"><input type="text" placeholder="ID..." value="{{id}}"><input type="submit" value="SUBMIT"></form></div>';

    var jEvents = {"events":[]};
    var sEventTemplate = '<div class="event-item round-corners"><form class="lblEventCreate"><div><input class="lblEventImage" type="text" value="{{img}}"></div><div><div><input class="lblEventTitle" type="text" value="{{title}}"><input class="lblEventOrganizer" type="text" value="{{organizer}}"><input class="lblEventDate" type="date" value="{{date}}"><input class="lblEventPrice" type="text" value="{{price}}"><input class="lblEventLocation" type="text" value="{{location}}"><a href="#">{{partners}}</a><input type="submit" class="btnEventCreate" value="CREATE"></div><div><textarea class="lblEventDescription">{{description}}</textarea></div></div><input class="lblEventId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';

    var jPartners = {"partners":[]};
    var sPartnerTemplate = '<div class="partner-item round-corners"><form class="lblPartnerCreate"><div><input class="lblPartnerImage" type="text" value="{{img}}"></div><div><div><input class="lblPartnerName" type="text" value="{{name}}"><input class="lblPartnerCEO" type="text" value="{{ceo}}"><input class="lblPartnerWebsite" type="text" value="{{website}}"><input class="lblPartnerHeadquarters" type="text" value="{{headquarters}}"><input class="btnPartnerCreate" type="submit" value="SUBMIT"></div><div><textarea class="lblPartnerDescription">{{description}}</textarea></div></div><input class="lblPartnerId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';

    handleAdminSetup();



    // EVENTS

    //Admin login form submit event
    $("#lblAdminLogin").submit(function(e){
        //prevent submitting of form & page reload, there is no backend to submit to
        e.preventDefault();
        //pass element (form) to handler function
        adminHandleLogin(this);
    });

    //Admin create
    $("#lblAdminCreate").submit(function(e){
        //prevent submitting of form & page reload, there is no backend to submit to
        e.preventDefault();
        //pass element (form) to handler function
        adminHandleCreate(this);
    });

    //Event create
    $("#lblEventCreate").submit(function(e){
        //prevent submitting of form & page reload, there is no backend to submit to
        e.preventDefault();
        //pass element (form) to handler function
        eventHandleCreate(this);
    });

    //Event create
    $("#lblPartnerCreate").submit(function(e){
        //prevent submitting of form & page reload, there is no backend to submit to
        e.preventDefault();
        //pass element (form) to handler function
        partnerHandleCreate(this);
    });

    //when an admin pick link is clicked, fade picker windows
    $(".wdw-admin-picker ul li a").click(function(){
        adminPicker(this);
    });

    $(document).on("click", ".admin-list-item .edit-item", function(){
        editItem($(this).parent());
    });

    $(document).on("submit", ".lblPartnerCreate", function(){
        editItem(this);
    });

    $(document).on("click", ".delete-item", function(){
        deleteItem($(this).parent());
    });

    $(document).on("click", '.modal-admin-edit-form-container form input[type="submit"]', function(e){
        e.preventDefault();
        adminEditModalSubmitHandler($(this).parent());
    });

    $(".admin-logout").click(function(){
        localStorage.bAdmin = false;
    });

    // FUNCTIONS - GENERAL



    // FUNCTIONS - ADMIN

    // If no admins exist, create standard admin user, otherwise load admins from localStorage
    function handleAdminSetup(){
        if (localStorage.getItem("sAdmins") === null) {
            var jAdmin = {"id": generateStringId(), "username":"admin", "password":"admin"};
            jAdmins.admins.push(jAdmin);
            localStorage.sAdmins = JSON.stringify(jAdmins);
        } else {
            jAdmins = JSON.parse(localStorage.sAdmins);
        }
    }

    function getAdmins(){
        jAdmins = JSON.parse(localStorage.sAdmins);
    }

    function setAdmins(jAdmin){
        jAdmins = JSON.parse(localStorage.sAdmins);
        jAdmins.admins.push(jAdmin);
        localStorage.sAdmins = JSON.stringify(jAdmins);
        return true;
    }

    function editAdmin(jAdmin){
        jAdmins = JSON.parse(localStorage.sAdmins);
        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            if(jAdmins.admins[i].id == jAdmin.id){
                jAdmins.admins[i] = jAdmin;
            }
        }
        localStorage.sAdmins = JSON.stringify(jAdmins);
        return true;
    }

    function deleteAdmin(sId){
        getAdmins();
        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            if(jAdmins.admins[i].id == sId){
                jAdmins.admins.splice(i, 1);
            }
        }
        localStorage.sAdmins = JSON.stringify(jAdmins);
        populateAdminList();
        return true;
    }

    function checkAdmin(){
        if(localStorage.getItem("bAdmin") === null){
            localStorage.bAdmin = false;
            bAdmin = false;
        } else {
            bAdmin = localStorage.bAdmin;
            if(bAdmin.toLowerCase() === "true"){
                bAdmin = true;
            }
        }

        return bAdmin;
    }

    function getEvents(){
        if(localStorage.getItem("sEvents") !== null) {
            jEvents = JSON.parse(localStorage.sEvents);
        }
    }

    function setEvent(jEvent){
        getEvents();
        jEvents.events.push(jEvent);
        localStorage.sEvents = JSON.stringify(jEvents);
        return true;
    }

    function editEvent(jEvent){
        getEvents();
        var iCounter = jEvents.events.length;
        for(var i = 0; i < iCounter; i++){
            if(jEvents.events[i].id == jEvent.id){
                jEvents.events[i] = jEvent;
            }
        }
        localStorage.sEvents = JSON.stringify(jEvents);
        return true;
    }

    function deleteEvent(sId){
        getEvents();
        var iCounter = jEvents.events.length;
        for(var i = 0; i < iCounter; i++){
            if(jEvents.events[i].id == sId){
                jEvents.events.splice(i, 1);
            }
        }
        localStorage.sEvents = JSON.stringify(jEvents);
        populateEventList()
        return true;
    }

    function getPartners(){
        if(localStorage.getItem("sPartners") !== null) {
            jPartners = JSON.parse(localStorage.sPartners);
        }
    }

    function setPartner(jPartner){
        getPartners();
        jPartners.partners.push(jPartner);
        localStorage.sPartners = JSON.stringify(jPartners);
        return true;
    }

    function editPartner(jPartner){
        getPartners();
        var iCounter = jPartners.partners.length;
        for(var i = 0; i < iCounter; i++){
            if(jPartners.partners[i].id == jPartner.id){
                jPartners.partners[i] = jPartner;
            }
        }
        localStorage.sPartners = JSON.stringify(jPartners);
        return true;
    }

    function deletePartner(sId){
        getPartners();
        var iCounter = jPartners.partners.length;
        for(var i = 0; i < iCounter; i++){
            if(jPartners.partners[i].id == sId){
                jPartners.partners.splice(i, 1);
            }
        }
        localStorage.sPartners = JSON.stringify(jPartners);
        populatePartnerList();
        return true;
    }

    //handles admin login form submit - receives form element & children as oElement
    function adminHandleLogin(oElement){
        //gets input values from username & password fields
        var sUsername = $(oElement).children("#lblAdminUsername").val();
        var sPassword = $(oElement).children("#lblAdminPassword").val();

        //check vs. registered users (also in localstorage) to login
        getAdmins();
        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            if(jAdmins.admins[i].username == sUsername && jAdmins.admins[i].password == sPassword){
                localStorage.bAdmin = true;
                populateAdminList();
                //placeholder, use animation instead?
                $(".wdw-admin-picker").fadeIn();
                if(!bAdminMessageAnimationRunning){
                    adminLoginMessage(true);
                }
                break;
            } else {
                localStorage.bAdmin = false;
                if(!bAdminMessageAnimationRunning){
                    adminLoginMessage(false);
                }
            }
        }

        $(oElement).children("#lblAdminUsername").val("");
        $(oElement).children("#lblAdminPassword").val("");
    }

    function adminLoginMessage(bStatus){
        bAdminMessageAnimationRunning = true;
        if(bStatus){
            $("#lblAdminLogin span").text("Login successful.").fadeIn();
            setTimeout(function(){
                $("#lblAdminLogin span").fadeOut();
                bAdminMessageAnimationRunning = false;
                $(".wdw-login form").fadeOut();
                setTimeout(function(){
                    $(".admin-logout").fadeIn();
                }, 750);
            }, 1000);
        } else {
            $("#lblAdminLogin span").text("Login failed.").fadeIn();
            setTimeout(function(){
                $("#lblAdminLogin span").fadeOut();
                bAdminMessageAnimationRunning = true;
            }, 1000);
        }
    }

    function adminHandleCreate(oElement){
        var sUsername = $(oElement).children("#lblAdminNewUsername").val();
        var sPassword = $(oElement).children("#lblAdminNewPassword").val();

        getAdmins();
        var jAdmin = {};
        jAdmin.id = generateStringId();
        jAdmin.username = sUsername;
        jAdmin.password = sPassword;
        setAdmins(jAdmin);

        $(oElement).children("#lblAdminNewUsername").val("");
        $(oElement).children("#lblAdminNewPassword").val("");
        populateAdminList();
    }

    function eventHandleCreate(oElement){
        var sImage = $(oElement).find("#lblEventImage").val();
        var sTitle = $(oElement).find("#lblEventTitle").val();
        var sOrganizer = $(oElement).find("#lblEventOrganizer").val();
        var sDate = $(oElement).find("#lblEventDate").val();
        var sPrice = $(oElement).find("#lblEventPrice").val();
        var sLocation = $(oElement).find("#lblEventLocation").val();
        var sPartner = "wat";
        var sDescription = $(oElement).find("#lblEventDescription").val();

        getEvents();
        var jEvent = {};
        jEvent.id = generateStringId();
        jEvent.img = sImage;
        jEvent.title = sTitle;
        jEvent.organizer = sOrganizer;
        jEvent.date = sDate;
        jEvent.price = sPrice;
        jEvent.location = sLocation;
        jEvent.partners = sPartner;
        jEvent.description = sDescription;
        setEvent(jEvent);

        $(oElement).children().val("");
        populateEventList();
    }

    function partnerHandleCreate(oElement){
        var sImage = $(oElement).find("#lblPartnerImage").val();
        var sName = $(oElement).find("#lblPartnerName").val();
        var sCeo = $(oElement).find("#lblPartnerCEO").val();
        var sWebsite = $(oElement).find("#lblPartnerWebsite").val();
        var sHeadquarters = $(oElement).find("#lblPartnerHeadquarters").val();
        var sDescription = $(oElement).find("#lblPartnerDescription").val();

        getPartners();
        var jPartner = {};
        jPartner.id = generateStringId();
        jPartner.img = sImage;
        jPartner.ceo = sCeo;
        jPartner.website = sWebsite;
        jPartner.headquarters = sHeadquarters;
        jPartner.description = sDescription;
        jPartner.name = sName;
        setPartner(jPartner);

        $(oElement).children().val("");
        populatePartnerList();
    }

    function adminPicker(oElement){
        if(checkAdmin() == true){
            $(".pick-window").css("display", "none");

            //placeholder - implement css animation loader figure before showing each list
            if($(oElement).hasClass("admin-event-list")){
                populateEventList();
                $(".wdw-event-list").fadeIn();
            } else if($(oElement).hasClass("admin-partner-list")){
                populatePartnerList();
                $(".wdw-partner-list").fadeIn();
            } else if($(oElement).hasClass("admin-admin-list")){
                populateAdminList();
                $(".wdw-admin-list").fadeIn();
            }
        }
    }

    function populateAdminList(){
        var sHtml = "";
        getAdmins();

        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            sHtml += sAdminTemplate.replace("{{name}}", jAdmins.admins[i].username);
            sHtml = sHtml.replace("{{id}}", jAdmins.admins[i].id);
        }

        $(".wdw-admin-list div").empty().append(sHtml);
    }

    function populateEventList(){
        var sHtml = "";
        getEvents();

        var iCounter = jEvents.events.length;
        for(var i = 0; i < iCounter; i++){
            sHtml += sEventTemplate.replace("{{id}}", jEvents.events[i].id);
            sHtml = sHtml.replace("{{img}}", jEvents.events[i].img);
            sHtml = sHtml.replace("{{title}}", jEvents.events[i].title);
            sHtml = sHtml.replace("{{organizer}}", jEvents.events[i].organizer);
            sHtml = sHtml.replace("{{date}}", jEvents.events[i].date);
            sHtml = sHtml.replace("{{price}}", jEvents.events[i].price);
            sHtml = sHtml.replace("{{location}}", jEvents.events[i].location);
            sHtml = sHtml.replace("{{partners}}", jEvents.events[i].partners);
            sHtml = sHtml.replace("{{description}}", jEvents.events[i].description);
        }

        $(".wdw-event-list div.event-list").empty().append(sHtml);
    }

    function populatePartnerList(){
        var sHtml = "";
        getPartners();

        var iCounter = jPartners.partners.length;
        for(var i = 0; i < iCounter; i++){
            sHtml += sPartnerTemplate.replace("{{id}}", jPartners.partners[i].id);
            sHtml = sHtml.replace("{{img}}", jPartners.partners[i].img);
            sHtml = sHtml.replace("{{name}}", jPartners.partners[i].name);
            sHtml = sHtml.replace("{{ceo}}", jPartners.partners[i].ceo);
            sHtml = sHtml.replace("{{website}}", jPartners.partners[i].website);
            sHtml = sHtml.replace("{{headquarters}}", jPartners.partners[i].headquarters);
            sHtml = sHtml.replace("{{description}}", jPartners.partners[i].description);
        }

        $(".wdw-partner-list div.partner-list").empty().append(sHtml);
    }

    function editItem(oElement){
        if($(oElement).hasClass("admin-list-item")){
            var sName = $(oElement).children("h3:first-child").text();
            sName = sName.split(": ");
            sName = sName[1];
            var sId = $(oElement).children("h3:nth-child(2)").text();
            sId = sId.split(": ");
            sId = sId[1];

            var sHtml = "";
            sHtml += sEditAdminTemplate.replace("{{name}}", sName).replace("{{id}}", sId);

            $("#modal-top h2").empty().text("Edit Admin: " + sName);
            $("#modal-middle").empty().append(sHtml);
            $("#wdw-admin-modal").fadeIn();
        }
        if($(oElement).hasClass("lblPartnerCreate")){
            var sId = $(oElement).find(".lblPartnerId").val();
            var sImage = $(oElement).find(".lblPartnerImage").val();
            var sName = $(oElement).find(".lblPartnerName").val();
            var sCeo = $(oElement).find(".lblPartnerCEO").val();
            var sWebsite = $(oElement).find(".lblPartnerWebsite").val();
            var sHeadquarters = $(oElement).find(".lblPartnerHeadquarters").val();
            var sDescription = $(oElement).find(".lblPartnerDescription").val();

            var jPartner = {};
            jPartner.id = sId;
            jPartner.img = sImage;
            jPartner.ceo = sCeo;
            jPartner.website = sWebsite;
            jPartner.headquarters = sHeadquarters;
            jPartner.description = sDescription;
            jPartner.name = sName;

            editPartner(jPartner);
            $(oElement).
            populatePartnerList();
        }
    }

    function deleteItem(oElement){
        if($(oElement).hasClass("admin-list-item")){
            var sId = $(oElement).children("h3:nth-child(2)").text();
            sId = sId.split(": ");
            sId = sId[1];
            console.log(sId);

            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this admin user!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function(){
                swal("Deleted!", "The admin user has been deleted.", "success");
                deleteAdmin(sId);
            });
        }
        if($(oElement).hasClass("partner-item")){
            var sId = $(oElement).find('input[type="hidden"]').val();
            console.log(sId);

            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this admin user!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function(){
                    swal("Deleted!", "The admin user has been deleted.", "success");
                    deletePartner(sId);
                });
        }
    }

    function adminEditModalSubmitHandler(oElement){
        var sName = $(oElement).children("input:first-child").val();
        var sId = $(oElement).children("input:nth-child(2)").val();
        var jAdmin = {};

        getAdmins();
        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            if(jAdmins.admins[i].id == sId){
                jAdmin = jAdmins.admins[i];
            }
        }
        jAdmin.username = sName;
        jAdmin.id = sId;

        editAdmin(jAdmin);
        populateAdminList();
        $("#wdw-admin-modal").fadeOut();
    }

    //generate (not really) random string to be used as an id
    function generateStringId(){
        var sResult = "";
        sResult = (Math.random().toString(16)+"000000000").substr(2,8);
        sResult = sResult + $.now().toString();
        return sResult;
    }

    //500ms interval for admin display purposes
    setInterval(function(){
        if(checkAdmin() == true){
            $(".wdw-admin-picker").fadeIn();
            $("#lblAdminLogin").fadeOut();
            $(".admin-logout").fadeIn();
        } else {
            $(".wdw-admin-picker").fadeOut();
            $(".pick-window").fadeOut();
            $(".admin-logout").fadeOut();
            $("#lblAdminLogin").fadeIn();
        }
    }, 500);

});

