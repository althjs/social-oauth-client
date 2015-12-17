'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');

function Twitter(configuration) {
  this.init(configuration);
}

Twitter.prototype = {
  PLATFORM_TYPE: 'TWITTER',
  conf: {
    CONSUMER_KEY: '',
    CONSUMER_SECRET: ''
  }
};

Twitter.prototype.init = function(configuration) {
  this.conf = configuration;
};

Twitter.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var oauth = {
        consumer_key: this.conf.CONSUMER_KEY,
        consumer_secret: this.conf.CONSUMER_SECRET,
        token: req.query.oauth_token,
        verifier: req.query.oauth_verifier
      },
      url = 'https://api.twitter.com/oauth/access_token';

  // console.log('oauth:', JSON.stringify(oauth, null, 2));
  var self = this;
  request.post({url:url, oauth:oauth}, function (e, r, body) {

    var o = qs.parse(body);
    // console.log('body:', JSON.stringify(o, null, 2));
      oauth = {
        consumer_key: self.conf.CONSUMER_KEY,
        consumer_secret: self.conf.CONSUMER_SECRET,
        token: o.oauth_token,
        token_secret: o.oauth_token_secret
      };
      url = 'https://api.twitter.com/1.1/users/show.json';

    var params = {
      screen_name: o.screen_name,
      user_id: o.user_id
    };

    // console.log('qs:', JSON.stringify(params, null, 2), JSON.stringify(oauth, null, 2));

    request.get({url:url, oauth:oauth, qs:params, json:true}, function (error, response, info) {
      // console.log(info);
      if (!error && response.statusCode === 200) {
      var key = self.PLATFORM_TYPE + '_' + info.id;

        delete info.status;
        var user = {
          tokens: {
            auth: oauth,
            qs: params
          },
          info: info,
          key: key,
          platform: self.PLATFORM_TYPE
        };


        deferred.resolve(user);
      } else {
        deferred.reject(error);
      }

    });
  });

  return deferred.promise;
};

Twitter.prototype.getAuthorizeUrl = function () {
  var deferred = $q.defer();

  try {
    var oauth = {
      callback: this.conf.REDIRECT_URL,
      consumer_key: this.conf.CONSUMER_KEY,
      consumer_secret: this.conf.CONSUMER_SECRET
    },
    url = 'https://api.twitter.com/oauth/request_token';

    request.post({url:url, oauth:oauth}, function (e, r, body) {
      // Ideally, you would take the body in the response
      // and construct a URL that a user clicks on (like a sign in button).
      // The verifier is only available in the response after a user has
      // verified with twitter that they are authorizing your app.

      // step 2
      var req_data = qs.parse(body);

      // console.log(body);
      // res.send(req_data);

      var url = 'https://api.twitter.com/oauth/authorize?oauth_token=' + req_data.oauth_token;
      console.log(url);
      deferred.resolve(url);
    });
  } catch(e) {
    deferred.reject(e.message);
  }

  return deferred.promise;
};

exports.Twitter = Twitter;
