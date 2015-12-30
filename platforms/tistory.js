'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');

// REF: http://www.tistory.com/guide/api/oauth

function Tistory(configuration) {
  this.init(configuration);
}

Tistory.prototype = {
  PLATFORM_TYPE: 'TISTORY',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: ''
  }
};

Tistory.prototype.init = function(configuration) {
  this.conf = configuration;
};


Tistory.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://www.tistory.com/oauth/access_token/',
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
    //   console.log(body); 


      var tokens = qs.parse(body);

      // console.log(headers);
      url = 'https://www.tistory.com/apis/blog/info?access_token=' + tokens.access_token + '&output=json';

      request.get(url, function(error, response, body) {

        if (!error && response.statusCode === 200) {
          // console.log(body); // Show the HTML for the Google homepage

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + info.tistory.userId;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'TISTORY'
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

Tistory.prototype.getAuthorizeUrl = function (scopes) {
  var scope = 'auth';
  if (Array.isArray(scopes)) {
    scope = scopes.join(',');
  }
  // console.log(scope);
  var url = 'https://www.tistory.com/oauth/authorize?client_id=' + this.conf.CLIENT_ID + '&redirect_uri=' + this.conf.REDIRECT_URL + '&response_type=code';
  return url;
};

exports.Tistory = Tistory;
