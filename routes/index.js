var express = require('express');
var twitter = require('twitter');

const {check, validationResult} = require('express-validator');
var dotenv = require('dotenv');
var Sentiment = require('sentiment');

var router = express.Router();
var s = new Sentiment();



dotenv.config();
var tw = new twitter({
	consumer_key: process.env.CONSUMER_KEY,
  	consumer_secret: process.env.CONSUMER_SECRET,
  	access_token_key: process.env.ACCESS_TOKEN_KEY,
  	access_token_secret: process.env.ACCESS_TOKEN_SECRET
  })

/* GET home page. */
router.get('/', function(req, res, next) {
	var today_txt = [];
	var today = new Date();
	for (var i = 0; i<=7; i++){
    	var ieri = new Date(today);
    	ieri.setDate(today.getDate() - i);
      	var dd = String(ieri.getDate()).padStart(2, '0');
		var mm = String(ieri.getMonth() + 1).padStart(2, '0'); //January is 0
		var yyyy = ieri.getFullYear();
		today_txt[i] = yyyy + '-' + mm + '-' + dd;
		
	}
  	res.render('index',{ activeIndex:"active",activeRegole:"",data0:today_txt[0],data1:today_txt[1],data2:today_txt[2],data3:today_txt[3],data4:today_txt[4],data5:today_txt[5],data6:today_txt[6],data7:today_txt[7] });
});

/* GET operatori page. */
router.get('/operatori', function(req, res, next) {
  	res.render('regole', { activeIndex:"",activeRegole:"active" });
});

//controlli
router.post('/search', [
	check('fcerca')
		.not().isEmpty()
		.withMessage('Search field can not be empty.'),
	check('fnumero')
		.not().isEmpty().withMessage('Tweet count field can not be empty.')
		.isInt({min:1,max:100}).withMessage('Tweet count field has to be a number between 1 and 100. Be sure not to add any other character after the Tweet count field.'),		
	check('fresult_type')
		.not().isEmpty()
		.withMessage('Result type field can not be empty.'),
	check('fdate_select')
		.not().isEmpty()
		.withMessage('Until field can not be empty.')
  ],
  function (req, res) {
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
	} else {
		var params = {
			q:req.body.fcerca,
			result_type:req.body.fresult_type,
			count:req.body.fnumero,
			until:req.body.fdate_select,
			tweet_mode:'extended'
		}
		tw.get('search/tweets', params, function(error, tweets, response) {
			if(!error){
				console.log(tweets.statuses.length);
				if(tweets.statuses.length == 0){
					res.json(null);
				}
				else{
					//console.log(tweets.statuses);
					var dresp = {
						tweet:[],
						sentiment:[]
					};
					for (var i = 0; i < tweets.statuses.length; i++) {
						dresp.tweet[i] = tweets.statuses[i];
						dresp.sentiment[i] = s.analyze(tweets.statuses[i].full_text);
						console.log(dresp.tweet[i]);
						console.log(dresp.sentiment[i]);
					}
					res.json(dresp);
				}
			}
			else{
				res.json(null);
			}
				

		 });
    }
  });

module.exports = router;
