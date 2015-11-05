#!/bin/bash

/usr/local/bin/uglifyjs -mc < cookiebar.js | sed -e s/'\.css'/'.min.css'/ > cookiebar.min.js
/usr/local/bin/yuicompressor cookiebar.css > cookiebar.min.css
