jQuery("document").ready(function(){function n(){v=JSON.parse(localStorage.sAdmins)}function i(n){return v=JSON.parse(localStorage.sAdmins),v.admins.push(n),localStorage.sAdmins=JSON.stringify(v),!0}function e(n){v=JSON.parse(localStorage.sAdmins);for(var i=v.admins.length,e=0;e<i;e++)v.admins[e].id==n.id&&(v.admins[e]=n);return localStorage.sAdmins=JSON.stringify(v),!0}function a(i){n();for(var e=v.admins.length,a=0;a<e;a++)v.admins[a].id==i&&v.admins.splice(a,1);return localStorage.sAdmins=JSON.stringify(v),o(),!0}function t(){return null===localStorage.getItem("bAdmin")?(localStorage.bAdmin=!1,h=!1):(h=localStorage.bAdmin,"true"===h.toLowerCase()&&(h=!0)),h}function l(i){var e=p(i).children("#lblAdminUsername").val(),a=p(i).children("#lblAdminPassword").val();n();for(var t=v.admins.length,l=0;l<t;l++){if(v.admins[l].username==e&&v.admins[l].password==a){localStorage.bAdmin=!0,o(),p(".wdw-admin-picker").fadeIn(),w||d(!0);break}localStorage.bAdmin=!1,w||d(!1)}p(i).children("#lblAdminUsername").val(""),p(i).children("#lblAdminPassword").val("")}function d(n){w=!0,n?(p("#lblAdminLogin span").text("Login successful.").fadeIn(),setTimeout(function(){p("#lblAdminLogin span").fadeOut(),w=!1,p(".wdw-login").fadeOut()},1e3)):(p("#lblAdminLogin span").text("Login failed.").fadeIn(),setTimeout(function(){p("#lblAdminLogin span").fadeOut(),w=!0},1e3))}function s(e){var a=p(e).children("#lblAdminNewUsername").val(),t=p(e).children("#lblAdminNewPassword").val();n();var l={};l.id=f(),l.username=a,l.password=t,i(l),p(e).children("#lblAdminNewUsername").val(""),p(e).children("#lblAdminNewPassword").val(""),o()}function r(n){1==t()&&(p(".pick-window").css("display","none"),p(n).hasClass("admin-event-list")?p(".wdw-event-list").fadeIn():p(n).hasClass("admin-partner-list")?p(".wdw-partner-list").fadeIn():p(n).hasClass("admin-admin-list")&&(o(),p(".wdw-admin-list").fadeIn()))}function o(){var i="";n();for(var e=v.admins.length,a=0;a<e;a++)i+=g.replace("{{name}}",v.admins[a].username),i=i.replace("{{id}}",v.admins[a].id);p(".wdw-admin-list div").empty().append(i)}function m(n){if(p(n).hasClass("admin-list-item")){var i=p(n).children("h3:first-child").text();i=i.split(": "),i=i[1];var e=p(n).children("h3:nth-child(2)").text();e=e.split(": "),e=e[1];var a="";a+=A.replace("{{name}}",i).replace("{{id}}",e),p("#modal-top h2").empty().text("Edit Admin: "+i),p("#modal-middle").empty().append(a)}}function c(n){if(p(n).hasClass("admin-list-item")){var i=p(n).children("h3:nth-child(2)").text();i=i.split(": "),i=i[1],console.log(i),swal({title:"Are you sure?",text:"You will not be able to recover this admin user!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!1},function(){swal("Deleted!","The admin user has been deleted.","success"),a(i)})}}function u(i){var a=p(i).children("input:first-child").val(),t=p(i).children("input:nth-child(2)").val(),l={};n();for(var d=v.admins.length,s=0;s<d;s++)v.admins[s].id==t&&(l=v.admins[s]);l.username=a,l.id=t,e(l),o()}function f(){var n="";return n=(Math.random().toString(16)+"000000000").substr(2,8),n+=p.now().toString()}var p=jQuery.noConflict();console.log("Page loaded and ready.");var h,v={admins:[]},w=!1,g='<div class="admin-list-item"><h3>Name: {{name}}</h3><h3>ID: {{id}}</h3><i class="fa fa-pencil edit-item" aria-hidden="true"></i><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>',A='<div class="modal-admin-edit-form-container"><form><input type="text" placeholder="Name..." value="{{name}}"><input type="text" placeholder="ID..." value="{{id}}"><input type="submit" value="SUBMIT"></form></div>';!function(){if(null===localStorage.getItem("sAdmins")){var n={id:f(),username:"admin",password:"admin"};v.admins.push(n),localStorage.sAdmins=JSON.stringify(v)}else v=JSON.parse(localStorage.sAdmins)}(),p("#lblAdminLogin").submit(function(n){n.preventDefault(),l(this)}),p("#lblAdminCreate").submit(function(n){n.preventDefault(),s(this)}),p(".wdw-admin-picker ul li a").click(function(){r(this)}),p(document).on("click",".edit-item",function(){m(p(this).parent())}),p(document).on("click",".delete-item",function(){c(p(this).parent())}),p(document).on("click",'.modal-admin-edit-form-container form input[type="submit"]',function(n){n.preventDefault(),u(p(this).parent())}),setInterval(function(){1==t()?p(".wdw-admin-picker").fadeIn():(p(".wdw-admin-picker").fadeOut(),p(".pick-window").fadeOut())},500),setInterval(function(){1==t()&&o()},1e4)});