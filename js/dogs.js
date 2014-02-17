d3.tsv("data/dogs.tsv", function(error, data) {
  
  //coercing from strings to numbers
  data.forEach(function(d, i) {
    $.each(d, function(j, value) {
      data[i][j] = +value;
    })
  });
  
  var scales = new Object();
  
  data[0].each(d, function(i, value) {
    scales[i] = d3.scale.linear()
      .domain([0,1])
      .range([data[0][i],data[1][i]]);
  });
  
});