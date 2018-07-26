<!DOCTYPE html>
<head>
<meta charset="utf-8">
<style>

.links line {
  stroke: #aaa;
  stroke-width: 3px;
}

.nodes rect {
  pointer-events: all;
  stroke: black;
  stroke-width: 3px;
}


</style>
</head>

<body>
<div id="mainDiv" style="width: 1366px; height: 768px; background-color: white;">

<script src="https://d3js.org/d3.v4.min.js"></script>

<script>

var height = 768;
var width = 1366;

var zoom = d3.zoom()
    .scaleExtent([0.1, 8])
    .on("zoom", zoomed);

var svg = d3.select("#mainDiv"). append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .append("g")
    .attr("id", "topG");

zoom.scaleTo(d3.select("svg"),0.35);

window.onwheel = function(){return false;}

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }))
    // changes spacing of viz via node repulsion
    .force("charge", d3.forceManyBody().strength(-1500))
    .force("center", d3.forceCenter(width / 1, height / 1));

d3.json("graph.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
    .attr("class", "links")
    .call(d3.zoomTransform)
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  var node = svg.append("g")
    .attr("class", "nodes")
    .call(d3.zoomTransform)
    .selectAll("rect")
    .data(graph.nodes)
    .enter().append("rect")
    .attr("width", function(d) {width = 30;
        //makes width of node a function of category
        if(d.category == "suboffice") width = 480;
        if(d.category == "product category") width = 180;
        if(d.category == "product") width = 120;
        if(d.category == "company") width = 60;
        return width 
        }) 
    .attr("height", function(d) {height = 30;
        //makes height of node a function of category
        if(d.category == "suboffice") height = 480;
        if(d.category == "product category") height = 180;
        if(d.category == "product") height = 120;
        if(d.category == "company") height = 60;
        return height 
        }) 
      //colors nodes by category
     .style("fill", function(d) {color = "black";
      if(d.category == "suboffice") color = "green";
      if(d.category == "product category") color = "purple";
      if(d.category == "product") color = "orange";
      if(d.category == "company") color = "pink";
      return color
      })
      .on('mousedown', function() { d3.event.stopPropagation(); })

      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

//change speed of viz cooling for animated murderboard effect
  simulation.alpha (.8);
  simulation.alphaTarget(0);
  simulation.alphaDecay([0]); 

var text = svg.append("g").attr("class", "labels").selectAll("g")
  .data(graph.nodes)
  .enter().append("g");

text.append("text")
  .attr("x", 14)
  .attr("y", ".31em")
  .style("font-family", "sans-serif")
  .style("font-size", "2em")
  .text(function(d) { return d.name; });


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });

    text

        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }
});

//adds sticky dragging

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = d.x;
  d.fy = d.y;
}

function zoomed()
{
  var topG = d3.select("#topG");
  topG.attr("transform", "translate(" + d3.event.transform.x+","+d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
}

</script>
</div>
</body>
</html>