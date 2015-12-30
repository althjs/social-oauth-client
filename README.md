Social OAuth Client
===========================

 OAuth wrapper to easily adapt social login using Restful on each platforms.

## Features
* get OAuth tokens & basic info for each platforms.
* Platforms
  * Facebook
  * Google
  * Twitter
  * GitHub
  * Disqus
  * Instagram
  * Naver
  * Kakao
  * Dropbox
  * Tumblr - OAuth1
  * Flickr - OAuth1
  * Wordpress

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
  var url = google.getAuthorizeUrl(); // default scope 'https://www.googleapis.com/auth/plus.me'
  // var url = google.getAuthorizeUrl(['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/calendar']);
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
  var url = facebook.getAuthorizeUrl(); // default scope public_profile
  // var url = facebook.getAuthorizeUrl(['user_likes','email','user_events']);
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

  // twitter OAuth scope is managed by management console.
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
  "CLIENT_SECRET": "xxxxxxxxxxebb7b3c74cc2e52245f4991338818f"
});

// go to GitHub authorize page
app.get('/github_authorize', function (req, res) {
  var url = github.getAuthorizeUrl(); // default scope "user"
  // var url = github.getAuthorizeUrl(['repo', 'gist']);
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


### DISQUS
```javascript
...

// require social-oauth-client
var soc = require('social-oauth-client');

// DISQUS (REPLACE WITH YOUR OWN APP SETTINGS)
var disqus = new soc.Disqus({
  "API_KEY": "KKZyiA1EexxxxxxxxZWnOKoXuKWlKt9SSALYaN40P7rvOw65my6QpbbymWCxSFHZ",
  "API_SECRET": "vihYOhS7xit7IAAvFvayyxkPkWuhHc1Qa0HXYQCUVWvvxxxxxCHgpc4DUnxTB9pn",
  "REDIRECT_URL": "http://js.2do.kr:10000/service/oauth/disqus_callback"
});

// go to DISQUS authorize page
app.get('/disqus_authorize', function (req, res) {
  var url = disqus.getAuthorizeUrl(); // default scope "read"
  // var url = disqus.getAuthorizeUrl(['read', 'write']);
  res.redirect(url);
});

// DISQUS OAuth redirection url
app.get('/service/oauth/disqus_callback', function (req, res) {

  // delegate to social-oauth-client
  disqus.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```

### Instagram
```javascript
...

// Instagram (REPLACE WITH YOUR OWN APP SETTINGS)
var instagram = new soc.Instagram({
  "CLIENT_ID": "0ce5dc2f82d146fxxxxxx7e12a7c07e4",
  "CLIENT_SECRET": "a04b226xxxxx4d6ab747129c83427223",
  "REDIRECT_URL": "http://js.2do.kr:10000/service/oauth/instagram_callback"
});

// go to Instagram authorize page
app.get('/instagram_authorize', function (req, res) {
  var url = instagram.getAuthorizeUrl();  // default scope "public_content"
  // var url = instagram.getAuthorizeUrl(['follower_list', 'likes']);
  res.redirect(url);
});

// Instagram redirection url
app.get('/service/oauth/instagram_callback', function (req, res) {

  // delegate to social-auth-client
  instagram.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```

### Naver
```javascript
...

// Naver OAuth 2.0 (REPLACE WITH YOUR OWN APP SETTINGS)
// https://nid.naver.com/devcenter/main.nhn
var naver = new soc.Naver({
  "CLIENT_ID": "rCcjmpJshawqaB7RXXXX",
  "CLIENT_SECRET": "IT32xxxxIw",
  "REDIRECT_URL": "http://js.2do.kr:3005/service/oauth/naver_callback"
});

// go to Naver authorize page
app.get('/naver_authorize', function (req, res) {
  var url = naver.getAuthorizeUrl();
  // res.send(url);
  res.redirect(url);
});

// Naver redirection url
app.get('/service/oauth/naver_callback', function (req, res) {

  // delegate to social-auth-client
  naver.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });

});

...
```


### Kakao
```javascript
...

// Kakao (REPLACE WITH YOUR OWN APP SETTINGS)
var kakao = new soc.Kakao({
  "REST_KEY": "e4c4519465b273191afdc001c0xxxxxx",
  "JAVASCRIPT_KEY": "a2c96aac53647a69xxxxxx6eaf4cf190",
  "REDIRECT_URL": "http://js.2do.kr:3005/service/oauth/kakao_callback"
});

// go to Kakao authorize page
app.get('/kakao_authorize', function (req, res) {
  var url = kakao.getAuthorizeUrl();
  res.redirect(url);
});

// Kakao redirection url
app.get('/service/oauth/kakao_callback', function (req, res) {

  // delegate to social-auth-client
  kakao.callback(req, res).then(function(user) {
    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```

### Dropbox
```javascript
...

// Dropbox (REPLACE WITH YOUR OWN APP SETTINGS)
var dropbox = new soc.Dropbox({
  "CLIENT_ID": "hlyuxxxxxxxxdbk",
  "CLIENT_SECRET": "lxvg1xxxxxnbxr7",
  "REDIRECT_URL": "https://js.2do.kr/service/oauth/dropbox_callback"
});

// go to Dropbox authorize page
app.get('/dropbox_authorize', function (req, res) {
  // Dropbox OAuth scope is managed by management console.
  var url = dropbox.getAuthorizeUrl();
  res.redirect(url);
});

// Dropbox OAuth redirection url
app.get('/service/oauth/dropbox_callback', function (req, res) {

  // delegate to social-auth-client
  dropbox.callback(req, res).then(function(user) {

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```



### Tumblr - OAuth1
```javascript
...

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');   // for temporary oauth_token_secret saving
app.use(cookieParser());

// require social-auth-client
var soc = require('social-oauth-client');


// Tumblr (REPLACE WITH YOUR OWN APP SETTINGS)
var tumblr = new soc.Tumblr({
  "CONSUMER_KEY": "ga9wlssygga4yZGqOHA5EyxxxxxtHgLBpp17ZOql2TWqdchVUc",
  "CONSUMER_SECRET": "KhwFS7dN3JakU4mnXsxxxxxzMa38WDTMSQ09zRzgODbKy20gz6",
  "REDIRECT_URL": "http://js.2do.kr:3005/service/oauth/tumblr_callback"
});

// go to Tumblr authorize page
app.get('/tumblr_authorize', function (req, res) {

  var url = tumblr.getAuthorizeUrl().then(function(o) {

    // save oauth_token_secret to cookie temporary
    var cookieDomain = '.2do.kr';
    res.cookie('token_secret', o.token.oauth_token_secret, {domain: cookieDomain, path: '/'});

    res.redirect(o.url);
  }, function(err) {
    res.send(err);
  });
});

// Tumblr OAuth redirection url
app.get('/service/oauth/tumblr_callback', function (req, res) {

  // pass oauth_token_secret from cookie
  req.query.token_secret = req.cookies.token_secret;

  // delegate to social-auth-client
  tumblr.callback(req, res).then(function(user) {

    // delete temporary oauth_token_secret from cookie
    var cookieDomain = '.2do.kr';
    res.cookie('token_secret', '', {domain: cookieDomain, path: '/', expires: new Date(Date.now() - 1000)});

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});


...
```


### Flickr - OAuth1
```javascript
...

var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');   // for temporary oauth_token_secret saving
app.use(cookieParser());

// require social-auth-client
var soc = require('social-oauth-client');

// Flickr (REPLACE WITH YOUR OWN APP SETTINGS)
var flickr = new soc.Flickr({
  "CONSUMER_KEY": "5191b2bfecf2dcfxxxxxxxxxe7452e90",
  "CONSUMER_SECRET": "0ecf4c8xxxx82dc7",
  "REDIRECT_URL": "http://js.2do.kr:3005/service/oauth/flickr_callback"
});

// go to Flickr authorize page
app.get('/flickr_authorize', function (req, res) {

  // flickr OAuth scope is managed by management console.
  var url = flickr.getAuthorizeUrl().then(function(o) {

    // save oauth_token_secret to cookie temporary
    var cookieDomain = '.2do.kr';
    res.cookie('token_secret', o.token.oauth_token_secret, {domain: cookieDomain, path: '/'});

    res.redirect(o.url);
  }, function(err) {
    res.send(err);
  });
});

// Flickr OAuth redirection url
app.get('/service/oauth/flickr_callback', function (req, res) {

  // pass oauth_token_secret from cookie
  req.query.token_secret = req.cookies.token_secret;

  flickr.callback(req, res).then(function(user) {

    // delete temporary oauth_token_secret from cookie
    var cookieDomain = '.2do.kr';
    res.cookie('token_secret', '', {domain: cookieDomain, path: '/', expires: new Date(Date.now() - 1000)});

    // oauth token & user basic info will be shown
    res.send(user);
  }, function(err) {
    res.send(err);
  });
});

...
```


## Wordpress
```javascript
...

// Wordpress (REPLACE WITH YOUR OWN APP SETTINGS)
var wordpress = new soc.Wordpress({
  "CLIENT_ID": "44xx2",
  "CLIENT_SECRET": "axwBhV3OnQWNXzsz7ZudcDaxjDBS6TfAsb1Zho8WeifEaxxxxxxxxvq4xfEkYtFd",
  "REDIRECT_URL": "http://js.2do.kr:3005/service/oauth/wordpress_callback"
});

// go to Wordpress authorize page
app.get('/wordpress_authorize', function (req, res) {
  var url = wordpress.getAuthorizeUrl(); // default scope "auth"
  // var url = wordpress.getAuthorizeUrl(['global']);
  res.redirect(url);
});

// Wordpress OAuth redirection url
app.get('/service/oauth/wordpress_callback', function (req, res) {

  // delegate to social-auth-client
  wordpress.callback(req, res).then(function(user) {

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
