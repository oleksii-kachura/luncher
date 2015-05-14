$(document).ready(function() {
    var path = location.pathname;

    if (/Auth.Login/.test(path)) {
        // autologin
        $('#Login').val('alex.kachura@maxymiser.com');
        $('#Password').val('adgjmptW!12');
        $('#Login[type=submit]').click();
    }

    if (/CampaignBuilder.*DomainLocations.Add/.test(path)) {
        // check Overlay option by default
        $('#IsOverlay').click();
    }

    if (/Admin.*ActionLog/.test(path)) {
        setTimeout(function() {
            // set action flags
            $('#VISITOR').click();
            $('#IP').click();
            $('#COUNTRY').click();
            $('#CAMPAIGN').click();
            $('#bApply').click();

            // show 50 actions per page
            $('.k-item:contains(50)').click();
        }, 500);
    }

    if (/CampaignBuilder.*DomainLocations/.test(path)) {
        // show 50 Site pages per page TODO: try to do it by setting URL params
        //setTimeout(function() {
        //    if ($('.t-input').text() === '50') {
        //        return;
        //    }
        //
        //    $('.t-dropdown-wrap.t-state-default').click();
        //    $('.t-item:contains(50)').click();
        //}, 500);
        // test commit
    }

    if (/CampaignBuilder.*CampaignContentManager/.test(path)) {
        (function improveContentManager() {
            !function(){function w(a){a=jQuery('<a download href="'+a+'"></a>').w().h(f);a[0].click();a.remove()}function q(a){return jQuery.f({url:location.href+"/DeleteContentManagerItem",type:"post",data:{N:a}})}function x(){return e().R(":has(.b-mm-content-manager__content-item__in-use)")}function e(){return jQuery(".b-mm-content-manager__content-item-layout")}function t(a){jQuery.g.apply(jQuery,a).done(function(){l("<br>");jQuery(".b-mm__progress-bar-overlay__loading-icon").w();l('finished. please, examine log and <a href="javascript:location.reload()">reload page</a>')})} function l(a) { var b = jQuery("#upload-log");return jQuery("<div>"+a+"</div>").h(b)}function u(){jQuery("body").append('<div class="b-mm__progress-bar-overlay-container"><div class="b-mm__progress-bar-overlay-background"></div><div class="b-mm__progress-bar-overlay__ellipse"><div class="b-mm__progress-bar-overlay__ellipse-item"><i class="b-mm__progress-bar-overlay__loading-icon"></i><div class="b-mm__progress-bar-overlay__caption">Uploading</div></div></div><div id="upload-log"></div></div>')}(function(){var a= document.createElement("style"); return jQuery("head").append(a), function (b) { a.styleSheet ? a.styleSheet.cssText += b : a.innerHTML += b } })()("#upload-log{position: absolute;top: 25%;width: 400px;left: 50%;margin-left: -200px;color: white;z-index: 1010;} #upload-log>div{text-indent:-20px;} #upload-log a{color: #bada55;} .mm-uploadError{color:rgb(252, 131, 131);} .b-mm__progress-bar-overlay__ellipse{position:absolute;width:auto;top:20%;margin-left:-75px;} .mm-dropzone{} .mm-dropzone.mm-over{background: rgb(220, 252, 220);} .mm-dropzone.mm-over > div{visibility:hidden;} .mm-assetCheckbox{position: absolute;top: 0;} .b-mm__progress-bar-overlay__caption{text-align:center;text-indent:-99999px;}"); var A = location.href.match(/\/(\d+)\/CampaignContentManager/)[1],c=jQuery(".b-mm-content-manager__content-container__you-have-no-content-items, .b-mm-content-manager__content-item-container").filter(":visible").m("mm-dropzone"),f=jQuery("<div>loading elements and variants data, please wait a little bit...</div>").insertBefore(c);jQuery.g(jQuery.get(location.href.replace("/CampaignContentManager","/CampaignContent")),jQuery.get(location.href.replace("/CampaignContentManager","/CampaignScripts")),jQuery.i(location.href+ "/GetContentManagerItemList")).done(function(a,b,v){function y(d){return v.filter(function(a){return a.b===d})[0]}a=jQuery(a[0]);b=jQuery(b[0]);v=v[0];var r={};a.find(".content-element-block").a(function(){var d=jQuery(this),a=d.find(".title-block").text(),m=d.find('a[href*="EditElement"]').K("href").split("/").pop();r[a]={id:m,j:{}};d.find('a[href*="EditVariant"]').a(function(){var d=this.href.split("/").pop(),m=jQuery(this).s("tr").find("span").u(0).text();r[a].j[m]=d})});var z={};b.find('a[href*="CampaignScripts/Edit"]').a(function(){var d= this.href.split("/").pop(), a = jQuery(this).s("tr").find("td").u(0).text().trim(); z[a] = d }); f.A("what you'd like to do?"); c.L("<br><div>to upload files, drop them here:</div>"); f.append("<br>", jQuery('<a href="javascript:;">remove unused assets</a>').click(function () { if (confirm("Are you sure you want to remove ALL unused assets?")) { u(); var a = []; x().a(function () { var g = +jQuery(this).find('input[name="id"]').B(), m = jQuery(this).find(".b-mm-content-manager__content-item__name").text(), b = l("deleting " + m + ", id " + g + "..."); a.push(q(g).done(function () { b.append(" DONE") }).v(function (){b.append(" FAILED")}))});t(a)}}));f.append(" | ",jQuery('<a href="javascript:;">remove selected assets</a>').click(function(){if(confirm("Are you sure you want to remove selected assets?")){u();var a=[];x().has(".mm-assetCheckbox:checked").a(function(){var g=+jQuery(this).find('input[name="id"]').B(),b=jQuery(this).find(".b-mm-content-manager__content-item__name").text(),c=l("deleting "+b+", id "+g+"...");a.push(q(g).done(function(){c.append(" DONE")}).v(function(){c.append(" FAILED")}))}); t(a) } })); f.append("<br>",jQuery('<a href="javascript:;">download all assets</a>').click(function(){e().find(".b-mm-content-manager__content-item__thumbnail").a(function(a,b){w(b.src)})}));f.append(" | ",jQuery('<a href="javascript:;">download selected assets</a>').click(function(){e().has(".mm-assetCheckbox:checked").find(".b-mm-content-manager__content-item__thumbnail").a(function(a,b){w(b.src)})}));e().append('<input type="checkbox" name="mm-assetCheckbox" class="mm-assetCheckbox">');c[0].addEventListener("dragover", function (a) { a.stopPropagation();a.preventDefault();a.dataTransfer.dropEffect="copy";c.m("mm-over")},!1);c[0].addEventListener("dragleave",function(){c.V("mm-over")},!1);c[0].addEventListener("drop",function(a){a.stopPropagation();a.preventDefault();a=a.dataTransfer.files;var b=!1;e().find(".b-mm-content-manager__content-item__name").text();jQuery.a(a,function(a,c){return y(c.name)?(b=!0,!1):void 0});var c;b&&(c=confirm("There are some files that already exist with the same name.\nDo you want to replace them automatically?")); var f = []; u(); jQuery.a(a, function(a,b){function d(){var a=jQuery.c();if(n.A("uploading "+b.name+"..."),h.H){var c=[],f=jQuery.c();jQuery.a(h.F,function(a,b){var d=r[b.b].id;jQuery.a(b.J,function(a,k){function e(a){return jQuery.f({url:location.href.replace("/CampaignContentManager","/CampaignContentVariant/UpdateVariant"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({o:null,O:d,P:a,id:g,name:k.b,U:null})})}var g=r[b.b].j[k.b],h=jQuery.c();c.push(h); jQuery.i(location.href.replace("/CampaignContentManager","/CampaignContentVariant/GetVariant"),{X:g},function(a){var b=a.G;a=b.replace(/\(ContentManager:/g,"(ContentManager-tmp:");e(a).done(function(){h.resolve()});f.done(function(){c.push(e(b))})})})});jQuery.a(h.C,function(a,b){function d(a,c){return jQuery.f({url:location.href.replace("/CampaignContentManager","/CampaignScripts/UpdateCampaignScript"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({o:null, description: c, id: k, name:b.b,W:a})})}var k=z[b.b],e=jQuery.c();c.push(e);jQuery.i(location.href.replace("/CampaignContentManager","/CampaignScripts/GetCampaignScript"),{M:k},function(a){var b=a.I,k=b.replace(/\(ContentManager:/g,"(ContentManager-tmp:"),g=a.D||"";d(k,g).done(function(){e.resolve()});f.done(function(){c.push(d(b,g))})})});jQuery.g.apply(jQuery,c).done(function(){q(h.l).done(function(){e().done(function(){c=[];f.resolve();jQuery.g.apply(jQuery,c).done(function(){a.resolve()})})})})}else q(h.l).done(function(){e().done(function(){a.resolve()})}); return a.T() } function e() { return jQuery.f({url:location.href+"/ContentManagerItemUploadForm",data:g(),contentType:!1,S:!1,type:"post"})}function g(){var a=new FormData;return a.append("file",b),a.append("campaignId",A),a}var n=l("uploading "+b.name+"..."),h=y(b.name),p=jQuery.c();p.done(function(a){return a?(n.append(' FAILED: <span class="mm-uploadError">'+a+"</span> "),void(/file with the same name already exists/.test(a)&&(c?d():jQuery('<a href="javascript:;">replace this file with new one</a>').h(n).click(function(){d().done(function(){n.append(" DONE")})})))): void n.append(" DONE") });f.push(p);c&&h?d().done(function(){p.resolve()}):e().done(function(a){a=(a.match(/var errors = .*?\["([^"]+)/)||[,""])[1];""===a?p.resolve():p.resolve(a)})});t(f)},!1)})}();
        })();
    }
});