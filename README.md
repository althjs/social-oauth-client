Social OAuth Client
===========================

Facebook, Google, Twitter, GitHub OAuth wrapper to easily adapt social login using Restful on each platforms.

## Features
* get OAuth tokens & basic info for each platforms.

## Installation
```bash
# 1. install social-oauth-client
$ npm install social-oauth-client
```

## Usage
> Social login require browser activities like URL redirect or callback url. So, demo use Express server to receive callback.
> Each social platform needs to register application for OAuth login.

### Google
```javascript
'use strict';
var express = require('express');
var app = express();

// require social-oauth-client
var soc = require('social-oauth-client');

// get instance for Google (REPLACE WITH YOUR OWN APP SETTINGS)
var google = new soc.Google({
  "CLIENT_ID": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
  "CLIENT_ID": "xxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
  "CLIENT_SECRET": "xxxxxxxxxxxxxxxx-oOQnFM2",
  "REDIRECT_URL": "http://test.com:3000/google_callback"
});

// go to Google authorize page
app.get('/google_authorize', function (req, res) {
  var url = google.getAuthorizeUrl();
  res.redirect(url);
});

// Google OAuth redirection url
app.get('/google_callback', function (req, res) {

  // delegate to social-oauth-client
  google.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown

    console.log(JSON.stringify(user));
    /*
    {
        "tokens": {
            "access_token": "xxxx.JAIbzLcX14pZh9O1epjw_6vqtsTnJDgBc1tcVlNQE1D5sHoTiStfzdaUmEjUWECxXywa",
            "token_type": "Bearer",
            "id_token": "xxxxxxxxxxJSUzI1NiIsImtpZCI6ImJlMzRkYWU0MDkwMmZlNzNhNTlhMTc2NDJjM2U3ODBiNDA0MWRiODUifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6IjVSX2pjWFFHMjFVYS1BZzRBUFJ6Z0EiLCJhdWQiOiI0NzI4NzcyMjgwNDUta2RlOWx0NHMwaG1zbThlbGY0YmhqY2VqOHA5dTU2MDMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDIwMjk4MDQzMDc3NDAzOTQ4OTciLCJhenAiOiI0NzI4NzcyMjgwNDUta2RlOWx0NHMwaG1zbThlbGY0YmhqY2VqOHA5dTU2MDMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJpYXQiOjE0NDY4MDU0NjIsImV4cCI6MTQ0NjgwOTA2Mn0.RLj5XT66cBWA959BYFEbzkh57MU56Q318MVPts8uJ1hewMDuLEUpX1tMnW_RR2uYiBfDMa20vUOmjqH-vm1NVy-4QaHS3g4IfwSf0OHD8Gcf_jHkt_sMet4DUbddcQ6uxYYqnwfpa90SErK8pZkeQxCQq04hXOdDRfrjP6Kf9HoS62MN5K0u1umT_Un6p57tW8DdFI70vOuyaDL0teONiNa13_XChIHOeGbYy3lTr4S7baT1gV7Se9fDDuqP1Ia1yjBYWpV3wx-5nn8DroR1qqZ6_qn1fEjmMNEFMap2FNDpPt-rwMBZq9o5he_E3C4jEwmLkCJPX44AD6MEp7sOHA",
            "refresh_token": "1/GHIW3jESUOrrOU63WyW7JSmR378LMsHUyHZIEYmLaaxIgOrJDtdun6xxxxxxxxxx",
            "expiry_date": 1446809062917
        },
        "info": {
            "kind": "plus#person",
            "etag": "\"MrhFVuKLF7zHXL6gE2l7cEdzuiA/_1F2ElmGLMw94CqwVNkhAcT9ieM\"",
            "gender": "male",
            "objectType": "person",
            "id": "102029804307740394897",
            "displayName": "박종순",
            "name": {
                "familyName": "박",
                "givenName": "종순"
            },
            "url": "https://plus.google.com/+박종순",
            "image": {
                "url": "https://lh6.googleusercontent.com/-RNto1FAc5WE/AAAAAAAAAAI/AAAAAAAAAdo/0j7f4c_qY9Q/photo.jpg?sz=50",
                "isDefault": false
            },
            "isPlusUser": true,
            "circledByCount": 624,
            "verified": false
        },
        "key": "GOOGLE_102029804307740394897",
        "platform": "GOOGLE"
    }    
     */
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

app.get('/', function (req, res) {
  var demo = '<h2>Social OAuth Client Demo!</h2>';
  demo+= '<a href="/google_authorize">Google</a><br/>';
  res.send(demo);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

```

### Facebook
```javascript
...

// require social-oauth-client
var soc = require('social-oauth-client');

// Facebook (REPLACE WITH YOUR OWN APP SETTINGS)
var facebook = new soc.Facebook( {
  "APP_ID": "xxxxxxxxxx845827",
  "APP_SECRET": "xxxxxxxxxxb6cf8fc6a1a43efb78deff",
  "CLIENT_ID": "xxxxxxxxxxbb9c0a2e597bdbaef07a9d",
  "REDIRECT_URL": "http://js.2do.kr:10000/service/oauth/facebook_callback"
});

// go to Facebook authorize page
app.get('/facebook_authorize', function (req, res) {
  var url = facebook.getAuthorizeUrl();
  res.redirect(url);
});

// Facebook OAuth redirection url
app.get('/service/oauth/facebook_callback', function (req, res) {

  // delegate to social-oauth-client
  facebook.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```


### Twitter
```javascript
...

// require social-oauth-client
var soc = require('social-oauth-client');

// Twitter (REPLACE WITH YOUR OWN APP SETTINGS)
var twitter = new soc.Twitter({
  "CONSUMER_KEY": "xxxxxxxxxxyb4UWW4t0kARqT6",
  "CONSUMER_SECRET": "xxxxxxxxxxdSf47fyfj6pfcXjRMtwa8F9oOBgnb2bXIRf0Dawl",
  "REDIRECT_URL": "http://js.2do.kr:10000/service/oauth/twitter_callback"
});

// go to Twitter authorize page
app.get('/twitter_authorize', function (req, res) {
  var url = twitter.getAuthorizeUrl().then(function(url) {
    res.redirect(url);
  }, function(err) {
    res.send(err);
  });
});

// Twitter OAuth redirection url
app.get('/service/oauth/twitter_callback', function (req, res) {

  // delegate to social-oauth-client
  twitter.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...

```

### GitHub
```javascript
...

// require social-oauth-client
var soc = require('social-oauth-client');

// GitHub (REPLACE WITH YOUR OWN APP SETTINGS)
var github = new soc.GitHub({
  "CLIENT_ID": "xxxxxxxxxxe06f8939ff",
  "CLIENT_SECERT": "xxxxxxxxxxebb7b3c74cc2e52245f4991338818f"
});

// go to GitHub authorize page
app.get('/github_authorize', function (req, res) {
  var url = github.getAuthorizeUrl();
  res.redirect(url);
});

// GitHub OAuth redirection url
app.get('/service/oauth/github_callback', function (req, res) {

  // delegate to social-oauth-client
  github.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```

## License
* The MIT License (MIT)
* http://opensource.org/licenses/MIT



That's all folks!
