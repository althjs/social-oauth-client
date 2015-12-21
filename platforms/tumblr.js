'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');
var crypto = require('crypto');
var _ = require('lodash');

function Tumblr(configuration) {
  this.init(configuration);
}

Tumblr.prototype = {
  PLATFORM_TYPE: 'TUMBLR',
  conf: {
    CONSUMER_KEY: '',
    CONSUMER_SECRET: '',
    REDIRECT_URL: ''
  }
};

Tumblr.prototype.init = function(configuration) {
  this.conf = configuration;
};

Tumblr.prototype.callback = function (req, res) {
  var deferred = $q.defer();

  var params = {
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  },
  api = 'https://www.tumblr.com/oauth/access_token';

  params.oauth_signature = this.getSignature(api, 'POST', params, req.query.token_secret);
  var url = api + '?' + qs.stringify(params);

  // console.log('oauth:', JSON.stringify(params, null, 2));

  var self = this;
  request.post(url, function (e, r, body) {

    if (!e && r.statusCode === 200) {

      var tokens = qs.parse(body);


      var user = {
        tokens: tokens,
        platform: self.PLATFORM_TYPE
      };


      url = 'http://api.tumblr.com/v2/user/info';
      params = {
        consumer_key: self.conf.CONSUMER_KEY,
        consumer_secret: self.conf.CONSUMER_SECRET,
        token: tokens.oauth_token,
        token_secret: tokens.oauth_token_secret
      };

      request.post(url, {oauth: params}, function (e, r, body) {
          try {
            // console.log(body);
            body = JSON.parse(body);
            var info = body.response.user;
            var key = self.PLATFORM_TYPE + '_' + info.name;

            user.info = info;
            user.key = key;
            deferred.resolve(user);

          } catch(e) {
            deferred.reject(e.message);
          }

      });



    } else {
      deferred.reject(body);
    }

  });


  return deferred.promise;
};

Tumblr.prototype.getSignature = function (api, method, params, oauth_token_secret) {

  var ts = parseInt(new Date().getTime() / 1000, 10),
    nonce = 'n' + ts;

  params.oauth_consumer_key = params.oauth_consumer_key || this.conf.CONSUMER_KEY;
  params.oauth_nonce = params.oauth_nonce || nonce;
  params.oauth_signature_method = params.oauth_signature_method || 'HMAC-SHA1';
  params.oauth_timestamp = params.oauth_timestamp || ts;
  params.oauth_version = params.oauth_version || '1.0';

  var ks = _.keys(params).sort(),
    len = ks.length,
    i;

  var p = {};

  // sort parameters by key name
  for (i=0; i<len; i++) {
    p[ks[i]] = params[ks[i]];
  }

  //console.log('@@ getSignature params:', JSON.stringify(params, null, 2));

  var signature_str = method + '&' + encodeURIComponent(api) + '&' + encodeURIComponent(qs.stringify(p));
  var key = this.conf.CONSUMER_SECRET + '&' + (oauth_token_secret || '');

  // console.log('@@ signature_str:', signature_str);
  // console.log('@@ signature KEY:', key);

  var signature = crypto.createHmac('sha1', key).update(signature_str).digest('base64');
  //console.log('@@ signature:', signature);

  return signature;

};


Tumblr.prototype.getAuthorizeUrl = function () {
  var deferred = $q.defer();

  try {
    var params = {
      oauth_callback: this.conf.REDIRECT_URL,
    },
    api = 'https://www.tumblr.com/oauth/request_token';

    params.oauth_signature = this.getSignature(api, 'POST', params);
    var url = api + '?' + qs.stringify(params);

    // console.log('@@ request_token URL: ', url);

    request.post(url, function (e, r, body) {
      var request_token = qs.parse(body);
      url = 'https://www.tumblr.com/oauth/authorize?oauth_token=' + request_token.oauth_token;

      deferred.resolve({
        url: url,
        token: request_token
      });

    });
  } catch(e) {
    deferred.reject(e.message);
  }

  return deferred.promise;
};

exports.Tumblr = Tumblr;
