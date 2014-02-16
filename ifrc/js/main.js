var prcDistributions = [];
var maxDate;
var minDate;
var chartData = [];
var categoryData = {};
var categoryTotal = 0;
var itemsCategory;
var categoryList = ["Blankets", "MosquitoNet", "PlasticSleepingMat", "Jerry_10L", "Jerry_20L", "HygieneKit", "KitchenSet", "Tarpaulin","Tent","SRK"];


function getDistributionData(){
  $.ajax({
      type: 'GET',
      url: 'data/PRC_Distributions.json',
      contentType: 'application/json',
      dataType: 'json',
      timeout: 10000,
      success: function(json) {
        prcDistributions = json;        
        getDateRange();
      },
      error: function(e) {
          console.log(e);
      }
  });
}


function getDateRange(){
  var allDates = [];

  $(prcDistributions).each(function(i, distribution){
    selected = distribution.DATE;
    selectedDate = new Date(selected);
    allDates.push(selectedDate);
  });
  maxDate = new Date(Math.max.apply(null, allDates));
  minDate = new Date(Math.min.apply(null, allDates));
  buildHistory();
}

//       if (isFinite(x) == true){
//         y += x;
//       };


function buildHistory (){
	
  $(categoryList).each(function(i, category){
    categoryTotal = 0;
    categoryData = {};
    itemsCategory = category;
    categoryData.key = category;
    categoryData.values = [];
    for (var d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      $(prcDistributions).each(function(i, distribution){
        if((new Date(distribution.DATE)).getTime() == d.getTime()){
          categoryTotal += distribution[itemsCategory];
        }
      });
      currentDate = new Date(d);
      categoryData.values.push([currentDate.getTime(), categoryTotal]);
    }
    chartData.push(categoryData);
  });
  buildChart();
}

function buildChart(){
    /*
  .map(function(series) {
    series.values = series.values.map(function(d) {
      return { x: d[0], y: d[1] }
    });
    return series;
  });
  */

  //an example of harmonizing colors between visualizations
  //observe that Consumer Discretionary and Consumer Staples have
  //been flipped in the second chart
  var colors = d3.scale.category20();
  keyColor = function(d, i) {return colors(d.key)};

  var chart;
  nv.addGraph(function() {
    chart = nv.models.stackedAreaChart()
                  .margin({right:30})
                 // .width(600).height(500)
                  .useInteractiveGuideline(true)
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .color(keyColor)
                  .transitionDuration(300);
                  //.clipEdge(true);

  // chart.stacked.scatter.clipVoronoi(false);

    chart.xAxis
        .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

    chart.yAxis
        .tickFormat(d3.format(',.0f'));

    d3.select('#chart1')
      .datum(chartData)
      .transition().duration(1000)
      .call(chart)
      // .transition().duration(0)
      .each('start', function() {
          setTimeout(function() {
              d3.selectAll('#chart1 *').each(function() {
                console.log('start',this.__transition__, this)
                // while(this.__transition__)
                if(this.__transition__)
                  this.__transition__.duration = 1;
              })
            }, 0)
        })
      // .each('end', function() {
      //         d3.selectAll('#chart1 *').each(function() {
      //           console.log('end', this.__transition__, this)
      //           // while(this.__transition__)
      //           if(this.__transition__)
      //             this.__transition__.duration = 1;
      //         })});

    nv.utils.windowResize(chart.update);

    // chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    return chart;
  });

  // nv.addGraph(function() {
  //   var chart = nv.models.stackedAreaChart()
  //                 .x(function(d) { return d[0] })
  //                 .y(function(d) { return d[1] })
  //                 .color(keyColor)
  //                 ;
  //                 //.clipEdge(true);

  //   chart.xAxis
  //       .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

  //   chart.yAxis
  //       .tickFormat(d3.format(',.2f'));

  //   d3.select('#chart2')
  //     .datum(histcatexpshort)
  //     .transition()
  //       .call(chart);

  //   nv.utils.windowResize(chart.update);

  //   return chart;
  // });
}




getDistributionData();



