var express = require('express');
var router = express.Router();
var moment=require('moment');

var chatHistory=require('./../controllers/chatHistory');

/* GET home page. */
router.get('/getMessageHistory', function(req, res) {

  var data={startdate:moment.unix(req.param('startIndex')).format(),enddate:moment.unix(req.param('endIndex')).format()};

  chatHistory.getByTwoDateBetween(data,function (err,resp) { 

    if(err){
      res.statusCode=500;
      res.message='An error occured';
    }
    else {
      res.statusCode=200;
      var json=JSON.stringify(resp);
      res.end(json);
    }
  });
});

module.exports = router;
