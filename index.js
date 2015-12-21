'use strict';

var facebook = require('./platforms/facebook');
var google = require('./platforms/google');
var github = require('./platforms/github');
var twitter = require('./platforms/twitter');
var disqus = require('./platforms/disqus');
var instagram = require('./platforms/instagram');
var naver = require('./platforms/naver');
var kakao = require('./platforms/kakao');
var dropbox = require('./platforms/dropbox');

exports.Facebook = facebook.Facebook;
exports.Google = google.Google;
exports.GitHub = github.GitHub;
exports.Twitter = twitter.Twitter;
exports.Disqus = disqus.Disqus;
exports.Instagram = instagram.Instagram;
exports.Naver = naver.Naver;
exports.Kakao = kakao.Kakao;
exports.Dropbox = dropbox.Dropbox;
