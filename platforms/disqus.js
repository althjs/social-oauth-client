'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');

// REF: https://disqus.com/api/docs/auth/

function Disqus(configuration) {
  this.init(configuration);
}

Disqus.prototype = {
  PLATFORM_TYPE: 'DISQUS',
  conf: {
    API_KEY: '',
    API_SECERT: '',
    REDIRECT_URL: ''
  }
};

Disqus.prototype.init = function(configuration) {
  this.conf = configuration;
};


Disqus.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://disqus.com/api/oauth/2.0/access_token/',
    params = {
      grant_type: 'authorization_code',
      client_id: this.conf.API_KEY,
      client_secret: this.conf.API_SECERT,
      redirect_uri: this.conf.REDIRECT_URL,
      code: code
    },
    headers = {
      Accept: 'application/json'
    };

  var self = this;

  request.post(url, {form: params, headers: headers}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);

      var tokens = JSON.parse(body);
      params = {
        access_token: tokens.access_token,
        api_key: params.client_id,
        api_secret: params.client_secret
      };

      url = 'https://disqus.com/api/3.0/users/details.json?' + qs.stringify(params);
      // console.log(url);
      request.get(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          // console.log(body); // Show the HTML for the Google homepage

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + tokens.user_id;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'DISQUS'
          };

          deferred.resolve(user);
        } else {
          deferred.reject(error);
        }

      });

    } else {
      res.send(body);
    }
  });

  return deferred.promise;
};

Disqus.prototype.getAuthorizeUrl = function () {
  var url = 'https://disqus.com/api/oauth/2.0/authorize?client_id=' + this.conf.API_KEY + '&scope=read&response_type=code&redirect_uri=' + this.conf.REDIRECT_URL;
  return url;
};

exports.Disqus = Disqus;
