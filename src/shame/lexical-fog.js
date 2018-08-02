
import Data from "../../data/tempWordCloudData.csv";
import { select } from "d3-selection";
import * as cloud from "d3-cloud";
import draw from "./draw-words";


export default function(chart){


  if (select("#lexical-fog-svg").selectAll("text").empty())
  {
    const width = chart.width;
    const height = chart.height;

   
    select("#lexical-fog-svg")
      .attr("class", "wordcloud")
      .append("g")
    // without the transform, words would get cutoff to the left and top, they would
    // appear outside of the SVG area
      .attr("transform", "translate("+ width/2 + "," + height/2 + ")")
      .attr("id", "wordcloud-g");

    cloud().size([width, height-height*0.2])
      .words(Data)
      .text(function(d) { return d.name; })
      .rotate(0)
      .fontSize(function(d) {return (Math.ceil(Math.pow(d.total_value, 0.26))/4 +6); })
      .padding(1)
      .font("Impact")
      .on("end", draw)
      .start();

 
    // Below is Alex Ahmed's code, which she wrote before she knew we were using Moacir's tooltips
  // //Hovering handlers
  // function handleMouseOver(d){ //don't need to be redefined, because we need visual consistency
  //   //Lighten the text of the wordcloud
  //   select(this).style("opacity",0.7);
  //   //Show tooltip
  //   var base = d.y - d.size; //Calculate position of text
  //
  //   //Position and populate the text of the tooltip
  //   tip.append("text")
  //     .attr("id","cloud_tooltip_text")
  //     .attr("x",d.x) //position x - this could be static
  //     .attr("y",base) //position y
  //     .attr("text-anchor", "middle")
  //     .style("font-size","1.25rem")
  //     .style("fill", colour[5-d.years])
  //     .text("$" + format(",")(Math.round(d.total_value))); //Format the text as $
  //
  //   //Create and position the bounding box behind the text
  //   tip.append("rect")
  //     .attr("id","cloud_tooltip_rect")
  //     .attr("width",select("#cloud_tooltip_text").node().getBBox().width)
  //     .attr("height",select("#cloud_tooltip_text").node().getBBox().height)
  //     .attr("x",select("#cloud_tooltip_text").node().getBBox().x)
  //     .attr("y",select("#cloud_tooltip_text").node().getBBox().y)
  //     .attr("fill","black")
  //     .style("opacity",0.3);
  // }
  // function handleMouseOut() {
  //   select(this)
  //     .style("opacity",1);
  //
  //   //Remove tooltip
  //   select("#cloud_tooltip_text").remove(); //get rid of tooltip text
  //   select("#cloud_tooltip_rect").remove(); //get rid of the tooltip rect
  // }
  // //Create a tooltip - Greg: perhaps this can be where we create the single text box
  // var tip = svg.append("g")
  //   .attr("id","cloud_tooltip")
  //   .attr("position","absolute");
  }
}