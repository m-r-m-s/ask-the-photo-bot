var fs           = require('fs'); // access to the file system for results JSON
var path         = require('path'); // node module for handling and transforming file paths
var config       = require(path.join(__dirname, 'config')); // twitter account API key
var accKey       = require(path.join(__dirname, 'config')); // bing API key
var Bing         = require('node-bing-api')(accKey); // bing search module
var photog_Names = require(path.join(__dirname, 'photographerNames')); // corpus of 1900+ photographer names
var async        = require('async'); // async module
var http         = require('follow-redirects').http; // handles redirects (node.js doesn't do this natively)
var https        = require('follow-redirects').https; // handles redirects (node.js doesn't do this natively)
var shuffle      = require('knuth-shuffle').knuthShuffle; // knuth shuffles the corpus
// consider removing sslRootCas from global namespace?
var sslRootCas   = require('ssl-root-cas').inject(); // for sketchy ssls that throw unhandled errors
var Twit         = require('twit'); // twit module
var T            = new Twit(config); // Twit object for connection to the twitter API
var tweetQueue   = []; // queue for incoming tweets

console.log('==========> askthephoto bot has been initialized...');

// selects a photographer name from the corpus for the upcoming bing search
function getName (callback) {
  var photogNames   = photog_Names;
  var shuffledNames = shuffle(photogNames.slice(0));
  // console.log(shuffledNames);
  var pickRandomPhotographerName = Math.floor(Math.random() * shuffledNames.length);
  console.log('*** photographer name index: ' + pickRandomPhotographerName);
  var searchName = photog_Names[pickRandomPhotographerName];
  console.log('*** a photographer name has been randomly selected from the corpus...');
  console.log('*** searching with the name: ' + searchName + '...');
  callback(null, searchName);
}
// bing image search based on photographer name selected in getName
function searchImage (searchName, callback) {
  Bing.images('photography by ' +
    searchName, {adult: 'moderate', imageFilters: {size: 'large'}}, // set 'medium' if file size too large errors
    function (error, response, body) {
      if (error) {
        callback(error, null, null);
        console.log('==========> Error: ');
        console.log(error);
        return;
      } else {
        console.log('*** getting randomly selected image from bing results array...');
        var photographer = searchName;
        var array        = body.d.results; // search results based on 'photography by ' + corpus name
        var botData      = {photographer, array};
        console.log('*** search was a success! moving the required botData along...');
        // callback(null, botData);
        setTimeout(function () {
          callback(null, botData);
          // console.log(botData);
        }, 5000); // create a delay before processing the botData
      }
    });
}
// process search results for upcoming tweet
function processBotdata (botData, callback) {
  // this test accounts for searchImage, i.e. bing api sometimes returning an empty array;
  if (!botData || !botData.array || !botData.array.length) {
    if (callback(new Error('==========> Error: Bing API returned No search results'))) {
      async.waterfall([
        getName,
        async.retryable([opts = {times: 5, interval: 500}], searchImage),
        async.retryable([opts = {times: 3, interval: 1000}], processBotdata),
        async.retryable([opts = {times: 3, interval: 500}], getImage),
        postTweet.bind(null, tweet)
      ],
      function (error, result) {
        if (error) {
          console.error(error);
          return;
        }
        // console.log(result);
      });
    }
  } else {
    var photographer = botData.photographer;
    var array        = botData.array;
    var randomIndex  = Math.floor(Math.random() * array.length);
    console.log('*** randomIndex: ' + randomIndex);
    var mediaUrl  = array[randomIndex].MediaUrl;
    console.log('*** mediaUrl: ' + mediaUrl);
    var sourceUrl = array[randomIndex].SourceUrl;
    console.log('*** sourceUrl: ' + sourceUrl);
    var botData   = {photographer, mediaUrl, sourceUrl};
    // writing the results to a file for later use
    fs.readFile('results.json', function (err, data) {
      var json = JSON.parse(data);
      json.push(['search results for ' + photographer + ': ',
                              'mediaUrl: ' + botData.mediaUrl,
                              'sourceUrl: ' + botData.sourceUrl]);

      fs.writeFile('results.json', JSON.stringify(json, null, '\t'));
      console.log('*** botData appended to results.json file...');
    });
    console.log('*** botData has now been processed for upcoming tweet...');
    // callback(null, botData);
    setTimeout(function () {
      callback(null, botData);
      // console.log(botData);
    }, 5000); // again a little breathing room before getImage
  }
}
// buffers image for upcoming tweet
function getImage (botData, callback) {
  var photographer = botData.photographer;
  var mediaUrl     = botData.mediaUrl;
  var sourceUrl    = botData.sourceUrl;
  // using buffered images instead of accessing image files from disk
  console.log('*** attempting to get a buffered image for upcoming tweet...');
  // test for whether the url to fetch is HTTPS, and using https.get if it is, otherwise use http.get
  (/^https:/.test(botData.mediaUrl) ? https : http).get(
    botData.mediaUrl,
    function (res) {
      var body = new Buffer(0);

      res.on('data', function (chunk) {
        body = Buffer.concat([body, chunk]);
      });

      if (res.statusCode !== 200) {
        /* consider refactoring:
        * if(res.statusCode !== 200 && res.statusCode >= 400)
        * since 301 redirects should be handled now.
        */
        res.on('end', function () {
          // should follow redirects but logging for any uncaught responses:
          console.error('==========> HTTP ' + res.statusCode);
          console.error('==========> Error: ' + body);
        });
        // to avoid script stalls on 4xx responses:
        if (res.statusCode >= 400) {
          res.on('end', function () {
            console.error('==========> HTTP ' + res.statusCode);
            console.error('==========> Error: ' + body);
            // if 403 error script will stall at postTweet but pm2 should restart script...
            // still need fallover implementation to complete outstanding requests!
            async.waterfall([
              getName,
              async.retryable([opts = {times: 5, interval: 500}], searchImage),
              async.retryable([opts = {times: 3, interval: 1000}], processBotdata),
              async.retryable([opts = {times: 3, interval: 500}], getImage),
              postTweet.bind(null, tweet)
            ],
            function (error, result) {
              if (error) {
                console.error(error);
                return;
              }
              // console.log(result);
            });
          });
        }
      } else {
        res.on('end', function () {
          var imgBuffer = body;
          var b64content = imgBuffer.toString('base64');
          var botData = {
                           imgBuffer,
                           b64content,
                           photographer,
                           mediaUrl,
                           sourceUrl
                          };
          console.log('*** successfully buffered image!');
          callback(null, botData);
        });
      }

      res.on('error', function (err) {
        // callback(err);  // is this callback needed or just error logging???
        callback(null);
        console.error(err);
      });
      // will show all URLs including redirects...
      console.log('*** fetched Urls: ' + res.fetchedUrls);
    }
  );
}

// post tweet with an image
function postTweet (tweet, botData, callback) {
  console.log('*** ok, time to tweet!');
  if (tweetQueue.length > 0) {
    var newTweet = tweetQueue.shift();
    var imgBuffer    = botData.imgBuffer;
    var b64content   = botData.b64content;
    var photographer = botData.photographer;
    var mediaUrl     = botData.mediaUrl;
    var sourceUrl    = botData.sourceUrl;
    var name         = tweet.user.screen_name;
    var tweetId      = tweet.id_str;

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      var mediaIdStr         = data.media_id_string;
      // array of question prompts that accompany the photo
      var questions          = config.questions;
      // selects one of the questions for the reply
      var pickRandomQuestion = Math.floor(Math.random() * questions.length);
      var question           = questions[pickRandomQuestion];
      var reply              = '@' + name + ' ' + question + ' ' + 'Photograph by: ' + photographer + ' ' + '#askthephoto';
      var params             = {
                                status: reply,
                                in_reply_to_status_id: newTweet.tweetId,
                                media_ids: [mediaIdStr]
                               };
      if (err) {
        callback(err, null, null);
        console.log('*** Error');
        console.log(err);
        return;
      } else {
        T.post('statuses/update', params, function (err, data, response) {
          callback(null, data);
          console.log('*** a tweet has been posted!');
        });
      }
    });
  }
}
// initiates the twitter stream
function streamOn (callback) {
  // listening for @mentions for @askthephoto
  var stream = T.stream('statuses/filter', { track: ['@askthephoto'] });
  console.log('*** stream is now listening for tweets...');
  // run callback when you have a tweet.
  stream.on('tweet', callback);
}

// callback to streamOn
streamOn(function (tweet) {
  // console.log(' ==========> a request has been made: ' + tweet.text);
  var tweetId         = tweet.id_str;
  var name            = tweet.user.screen_name;
  var request         = tweet.text;
  var trigger         = config.trigger;
  var matchesTrigger  = request.match(trigger);
  var notTriggerMatch = !trigger.test(request);
  var aQuestion       = tweet.in_reply_to_status_id_str;
  tweetQueue.push({
    tweetId
  });
  console.log(tweetQueue);

  if (matchesTrigger) {
    console.log('*** a request has been made: ' + tweet.text);
    setTimeout(function () {
      async.waterfall([
        getName,
        async.retryable([opts = {times: 5, interval: 500}], searchImage),
        async.retryable([opts = {times: 3, interval: 1000}], processBotdata),
        async.retryable([opts = {times: 3, interval: 500}], getImage),
        postTweet.bind(null, tweet)
      ],
      function (error, result) {
        if (error) {
          console.error(error);
          return;
        }
        console.log(result);
      });
    }, 36000);
  } else if (notTriggerMatch && !aQuestion) {
    console.log('*** doesn\'t match the trigger: ' + tweet.text);
    setTimeout(function () {
      if (tweetQueue.length > 0) {
        var newTweet = tweetQueue.shift();
        // array of phrases (to hopefully avoid duplicate status errors if multiple attempts)...
        var tryAgainPhrases = config.tryAgainPhrases;
        // selection of one of the tryAgainPhrases for the reply
        var pickRandomPhrase = Math.floor(Math.random() * tryAgainPhrases.length);
        var tryAgain = tryAgainPhrases[pickRandomPhrase];
        // contructs the reply response
        var reply = '@' + name + tryAgain;
        // parameters for posting a tweet
        var params = { status: reply, in_reply_to_status_id: newTweet.tweetId };
        T.post('statuses/update', params, function (err, data, response) {
          if (err !== undefined) {
            console.log(err);
          } else {
            console.log('*** tweeted: ' + params.status);
               // console.log(data);
          }
        });
      }
    }, 36000);
  } else {
    if (aQuestion && !matchesTrigger) {
      console.log('*** Question Asked: ' + tweet.text);
      setTimeout(function () {
        if (tweetQueue.length > 0) {
          var newTweet = tweetQueue.shift();
          // question affirmations
          var questionResponses = config.questionResponses;
          var pickRandomPhrase = Math.floor(Math.random() * questionResponses.length);
          var affirmations = questionResponses[pickRandomPhrase];
          // contructs the reply response
          var reply = '@' + name + ' ' + affirmations;
          // parameters for posting a tweet
          var params = { status: reply, in_reply_to_status_id: newTweet.tweetId };
          T.post('statuses/update', params, function (err, data, response) {
            if (err !== undefined) {
              console.log(err);
            } else {
              console.log('*** tweeted: ' + params.status);
                  // console.log(data);
            }
          });
        }
      }, 36000);
    }
  }
});
