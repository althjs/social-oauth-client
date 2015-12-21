'use strict';

var $q = require("q");
var request = require('request');

// REF: https://www.dropbox.com/developers/reference/oauth-guide


function Dropbox(configuration) {
  this.init(configuration);
}

Dropbox.prototype = {
  PLATFORM_TYPE: 'DROPBOX',
  conf: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: ''
  }
};

Dropbox.prototype.init = function(configuration) {
  this.conf = configuration;
};


Dropbox.prototype.callback = function (req, res) {
  var deferred = $q.defer();
  var code = req.query.code;

  var url = 'https://api.dropboxapi.com/1/oauth2/token';

  var params = {
    code: code,
    client_id: this.conf.CLIENT_ID,
    grant_type: 'authorization_code',
    client_secret: this.conf.CLIENT_SECRET,
    redirect_uri: this.conf.REDIRECT_URL
  };
  var headers;

  var self = this;
  //console.log('params:' , JSON.stringify(params, null, 2));
  request.post(url, {form: params}, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body); // Show the HTML for the Google homepage.
      // {"access_token": "2I_yxdOv0PoAAAAAAAADUmnboKpdC73wc9n25xnQJwV5qadDwUy_A5OuPDm9cqrz", "token_type": "bearer", "uid": "55783727"}
      var tokens = JSON.parse(body);
      headers = {
        Authorization: 'Bearer ' + tokens.access_token,
        'User-Agent': 'Redisfire App'
      };
      params = {
        'account_id': tokens.uid
      };

      url = 'https://api.dropboxapi.com/2/users/get_current_account';
      request.post(url, {headers: headers}, function(error, response, body) {
        // console.log(body); // Show the HTML for the Google homepage
        if (!error && response.statusCode === 200) {

          var info = JSON.parse(body);
          var key = self.PLATFORM_TYPE + '_' + tokens.uid;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: 'DROPBOX'
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

Dropbox.prototype.getAuthorizeUrl = function () {
  var url = 'https://www.dropbox.com/1/oauth2/authorize';
  url += '?client_id=' + this.conf.CLIENT_ID;
  url += '&response_type=code';
  url += '&redirect_uri=' + this.conf.REDIRECT_URL;
  url += '&force_reapprove=true';
  url += '&disable_signup=false';
  return url;
};

exports.Dropbox = Dropbox;
