var path = location.pathname,
    href = location.href,
    login, password;

$(document).ready(function() {
    if (/Auth.Login/.test(path)) {
        // autologin
        chrome.storage.local.get('autologin', function(result) {
            if (result.autologin && !$('.auth-top-messages').text().replace(/\s/g, '').length) {
                chrome.storage.local.get('login', function(result) {
                    login = result.login;
                    $("#Login").val(login);

                    chrome.storage.local.get('password', function(result) {
                        password = result.password;
                        $("#Password").val(password);

                        if (login && password) $('#Login[type=submit]').click();
                    });
                });
            }
        });
    }

    if (/CampaignBuilder.*DomainLocations.Add/.test(path)) {
        // check Overlay option by default
        $('#IsOverlay').click();
        $('#ProcessingOrder').val(0);
        $('#form0').find('.mm-switcher.disabled').addClass('enabled');
        
        // add description
        !function() {var c = function(a) {return Array.prototype.slice.call(a)},d= (new Date).toLocaleString().replace(/\//g, "."),f = $("#user_login input.mm-dd-input:eq(0)").val(),b = c(document.querySelectorAll("#Description, #description, #descr-textarea-id")),e = [],v;e = c(document.querySelectorAll("iframe")).filter(function(a) {return a.src.match(new RegExp("^" + location.protocol + "//" + document.domain.replace(/./g, "."))) || "" === a.src}).map(function(a) {return a.contentDocument.querySelector("#Description, #description")}).filter(function(a) {return null != a});b = b.concat(e);v = '[' + d.substring(0, d.indexOf("M") - 11) + " by " + f + ']\n';b.length && (b[0].value = b[0].value ? v + b[0].value : v);b[0].focus();}();
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
            $('.k-list-container .k-item:contains(50)').click();
        }, 500);
    }

    if (/CampaignBuilder.*DomainLocations$/.test(href)) {
        // show 50 Site pages per page TODO: try to do it by setting URL params
        setTimeout(function() {
            $('#GridLocations').find('.t-dropdown-wrap.t-state-default').click();
            $('.t-animation-container .t-item:contains(50)').click();
        }, 500);
    }

    if (/CampaignBuilder.*CampaignContentManager/.test(path)) {
        // improve Content Manager
        setTimeout(function() {
            !function(){var e=function(){var e=document.createElement("style");return jQuery("head").append(e),function(n){e.styleSheet?e.styleSheet.cssText+=n:e.innerHTML+=n}}();e("#upload-log{position: absolute;top: 25%;width: 400px;left: 50%;margin-left: -200px;color: white;z-index: 1010;} #upload-log>div{text-indent:-20px;} #upload-log a{color: #bada55;} .mm-uploadError{color:rgb(252, 131, 131);} .b-mm__progress-bar-overlay__ellipse{position:absolute;width:auto;top:20%;margin-left:-75px;} .mm-dropzone{} .mm-dropzone.mm-over{background: rgb(220, 252, 220);} .mm-dropzone.mm-over > div{visibility:hidden;} .mm-assetCheckbox{position: absolute;top: 0;} .b-mm__progress-bar-overlay__caption{text-align:center;text-indent:-99999px;}");var n=location.href.match(/\/(\d+)\/CampaignContentManager/)[1],a=function(){jQuery("body").append('<div class="b-mm__progress-bar-overlay-container"><div class="b-mm__progress-bar-overlay-background"></div><div class="b-mm__progress-bar-overlay__ellipse"><div class="b-mm__progress-bar-overlay__ellipse-item"><i class="b-mm__progress-bar-overlay__loading-icon"></i><div class="b-mm__progress-bar-overlay__caption">Uploading</div></div></div><div id="upload-log"></div></div>')},t=function(e){var n=jQuery("#upload-log");return jQuery("<div>"+e+"</div>").appendTo(n)},r=function(e){jQuery.when.apply(jQuery,e).done(function(){t("<br>"),jQuery(".b-mm__progress-bar-overlay__loading-icon").hide(),t('finished. please, examine log and <a href="javascript:location.reload()">reload page</a>')})},o=function(){return jQuery(".b-mm-content-manager__content-item-layout")},i=function(){return o().not(":has(.b-mm-content-manager__content-item__in-use)")},s=function(e){return jQuery.ajax({url:location.href+"/DeleteContentManagerItem",type:"post",data:{contentManagerItemId:e}})},c=function(e){var n=jQuery('<a download href="'+e+'"></a>').hide().appendTo(d);n[0].click(),n.remove()},p=function(e){return(e.match(/var errors = .*?\["([^"]+)/)||[,""])[1]},l=jQuery(".b-mm-content-manager__content-container__you-have-no-content-items, .b-mm-content-manager__content-item-container").filter(":visible").addClass("mm-dropzone"),d=jQuery("<div>loading elements and variants data, please wait a little bit...</div>").insertBefore(l);jQuery.when(jQuery.get(location.href.replace("/CampaignContentManager","/CampaignContent")),jQuery.get(location.href.replace("/CampaignContentManager","/CampaignScripts")),jQuery.post(location.href+"/GetContentManagerItemList")).done(function(e,u,m){e=jQuery(e[0]),u=jQuery(u[0]),m=m[0];var f=function(e){return m.filter(function(n){return n.Name===e})[0]},v={};e.find(".content-element-block").each(function(){var e=jQuery(this),n=e.find(".title-block").text(),a=e.find('a[href*="EditElement"]').attr("href").split("/").pop();v[n]={id:a,variants:{}},e.find('a[href*="EditVariant"]').each(function(){var e=this.href.split("/").pop(),a=jQuery(this).closest("tr").find("span").eq(0).text();v[n].variants[a]=e})});var h={};u.find('a[href*="CampaignScripts/Edit"]').each(function(){var e=this.href.split("/").pop(),n=jQuery(this).closest("tr").find("td").eq(0).text().trim();h[n]=e}),d.html("what you'd like to do?"),l.before("<br><div>to upload files, drop them here:</div>"),d.append("<br>",jQuery('<a href="javascript:;">remove unused assets</a>').click(function(){if(confirm("Are you sure you want to remove ALL unused assets?")){a();var e=[];i().each(function(){var n=+jQuery(this).find('input[name="id"]').val(),a=jQuery(this).find(".b-mm-content-manager__content-item__name").text(),r=t("deleting "+a+", id "+n+"...");e.push(s(n).done(function(){r.append(" DONE")}).fail(function(){r.append(" FAILED")}))}),r(e)}})),d.append(" | ",jQuery('<a href="javascript:;">remove selected assets</a>').click(function(){if(confirm("Are you sure you want to remove selected assets?")){a();var e=[];i().has(".mm-assetCheckbox:checked").each(function(){var n=+jQuery(this).find('input[name="id"]').val(),a=jQuery(this).find(".b-mm-content-manager__content-item__name").text(),r=t("deleting "+a+", id "+n+"...");e.push(s(n).done(function(){r.append(" DONE")}).fail(function(){r.append(" FAILED")}))}),r(e)}})),d.append("<br>",jQuery('<a href="javascript:;">download all assets</a>').click(function(){o().find(".b-mm-content-manager__content-item__thumbnail").each(function(e,n){c(n.src)})})),d.append(" | ",jQuery('<a href="javascript:;">download selected assets</a>').click(function(){o().has(".mm-assetCheckbox:checked").find(".b-mm-content-manager__content-item__thumbnail").each(function(e,n){c(n.src)})})),o().append('<input type="checkbox" name="mm-assetCheckbox" class="mm-assetCheckbox">'),l[0].addEventListener("dragover",function(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy",l.addClass("mm-over")},!1),l[0].addEventListener("dragleave",function(){l.removeClass("mm-over")},!1),l[0].addEventListener("drop",function(e){e.stopPropagation(),e.preventDefault();{var i=e.dataTransfer.files,c=!1;o().find(".b-mm-content-manager__content-item__name").text()}jQuery.each(i,function(e,n){return f(n.name)?(c=!0,!1):void 0});var d;c&&(d=confirm("There are some files that already exist with the same name.\nDo you want to replace them automatically?"));var u=[];a(),jQuery.each(i,function(e,a){var r=function(){var e=new FormData;return e.append("file",a),e.append("campaignId",n),e},o=function(){return jQuery.ajax({url:location.href+"/ContentManagerItemUploadForm",data:r(),contentType:!1,processData:!1,type:"post"})},i=t("uploading "+a.name+"..."),c=f(a.name),l=function(){var e=jQuery.Deferred();if(i.html("uploading "+a.name+"..."),c.IsUsage){var n=[],t=jQuery.Deferred();jQuery.each(c.Elements,function(e,a){var r=v[a.Name].id;jQuery.each(a.Variants,function(e,o){var i=v[a.Name].variants[o.Name],s=function(e){return jQuery.ajax({url:location.href.replace("/CampaignContentManager","/CampaignContentVariant/UpdateVariant"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({clientId:null,elementId:r,htmlContent:e,id:i,name:o.Name,propensityFieldId:null})})},c=jQuery.Deferred();n.push(c),jQuery.post(location.href.replace("/CampaignContentManager","/CampaignContentVariant/GetVariant"),{variantId:i},function(e){var a=e.HtmlContent,r=a.replace(/\(ContentManager:/g,"(ContentManager-tmp:");s(r).done(function(){c.resolve()}),t.done(function(){n.push(s(a))})})})}),jQuery.each(c.CampaignScripts,function(e,a){var r=h[a.Name],o=function(e,n){return jQuery.ajax({url:location.href.replace("/CampaignContentManager","/CampaignScripts/UpdateCampaignScript"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({clientId:null,description:n,id:r,name:a.Name,script:e})})},i=jQuery.Deferred();n.push(i),jQuery.post(location.href.replace("/CampaignContentManager","/CampaignScripts/GetCampaignScript"),{campaignScriptId:r},function(e){var a=e.Script,r=a.replace(/\(ContentManager:/g,"(ContentManager-tmp:"),s=e.Description||"";o(r,s).done(function(){i.resolve()}),t.done(function(){n.push(o(a,s))})})}),jQuery.when.apply(jQuery,n).done(function(){s(c.Id).done(function(){o().done(function(){n=[],t.resolve(),jQuery.when.apply(jQuery,n).done(function(){e.resolve()})})})})}else s(c.Id).done(function(){o().done(function(){e.resolve()})});return e.promise()},m=jQuery.Deferred();m.done(function(e){return e?(i.append(' FAILED: <span class="mm-uploadError">'+e+"</span> "),void(/file with the same name already exists/.test(e)&&(d?l():jQuery('<a href="javascript:;">replace this file with new one</a>').appendTo(i).click(function(){l().done(function(){i.append(" DONE")})})))):void i.append(" DONE")}),u.push(m),d&&c?l().done(function(){m.resolve()}):o().done(function(e){var n=p(e);""===n?m.resolve():m.resolve(n)})}),r(u)},!1)})}();
        }, 500);
    }
});