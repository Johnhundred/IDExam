jQuery("document").ready(function(){function e(){x=JSON.parse(localStorage.sAdmins)}function t(e){return x=JSON.parse(localStorage.sAdmins),x.admins.push(e),localStorage.sAdmins=JSON.stringify(x),!0}function n(e){x=JSON.parse(localStorage.sAdmins);for(var t=x.admins.length,n=0;n<t;n++)x.admins[n].id==e.id&&(x.admins[n]=e);return localStorage.sAdmins=JSON.stringify(x),!0}function a(t){e();for(var n=x.admins.length,a=0;a<n;a++)x.admins[a].id==t&&x.admins.splice(a,1);return localStorage.sAdmins=JSON.stringify(x),w(),!0}function i(){return null===localStorage.getItem("bAdmin")?(localStorage.bAdmin=!1,I=!1):(I=localStorage.bAdmin,"true"===I.toLowerCase()&&(I=!0)),I}function l(){null!==localStorage.getItem("sEvents")&&(B=JSON.parse(localStorage.sEvents))}function r(e){return l(),B.events.push(e),localStorage.sEvents=JSON.stringify(B),!0}function s(e){l();for(var t=B.events.length,n=0;n<t;n++)B.events[n].id==e.id&&(B.events[n]=e);return localStorage.sEvents=JSON.stringify(B),!0}function d(e){l();for(var t=B.events.length,n=0;n<t;n++)B.events[n].id==e&&B.events.splice(n,1);return localStorage.sEvents=JSON.stringify(B),y(),!0}function o(){null!==localStorage.getItem("sPartners")&&(L=JSON.parse(localStorage.sPartners))}function c(e){return o(),L.partners.push(e),localStorage.sPartners=JSON.stringify(L),!0}function u(e){o();for(var t=L.partners.length,n=0;n<t;n++)L.partners[n].id==e.id&&(L.partners[n]=e);return localStorage.sPartners=JSON.stringify(L),!0}function v(e){o();for(var t=L.partners.length,n=0;n<t;n++)L.partners[n].id==e&&L.partners.splice(n,1);return localStorage.sPartners=JSON.stringify(L),S(),!0}function m(t){var n=O(t).children("#lblAdminUsername").val(),a=O(t).children("#lblAdminPassword").val();e();for(var i=x.admins.length,l=0;l<i;l++){if(x.admins[l].username==n&&x.admins[l].password==a){localStorage.bAdmin=!0,w(),O(".wdw-admin-picker").fadeIn(),D||p(!0);break}localStorage.bAdmin=!1,D||p(!1)}O(t).children("#lblAdminUsername").val(""),O(t).children("#lblAdminPassword").val("")}function p(e){D=!0,e?(O("#lblAdminLogin span").text("Login successful.").fadeIn(),setTimeout(function(){O("#lblAdminLogin span").fadeOut(),D=!1,O(".wdw-login form").fadeOut(),setTimeout(function(){O(".admin-logout").fadeIn()},750)},1e3)):(O("#lblAdminLogin span").text("Login failed.").fadeIn(),setTimeout(function(){O("#lblAdminLogin span").fadeOut(),D=!0},1e3))}function f(n){var a=O(n).children("#lblAdminNewUsername").val(),i=O(n).children("#lblAdminNewPassword").val();e();var l={};l.id=C(),l.username=a,l.password=i,t(l),O(n).children("#lblAdminNewUsername").val(""),O(n).children("#lblAdminNewPassword").val(""),w()}function b(e){var t=O(e).find("#lblEventImage").val(),n=O(e).find("#lblEventTitle").val(),a=O(e).find("#lblEventOrganizer").val(),i=O(e).find("#lblEventDate").val(),s=O(e).find("#lblEventPrice").val(),d=O(e).find("#lblEventLocation").val(),o=O(e).find("#lblEventDescription").val();l();var c={};c.id=C(),c.img=t,c.title=n,c.organizer=a,c.date=i,c.price=s,c.location=d,c.partners="wat",c.description=o,r(c),O(e).children().val(""),y()}function g(e){var t=O(e).find("#lblPartnerImage").val(),n=O(e).find("#lblPartnerName").val(),a=O(e).find("#lblPartnerCEO").val(),i=O(e).find("#lblPartnerWebsite").val(),l=O(e).find("#lblPartnerHeadquarters").val(),r=O(e).find("#lblPartnerDescription").val();o();var s={};s.id=C(),s.img=t,s.ceo=a,s.website=i,s.headquarters=l,s.description=r,s.name=n,c(s),O(e).children().val(""),S()}function h(e){1==i()&&(O(".pick-window").css("display","none"),O(e).hasClass("admin-event-list")?(y(),O(".wdw-event-list").fadeIn()):O(e).hasClass("admin-partner-list")?(S(),O(".wdw-partner-list").fadeIn()):O(e).hasClass("admin-admin-list")&&(w(),O(".wdw-admin-list").fadeIn()))}function w(){var t="";e();for(var n=x.admins.length,a=0;a<n;a++)t+=N.replace("{{name}}",x.admins[a].username),t=t.replace("{{id}}",x.admins[a].id);O(".wdw-admin-list div").empty().append(t)}function y(){var e="";l();for(var t=B.events.length,n=0;n<t;n++)e+=T.replace("{{id}}",B.events[n].id),e=e.replace("{{img}}",B.events[n].img),e=e.replace("{{title}}",B.events[n].title),e=e.replace("{{organizer}}",B.events[n].organizer),e=e.replace("{{date}}",B.events[n].date),e=e.replace("{{price}}",B.events[n].price),e=e.replace("{{location}}",B.events[n].location),e=e.replace("{{partners}}",B.events[n].partners),e=e.replace("{{description}}",B.events[n].description);O(".wdw-event-list div.event-list").empty().append(e)}function S(){var e="";o();for(var t=L.partners.length,n=0;n<t;n++)e+=k.replace("{{id}}",L.partners[n].id),e=e.replace("{{img}}",L.partners[n].img),e=e.replace("{{name}}",L.partners[n].name),e=e.replace("{{ceo}}",L.partners[n].ceo),e=e.replace("{{website}}",L.partners[n].website),e=e.replace("{{headquarters}}",L.partners[n].headquarters),e=e.replace("{{description}}",L.partners[n].description);O(".wdw-partner-list div.partner-list").empty().append(e)}function P(e){if(O(e).hasClass("admin-list-item")){var t=O(e).children("h3:first-child").text();t=t.split(": "),t=t[1];var n=O(e).children("h3:nth-child(2)").text();n=n.split(": "),n=n[1];var a="";a+=J.replace("{{name}}",t).replace("{{id}}",n),O("#modal-top h2").empty().text("Edit Admin: "+t),O("#modal-middle").empty().append(a),O("#wdw-admin-modal").fadeIn()}if(O(e).hasClass("lblPartnerCreate")){var n=O(e).find(".lblPartnerId").val(),i=O(e).find(".lblPartnerImage").val(),t=O(e).find(".lblPartnerName").val(),r=O(e).find(".lblPartnerCEO").val(),d=O(e).find(".lblPartnerWebsite").val(),o=O(e).find(".lblPartnerHeadquarters").val(),c=O(e).find(".lblPartnerDescription").val(),v={};v.id=n,v.img=i,v.ceo=r,v.website=d,v.headquarters=o,v.description=c,v.name=t,u(v),S()}if(O(e).hasClass("lblEventCreate")){var n=O(e).find(".lblEventId").val(),i=O(e).find(".lblEventImage").val(),m=O(e).find(".lblEventTitle").val(),p=O(e).find(".lblEventOrganizer").val(),f=O(e).find(".lblEventDate").val(),b=O(e).find(".lblEventPrice").val(),g=O(e).find(".lblEventLocation").val(),c=O(e).find(".lblEventDescription").val();l();var h={};h.id=n,h.img=i,h.title=m,h.organizer=p,h.date=f,h.price=b,h.location=g,h.partners="wat",h.description=c,s(h),y()}}function E(e){if(O(e).hasClass("admin-list-item")){var t=O(e).children("h3:nth-child(2)").text();t=t.split(": "),t=t[1],console.log(t),swal({title:"Are you sure?",text:"You will not be able to recover this admin user!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!1},function(){swal("Deleted!","The admin user has been deleted.","success"),a(t)})}if(O(e).hasClass("partner-item")){var t=O(e).find('input[type="hidden"]').val();console.log(t),swal({title:"Are you sure?",text:"You will not be able to recover this partner!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!1},function(){swal("Deleted!","The partner has been deleted.","success"),v(t)})}if(O(e).hasClass("event-item")){var t=O(e).find('input[type="hidden"]').val();console.log(t),swal({title:"Are you sure?",text:"You will not be able to recover this event!",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it!",closeOnConfirm:!1},function(){swal("Deleted!","The event has been deleted.","success"),d(t)})}}function A(t){var a=O(t).children("input:first-child").val(),i=O(t).children("input:nth-child(2)").val(),l={};e();for(var r=x.admins.length,s=0;s<r;s++)x.admins[s].id==i&&(l=x.admins[s]);l.username=a,l.id=i,n(l),w(),O("#wdw-admin-modal").fadeOut()}function C(){var e="";return e=(Math.random().toString(16)+"000000000").substr(2,8),e+=O.now().toString()}var O=jQuery.noConflict();console.log("Page loaded and ready.");var I,x={admins:[]},D=!1,N='<div class="admin-list-item"><h3>Name: {{name}}</h3><h3>ID: {{id}}</h3><i class="fa fa-pencil edit-item" aria-hidden="true"></i><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>',J='<div class="modal-admin-edit-form-container"><form><input type="text" placeholder="Name..." value="{{name}}"><input type="text" placeholder="ID..." value="{{id}}"><input type="submit" value="SUBMIT"></form></div>',B={events:[]},T='<div class="event-item round-corners"><form class="lblEventCreate"><div><input class="lblEventImage" type="text" value="{{img}}"></div><div><div><input class="lblEventTitle" type="text" value="{{title}}"><input class="lblEventOrganizer" type="text" value="{{organizer}}"><input class="lblEventDate" type="date" value="{{date}}"><input class="lblEventPrice" type="text" value="{{price}}"><input class="lblEventLocation" type="text" value="{{location}}"><a href="#">{{partners}}</a><input type="submit" class="btnEventCreate" value="SUBMIT"></div><div><textarea class="lblEventDescription">{{description}}</textarea></div></div><input class="lblEventId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>',L={partners:[]},k='<div class="partner-item round-corners"><form class="lblPartnerCreate"><div><input class="lblPartnerImage" type="text" value="{{img}}"></div><div><div><input class="lblPartnerName" type="text" value="{{name}}"><input class="lblPartnerCEO" type="text" value="{{ceo}}"><input class="lblPartnerWebsite" type="text" value="{{website}}"><input class="lblPartnerHeadquarters" type="text" value="{{headquarters}}"><input class="btnPartnerCreate" type="submit" value="SUBMIT"></div><div><textarea class="lblPartnerDescription">{{description}}</textarea></div></div><input class="lblPartnerId" type="hidden" value="{{id}}"></form><i class="fa fa-trash-o delete-item" aria-hidden="true"></i></div>';!function(){if(null===localStorage.getItem("sAdmins")){var e={id:C(),username:"admin",password:"admin"};x.admins.push(e),localStorage.sAdmins=JSON.stringify(x)}else x=JSON.parse(localStorage.sAdmins)}(),O("#lblAdminLogin").submit(function(e){e.preventDefault(),m(this)}),O("#lblAdminCreate").submit(function(e){e.preventDefault(),f(this)}),O("#lblEventCreate").submit(function(e){e.preventDefault(),b(this)}),O("#lblPartnerCreate").submit(function(e){e.preventDefault(),g(this)}),O(".wdw-admin-picker ul li a").click(function(){h(this)}),O(document).on("click",".admin-list-item .edit-item",function(){P(O(this).parent())}),O(document).on("submit",".lblPartnerCreate",function(){P(this)}),O(document).on("submit",".lblEventCreate",function(){P(this)}),O(document).on("click",".delete-item",function(){E(O(this).parent())}),O(document).on("click",'.modal-admin-edit-form-container form input[type="submit"]',function(e){e.preventDefault(),A(O(this).parent())}),O(".admin-logout").click(function(){localStorage.bAdmin=!1}),setInterval(function(){1==i()?(O(".wdw-admin-picker").fadeIn(),O("#lblAdminLogin").fadeOut(),O(".admin-logout").fadeIn()):(O(".wdw-admin-picker").fadeOut(),O(".pick-window").fadeOut(),O(".admin-logout").fadeOut(),O("#lblAdminLogin").fadeIn())},500)});