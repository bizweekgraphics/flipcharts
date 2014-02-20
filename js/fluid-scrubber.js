var xExtent, yExtent, linePath,
    scrubX, scrubY;

var defaultMargin = $(document).width()*0.1;

var margin = {top: defaultMargin, right: defaultMargin, bottom: defaultMargin, left: defaultMargin},
    width = $(document).width() - margin.left - margin.right,
    height = $(document).height() - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0,100])
    .range([0,width]);

var y = d3.scale.linear()
    .domain([0,100])
    .range([height,0]);
    
var xZoomMouse = d3.scale.linear()
    .domain([0,height])
    .range([1,3])
    .clamp(true);

var xZoomTilt = d3.scale.linear()
    .domain([45,25]) //degrees of tilt
    .range([1,3])
    .clamp(true);

var xPanMouse = d3.scale.linear()
    .domain([0,width])
    .range([0, 2000]);

var xPanTilt = d3.scale.linear()
    .domain([10,-10]) //degrees of tilt
    .range([0, 2000]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(x.domain())
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickValues(y.domain())
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
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.spx); });

d3.tsv("data/spx.tsv", function(error, data) {
  
  // coerce to numbers
  data.forEach(function(d) {
    d.date = +d.date;
    d.spx = +d.spx;
  });
  
  xExtent = d3.extent(data, function(d) { return d.date; });
  yExtent = d3.extent(data, function(d) { return d.spx; });
  
  x.domain(xExtent);
  y.domain(yExtent);
  
  xAxis.tickValues(x.domain());
  yAxis.tickValues(y.domain());
  
  gx.call(xAxis);
  gy.call(yAxis);
  
  xPanMouse.range(d3.extent(data, function(d) { return d.date; }));
  xPanTilt.range(d3.extent(data, function(d) { return d.date; }));
  
  linePath = svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  
});

d3.select("body").on("mousemove", function(d,i) {
  
  // NOTE: The outer wrapper of min/max below keeps the lower bound of the domain from crossing over past the upper, and vice versa. 
  // That's a problem when the chart margins are bigger than the +/- range below, and the whole scale flips backwards. Funky.
  // But you also get a nice springy thing as long as you stay on the near side of that asymptote. So they may be some use for it.
  
  scrubX = xPanMouse(d3.mouse(svg.node())[0]);
  scrubY = xZoomMouse(d3.mouse(svg.node())[1]);
  scrub(scrubX, scrubY);
  
});


if (window.DeviceOrientationEvent) {

  // Listen for the deviceorientation event and handle the raw data
  window.addEventListener('deviceorientation', function(eventData) {
    gamma 	= eventData.gamma;	// - left-to-right + (degrees)
    beta 	  = eventData.beta;	  // - back-to-front + (degrees)
    alpha 	= eventData.alpha	  // compass direction (degrees)
          
    if(gamma == null || beta == null || alpha == null) {
      // desktopMode();
    } else {
      
      scrubX = xPanTilt(gamma);
      scrubY = xZoomTilt(beta);
      scrub(scrubX, scrubY);
      
    }
  }, false);
} 
else {
  // desktopMode();
}

function scrub(scrubX, scrubY) {
  
  var subdomain = (xExtent[1] - xExtent[0]) / scrubY;
  $(".data-credit").text("Zoom factor: "+scrubY+", Subdomain: "+subdomain);
  
  // NOTE: The outer wrapper of min/max below keeps the lower bound of the domain from crossing over past the upper, and vice versa. 
  // That's a problem when the chart margins are bigger than the +/- range below, and the whole scale flips backwards. Funky.
  // But you also get a nice springy thing as long as you stay on the near side of that asymptote. So they may be some use for it.
  x.domain(
    [
      Math.min(Math.max(scrubX - subdomain/2, xExtent[0] ), xExtent[1] - subdomain/2),
      Math.max(Math.min(scrubX + subdomain/2, xExtent[1] ), xExtent[0] + subdomain/2)
    ]
  );
    
  xAxis.tickValues(x.domain());
  
  gx.call(xAxis);
  linePath.attr("d", line);
  
}