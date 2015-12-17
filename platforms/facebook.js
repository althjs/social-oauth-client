'use strict';

var $q = require("q");
var request = require('request');
var qs = require('querystring');


function Facebook(configuration) {
  this.init(configuration);
}

Facebook.prototype = {
  PLATFORM_TYPE: 'FACEBOOK',
  conf: {
    APP_ID: '',
    APP_SECRET: '',
    CLIENT_ID: '',
    REDIRECT_URL: ''
  }
};

Facebook.prototype.init = function(configuration) {
  this.conf = configuration;
};

Facebook.prototype.callback = function (req, res) {
    var deferred = $q.defer();
    var code = req.query.code;

    /*
    https://graph.facebook.com/v2.3oauth/access_token?
        client_id={app-id}
       &redirect_uri={redirect-uri}
       &client_secret={app-secret}
       &code={code-parameter}
     */

    var params = {
      client_id: this.conf.APP_ID,
      redirect_uri: this.conf.REDIRECT_URL,
      client_secret: this.conf.APP_SECRET,
      code: code
    };

    var url = 'https://graph.facebook.com/v2.3/oauth/access_token?' + qs.stringify(params);

    /*
    {
    access_token: "CAAXjshZBgckMBAKhf5Yyu5uY57Pbjpf2i76HwXoYrFfaFlFTs8WTJAxK1eRZBnf06pEsaZACPGVCqJNzyONpC7ESSZBsCm0nzeBRTto1uPqQfnZCw2Huxs7sYFSZCd7IzqAJbh30G91ohoOkaxXPvIlhVAjastrthoiJRXKvdCTAgnG3tw9rvbUrpDfGocYLsZD",
    token_type: "bearer",
    expires_in: 5183533
    }
     */

    var self = this;
    request.get(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log(body); // Show the HTML for the Google homepage.

        var tokens = JSON.parse(body);

        self.profile(tokens).then(function(info) {
          var key = self.PLATFORM_TYPE + '_' + info.id;
          var user = {
            tokens: tokens,
            info: info,
            key: key,
            platform: self.PLATFORM_TYPE
          };

          deferred.resolve(user);

        }, function(err) {
          deferred.reject(err);
        });

      } else {
        deferred.reject(error);
      }
    });

    return deferred.promise;
};

Facebook.prototype.getAuthorizeUrl = function (scopes) {
    var scope = 'public_profile';
    if (Array.isArray(scopes)) {
      scope = scopes.join(',');
    }
    // console.log(scope);
    var url = 'https://www.facebook.com/dialog/oauth?client_id=' + this.conf.APP_ID + '&redirect_uri=' + encodeURIComponent(this.conf.REDIRECT_URL);
    url+= '&scope=' + scope;

    return url;
};

Facebook.prototype.profile = function (tokens) {
    var deferred = $q.defer();
    var url = 'https://graph.facebook.com/v2.5/me?fields=id,name,picture,email&access_token=';
    url+= tokens.access_token;

    console.log(url);
    request.get(url, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(JSON.stringify(JSON.parse(body), null, 2)); // Show the HTML for the Google homepage.
        try {
          deferred.resolve(JSON.parse(body));
        } catch(e) {
          console.log('XXXX' + e.message);
        }
      } else {
        deferred.reject(body);
      }
    });

    return deferred.promise;
};


exports.Facebook = Facebook;
/*
curl -i -X GET \
 "https://graph.facebook.com/v2.5/me?fields=id%2Cname%2Cpicture&access_token=CAAXjshZBgckMBAIiRS9iwg9O4FXQaB0wLQaOo3TcL2WP5dxrx1l5ssZAUPnwQvhAoCRRsGTZCcazLFwROEO9SwJkaLiNOI1VCzTlSxT5lNJJsl2aIIZAX6ahJ0aAZCqvFtukzpwg29K1LqY7twlWZAuWDZAV1ZAeJAF42UDcnb7v4tzngqcJzYWZBSZCyYLbVZCRmoZD"
 */
// exports.profile = function (req, res) {
//   var url = 'https://graph.facebook.com/v2.5/me?fields=id,name,picture,email&access_token=';
//   url+= 'CAAXjshZBgckMBACJPW4XCx01NaA4PTmYRJ59vDmvmBNnta8SEy1fjn0vbv4SmafboxodMuVQRwvYLJsV61PNFjhYViGVW5A58HtXQ3bfWYfogbqWMiUhwN2ZCoweOoYb6QFeG9nY328CZCJYIkQxe3fJv5t9H0W7BGZBlKD9vkoCGcGI1hCW29VdJ70HsYAZD';
//
//   request.get(url, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       console.log(body); // Show the HTML for the Google homepage.
//       res.send(body);
//     } else {
//       res.send(body);
//     }
//   });
//
// };
