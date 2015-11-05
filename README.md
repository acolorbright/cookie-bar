RBMA Cookie Bar
===============

Cookie Bar is a free & easy solution to the EU cookie law.

_This repository has an RBMA flavored and stripped down version of the [original cookie-bar project](http://cookie-bar.eu/)._

##### Why use Cookie Bar?

There is a lot of mystery and fuss surrounding the new EU cookie legislation, but it's essentially really simple. Cookies are files used to track site activity and most websites use them. Site owners need to make the use of cookies very obvious to visitors.

Cookie bar makes it simple and clear to visitors that cookies are in use and tells them how to adjust browser settings if they are concerned.

##### TL;DR

Just place this somewhere in your website and forget it:

    http://rbma.github.io/cookie-bar/cookiebar.min.js


##### How it works?

Permisson Bar is a drop-in and forget, pure vanilla javascript code, no jQuery or any other dependency needed. It shows up only when actually needed and stay silent if not: If a website has a cookie or some localStorage data set then the bar is shown, otherwhise nothing happens.

Once user clicks 'Allow Cookies' Cookie Bar will set a cookie for that domain with a name 'cookiebar' that will expire in 30 days. What this means is that the plugin will only show up once per domain (per month).

##### How many languages are supported?

Currently, the supported languages for Cookie Bar are:

* en - English
* de - German

(Language files for it, fr, hu have been removed in this fork.)

The user language is automatically detected by the browser, but you can force a specific language by passing an optional parameter (see below).

##### How to Install?

Include this HTML snippet in your HTML code, ideally right before the `</body>` tag:

    <script src="http://rbma.github.io/cookie-bar/cookiebar.min.js" type="text/javascript"></script>


###### If you need to configure it, you can do it like that:

    <script src="http://rbma.github.io/cookie-bar/cookiebar.min.js?theme=foo&forceLang=en&…" type="text/javascript"></script>

##### Here is a short list of parameters you can use:

- `forceLang=XX` – force a specific language (if omitted we try to detect the browser's language setting)
- `privacyPage=URL` – set a custom privacy page URL (defaults to http://www.redbull.com/pp/en_INT)
- `top=1` – put the bar at the top of the viewport (default is at the bottom)
- `theme=mytheme` – use an alternate theme (no alternatives included in this fork – add a `cookiebar-mytheme.css` file for this to work)
- `bgColor=000000` – set the background color of the bar (hexadecimal without the `#`)
- `textColor=FFFFFF` – set the text color
- `linkColor=FF0000` – set the link text color
- `remember=NN` – remember the user's decision for NN days (show the bar again after NN days)
