'use strict';

var $q = require("q");
var request = require('request');

// REF: https://www.instagram.com/developer/authentication/

function Instagram(configuration) {
  this.init(configuration);
}

Instagram.prototype = {
  PLATFORM_TYPE: 'ISTAGRAM',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: ''
  }
};

Instagram.prototype.init = function(configuration) {
  this.conf = configuration;
};


Instagram.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://api.instagram.com/oauth/access_token',
    params = {
      grant_type: 'authorization_code',
      client_id: this.conf.CLIENT_ID,
      client_secret: this.conf.CLIENT_SECRET,
      redirect_uri: this.conf.REDIRECT_URL,
      code: code
    },
    headers = {
      Accept: 'application/json'
    };

  var self = this;

  request.post(url, {form: params, headers: headers}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      //console.log(body);

      var tokens = JSON.parse(body);

      url = 'https://api.instagram.com/v1/users/' + tokens.user.id + '/?access_token=' + tokens.access_token;
      // url = 'https://api.instagram.com/v1/users/self/?access_token=' + tokens.access_token;
      // console.log(url);
      request.get(url, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + tokens.user.id;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'ISTAGRAM'
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

Instagram.prototype.getAuthorizeUrl = function (scopes) {
  var scope = 'public_content';
  if (Array.isArray(scopes)) {
    scope = scopes.join('+');
  }
  // console.log(scope);
  
  var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.conf.CLIENT_ID + '&scope=' + scope + '&response_type=code&redirect_uri=' + this.conf.REDIRECT_URL;
  return url;
};

exports.Instagram = Instagram;
