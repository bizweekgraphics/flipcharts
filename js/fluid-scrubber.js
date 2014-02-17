var xExtent, yExtent, linePath;

var defaultMargin = $(document).width()*0.05;

var margin = {top: defaultMargin, right: defaultMargin, bottom: defaultMargin, left: defaultMargin},
    width = $(document).width() - margin.left - margin.right,
    height = $(document).height() - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0,100])
    .range([0,width]);

var y = d3.scale.linear()
    .domain([0,100])
    .range([height,0]);
    
var xZoom = d3.scale.linear()
    .domain([0,height])
    .range([1,10]);

var xPan = d3.scale.linear()
    .domain([0,width])
    .range([0, 2000]);

console.log("Width: "+width);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right");

var svg = d3.select("#svg-canvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var gx = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+ height +")")
    .call(xAxis);

var gy = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis);

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.population); });

d3.tsv("data/population.tsv", function(error, data) {
  
  // coerce to numbers
  data.forEach(function(d) {
    d.year = +d.year;
    d.population = +d.population;
  });
  
  xExtent = d3.extent(data, function(d) { return d.year; });
  yExtent = d3.extent(data, function(d) { return d.population; });
  
  x.domain(xExtent);
  y.domain(yExtent);
  
  gx.call(xAxis);
  gy.call(yAxis);
  
  xPan.range(d3.extent(data, function(d) { return d.year; }));
  
  linePath = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  
});

d3.select("body").on("mousemove", function(d,i) {
  
  // NOTE: The outer wrapper of min/max below keeps the lower bound of the domain from crossing over past the upper, and vice versa. 
  // That's a problem when the chart margins are bigger than the +/- range below, and the whole scale flips backwards. Funky.
  // But you also get a nice springy thing as long as you stay on the near side of that asymptote. So they may be some use for it.
  x.domain(
    [
      Math.min(Math.max( xPan(d3.mouse(svg.node())[0]) - 500, xExtent[0] ), xExtent[1] - 500),
      Math.max(Math.min( xPan(d3.mouse(svg.node())[0]) + 500, xExtent[1] ), xExtent[0] + 500)
    ]
  );
  
  console.log(Math.max( xPan(d3.mouse(svg.node())[0]) - 5, xExtent[0] ));
  
  gx.call(xAxis);
  linePath.attr("d", line);
});