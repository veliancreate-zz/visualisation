var elasticSearch = require('elasticsearch');
var client = new elasticSearch.Client({
  host: 'localhost:9200'
});
var fs = require('fs'),
    Baby = require('babyparse'),
    readline = require('readline');

function readFile(filePath, done) {
    var stream = fs.createReadStream(filePath),
        out = [];

    done = done || function(err) { if(err) throw err; };

    stream.on('data', function(data) {
      out.push(Baby.parse(data.toString(), { header: true }));
    });

    stream.on('end', function(){
      done(null, out);
    });

    stream.on('error', function(err) {
      done(err);
    });
}

function uploadToSearch(){
  var jsonData = require('../data/data.json')
  for(var i = 0; i < jsonData.length; i++){
    var hourlyRate = parseFloat(jsonData[i].Hourly_Rate.split('£')[1])
    var chargeRate = parseFloat(jsonData[i].Charge_Outrate.split('£')[1])
    var formatted = jsonData[i]
    formatted.Hourly_Rate = hourlyRate;
    formatted.Charge_Outrate = chargeRate;
    client.create({
      index: 'projectdata',
      type: 'data',
      body: formatted,
    }, function(err, response){
      if(err){ return console.log(err) }
    });
  } 
}

module.exports.averages = function(callback){
  client.search({
    index: 'projectdata',
    type: 'data',
    body: {
      size: 1,
      aggs: {
        average_hourly_rate: { avg: { field: 'Hourly_Rate' } },
        average_charge_rate: { avg: { field: 'Charge_Outrate'} }
      }
    }
  }).then(function (resp) {
    var hits = resp.aggregations;
    callback(hits)
  }, function (err) {
    console.trace(err.message);
  });
}

readFile('app/data/data.csv', function(err, data){
  writeReadyData = JSON.stringify(data[0].data, null, 2)
  fs.writeFile('app/data/data.json', writeReadyData, function(err){
    if(err) { return console.log(err) }
    uploadToSearch();
  });
});


