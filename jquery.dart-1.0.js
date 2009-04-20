      //document.domain="advancemags.com";
      // DART jQuery Plugin
      (function($) {
        //GLOBAL DART SETTINGS
        jQuery.extend({dart: {}});

        dartSettings = {
          kw: [],
          popups: true,
          url: 'http://ad.doubleclick.net/adj',
          environment: '',
          site: 'N681.doubleclick.com',
          zone: 'B3342305.17',
          section: '',
          additionalParams: {},
          // class name used to refresh ads on the page.
          reloadableClass: 'dartAdUnit_reloadable',
          // if this param is in document.location.search then popups will be restricted.
          popupRestrictionParam: 'nav',
          ord: Math.floor(Math.random()*10000000+1)
        }

        jQuery.extend({
          dart: {
            options: function(options){ 

              settings = jQuery.extend(true, {}, dartSettings, options);

              if (settings.popups) {
                // popups are restricted on first page entry from pay per click campaigns. 
                // add business specific popup restrictions here, or override popupRestrictionParam in options.
                if (document.referrer.indexOf('google') != '-1' || document.referrer.indexOf('yahoo') != '-1') { settings.popups = false; }
                if (settings.popupRestrictionParam != '' && document.location.search.indexOf(settings.popupRestrictionParam+'=') > -1) { settings.popups = false; }
              }

              // debug output
              if (settings.debug) {
                // TODO: change the console log test to a universal debug logger.
                if (typeof console == 'object' && typeof console.log == 'function') {
                  for (key in settings) {
                    console.log(key+': '+eval('settings.'+key)); 
                  }
                }
                // TODO: add code to collect the ad units on the page and append them to the console.log
            }
            // merge all the changed options back into dartSettings storage object
            // also reset the debug flag
            jQuery.extend(dartSettings, settings, {debug: false});

            return settings;
            },
            refresh: function(options){
              // This function is used to reload the ad units on the page without a full page reload.
              jQuery.extend(dartSettings, 
                            options,
                            {ord: Math.floor(Math.random()*10000000+1)});

              jQuery('.'+dartSettings.reloadableClass).dart({refresh: true});           
              return jQuery.dart.options();
            }            
          }
        });


        jQuery.fn.dart = function(options) {
          // define defaults and override with options, if available
          // by extending the default settings, we don't modify the argument
          placementSettings = jQuery.extend({
             sz: "728x90",
             pos: "leaderboard",
             refresh: false
          }, options);
          // TODO: look into merging the global settings with this if it would make things eaiser. maybe required when setting the ist setting to the first ad unit. also so we can override the jQuery.dart.options().reloadableClass value per unit.
          console.log(placementSettings.refresh);
          if (!placementSettings.refresh) {
            var additionalParamsString = '';
            var keywordsString = '';
            jQuery.each(jQuery.dart.options().additionalParams, function(i, val) { additionalParamsString += ';'+i+'='+val});
            jQuery.each(jQuery.dart.options().kw, function() { keywordsString += ';kw='+this});
            dartReqUrl = jQuery.dart.options().url+'/'+jQuery.dart.options().site+'/'+jQuery.dart.options().zone+additionalParamsString+keywordsString+';sz='+placementSettings.sz+';pos='+placementSettings.pos+';ord='+jQuery.dart.options().ord+'?';
            seedDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head><title></title><style>*{padding:0;margin:0;border:0}</style><scr' + 'ipt>document.domain=\"'+document.domain+'\";</scr'+'ipt></head><body><scr'+'ipt src="'+dartReqUrl+'"></scr'+'ipt></body></html>';
            this.data('seedDocumentStorage', seedDocument);
          } else {
            seedDocument = this.data('seedDocumentStorage');
          }
          //replace ORD from seed with current ORD number
          var seedDocument = seedDocument.replace(/ord=\d+/g, "ord="+jQuery.dart.options().ord);
          if (jQuery.browser.msie) {
            // this is still buggy. need to get rid of the click and also check if it is loading correctly.
            this.replaceWith(this.clone(true).each(function(){ this.src = 'javascript:document.open();document.write(\''+seedDocument+'\');document.close();'; }).attr('class', jQuery.dart.options().reloadableClass));
          } else {
            // not working in safari
            this.attr('src', 'javascript:document.open();document.write(\''+seedDocument+'\');document.close();').attr('class', jQuery.dart.options().reloadableClass);
          }
          console.log('fn.dart settings...');
          for (key in settings) {
              console.log(key + ': '+eval('settings.'+key));
          }
          return this;
        }

      // end of plugin  
      })(jQuery);