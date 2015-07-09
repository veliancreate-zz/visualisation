var express = require('express');
var router = express.Router();
var client = require('../elastic_search/elasticSearch');
var data = require('../data/data.json');

router.get('/', function(req, res, next){
  res.render('d3_test', {title: 'D3'})
})

router.get('/table', function(req, res, next) {
  res.render('table', { title: 'D3', data: data });
});

router.get('/charts', function(req, res, next){
  res.render('charts', {title: 'D3'})
});

router.get('/d3', function(req, res, next) {
  client.averages(function(hits){
    console.log(hits)
    res.send({ averages: hits});
  })
});

module.exports = router;
