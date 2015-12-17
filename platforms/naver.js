'use strict';

var $q = require("q");
var request = require('request');
var parseString = require('xml2js').parseString;

// REF: https://nid.naver.com/devcenter/docs.nhn?menu=API

function Naver(configuration) {
  this.init(configuration);
}

Naver.prototype = {
  PLATFORM_TYPE: 'NAVER',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: ''
  }
};

Naver.prototype.init = function(configuration) {
  this.conf = configuration;
};


Naver.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://nid.naver.com/oauth2.0/token',
    params = {
      grant_type: 'authorization_code',
      client_id: this.conf.CLIENT_ID,
      client_secret: this.conf.CLIENT_SECRET,
      redirect_uri: this.conf.REDIRECT_URL,
      code: code,
      state: req.query.state
    },
    headers = {
      Accept: 'application/json'
    };

  var self = this;

  request.post(url, {form: params, headers: headers}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);


      var tokens;
          // console.log(result);
          tokens = JSON.parse(body);


          var headers = {
            Authorization: 'Bearer ' + tokens.access_token
          };
          url = 'https://openapi.naver.com/v1/nid/getUserProfile.xml';
          request(url, {headers: headers}, function(error, response, body) {
            if (!error && response.statusCode === 200) {

              parseString(body, {trim: true, explicitArray: false}, function (err, result) {

                var info = result.data.response;
                var key = self.PLATFORM_TYPE + '_' + info.enc_id;
                var user = {
                  tokens: tokens,
                  info: info,
                  key: key,
                  platform: 'NAVER'
                };

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

Naver.prototype.getAuthorizeUrl = function () {
  var url = 'https://nid.naver.com/oauth2.0/authorize?client_id=' + this.conf.CLIENT_ID + '&response_type=code&redirect_uri=' + this.conf.REDIRECT_URL + '&state=' + new Date().getTime();
  return url;
};



exports.Naver = Naver;
