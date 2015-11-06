'use strict';

var facebook = require('./platforms/facebook');
var google = require('./platforms/google');
var github = require('./platforms/github');
var twitter = require('./platforms/twitter');

exports.Facebook = facebook.Facebook;
exports.Google = google.Google;
exports.GitHub = github.GitHub;
exports.Twitter = twitter.Twitter;
