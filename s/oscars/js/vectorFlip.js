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

function changeSlide(scrubX) {
  var xVector = drawArrow(parent,[0,0],[xScale(xInterpolate(scrubX))],0,false);
  var yVector = drawArrow(parent,[0,0],[0,yScale(yInterpolate(scrubX))],false);

}
