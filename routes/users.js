var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myname', function(req, res, next) {
  res.send('Anson');
});
router.get('/myfavoritemovies', function(req, res, next) {
  res.json([['Iron man 1',"Iron man 2", "Iron man 3"]]);
});

module.exports = router;
