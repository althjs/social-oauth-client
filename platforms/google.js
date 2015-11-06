'use strict';

var $q = require("q");
var request = require('request');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

function Google(configuration) {
  this.init(configuration);
}

Google.prototype = {
  PLATFORM_TYPE: 'GOOGLE',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: '',
    PROJECT_NAME: ''
  }
};

Google.prototype.init = function(configuration) {
  this.conf = configuration;
};

Google.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var oauth2Client = new OAuth2(this.conf.CLIENT_ID, this.conf.CLIENT_SECRET, this.conf.REDIRECT_URL);
  var self = this;

  oauth2Client.getToken(code, function(err, tokens) {
    if(!err) {
      oauth2Client.setCredentials(tokens);

      console.log('google_callback tokens:' + JSON.stringify(tokens, null,2));

      var plus = google.plus('v1');
      plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {

        if (!err) {
          var key = self.PLATFORM_TYPE + '_' + response.id;

          var user = {
            tokens: tokens,
            info: response,
            key: key,
            platform: 'GOOGLE'
          };

          deferred.resolve(user);
        } else {
          console.log(err.message);
          deferred.reject(err);
        }
      });

    } else {
      deferred.reject(err);
    }
  });

  return deferred.promise;
};

Google.prototype.getAuthorizeUrl = function(scopes) {
  try {
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var _scopes = scopes || [
      'https://www.googleapis.com/auth/plus.me'
    ];

    var oauth2Client = new OAuth2(this.conf.CLIENT_ID, this.conf.CLIENT_SECRET, this.conf.REDIRECT_URL);

    var url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
      approval_prompt: 'force',
      // CHECK: 구글인증 받는 직후에만 refresh_token 이 리턴됨. 한번 승인한 유저에 대해서는 refresh_token 이 안남어오므로 이 경우 강제로 재승인 받도록 하기위한 옵션
      // https://developers.google.com/identity/protocols/OAuth2WebServer#offline
      scope: _scopes // If you only need one scope you can pass it as string,
    });

    console.log('google_oauth url: ' + url);
    // res.send(url);

    return url;
  } catch(e) {
    return e.message;
  }
};

// Google.prototype.getOAuth2Client = function (tokens, path) {
//   var deferred = $q.defer();
//
//   var oauth2Client = new OAuth2(this.conf.CLIENT_ID, this.conf.CLIENT_SECRET, this.conf.REDIRECT_URL);
//
//   oauth2Client.setCredentials({
//     access_token: tokens.access_token,
//     refresh_token: tokens.refresh_token
//   });
//
//
//   if (tokens.expiry_date < new Date().getTime()) {
//     console.log('토큰 갱신', path);
//
//     oauth2Client.refreshAccessToken(function(err, tokens_) {
//     // your access_token is now refreshed and stored in oauth2Client
//     // store these new tokens in a safe place (e.g. database)
//       console.log('refreshAccessToken', JSON.stringify(tokens, null, 2));
//
//       oauth2Client.setCredentials({
//         access_token: tokens_.access_token,
//         refresh_token: tokens_.refresh_token
//       });
//       redisfire.ioPOST(path, tokens_, {}).then(function(o) {
//         deferred.resolve(oauth2Client);
//       }, function(err) {
//         deferred.resolve(oauth2Client);
//       });
//
//       if (!err) {
//         console.log('refreshAccessToken err:' + err);
//       }
//
//     });
//   } else {
//     setTimeout(function() {
//       deferred.resolve(oauth2Client);
//     });
//   }
//
//   return deferred.promise;
// };

exports.Google = Google;


// var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
// var plus = google.plus('v1');

// 구글 OAuth2 연동 참조: https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps?hl=ko


// STEP1: 앱 인증요청
// https://accounts.google.com/o/oauth2/auth?client_id=768773481734-l89t23q2bfras7ddeitrcn2iiavamfru.apps.googleusercontent.com&response_type=token&redirect_uri=http://js.2do.kr:10000/service/oauth/google_callback&scope=https://www.googleapis.com/auth/plus.me

// STEP2: 토큰 확인
// https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ACCESS_TOKEN
// https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=ya29.GgIfgiU2Xu_71JnH0Xy5ZXgIQdvvID8eSsp8slE6HPaYfe2aZwYzhrv3Bl7x5kB1f0HC

// var _tokens = { // email
//   "access_token": "ya29.GwJJiP7XWXcYYzjPE1YUF18XbJZ4YpWA8xDz4W-pF0tqmRc31jjI9tZd8_eJEvHyoNqU",
//   "token_type": "Bearer",
//   "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk4NzZlMWYwMjk0NzQyOWNhOTVkOTQ1NjI1Y2I5YjM1ZTlhNTQzMzQifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Ii1JbG56Y3JRck5qNk9Mc3lnTmVYNHciLCJhdWQiOiI3Njg3NzM0ODE3MzQtbDg5dDIzcTJiZnJhczdkZGVpdHJjbjJpaWF2YW1mcnUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDIwMjk4MDQzMDc3NDAzOTQ4OTciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiNzY4NzczNDgxNzM0LWw4OXQyM3EyYmZyYXM3ZGRlaXRyY24yaWlhdmFtZnJ1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJhbHRoanNAZ21haWwuY29tIiwiaWF0IjoxNDQ2MDg1NzQ3LCJleHAiOjE0NDYwODkzNDd9.ih8JeXNTYd-DBxgU4nALsqBNJD2onB3gtJMqmx_wWaKCOTEyhNsPQ6OceMM0a5ous1R8SdNOx-OLAvT9mPDY8XjqzwGjAEsL413SfpbGZOst4EeAerztiKSa__9JLeCnmXOUekYYhQ6xwlg2vN-e_3MG3qSze6hw_Agl0jXL4DoJXr-b4usvT51FmZL8o99a_-D99sJYEvclePOf6zo8xwNI8pfr-zluFyAC7lR6JJ5BkgoGbQnebudLu8AqGtbQLwgdVCX8t_HQu-oCJrhRM9pr2gVuDULhOE0T9laxEwsXU58afk6YriOHuZlqaBoJ5CXWbLlVMgwt0z6Y6ZD00A",
//   "refresh_token": "1/g7uZpdgppVzwfy1ngUrc433_8jkWpRWu0LZQ32x2ynvBactUREZofsF9C7PrpE-j",
//   "expiry_date": 1446089347750
// }



// exports.google_profile = function(req, res) {
//
//   var path = REDISFIRE_AUTH_PROJECT + redisfire.decrypt(req.cookies.redisfire_session_id) + '/tokens';
//
//   console.log('google_profile path:', path);
//   redisfire.ioGET(path, {}).then(function (tokens) {
//     console.log('Saved token:', tokens);
//
//     getOAuth2Client(tokens, path).then(function(oauth2Client) {
//       var plus = google.plus('v1');
//       plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
//         res.send(response);
//       });
//     });
//   });
//
// };

// exports.google_urlshortener = function (req, res) {
//   var auth = 'AIzaSyAQU-llp2UmdpLS6D2YXusx4rpn0ylUvJM'; // or you could use oauth2Client
//   var urlshortener = google.urlshortener({ version: 'v1', auth: auth });
//
//   var params = { shortUrl: 'http://goo.gl/xKbRu3' };
//
//   // get the long url of a shortened url
//   urlshortener.url.get(params, function (err, response) {
//     if (err) {
//       res.send('Encountered error' + err);
//     } else {
//       res.send('Long url is' + response.longUrl);
//     }
//   });
// };
