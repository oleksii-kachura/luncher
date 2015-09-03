/**
 * content.js
 * This script does all the changes in UI.
 *
 * @author Alex Kachura alex.kachura@maxymiser.com
 * @date 14 May 2015
 */

;
(function() {
    var $        = window.$;
    var href     = location.href;
    var host     = location.host;
    var path     = location.pathname;
    var search   = location.search;
    var settings = {};

    chrome.storage.sync.get(null, makeLifeBetter);

    /**
     * Applies all fixes on corresponding pages.
     * @param {object} storageData - Extension settings received from chrome storage.
     */
    function makeLifeBetter(storageData) {
        settings = storageData;

        // browser rules, site actions
        if (/CampaignBuilder.*(((Campaign|Domain)BrowserRules)|DomainActions|ScriptsMappings)$/.test(path) && !search) {
            settings.moreItems && showMoreItemsPerPage();
        }

        $(document).ready(function() {
            // common
            replaceSpinner();
            // campaign builder
            if (/CampaignBuilder/.test(path)) {
                path = path.replace('CampaignBuilder', '');

                // add new script/action/page/element/variant/segmentRule page
                if (/Add/.test(path)) {
                    // add campaign/domain script page
                    if (/Scripts.Add/.test(path)) {
                        settings.addScriptBody && addScriptBody(settings.scriptBody);
                    }
                    // add new action/element/script page
                    if (/(CampaignContent.AddElement)|((DomainActions|Scripts).Add)/.test(path)) {
                        settings.addDescription && addDescription();
                    }
                    // add campaign element/script page
                    if (/(Campaign.+Add)/.test(path)) {
                        settings.addNamePrefix && addNamePrefix();
                    }
                    // add new site page
                    if (/DomainLocations.Add/.test(path)) {
                        $('#ProcessingOrder').attr('title', '10-200 - Common pages\n200-700 - Campaign specific pages\n700-1000 - Virtual pages');
                        settings.addDescription && addDescription();
                    }
                    focusName();
                }

                // campaign pages
                if (/Campaign/.test(path)) {
                    settings.reorderCmpSidebar && reorderCmpSidebar();

                    // campaign pages/actions/mappings
                    if (/Locations|Goals|Mappings/.test(path)) {
                        settings.addFilterInput && addFilterInput();
                    }
                    // content manager page
                    if (/ContentManager/.test(path)) {
                        settings.improveCM && improveContentManager();
                    }
                    // campaign scripts page
                    if (/Scripts/.test(path)) {
                        // if no scripts add a new one
                        if (settings.addScriptIfNo && $('#Grid').find('.t-no-data').length) {
                            location.assign(href + '/Add');
                        }
                    }
                    // campaign settings/actions page
                    if (/Settings|Goals/.test(path)) {
                        settings.omitActionDetails && omitActionDetails();
                    }
                    // campaign add script page
                    if (/Scripts.Add/.test(path)) {
                        watchNameLength();
                    }
                }

                // site pages
                if (/Domain/.test(path)) {
                    // site pages page
                    if (/Locations$/.test(path) && !search) {
                        settings.moreItems && !$('#Url').val() && showMoreItemsPerPage('?GridLocations-page=1&GridLocations-orderBy=~&GridLocations-filter=~&GridLocations-size=50');
                    }
                    // site scripts page
                    if (/Scripts/.test(path)) {
                        // if no scripts add a new one
                        if (settings.addScriptIfNo && $('#Grid').find('.t-no-data').length) {
                            location.assign(href + '/Add');
                        }
                    }
                    // site mappings
                    if (/Mappings/.test(path)) {
                        settings.addFilterInput && addFilterInput();
                    }
                    // add/edit action page
                    if (/Actions.(Add|Edit)/.test(path)) {
                        $('#ActionType').on('change', function() {
                            if (this.value === 'Sales_Amount') {
                                $('#ActionMultiplier').val('0.01');
                            }
                        });
                    }
                }
            }
            // admin pages
            if (/Admin/.test(path)) {
                // action log page
                if (/ActionLog/.test(path)) {
                    settings.moreItems && $('#bRefresh, #bApply').click(showMoreItemsPerPageDOM);
                    if (settings.filterActionLog) {
                        setTimeout(function() {
                            // set flags
                            $.each($('#CheckBoxes').find('input'), function(id, checkbox) {
                                id = $(checkbox).attr('id');
                                if ($(checkbox).prop('checked') != !!(settings.actionLogFiltersList.indexOf(id) + 1)) {
                                    $($('#' + id)).click();
                                }
                            });
                            // apply flags
                            $('#bApply').click();
                        }, 750);
                    }
                }
                settings.alternativeDocTitle = false;
            }
            // login page
            if (/Auth.Login/.test(path)) {
                settings.autoLogin && autoLogin();
            }

            settings.alternativeDocTitle && alternativeDocTitle();
        });
    }

    /**
     * Detects current environment.
     * @returns {string} - Empty string | 'US' | 'Demo'
     */
    function detectEnvironment() {
        var env = '';
        if (/us/.test(host)) { env = 'US'; }
        if (/demo/.test(host)) { env = 'Demo'; }
        return env;
    }

    /**
     * Improves Content Manager.
     * Allows you to upload/download/remove multiple files at a time, use drag&drop to add files.
     */
    function improveContentManager(){ setTimeout(function() {
        var e = function() {
                var e = document.createElement("style");return jQuery("head").append(e), function(n) {e.styleSheet ? e.styleSheet.cssText += n : e.innerHTML += n}
            }(),
            n=location.href.match(/\/(\d+)\/CampaignContentManager/)[1],
            a=function(){
                jQuery("body").append('<div class="b-mm__progress-bar-overlay-container"><div class="b-mm__progress-bar-overlay-background"></div><div class="b-mm__progress-bar-overlay__ellipse"><div class="b-mm__progress-bar-overlay__ellipse-item"><i class="b-mm__progress-bar-overlay__loading-icon"></i><div class="b-mm__progress-bar-overlay__caption">Uploading</div></div></div><div id="upload-log"></div></div>')
            },t=function(e){
                var n=jQuery("#upload-log");return jQuery("<div>"+e+"</div>").appendTo(n)
            },r=function(e){
                jQuery.when.apply(jQuery,e).done(function(){t("<br>"),jQuery(".b-mm__progress-bar-overlay__loading-icon").hide(),t('finished. please, examine log and <a href="javascript:location.reload()">reload page</a>')})
            },o=function(){
                return jQuery(".b-mm-content-manager__content-item-layout")
            },i=function(){
                return o().not(":has(.b-mm-content-manager__content-item__in-use)")
            },s=function(e){
                return jQuery.ajax({url:location.href+"/DeleteContentManagerItem",type:"post",data:{contentManagerItemId:e}})
            },c=function(e){
                var n=jQuery('<a download href="'+e+'"></a>').hide().appendTo(d);n[0].click(),n.remove()
            },p=function(e){
                return(e.match(/var errors = .*?\["([^"]+)/)||[,""])[1]
            },l=jQuery(".b-mm-content-manager__content-container__you-have-no-content-items, .b-mm-content-manager__content-item-container").filter(":visible").addClass("mm-dropzone"),
            d=jQuery("<div>loading elements and variants data, please wait a little bit...</div>").insertBefore(l);

        e("#upload-log{position: absolute;top: 25%;width: 400px;left: 50%;margin-left: -200px;color: white;z-index: 1010;} #upload-log>div{text-indent:-20px;} #upload-log a{color: #bada55;} .mm-uploadError{color:rgb(252, 131, 131);} .b-mm__progress-bar-overlay__ellipse{position:absolute;width:auto;top:20%;margin-left:-75px;} .mm-dropzone{} .mm-dropzone.mm-over{background: rgb(220, 252, 220);} .mm-dropzone.mm-over > div{visibility:hidden;} .mm-assetCheckbox{position: absolute;top: 0;} .b-mm__progress-bar-overlay__caption{text-align:center;text-indent:-99999px;}");
        jQuery.when(jQuery.get(location.href.replace("/CampaignContentManager","/CampaignContent")), jQuery.get(location.href.replace("/CampaignContentManager","/CampaignScripts")), jQuery.post(location.href+"/GetContentManagerItemList"))
            .done(function(e,u,m){e=jQuery(e[0]),u=jQuery(u[0]),m=m[0];var f=function(e){return m.filter(function(n){return n.Name===e})[0]},v={};e.find(".content-element-block").each(function(){var e=jQuery(this),n=e.find(".title-block").text(),a=e.find('a[href*="EditElement"]').attr("href").split("/").pop();v[n]={id:a,variants:{}},e.find('a[href*="EditVariant"]').each(function(){var e=this.href.split("/").pop(),a=jQuery(this).closest("tr").find("span").eq(0).text();v[n].variants[a]=e})});var h={};u.find('a[href*="CampaignScripts/Edit"]').each(function(){var e=this.href.split("/").pop(),n=jQuery(this).closest("tr").find("td").eq(0).text().trim();h[n]=e}),d.html("what you'd like to do?"),l.before("<br><div>to upload files, drop them here:</div>"),d.append("<br>",jQuery('<a href="javascript:;">remove unused assets</a>').click(function(){if(confirm("Are you sure you want to remove ALL unused assets?")){a();var e=[];i().each(function(){var n=+jQuery(this).find('input[name="id"]').val(),a=jQuery(this).find(".b-mm-content-manager__content-item__name").text(),r=t("deleting "+a+", id "+n+"...");e.push(s(n).done(function(){r.append(" DONE")}).fail(function(){r.append(" FAILED")}))}),r(e)}})),d.append(" | ",jQuery('<a href="javascript:;">remove selected assets</a>').click(function(){if(confirm("Are you sure you want to remove selected assets?")){a();var e=[];i().has(".mm-assetCheckbox:checked").each(function(){var n=+jQuery(this).find('input[name="id"]').val(),a=jQuery(this).find(".b-mm-content-manager__content-item__name").text(),r=t("deleting "+a+", id "+n+"...");e.push(s(n).done(function(){r.append(" DONE")}).fail(function(){r.append(" FAILED")}))}),r(e)}})),d.append("<br>",jQuery('<a href="javascript:;">download all assets</a>').click(function(){o().find(".b-mm-content-manager__content-item__thumbnail").each(function(e,n){c(n.src)})})),d.append(" | ",jQuery('<a href="javascript:;">download selected assets</a>').click(function(){o().has(".mm-assetCheckbox:checked").find(".b-mm-content-manager__content-item__thumbnail").each(function(e,n){c(n.src)})})),o().append('<input type="checkbox" name="mm-assetCheckbox" class="mm-assetCheckbox">'),l[0].addEventListener("dragover",function(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy",l.addClass("mm-over")},!1),l[0].addEventListener("dragleave",function(){l.removeClass("mm-over")},!1),l[0].addEventListener("drop",function(e){e.stopPropagation(),e.preventDefault();{var i=e.dataTransfer.files,c=!1;o().find(".b-mm-content-manager__content-item__name").text()}jQuery.each(i,function(e,n){return f(n.name)?(c=!0,!1):void 0});var d;c&&(d=confirm("There are some files that already exist with the same name.\nDo you want to replace them automatically?"));var u=[];a(),jQuery.each(i,function(e,a){var r=function(){var e=new FormData;return e.append("file",a),e.append("campaignId",n),e},o=function(){return jQuery.ajax({url:location.href+"/ContentManagerItemUploadForm",data:r(),contentType:!1,processData:!1,type:"post"})},i=t("uploading "+a.name+"..."),c=f(a.name),l=function(){var e=jQuery.Deferred();if(i.html("uploading "+a.name+"..."),c.IsUsage){var n=[],t=jQuery.Deferred();jQuery.each(c.Elements,function(e,a){var r=v[a.Name].id;jQuery.each(a.Variants,function(e,o){var i=v[a.Name].variants[o.Name],s=function(e){return jQuery.ajax({url:location.href.replace("/CampaignContentManager","/CampaignContentVariant/UpdateVariant"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({clientId:null,elementId:r,htmlContent:e,id:i,name:o.Name,propensityFieldId:null})})},c=jQuery.Deferred();n.push(c),jQuery.post(location.href.replace("/CampaignContentManager","/CampaignContentVariant/GetVariant"),{variantId:i},function(e){var a=e.HtmlContent,r=a.replace(/\(ContentManager:/g,"(ContentManager-tmp:");s(r).done(function(){c.resolve()}),t.done(function(){n.push(s(a))})})})}),jQuery.each(c.CampaignScripts,function(e,a){var r=h[a.Name],o=function(e,n){return jQuery.ajax({url:location.href.replace("/CampaignContentManager","/CampaignScripts/UpdateCampaignScript"),type:"post",contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({clientId:null,description:n,id:r,name:a.Name,script:e})})},i=jQuery.Deferred();n.push(i),jQuery.post(location.href.replace("/CampaignContentManager","/CampaignScripts/GetCampaignScript"),{campaignScriptId:r},function(e){var a=e.Script,r=a.replace(/\(ContentManager:/g,"(ContentManager-tmp:"),s=e.Description||"";o(r,s).done(function(){i.resolve()}),t.done(function(){n.push(o(a,s))})})}),jQuery.when.apply(jQuery,n).done(function(){s(c.Id).done(function(){o().done(function(){n=[],t.resolve(),jQuery.when.apply(jQuery,n).done(function(){e.resolve()})})})})}else s(c.Id).done(function(){o().done(function(){e.resolve()})});return e.promise()},m=jQuery.Deferred();m.done(function(e){return e?(i.append(' FAILED: <span class="mm-uploadError">'+e+"</span> "),void(/file with the same name already exists/.test(e)&&(d?l():jQuery('<a href="javascript:;">replace this file with new one</a>').appendTo(i).click(function(){l().done(function(){i.append(" DONE")})})))):void i.append(" DONE")}),u.push(m),d&&c?l().done(function(){m.resolve()}):o().done(function(e){var n=p(e);""===n?m.resolve():m.resolve(n)})}),r(u)},!1)})
    }, 600); }

    /**
     * Gets client name, e.g. 'lastminute.de'.
     */
    function getClientName() {
        try {
            return $('.top-navigation-content .domain-dd-wrap .dd-input-in .dd-text').text();
        } catch (e) { return ''; }
    }

    /**
     * Gets campaign prefix, e.g. 'T31'.
     */
    function getCampaignPrefix() {
        var prefix;
        var $elem = $('#main .breadcrumb .mm-name span, #main .mm-campaign-name span.overflow-tooltip');
        if (!$elem.length) { return ''; }
        prefix = $elem.eq(0).text().match(/(M?T|CID|PC|VCB)\d*/, '')[0];
        return prefix || '';
    }

    /**
     * Prepends Campaign prefix to document title.
     */
    function alternativeDocTitle() {
        var $title, title, prefix, postfix;
        setTimeout(function() {
            $title = $('head title');
            title = $title.text().replace('Site', '');
            prefix = getCampaignPrefix();
            postfix = getClientName();
            prefix && (title = title.replace('Campaign ', ''));
            $title.text((prefix ? prefix + ' ' : '') + title + (postfix ? ' | ' + postfix : ''));
        }, 2000);
    }

    /**
     * Gets user name.
     * @returns {string}
     */
    function getUserName() {
        return $('#user_login').find('input.mm-dd-input:eq(0)').val();
    }

    /**
     * Gets current date.
     * @returns {string} Format: "8.12.2015".
     */
    function getDate() {
        var d = (new Date).toLocaleString('pl');
        return d.substring(0, d.indexOf(','));
    }

    /**
     * Adds campaign prefix to the name of script/element.
     */
    function addNamePrefix() {
        var e;
        setTimeout(function() {
            e = $('#Name, #b-mm-edit-campaign-script__campaign-script-name');
            e.length && !e.val() && e.val(getCampaignPrefix() + '_');
        }, 900);
    }

    /**
     * If description field exists, adds current date and name of creator.
     * Format [dd.mm.yyyy by Name Surname]
     */
    function addDescription() {
        var d, f, b, v;
        setTimeout(function() {
            d = getDate();
            f = getUserName();
            b = $('#Description, #description, #descr-textarea-id');
            v = d + ' by ' + f + '\n';
            b.length && !b.val() && b.val(v);
        }, 900);
    }

    /**
     * Adds some dummy code to script field in order to prevent validation error when you save script with blank body.
     */
    function addScriptBody(code) {
        var $highlight, $script, name, email, date;
        if (!code) {
            date  = getDate() || '[date]';
            name  = getUserName() || '[name]';
            email = settings['login' + detectEnvironment()];
            if (!email || email == '@maxymiser.com') { email = '[email]'; }
            code =
                "/**\n" +
                " * [script name]\n" +
                " * This script's purpose is to [check generation rules, track actions, e.t.c].\n" +
                " *\n" +
                " * @author " + name + " " + email + "\n" +
                " * @date " + date + "\n" +
                " */\n" +
                "    \n" +
                ";\n" +
                "(function() {\n" +
                "    \n" +
                "})();";
        }
        setTimeout(function() {
            $highlight = $('#heightlight_button, #codeHighlight').eq(0);
            $script = $('#script, #Script');
            if (!$script.val()) {
                if ($highlight.prop('checked')) {
                    $highlight.click();
                    $script.val(code);
                    $highlight.click();
                } else {
                    $script.val(code);
                }
            }
        }, 900);
    }

    /**
     * Sets focus on Name input field.
     */
    function focusName() {
        var e;
        setTimeout(function() {
            e = $('#Name, #b-mm-edit-campaign-script__campaign-script-name, #b-mm-edit-variant__variant-name').eq(0);
            e.length && e.focus();
        }, 1300);
    }

    /**
     * Makes action 'details' link omit Action Details page and go directly to Edit Action Page.
     */
    function omitActionDetails() {
        var href;
        $('.mm-CampaignActions .dashbrd-lnk-std, .mm-details').each(function(k, link) {
            href = $(link).attr('href').replace(/campaign.+Details/, 'DomainActions/Edit');
            $(link).attr('href', href);
        });
    }

    /**
     * Automatically logs you in with credentials specified in settings.
     */
    function autoLogin() {
        var env = detectEnvironment();
        if (settings['login' + env] && settings['password' + env] && !$('.auth-top-messages').text().replace(/\s/g, '').length) {
            $("#Login").val(settings['login' + env]);
            $("#Password").val(settings['password' + env]);
            $('.btn[type="submit"]').click();
        }
    }

    /**
     * Shows more items per page using URL params.
     * @param params - Use this argument if URL parameters which set grid size differ from standard ones.
     */
    function showMoreItemsPerPage(params) {
        var numberOfItems;
        numberOfItems = '' + (settings.numberOfItems || 50);
        params = (params || '?Grid-page=1&Grid-orderBy=~&Grid-filter=~&Grid-size=50').replace(/50/g, numberOfItems);
        location.replace(href + params);
    }

    /**
     * Shows 50 items per page using DOM elements.
     */
    function showMoreItemsPerPageDOM() {
        setTimeout(function() {
            $('#Grid, #GridLocations, #grid').find('.t-dropdown-wrap.t-state-default, .k-dropdown-wrap.k-state-default').click();
            $('.t-animation-container .t-item:contains(50), .k-animation-container .k-item:contains(50)').click();
        }, 770);
    }

    /**
     * Replaces default spinner image to have transparent background.
     */
    function replaceSpinner() {
        var spinnerURL = chrome.extension.getURL('img/spinner.gif');
        var $spinner   = $('#spinner');
        if ($spinner.length) {
            $spinner.attr('src', spinnerURL).css({opacity: 1});
        }
    }

    /**
     * Moves Campaign Scripts and Mappings out of additional settings.
     */
    function reorderCmpSidebar() {
        $('#sidebar')
            .find('> ul > li.domain-settings')
                .addClass('selected')
                .parent().find('> li.campaign-settings > ul > li.delimiter')
                    .removeClass('selected')
                    .find('> ul > li:not(:first-child)')
                        .removeClass('sub-item-l2').addClass('sub-item')
                        .insertAfter('#sidebar > ul > li.campaign-settings > ul > li:nth-child(2)');
    }

    /**
     * Adds an input next to select which lets filter options
     */
    function addFilterInput() {
        $('#SelectedLocation, #ActionId, #LocationId, #ObjectId').each(function() {
            var $input  = $('<input type="text" class="filter-options" placeholder="Filter" title="RegExp">');
            var $select = $(this);
            var options = [];
            $input.insertBefore($select);
            $select.find('option').each(function() {
                options.push({value: $(this).val(), text: $(this).text()});
            });
            $select.data('options', options);
            $input.bind('change keyup', function() {
                var options, regex;
                options = $select.empty().data('options');
                try {
                    regex = new RegExp($(this).val(), 'gi');
                    $.each(options, function(i) {
                        var option = options[i];
                        if (option.text.match(regex) !== null) {
                            $select.append($('<option>').text(option.text).val(option.value));
                        }
                    });
                } catch (e) {}
            });
        });
    }

    function watchNameLength() {
        var $input, $wrapper, length;
        setTimeout(function() {
            $input = $('#b-mm-edit-campaign-script__campaign-script-name');
            $input.bind('change keyup', function() {
                length = $input.val().length;
                $wrapper = $('.b-mm-edit-campaign-script__wrong-name-tipsy');
                $wrapper.length && $wrapper.attr('id', 'validation-wrapper');
                $wrapper = $('#validation-wrapper');
                if (length > 20) {
                    if ($wrapper.length) {
                        $wrapper.addClass('b-mm-edit-campaign-script__wrong-name-tipsy')
                    } else {
                        $('.b-mm-edit-campaign-script__campaign-script-name-container').append('<div id="validation-wrapper" class="b-mm-edit-campaign-script__wrong-name-tipsy"><i class="b-mm-edit-campaign-script__wrong-field-error-icon" original-title="Length of the Campaign Script name must be between 1 and 20 characters."></i></div>');
                        $input.insertBefore($('i.b-mm-edit-campaign-script__wrong-field-error-icon')).focus();
                    }
                } else if ($wrapper.length) {
                    $wrapper.removeClass('b-mm-edit-campaign-script__wrong-name-tipsy')
                }
            });
        }, 1200);
    }
})();