'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');
var crypto = require('crypto');
var _ = require('lodash');

function Flickr(configuration) {
  this.init(configuration);
}

Flickr.prototype = {
  PLATFORM_TYPE: 'FLICKR',
  conf: {
    CONSUMER_KEY: '',
    CONSUMER_SECRET: '',
    REDIRECT_URL: ''
  }
};

Flickr.prototype.init = function(configuration) {
  this.conf = configuration;
};

Flickr.prototype.callback = function (req, res) {
  var deferred = $q.defer();

  var params = {
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  },
  api = 'https://www.flickr.com/services/oauth/access_token';

  params.oauth_signature = this.getSignature(api, 'GET', params, req.query.token_secret);
  var url = api + '?' + qs.stringify(params);

  // console.log('oauth:', JSON.stringify(params, null, 2));

  var self = this;
  request(url, function (e, r, body) {

    if (!e && r.statusCode === 200) {

      var tokens = qs.parse(body);

      var key = self.PLATFORM_TYPE + '_' + tokens.user_nsid;
      var user = {
        tokens: tokens,
        key: key,
        platform: self.PLATFORM_TYPE
      };

      deferred.resolve(user);
    } else {
      deferred.reject(body);
    }

  });


  return deferred.promise;
};

Flickr.prototype.getSignature = function (api, method, params, oauth_token_secret) {

  var ts = new Date().getTime(),
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

  //console.log('@@ signature_str:', signature_str);
  //console.log('@@ signature KEY:', key);

  var signature = crypto.createHmac('sha1', key).update(signature_str).digest('base64');
  //console.log('@@ signature:', signature);

  return signature;

};


Flickr.prototype.getAuthorizeUrl = function () {
  var deferred = $q.defer();

  try {
    var params = {
      oauth_callback: this.conf.REDIRECT_URL,
    },
    api = 'https://www.flickr.com/services/oauth/request_token';

    params.oauth_signature = this.getSignature(api, 'GET', params);
    var url = api + '?' + qs.stringify(params);

    // console.log('@@ request_token URL: ', url);

    request(url, function (e, r, body) {
      var request_token = qs.parse(body);
      url = 'https://www.flickr.com/services/oauth/authorize?oauth_token=' + request_token.oauth_token + '&perms=read';

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

exports.Flickr = Flickr;
