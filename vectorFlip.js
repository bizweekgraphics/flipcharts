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

var xScale = d3.scale.linear()
  .domain([0,d3.max(data, function(d) { return d.x; })])
  .range($("#container").width());

var yScale = d3.scale.linear()
  .domain([0,d3.max(data, function(d) { return d.y; })])
  .range($("#container").height());

var xInterpolate = d3.scale.linear()
  .domain([0,1])
  .range(d3.extent(data, function(d) { return d.x; }));

var yInterpolate = d3.scale.linear()
  .domain([0,1])
  .range(d3.extent(data, function(d) { return d.y; }));

function changeSlide(scrubX) {
  var xVector = drawArrow(parent,[0,0],[xScale(xInterpolate(scrubX))],0,false);
  var yVector = drawArrow(parent,[0,0],[0,yScale(yInterpolate(scrubX))],false);
}
