'use strict';

var $q = require("q");
var request = require('request');

// REF: https://developers.kakao.com/docs/restapi#사용자-관리-로그인

function Kakao(configuration) {
  this.init(configuration);
}

Kakao.prototype = {
  PLATFORM_TYPE: 'KAKAO',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: ''
  }
};

Kakao.prototype.init = function(configuration) {
  this.conf = configuration;
};


Kakao.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://kauth.kakao.com/oauth/token',
    params = {
      grant_type: 'authorization_code',
      client_id: this.conf.REST_KEY,
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
      var headers = {
        Authorization: 'Bearer ' + tokens.access_token
      };

      // url = 'https://kapi.kakao.com/v1/api/story/profile';
      url = 'https://kapi.kakao.com/v1/api/talk/profile';

      request.get(url, {headers: headers}, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          var info = JSON.parse(body);
          var user = {
            tokens: tokens,
            info: info,
            platform: 'KAKAO'
          };

          url = 'https://kapi.kakao.com/v1/user/access_token_info';
          request.get(url, {headers: headers}, function(error, response, body) {
            var id = JSON.parse(body);
            user.key = self.PLATFORM_TYPE + '_' + id.id;
            deferred.resolve(user);
          });


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

Kakao.prototype.getAuthorizeUrl = function (scopes) {
  var url = 'https://kauth.kakao.com/oauth/authorize/?client_id=' + this.conf.REST_KEY + '&response_type=code&redirect_uri=' + this.conf.REDIRECT_URL + '&state=' + new Date().getTime();
  return url;
};

exports.Kakao = Kakao;
