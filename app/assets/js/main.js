// ctrl-f "placeholder" without the quotes to find things we need to fix before we're done

jQuery("document").ready(function() {
    var $ = jQuery.noConflict();
    console.log("Page loaded and ready.");

    // VARS & SETUP
    var jAdmins = {"admins":[]};
    var bAdmin;
    var bAdminMessageAnimationRunning = false;
    var sAdminTemplate = '<div class="admin-list-item"><h3>Name: {{name}}</h3><h3>ID: {{id}}</h3></div>';

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

    //when an admin pick link is clicked, fade picker windows
    $(".wdw-admin-picker ul li a").click(function(){
        adminPicker(this);
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
            console.log(jAdmins);
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
            }, 2000);
        } else {
            $("#lblAdminLogin span").text("Login failed.").fadeIn();
            setTimeout(function(){
                $("#lblAdminLogin span").fadeOut();
                bAdminMessageAnimationRunning = false;
            }, 2000);
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

    function adminPicker(oElement){
        if(checkAdmin() == true){
            $(".pick-window").css("display", "none");

            //placeholder - implement css animation loader figure before showing each list
            if($(oElement).hasClass("admin-event-list")){
                $(".wdw-event-list").fadeIn();
            } else if($(oElement).hasClass("admin-partner-list")){
                $(".wdw-partner-list").fadeIn();
            } else if($(oElement).hasClass("admin-admin-list")){
                populateAdminList();
                $(".wdw-admin-list").fadeIn();
                console.log("admin");
            }
        }
    }

    function populateAdminList(){
        var sHtml = "";
        getAdmins();

        var iCounter = jAdmins.admins.length;
        for(var i = 0; i < iCounter; i++){
            sHtml += sAdminTemplate.replace("{{name}}", jAdmins.admins[i].username); //'<div class="admin-list-item"><h3>Name: {{name}}</h3><h3>ID: {{id}}</h3></div>'
            sHtml = sHtml.replace("{{id}}", jAdmins.admins[i].id);
        }

        $(".wdw-admin-list div").empty().append(sHtml);
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
        } else {
            $(".wdw-admin-picker").fadeOut();
            $(".pick-window").fadeOut();
        }
    }, 500);

    //10.000ms interval for admin display purposes
    setInterval(function(){
        if(checkAdmin() == true){
            populateAdminList();
        }
    }, 10000);

});

