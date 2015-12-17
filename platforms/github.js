'use strict';

var $q = require("q");
var request = require('request');

// REF: https://developer.github.com/v3/oauth/

/*
$ curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/users/technoweenie -I
HTTP/1.1 200 OK
X-OAuth-Scopes: repo, user
X-Accepted-OAuth-Scopes: user
 */


function GitHub(configuration) {
  this.init(configuration);
}

GitHub.prototype = {
  PLATFORM_TYPE: 'GITHUB',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: ''
  }
};

GitHub.prototype.init = function(configuration) {
  this.conf = configuration;
};


GitHub.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://github.com/login/oauth/access_token',
  params = {
    client_id: this.conf.CLIENT_ID,
    client_secret: this.conf.CLIENT_SECRET,
    code: code
  },
  headers = {
    Accept: 'application/json'
  };

  var self = this;

  request.post(url, {form: params, headers: headers}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Show the HTML for the Google homepage.

      var tokens = JSON.parse(body);
      headers = {
        Authorization: 'token ' + tokens.access_token,
        'User-Agent': 'Redisfire App'
      };

      // console.log(headers);
      url = 'https://api.github.com/user';
      request.get(url, {headers: headers}, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          // console.log(body); // Show the HTML for the Google homepage

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + info.id;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'GITHUB'
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

GitHub.prototype.getAuthorizeUrl = function (scopes) {
  var scope = 'user';
  if (Array.isArray(scopes)) {
    scope = scopes.join(',');
  }
  // console.log(scope);
  var url = 'https://github.com/login/oauth/authorize?client_id=' + this.conf.CLIENT_ID + '&scope=' + scope;
  return url;
};

exports.GitHub = GitHub;
