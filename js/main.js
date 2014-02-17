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

d3.tsv("data/data.tsv", function(error, data) {
  
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
  x.domain(
    [
      Math.max( xPan(d3.mouse(svg.node())[0]) - 50, xExtent[0] ),
      Math.min( xPan(d3.mouse(svg.node())[0]) + 50, xExtent[1] )
    ]
  );
  
  console.log(Math.max( xPan(d3.mouse(svg.node())[0]) - 5, xExtent[0] ));
  
  gx.call(xAxis);
  linePath.attr("d", line);
});

//////////////////////////////////////////////////////////////////////////////////////////
// TEMPLATE FUNCTIONS ////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// from http://stackoverflow.com/a/326076/120290
function inIframe() {
    try {
        return window.self !== window.top;
    } catch(err) {
        return true;
    }
}

$( document ).ready(function() {  
  if(inIframe()) $("body").addClass("iframed");
});

//////////////////////////////////////////////////////////////////////////////////////////
// DRAWING FUNCTIONS /////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

function drawArrow(parent, from, to, degrees, clockwise) {
  /* 
  PARAMETERS:
    parent:     the svg container or element to which to append the arrow
    from, to:   where to draw the arrow from and to, in any of four forms (in any mix):
                  a DOM element:            document.getElementById("hed")
                  a jQuery element:         $("#hed")
                  a D3 element:             d3.select("#hed")
                  a coordinate array [x,y]: [100,200]
    degrees:    the angle which the arc of the arrow will subtend. 
                  90 for a gentle arc, 180 for a bigger swoop.
                  beyond 180, it gets gentler again, because of the way SVG computes arc.
                  pass 0 or 360 for a straight arrow.
    clockwise:  boolean determining whether arrow will swoop clockwise (true) or counterclockwise (false)
  */
  
  // ZEROTH, figure out which points to draw between, for when from and to are spatially-extended elements
  
  // "corners" are coordinates of points that are eligible to be connected
  function getCorners(element) {
    if(element instanceof Array && !element.data) {
      //an array hopefully containing [x,y] was passed in
      return [{"x":element[0],"y":element[1]}];
    } else if(element.jquery) {
      //a jquery element was passed in; convert to DOM element
      return edgesToCorners(element[0]);
    } else if(element.nodeType) {
      //a DOM element was directly passed in
      return edgesToCorners(element);            
    } else {
      //assume it's a D3 element (sloppy, yes)
      return edgesToCorners(element[0][0]);            
    }
  }

  // gets from the sides of a bounding rect (left, right, top, bottom) 
  //      to its corners (topleft, topright, bottomleft, bottomright)
  function edgesToCorners(element) {
    var corners = [];
    ["left","right"].forEach(function(i) { ["top","bottom"].forEach(function(j) { corners.push({"x":i,"y":j}); }); });
    return corners.map(function(corner) { 
      return {"x":element.getBoundingClientRect()[corner.x],
              "y":element.getBoundingClientRect()[corner.y]};
    });
  }
  
  var fromCorners = getCorners(from), 
      toCorners = getCorners(to),
      fromClosest, toClosest, d;
  
  // check all possible combinations of eligible endpoints for the shortest distance
  fromCorners.forEach(function(fromVal) { 
    toCorners.forEach(function(toVal) {
      if(d==null || distance(fromVal,toVal)<d) {
        d = distance(fromVal,toVal);
        fromClosest = fromVal;
        toClosest = toVal;
      }
    });
  });
  
  from = fromClosest;
  to = toClosest;
    
  /* 
  FIRST, compute radius of circle from desired degrees for arc to subtend.
    read up:  http://mathworld.wolfram.com/Chord.html
          http://www.wolframalpha.com/input/?i=angle+subtended
    n.b.:  bizweek only uses circular arcs, but SVG allows for any ellipse, so r1 == r2 in SVG path below
        bizweek arrows typically subtend 90 or 180 degrees
  */
  
  // bound acceptable {degrees}, between 1 and 359
  degrees = Math.max(degrees, 1);
  degrees = Math.min(degrees, 359);
  
  // get the chord length ("height" {h}) between points, by pythagorus
  var h = Math.sqrt(Math.pow((to.x-from.x),2)+Math.pow((to.y-from.y),2));

  // get the distance at which chord of height h subtends {angle} degrees
  var radians = degrees * Math.PI/180;
  var d = h / ( 2 * Math.tan(radians/2) );
  
  // get the radius {r} of the circumscribed circle
  var r = Math.sqrt(Math.pow(d,2)+Math.pow((h/2),2));
  
  /*
  SECOND, compose the corresponding SVG arc.
    read up: http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    example: <path d = "M 200 50 a 90 90 0 0 1 100 0"/>
  */
  var path = "M " + from.x + " " + from.y + " a " + r + " " + r + " 0 0 "+(clockwise ? "1" : "0")+" " + (to.x-from.x) + " " + (to.y-from.y);
  
  // append path to given {parent} (with class .arrow)
  var arrow = parent.append("path")
    .attr("d", path)
    .attr("marker-end", "url(#arrowhead)")
    .attr("class", "arrow");
  
  // return a reference to the appended arrow
  return arrow;
}

function distance(from, to) {
  return Math.sqrt(Math.pow(to.x-from.x,2)+Math.pow(to.y-from.y,2));
}

//////////////////////////////////////////////////////////////////////////////////////////
// NUMBER FORMATTING /////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// adapted from d3.formatPrefix
function bbwNumberFormat(dolla) {
  var base = Math.max(1, Math.min(1e12, dolla));
  var scaler = bbwFormatPrefix(base);
  return parseFloat(scaler.scale(dolla).toPrecision(3))+scaler.symbol;
}
var bbw_formatPrefixes = [ "p", "n", "µ", "m", "", "k", "m", "b", "t" ].map(bbw_formatPrefix);
function bbwFormatPrefix(value, precision) {
	var i = 0;
	if (value) {
		if (value < 0) value *= -1;
		if (precision) value = d3.round(value, d3_format_precision(value, precision));
		i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
		i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
	}
	return bbw_formatPrefixes[4 + i / 3];
};
function bbw_formatPrefix(d, i) {
	var k = Math.pow(10, Math.abs(4 - i) * 3);
	return {
		scale: i > 4 ? function(d) {
			return d / k;
		} : function(d) {
			return d * k;
		},
		symbol: d
	};
}

// Convert Excel dates into JS date objects
// @author https://gist.github.com/christopherscott/2782634
// @param excelDate {Number}
// @return {Date}
function getDateFromExcel(excelDate) {
  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
  // 2. Convert to milliseconds.
	return new Date((excelDate - (25567 + 1))*86400*1000);
}