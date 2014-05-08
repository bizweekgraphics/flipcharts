// var test = nodelinks.nodes
// var shuffled = _.shuffle(test)
// nodelinks.nodes = shuffled


var margin = {top: 50, right: 20, bottom: 50, left: 0},
    width = 960 - margin.left - margin.right,
    height = 3500 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),
    format = function(d) { return "$" +formatNumber(d); },
    color = d3.scale.category20();


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([100,20])
  .html(function(d) {

    return "<div class='tooltip-wrapper'><strong>From:</strong> " + d.source.name + "<br/><strong>To:</strong> " + d.target.name + "<br/><strong>Amount:</strong> " + format(d.value) + "<br/><strong>Likely Original Source:</strong> " + d.backer + "</div>"
  })

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip)

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(20)
    .size([width, height]);

var path = sankey.link();

var graph = nodelinks

var nodeMap = {};
graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
graph.links = graph.links.map(function(x) {
  return {
    source: nodeMap[x.source],
    target: nodeMap[x.target],
    value: x.value,
    backer: x.backer
  };
});

sankey
  .nodes(graph.nodes)
  .links(graph.links)
  .layout(32);

// add in the links
var link = svg.append("g").selectAll(".link")
    .data(graph.links)
  .enter().append("path")
    .attr("class", function(d) {
      return "link" + " " + d.backer
    })
    .attr("d", path)
    .on('mouseover', tip.show)
    .on('mouseleave', tip.hide)
    .style("stroke-width", function(d) { return Math.max(1, d.dy); })
    .style('stroke', function(d) {
      switch(d.backer) {
        case "Shechtel":
          return "#fc0766"
          break;
        case "Taylor":
          return "#1e69ff"
          break;
        case "TGS":
          return "black"
          break;
        case "Gelbaum":
          return "#49b122"
          break;
        default:
          return "black"
          break;
      }
    })

// add in the nodes
var node = svg.append("g").selectAll(".node")
    .data(graph.nodes)
  .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")"; })

// add in the title for the nodes
node.append("text")
    .attr("x", -6)
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) { return d.name; })
  .filter(function(d) { return d.x < width / 2; })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

// add the rectangles for the nodes
node.append("rect")
    .attr("height", function(d) {
      return d.dy; })
    .attr("width", sankey.nodeWidth())
    .style('fill', 'white')
    .style("stroke", function(d) {
        return d3.rgb(d.color).darker(2); })
