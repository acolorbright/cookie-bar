/*
  Plugin Name: Cookie Bar
  Plugin URL: http://cookie-bar.eu/
  @author: Emanuele "ToX" Toscano
  @description: Cookie Bar is a free & simple solution to the EU cookie law.
  @version: 1.5.4
*/


var CookieBar = function() {
  /*
   * Available languages array
   */
  var CookieLanguages = [
    'en',
    'de',
    'fr',
    'es',
  ];

  var cookieLawStates = [
    'BE',
    'BG',
    'CZ',
    'DK',
    'DE',
    'EE',
    'IE',
    'EL',
    'ES',
    'FR',
    'IT',
    'CY',
    'LV',
    'LT',
    'LU',
    'HU',
    'MT',
    'NL',
    'AT',
    'PL',
    'PT',
    'RO',
    'SI',
    'SK',
    'FI',
    'SE',
    'GB'
  ];


  /**
   * Main function
   */
  function setupCookieBar() {
    var scriptPath = getScriptPath();
    var cookieBar;
    var button;

    /**
     * If cookies are disallowed, delete all the cookies at every refresh
     * @param null
     * @return null
     */
    if (getCookie() == 'CookieDisallowed') {
      removeCookies();
      setCookie('cookiebar', 'CookieDisallowed');
    }

    /**
     * Load plugin only if needed:
     * show if the "always" parameter is set
     * do nothing if cookiebar cookie is set
     * show only for european users
     * @param null
     * @return null
     */
    var checkEurope = new XMLHttpRequest();

    checkEurope.open('GET', '//www.telize.com/geoip', true);
    checkEurope.onreadystatechange = function() {
      if (checkEurope.readyState === 4 && checkEurope.status === 200) {
        clearTimeout(xmlHttpTimeout);
        var country = JSON.parse(checkEurope.responseText).country_code;
        if (cookieLawStates.indexOf(country) > -1) {
          if (getURLParameter('always')) {
            var accepted = getCookie();
            if (accepted === undefined) {
              startup();
            }
          } else {
            if (document.cookie.length > 0 || window.localStorage.length > 0) {
              var accepted = getCookie();
              if (accepted === undefined) {
                startup();
              }
            }
          }
        }
      }
    }

    checkEurope.send();

    /*
    * Using an external service for geoip localization could be a long task
    * If it takes more than 1 second, start normally
    * @param null
    * @return null
    */
    var xmlHttpTimeout = setTimeout(ajaxTimeout, 1500);
    function ajaxTimeout() {
      checkEurope.abort();
      console.log('cookieBAR - Timeout for ip geolocalion');

      if (document.cookie.length > 0 || window.localStorage.length > 0) {
        var accepted = getCookie();
        if (accepted === undefined) {
          startup();
        }
      }
    }


    /**
     * Load external files (css, language files etc.)
     * @return null
     */
    function startup() {
      var userLang = detectLang();

      // Load CSS file
      var theme = '';
      if (getURLParameter('theme')) {
        theme = '-' + getURLParameter('theme');
      }
      var path = scriptPath.replace(/[^\/]*$/, '');
      var stylesheet = document.createElement('link');
      stylesheet.setAttribute('rel', 'stylesheet');
      stylesheet.setAttribute('href', path + 'cookiebar' + theme + '.css');
      document.head.appendChild(stylesheet);

      // Load the correct language messages file and set some variables
      var request = new XMLHttpRequest();
      request.open('GET', path + 'lang/' + userLang + '.html', true);
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
          var element = document.createElement('div');
          element.innerHTML = request.responseText;
          document.getElementsByTagName('body')[0].appendChild(element);

          cookieBar = document.getElementById('cookie-bar');
          button = document.getElementById('cookie-bar-button');
          privacyPolicyLink = document.getElementById('cookie-bar-privacy-policy-link');

          if (getURLParameter('top')) {
            cookieBar.style.top = 0;
            setBodyMargin('top');
          } else {
            cookieBar.style.bottom = 0;
            setBodyMargin('bottom');
          }

          var url;
          if (getURLParameter('privacyPage')) {
            url = decodeURIComponent(getURLParameter('privacyPage'));
          } else {
            url = 'http://www.redbull.com/pp/en_INT';
          }
          privacyPolicyLink.href = url;

          if (getURLParameter('bgColor')) {
            var bgColor = decodeURIComponent(getURLParameter('bgColor'));
            cookieBar.style.backgroundColor = '#' + bgColor;
          }

          if (getURLParameter('textColor')) {
            var textColor = decodeURIComponent(getURLParameter('textColor'));
            cookieBar.style.color = '#' + textColor;
          }

          if (getURLParameter('linkColor')) {
            var linkColor = decodeURIComponent(getURLParameter('linkColor'));
            privacyPolicyLink.style.color = '#' + linkColor;
          }

          setEventListeners();
          show(cookieBar);
          setBodyMargin();
        }
      };
      request.send();
    }

    /**
     * Get this javascript's path
     * @return {String} this javascript's path
     */
    function getScriptPath() {
      var scripts = document.getElementsByTagName('script');

      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].hasAttribute('src')) {
          var path = scripts[i].src;
          if (path.indexOf('cookiebar') > -1) {
            return path;
          }
        }
      }
    }

    /**
     * Get browser's language or, if available, the specified one
     * @return {String} userLang - short language name
     */
    function detectLang() {
      var userLang = getURLParameter('forceLang');
      if (userLang === false) {
        userLang = navigator.language || navigator.userLanguage;
      }
      userLang = userLang.substr(0, 2);
      if (CookieLanguages.indexOf(userLang) < 0) {
        userLang = 'en';
      }
      return userLang;
    }

    /**
     * Get Cookie Bar's cookie if available
     * @return {string} cookie value
     */
    function getCookie() {
      var cookieValue = document.cookie.match(/(;)?cookiebar=([^;]*);?/);

      if (cookieValue == null) {
        return undefined;
      } else {
        return decodeURI(cookieValue)[2];
      }
    }

    /**
     * Write cookieBar's cookie when user accepts cookies :)
     * @param {string} name - cookie name
     * @param {string} value - cookie value
     * @return null
     */
    function setCookie(name, value) {
      var exdays = 30;
      if (getURLParameter('remember')) {
        exdays = getURLParameter('remember');
      }

      var exdate = new Date();
      exdate.setDate(exdate.getDate() + parseInt(exdays));
      var cValue = encodeURI(value) + ((exdays === null) ? '' : '; expires=' + exdate.toUTCString() + ';path=/');
      document.cookie = name + '=' + cValue;
    }

    /**
     * Remove all the cookies and empty localStorage when user refuses cookies
     * @return null
     */
    function removeCookies() {
      // Clear cookies
      document.cookie.split(';')
        .forEach(function(c) {
          document.cookie = c.replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date()
              .toUTCString() + ';path=/');
        });

      // Clear localStorage
      localStorage.clear();
    }


    /**
     * FadeIn effect
     * @param {HTMLElement} el - Element
     * @return null
     */
    function show(el) {
      var s = el.style;
      s.display = 'block';
    }


    /**
     * FadeOut effect
     * @param {HTMLElement} el - Element
     * @return null
     */
    function hide(el) {
      var s = el.style;
      s.display = 'none';
    }

    /**
     * Add a body tailored bottom (or top) margin so that CookieBar doesn't hide anything
     * @param {String} where
     * @return null
     */
    function setBodyMargin(where) {
      setTimeout(function() {
        var height = document.getElementById('cookie-bar').clientHeight;

        switch (where) {
          case 'top':
            document.getElementsByTagName('body')[0].style.marginTop = height + 'px';
            break;
          case 'bottom':
            document.getElementsByTagName('body')[0].style.marginBottom = height + 'px';
            break;
        }
      }, 300);
    }

    /**
     * Clear the bottom (or top) margin when the user closes the CookieBar
     * @return null
     */
    function clearBodyMargin() {
      var height = document.getElementById('cookie-bar').clientHeight;

      if (getURLParameter('top')) {
        var currentTop = parseInt(document.getElementsByTagName('body')[0].style.marginTop);
        document.getElementsByTagName('body')[0].style.marginTop = currentTop - height + 'px';
      } else {
        var currentBottom = parseInt(document.getElementsByTagName('body')[0].style.marginBottom);
        document.getElementsByTagName('body')[0].style.marginBottom = currentBottom -height + 'px';
      }
    }

    /**
     * Get url parameter to look for
     * @param {string} name - param name
     * @return {String|Boolean} param value (false if parameter is not found)
     */
    function getURLParameter(name) {
      var set = scriptPath.split(name + '=');
      if (set[1]) {
        return set[1].split(/[&?]+/)[0];
      } else {
        return false;
      }
    }

    /**
     * Set button actions (event listeners)
     * @return null
     */
    function setEventListeners() {
      button.addEventListener('click', function() {
        setCookie('cookiebar', 'CookieAllowed');
        clearBodyMargin();
        hide(cookieBar);
      });
    }
  }

  return {
    setup: setupCookieBar
  }
}

// Load the script only if there is at least a cookie or a localStorage item
document.addEventListener('DOMContentLoaded', function() {
  (new CookieBar()).setup();
});
