var data = [
  {
    "x": 1,
    "y": 10
  },
  {
    "x": 11,
    "y": 2
  }
];

var xExt = d3.extent(data, function(d) { return d.x; });
var yExt = d3.extent(data, function(d) { return d.y; });

var xScale = d3.scale.linear()
  .domain([0,xExt[1]])
  .range($("#container").width());

var yScale = d3.scale.linear()
  .domain([0,yExt[1]])
  .range($("#container").height());

var xInterpolate = d3.scale.linear()
  .domain([0,1])
  .range(xExt);

var yInterpolate = d3.scale.linear()
  .domain([0,1])
  .range(yExt);

var xLabel = svg.append("text")
  .text("Box office revenue")
  .attr("x", xScale(xExt[1]))
  .attr("y", yScale(yExt[0]));
var yLabel = svg.append("text")
  .text("Critical acclaim")
  .attr("x", xScale(xExt[0]))
  .attr("y", yScale(yExt[1]));

function changeSlide(scrubX) {
  var xVector = drawArrow(parent,[0,0],[xScale(xInterpolate(scrubX))],0,false);
  var yVector = drawArrow(parent,[0,0],[0,yScale(yInterpolate(scrubX))],false);

  var xLabel.style("opacity", scrubX);
  var yLabel.style("opacity", 1-scrubX);
}
