var elasticSearch = require('elasticsearch');
var client = new elasticSearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
var fs = require('fs'),
    Baby = require('babyparse'),
    readline = require('readline');

function readFile(filePath, done) {
    var 
        stream = fs.createReadStream(filePath),
        out = [];

    // Make done optional
    done = done || function(err) { if(err) throw err; };

    stream.on('data', function(data) {
      // Parse data
      out.push(Baby.parse(data.toString(),{header:true}));
    });

    stream.on('end', function(){
      done(null, out); // All data is read
    });

    stream.on('error', function(err) {
      done(err);
    });
}

readFile('app/data/data.csv', function(err, data){
  fs.writeFile('app/data/data.json', JSON.stringify(data[0].data, null, 1), function(err){
    if(err) { return console.log(err) }
    var jsonData = require('../data/data.json')
    for(var i = 0; i < jsonData.length; i++){
      client.create({
        index: 'projectdata',
        type: 'data',
        body: jsonData[i]
      }, function(err, response){
        if(err){ return console.log(err) }
        console.log(response)  
      });
    }  
  })
});




