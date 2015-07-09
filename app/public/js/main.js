$(document).ready(function(){
  function getData(callback){
    $.get('/d3', function(resp){
      var data = [];
      avHourly = parseFloat(resp.averages.average_hourly_rate.value).toFixed(2)
      avCharge = parseFloat(resp.averages.average_charge_rate.value).toFixed(2)
      data.push(avHourly)
      data.push(avCharge)
      console.log(data);
      callback(data);
    })
  }
  getData(function(json){  
    var w = 800;
    var h = 450;
    var margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

    var data = json
    
    var x = d3.scale.linear()
        .domain([0,d3.max(data)])
        .range([0,width]);
    var y = d3.scale.linear()
        .domain([0,data.length])
        .range([0,height]);
    var svg = d3.select("div").append("svg")
          .attr("id", "chart")
          .attr("width", w)
          .attr("height", h);
    var chart = svg.append("g")
          .classed("display", true)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function plot(params){
      this.selectAll(".bar")
        .data(params.data)
        .enter()
          .append("rect")
          .classed("bar", true)
          .attr("x", 0)
          .attr("y", function(d,i){
            return y(i);
          })
          .attr("width", function(d,i){
            return x(d);
          })
          .attr("height", function(d,i){
            return y(1)-1;
          });
      this.selectAll(".bar-label")
        .data(params.data)
        .enter()
          .append("text")
          .classed("bar-label", true)
          .attr("x", function(d,i){
            return x(d);
          })
          .attr("dx", -4)
          .attr("y", function(d,i){
            return y(i);
          })
          .attr("dy", function(d,i){
            return y(1)/1.5+2;
          })
          .text(function(d,i){
            return d;
          });
    }
    plot.call(chart, {
      data: data
    }); 
  });    
});