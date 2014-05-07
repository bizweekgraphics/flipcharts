var g = new dagreD3.Digraph();

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
g.addNode("black",  { label: "Black Box" });
g.addNode("taylor",    { label: "Fred Taylor" });
g.addNode("gelbaum",      { label: "Shechtel" });
g.addNode("schectel",      { label: "Gelbaum" });
g.addNode("tgs",    { label: "TGS" });
g.addNode("roseland",     { label: "Another Roseland foundation" });

// Add edges to the graph. The first argument is the edge id. Here we use null
// to indicate that an arbitrary edge id can be assigned automatically. The
// second argument is the source of the edge. The third argument is the target
// of the edge. The last argument is the edge metadata.
g.addEdge(null, "black", "taylor");
g.addEdge(null, "black",   "gelbaum");
g.addEdge(null, "black",     "schectel");
g.addEdge(null, "black",     "tgs");
g.addEdge(null, "black",   "roseland");


var renderer = new dagreD3.Renderer();
renderer.run(g, d3.select("svg g"))

