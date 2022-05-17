var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
  //res.send(dateTime )
  res.render('datetime', { title: dateTime });
})

module.exports = router;