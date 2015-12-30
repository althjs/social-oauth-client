'use strict';

var $q = require("q");
var request = require('request');

// REF: https://developer.wordpress.com/v3/oauth/

/*
$ curl -H "Authorization: token OAUTH-TOKEN" https://api.wordpress.com/users/technoweenie -I
HTTP/1.1 200 OK
X-OAuth-Scopes: repo, user
X-Accepted-OAuth-Scopes: user
 */


function Wordpress(configuration) {
  this.init(configuration);
}

Wordpress.prototype = {
  PLATFORM_TYPE: 'WORDPRESS',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: ''
  }
};

Wordpress.prototype.init = function(configuration) {
  this.conf = configuration;
};


Wordpress.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://public-api.wordpress.com/oauth2/token',
  params = {
    client_id: this.conf.CLIENT_ID,
    client_secret: this.conf.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: this.conf.REDIRECT_URL,
    code: code
  },
  headers = {
    Accept: 'application/json'
  };

  // res.send(params); return;
  var self = this;

  request.post(url, {form: params, headers: headers}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Show the HTML for the Google homepage.

      var tokens = JSON.parse(body);

    //   {"access_token":"&H!bjSxYv*eHQxxcEJiiy9$2d6JI5LHmmors$ap&W^IyZUj%zDD$1ZTisy2U6xTI","token_type":"bearer","blog_id":"0","blog_url":null,"scope":"auth"}
      headers = {
        Authorization: 'Bearer ' + tokens.access_token,
        'User-Agent': 'Redisfire App'
      };

      // console.log(headers);
      url = 'https://public-api.wordpress.com/rest/v1.1/me';
      request.get(url, {headers: headers}, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          // console.log(body); // Show the HTML for the Google homepage

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + info.ID;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'WORDPRESS'
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

Wordpress.prototype.getAuthorizeUrl = function (scopes) {
  var scope = 'auth';
  if (Array.isArray(scopes)) {
    scope = scopes.join(',');
  }
  // console.log(scope);
  var url = 'https://public-api.wordpress.com/oauth2/authorize?client_id=' + this.conf.CLIENT_ID + '&scope=' + scope + '&redirect_uri=' + this.conf.REDIRECT_URL + '&response_type=code';
  return url;
};

exports.Wordpress = Wordpress;
