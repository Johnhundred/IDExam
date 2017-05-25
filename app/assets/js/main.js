

jQuery("document").ready(function() {
    var $ = jQuery.noConflict();
    console.log("Page loaded and ready.");

    // VARS & SETUP
    var jAdmins = {"admins":[]};
    var bAdmin;
    var bAdminMessageAnimationRunning = false;
    var sAdminTemplate = '<div class="admin-list-item" data-admin-id="{{id}}"><h3>Name: {{name}}</h3><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';
    var sEditAdminTemplate = '<div class="modal-admin-edit-form-container"><form><input type="text" placeholder="Name..." value="{{name}}"><input type="text" placeholder="ID..." value="{{id}}"><input type="submit" value="SUBMIT"></form></div>';

    var jEvents = {"events":[]};
    var sEventTemplate = '<div class="event-item round-corners"><form class="lblEventCreate"><div><input class="lblEventImage" type="text" value="{{img}}"></div><div><div><input class="lblEventTitle" type="text" value="{{title}}"><input class="lblEventOrganizer" type="text" value="{{organizer}}"><input class="lblEventDate" type="date" value="{{date}}"><input class="lblEventPrice" type="text" value="{{price}}"><input class="lblEventLocation" type="text" value="{{location}}"><a class="btn-partners" href="#" data-partners="{{partnersData}}">{{partners}}</a><input type="submit" class="btnEventCreate" value="SUBMIT"></div><div><textarea class="lblEventDescription">{{description}}</textarea></div></div><input class="lblEventId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';
    var jSelectedPartners = {"id": "", "partners": []};

    var jPartners = {"partners":[]};
    var sPartnerTemplate = '<div class="partner-item round-corners"><form class="lblPartnerCreate"><div><input class="lblPartnerImage" type="text" value="{{img}}"></div><div><div><input class="lblPartnerName" type="text" value="{{name}}"><input class="lblPartnerCEO" type="text" value="{{ceo}}"><input class="lblPartnerWebsite" type="text" value="{{website}}"><input class="lblPartnerHeadquarters" type="text" value="{{headquarters}}"><input class="btnPartnerCreate" type="submit" value="SUBMIT"></div><div><textarea class="lblPartnerDescription">{{description}}</textarea></div></div><input class="lblPartnerId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';

    var sPartnerModalTemplate = '<div class="partner-modal-item"><div><input type="checkbox" data-partner-id="{{partnerId}}" {{checked}}></div><h5>{{partner}}</h5></div>';

    handleAdminSetup();

    var sFPartnerTemplate = '<div class="partner-card" data-partner-id="{{id}}"><img src="{{img}}"><h2>{{name}}</h2></div>';
    var sFEventTemplate = '<div class="event-result" data-event-id="{{id}}">' +
        '<h2>{{title}}</h2>' +
        '<h3>{{partners}}</h3>' +
        '<pre>{{description}}</pre>' +
        '<p class="event-info">{{date}} | {{price}} | {{location}}</p>' +
        '<button>MORE INFORMATION</button>' +
        '</div>';



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
    $(".wdw-admin-picker ul li").click(function(){
        adminPicker(this);
    });

    $(document).on("click", ".admin-list-item .edit-item", function(){
        editItem($(this).parent());
    });

    $(document).on("submit", ".lblPartnerCreate", function(){
        editItem(this);
    });

    $(document).on("submit", ".lblEventCreate", function(){
        editItem(this);
    });

    $(document).on("click", ".wdw-event-list a", function(){
        var sId = $(this).parent().parent().parent().find(".lblEventId").val();
        if(!!sId){
            populatePartnerModal(sId);
        } else {
            populatePartnerModal();
        }
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

    $(".partner-modal-form").submit(function(e){
        e.preventDefault();
        submitPartnerModal(this);
    });

    $(document).on("click", ".partner-card", function(){
        var sId = $(this).attr("data-partner-id");
        fRedirectToPartner(sId);
    });

    $(".front-page .search-bar input").keypress(function(e){
        if(e.which == 13) {
            fFrontpageSubmit();
        }
    });

    $(".front-page .search-bar button").click(function(){
        fFrontpageSubmit();
    });

    $(".events-container .search-bar input").keypress(function(e){
        if(e.which == 13) {
            runSearch();
        }
    });

    $(".events-container .search-bar button").click(function(){
        runSearch();
    });

    $(document).on("click", ".event-result button", function(){
        fRedirectToEvent($(this).parent().attr("data-event-id"));
    });

    $("#partner-modal-content>i").click(function(){
        $("#wdw-partner-modal").fadeOut();
    });



    // FUNCTIONS - GENERAL

    function fPopulatePartners(){
        var sHtml = "";
        getPartners();
        var iCounter = jPartners.partners.length;
        for(var i = 0; i < iCounter; i++){
            sHtml += sFPartnerTemplate.replace("{{img}}", jPartners.partners[i].img);
            sHtml = sHtml.replace("{{name}}", jPartners.partners[i].name);
            sHtml = sHtml.replace("{{id}}", jPartners.partners[i].id);
        }

        $(".partner-container").empty().append(sHtml);
    }

    function fRedirectToPartner(sId){
        localStorage.sPartner = sId;
        setTimeout(function(){
            window.location.href = "/partnerTemplate.html";
        }, 100);
    }

    function fRedirectToEvent(sId){
        localStorage.sEvent = sId;
        setTimeout(function(){
            window.location.href = "/eventTemplate.html";
        }, 100);
    }

    function fPopulateSpecificPartner(){
        if(localStorage.getItem("sPartner") !== null){
            getPartners();
            var jPartner = {};

            var iCounter = jPartners.partners.length;
            for(var i = 0; i < iCounter; i++){
                if(jPartners.partners[i].id == localStorage.sPartner){
                    jPartner = jPartners.partners[i];
                }
            }

            $(".partner-title h2").text(jPartner.name);

            var sDesc = '<h3>Partner Description</h3>';
            sDesc += "<pre>" + jPartner.description;
            sDesc += "</pre>";
            $(".partner-desc").empty().append(sDesc);

            $(".partner-logo img").attr("src", jPartner.img);
            $(".CEO p").text(jPartner.ceo);
            $(".website p a").attr("href", jPartner.website).text(jPartner.website);
            $(".headquarters p").text(jPartner.headquarters);
        }
    }

    function fPopulateSpecificEvent(){
        if(localStorage.getItem("sEvent") !== null){
            getEvents();
            var jEvent = {};

            var iCounter = jEvents.events.length;
            for(var i = 0; i < iCounter; i++){
                if(jEvents.events[i].id == localStorage.sEvent){
                    jEvent = jEvents.events[i];
                }
            }

            $(".partner-title h2").text(jEvent.title);

            var sDesc = '<h3>Event Description</h3>';
            sDesc += "<pre>" + jEvent.description;
            sDesc += "</pre>";
            $(".event-content").empty().append(sDesc);

            var aPartners = [];
            var iPartners = jEvent.partners.partners.length;
            if(iPartners > 0){
                // for each id, loop through partners and get name
                for(var w = 0; w < iPartners; w++){
                    getPartners();
                    for(var q = 0; q < jPartners.partners.length; q++){
                        //on id match with partner id, store name in array
                        if(jEvent.partners.partners[w] == jPartners.partners[q].id){
                            aPartners.push(jPartners.partners[q].img);
                        }
                    }
                }
            }

            var sHtml = "";
            var iCo = aPartners.length;
            for(var u = 0; u < iCo; u++){
                sHtml += '<img src="' + aPartners[u] + '" alt="partner-logo">';
            }
            $(".event-partners").empty().append(sHtml);

            $(".partner-logo img").attr("src", jEvent.img);
            $(".organizer p").text(jEvent.organizer);
            $(".date p").text(jEvent.date);
            $(".price p").text(jEvent.price);
            $(".location p").text(jEvent.location);
        }
    }

    function removePreloader() {
        setTimeout(function(){
            $('body').addClass('loaded');
        }, 1000);
    }

    function fFrontpageSubmit() {
        localStorage.sFrontpage = $(".search-bar input").val();
        setTimeout(function(){
            window.location.href = "/events.html";
        }, 100);
    }

    function runSearch(){
        var sWord = "";

        if(localStorage.getItem("sFrontpage") !== null){
            sWord = localStorage.sFrontpage;
            $(".events-container .search-bar input").val(sWord);
            sWord = sWord.toLowerCase();
            localStorage.removeItem("sFrontpage");
        } else {
            sWord = $(".events-container .search-bar input").val().toLowerCase();
        }

        getEvents();
        var originalEvents = jQuery.extend(true, {}, jEvents);
        var searchHits = [];
        var iCounter2 = originalEvents.events.length;
        for(var j = 0; j < iCounter2; j++){
            if(originalEvents.events[j].title.toLowerCase().indexOf(sWord) != -1){
                searchHits.push(originalEvents.events[j]);
                originalEvents.events.splice(j, 1);
                j--;
                iCounter2--;
            } else if(originalEvents.events[j].description.toLowerCase().indexOf(sWord) != -1){
                searchHits.push(originalEvents.events[j]);
                originalEvents.events.splice(j, 1);
                j--;
                iCounter2--;
            } else if(originalEvents.events[j].organizer.toLowerCase().indexOf(sWord) != -1){
                searchHits.push(originalEvents.events[j]);
                originalEvents.events.splice(j, 1);
                j--;
                iCounter2--;
            } else if(originalEvents.events[j].location.toLowerCase().indexOf(sWord) != -1){
                searchHits.push(originalEvents.events[j]);
                originalEvents.events.splice(j, 1);
                j--;
                iCounter2--;
            }
        }

        var aCheckedInputs = $('.filter-list input:checked');
        var iCounter = aCheckedInputs.length;
        if(!!iCounter && iCounter > 0){
            for(var i = 0; i < iCounter; i++){
                if($(aCheckedInputs[i]).parent().parent().hasClass("event-location")){
                    var sLocation = $(aCheckedInputs[i]).val().toLowerCase();
                    var iCounter3 = searchHits.length;
                    for(var t = 0; t < iCounter3; t++){
                        if(searchHits[t].location.toLowerCase().indexOf(sLocation) == -1){
                            searchHits.splice(t, 1);
                            t--;
                            iCounter3--;
                        }
                    }
                } else if($(aCheckedInputs[i]).parent().parent().hasClass("event-price")){
                    if($(aCheckedInputs[i]).attr("data-price-id") == 1){
                        console.log("Free");
                        var iCounter5 = searchHits.length;
                        for(var c = 0; c < iCounter5; c++){
                            var sCompare = "" + searchHits[c].price;
                            sCompare = sCompare.toLowerCase();
                            if((Number(searchHits[c].price) && Number(searchHits[c].price) > 0) || sCompare != "free"){
                                searchHits.splice(c, 1);
                                c--;
                                iCounter5--;
                            }
                        }
                    } else if($(aCheckedInputs[i]).attr("data-price-id") == 2){
                        console.log("Paid");
                        var iCounter6 = searchHits.length;
                        for(var b = 0; b < iCounter5; b++){
                            if(Number(searchHits[b].price) && Number(searchHits[b].price) < 1){
                                searchHits.splice(b, 1);
                                b--;
                                iCounter6--;
                            }
                        }
                    }
                } else if($(aCheckedInputs[i]).parent().parent().hasClass("event-date")){
                    var sDateId = $(aCheckedInputs[i]).attr("data-date-id");
                    var iCurrentMonth = new Date().getMonth();
                    var iNextMonth = new Date().getMonth() + 1;
                    var iCounter7 = searchHits.length;
                    for(var m = 0; m < iCounter7; m++){
                        var iEventMonth = new Date(searchHits[m].date).getMonth();
                        if(sDateId == 1 && iCurrentMonth != iEventMonth){
                            searchHits.splice(m, 1);
                            m--;
                            iCounter7--;
                        }
                        if(sDateId == 2 && iNextMonth != iEventMonth){
                            searchHits.splice(m, 1);
                            m--;
                            iCounter7--;
                        }
                    }

                } else if($(aCheckedInputs[i]).parent().parent().hasClass("event-sponsor")){
                    var iCounter4 = searchHits.length;
                    for(var g = 0; g < iCounter4; g++){
                        if(typeof searchHits[g].partners.partners !== 'undefined' && searchHits[g].partners.partners.length == 0){
                            searchHits.splice(g, 1);
                            g--;
                            iCounter4--;
                        }
                    }
                }
            }
        }

        var aPartners = [];
        var sHtml = "";
        var iDisplayCounter = searchHits.length;
        for(var a = 0; a < iDisplayCounter; a++){
            sHtml += sFEventTemplate.replace("{{id}}", searchHits[a].id);
            sHtml = sHtml.replace("{{title}}", searchHits[a].title);
            var iPartners = searchHits[a].partners.partners.length;
            if(iPartners > 0){
                // for each id, loop through partners and get name
                for(var w = 0; w < iPartners; w++){
                    getPartners();
                    for(var q = 0; q < jPartners.partners.length; q++){
                        //on id match with partner id, store name in array
                        if(searchHits[a].partners.partners[w] == jPartners.partners[q].id){
                            aPartners.push(jPartners.partners[q].name);
                        }
                    }
                }
            }

            sHtml = sHtml.replace("{{partners}}", searchHits[a].organizer);

            var sDesc = "";
            if(searchHits[a].description.length > 255){
                sDesc = $.trim(searchHits[a].description).substring(0, 255);
                sDesc += "...";
            } else {
                sDesc = $.trim(searchHits[a].description);
            }
            sHtml = sHtml.replace("{{description}}", sDesc);
            sHtml = sHtml.replace("{{date}}", searchHits[a].date);
            var sPrice = "" + searchHits[a].price;
            if(sPrice.toLowerCase() != "free"){
                sPrice += " DKK";
            }
            sHtml = sHtml.replace("{{price}}", sPrice);
            sHtml = sHtml.replace("{{location}}", searchHits[a].location);
        }

        if(sHtml == ""){
            sHtml = "<h5 class='event-list-error'>No results.</h5>";
        }

        $(".results-container").empty().append(sHtml);
    }

    if($("body>div").hasClass("events-container")){
        runSearch();
    }

    if($("body>div").hasClass("pt")){
        fPopulateSpecificPartner();
    }

    if($("body>div").hasClass("et")){
        fPopulateSpecificEvent();
    }

    fPopulatePartners();
    removePreloader();



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
        populateEventList();
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
        if(jSelectedPartners.id == "1"){
            jEvent.partners = jSelectedPartners;
        } else {
            jEvent.partners = {"id": "1", "partners": []};
        }
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

        $(oElement).find('input[type="text"]').val("");
        $(oElement).find('textarea').val("");
        populatePartnerList();
    }

    function adminPicker(oElement){
        if(checkAdmin() == true){
            $(".pick-window").css("display", "none");
            $(".wdw-admin-picker ul li").removeClass("active");
            $(oElement).addClass("active");

            if($(oElement).children("a").hasClass("admin-event-list")){
                populateEventList();
                $(".wdw-event-list").fadeIn();
            } else if($(oElement).children("a").hasClass("admin-partner-list")){
                populatePartnerList();
                $(".wdw-partner-list").fadeIn();
            } else if($(oElement).children("a").hasClass("admin-admin-list")){
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
            var iPartners = 0;
            if(typeof jEvents.events[i].partners.partners !== "undefined"){
                iPartners = jEvents.events[i].partners.partners.length;
            }
            sHtml = sHtml.replace("{{partners}}", "" + iPartners + " Partners");
            sHtml = sHtml.replace("{{partnersData}}", iPartners);
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

    function populatePartnerModal(sId){
        sId = sId || "1";
        var aCurrentPartners = [];

        // Check the received ID against the IDs of all events.
        // If a match is found, we know we are looking at that event's partners.
        getEvents();
        var iCounter = jEvents.events.length;
        for(var i = 0; i < iCounter; i++){
            if(jEvents.events[i].id == sId){
                aCurrentPartners = jEvents.events[i].partners.partners;
                console.log(aCurrentPartners);
            }
        }

        //Populate the modal with a form containing all partners: Checkbox - Name
        var sHtml = '<div class="partner-wrap">';
        getPartners();
        var iCounter2 = jPartners.partners.length;
        var iCounter3 = aCurrentPartners.length;
        for(var j = 0; j < iCounter2; j++){
            sHtml += sPartnerModalTemplate.replace("{{partnerId}}", jPartners.partners[j].id);
            sHtml = sHtml.replace("{{partner}}", jPartners.partners[j].name);

            // If aCurrentPartners list has any IDs, match those IDs to partners in the generated HTML,
            // and check their checkboxes
            if(iCounter3 > 0){
                for(var n = 0; n < iCounter3; n++){
                    if(aCurrentPartners[n] == jPartners.partners[j].id){
                        sHtml = sHtml.replace("{{checked}}", "checked");
                    }
                }
            }
            // Remove templating string from element if match wasn't found
            sHtml = sHtml.replace("{{checked}}", "");
        }
        sHtml += '</div><input type="submit" value="SUBMIT">';
        $(".partner-modal-form").attr("data-event-id", sId).empty().append(sHtml);
        $("#wdw-partner-modal").fadeIn();
    }

    function submitPartnerModal(oElement){
        // Once submit is clicked, set jSelectedPartners to the id submitted with a list of checked partners

        // Get id of event from form attr
        jSelectedPartners.id = $(oElement).attr("data-event-id");

        // Create array of checked checkboxes from the modal form
        var aChecked = $(oElement).find("input:checked");
        var aPartners = [];
        for(var i = 0; i < aChecked.length; i++){
            aPartners.push($(aChecked[i]).attr("data-partner-id"));
        }

        jSelectedPartners.partners = aPartners;

        getEvents();
        var iCounter = jEvents.events.length;
        for(var i = 0; i < iCounter; i++){
            if(jEvents.events[i].id == jSelectedPartners.id){
                jEvents.events[i].partners = jSelectedPartners;
                editEvent(jEvents.events[i]);
                populateEventList();
                break;
            }
        }

        $("#wdw-partner-modal").fadeOut();
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
            populatePartnerList();
        }
        if($(oElement).hasClass("lblEventCreate")){
            var sId = $(oElement).find(".lblEventId").val();
            var sImage = $(oElement).find(".lblEventImage").val();
            var sTitle = $(oElement).find(".lblEventTitle").val();
            var sOrganizer = $(oElement).find(".lblEventOrganizer").val();
            var sDate = $(oElement).find(".lblEventDate").val();
            var sPrice = $(oElement).find(".lblEventPrice").val();
            var sLocation = $(oElement).find(".lblEventLocation").val();
            var sDescription = $(oElement).find(".lblEventDescription").val();

            getEvents();
            var jEvent = {};
            jEvent.id = sId;
            jEvent.img = sImage;
            jEvent.title = sTitle;
            jEvent.organizer = sOrganizer;
            jEvent.date = sDate;
            jEvent.price = sPrice;
            jEvent.location = sLocation;
            if(jSelectedPartners.id == sId){
                jEvent.partners = jSelectedPartners;
            } else {
                for(var i = 0; i < jEvents.events.length; i++){
                    if(jEvents.events[i].id == sId){
                        jEvent.partners = jEvents.events[i].partners;
                    }
                }
            }
            jEvent.description = sDescription;

            editEvent(jEvent);
            populateEventList();
        }
    }

    function deleteItem(oElement){
        if($(oElement).hasClass("admin-list-item")){
            var sId = $(oElement).attr("data-admin-id");
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
                text: "You will not be able to recover this partner!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function(){
                swal("Deleted!", "The partner has been deleted.", "success");
                deletePartner(sId);
            });
        }
        if($(oElement).hasClass("event-item")){
            var sId = $(oElement).find('input[type="hidden"]').val();
            console.log(sId);

            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this event!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function(){
                swal("Deleted!", "The event has been deleted.", "success");
                deleteEvent(sId);
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
            if($("#lblAdminLogin").css("display") == "none"){
                $("#lblAdminLogin").css("display", "flex").hide().fadeIn();
            }
        }
    }, 500);

});

