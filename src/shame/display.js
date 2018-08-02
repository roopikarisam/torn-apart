import { green, purple } from "../constants";
import { selection} from "d3-selection";
import $ from "jquery";
import initChart from "../charts/init";
import buildPieChart from "./pie-chart";
import buildLexicalFog from "./lexical-fog";
import * as colorscale from"d3-scale-chromatic";

export default function() {

  // this method is supposed to allow me to move d3 layers to the front. Not
  // sure it's working.
  selection.prototype.moveToFront = function() {  
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  
  // Set some constants.
  //const margins = {top: 10, bottom: 32, left: 32, right: rem};
  // Each chart will be 200px high. This seemed right for mobile
  const svgHeight = 200;
  // The width is calculated on the fly by measuring how wide this div is.
  // it only catches this width because it is already showing the div.
  const svgWidth = $("#pie-chart-div").width();
  // Or what if we want something to be a third of the container wide?
  const thirdWidth = Math.floor(svgWidth * 2 / 3);

  // Create the "dataObjects."
  // These create a new object for each visualization with certain expected
  // properties, like an id, an array that will hold the data, etc.
  
  const lexicalFog = {data: [ ], margins: { top: 0, bottom: 0, left: 0, right: 0},
    id: "#lexical-fog-svg", svgWidth: svgWidth 
  };
  
  const gender = { data: [
    // As you can see, here data is going to be an array of objects.
    {group: "FEM", taName: "female", count: 184, color: purple}, 
    {group: "NON-FEM", taName: "non-female", count: 940, color: green}
  ], 
  margins: { top: 0, bottom: 0, left: 0, right: 0},
  id: "#gender-svg", number: "count", svgWidth: thirdWidth 
  };
  
  const ethnicity = {data: [
    {group: "BA", taName: "Black-American", ecount: 61, color: colorscale.schemeSet2[0]},
    {group: "HA", taName: "Hispanic-American", ecount: 57, color: colorscale.schemeSet2[2]},
    {group: "SAAIA", taName: "Subcontinent-Asian/Asian-Indian-American", ecount: 36, color:  colorscale.schemeSet2[1]},
    {group: "AP", taName: "Asian-Pacific", ecount: 31, color: colorscale.schemeSet2[3]},
    {group: "NA", taName: "Native-American", ecount: 21, color: colorscale.schemeSet2[4]} , 
    {group: "OA", taName: "Other-Minority", ecount: 19, color: colorscale.schemeSet2[5]
    },
    {group: "AN", taName: "Alaskan-Native", ecount: 12, color: colorscale.schemeSet2[6]}
  ],  margins: { top: 0, bottom: 0, left: 0, right: 0}, 
  id: "#ethnicity-svg", number: "ecount", svgWidth: thirdWidth 
  };

  const intersectionality = { data: [
    {group: "INT", taName: "intersectional", iCount: 77, color: purple}, 
    {group: "NON-INT", taName: "non-intersectional", iCount: 344, color: green}
  ], 
  margins: { top: 0, bottom: 0, left: 0, right: 0},
  id: "#intersectionality-svg", number: "iCount", svgWidth: thirdWidth 
  };

  // Initialize the charts where appropriate.
  [gender, ethnicity, intersectionality, lexicalFog].forEach(chart => initChart(chart, svgWidth, svgHeight));
  
  //build the word cloud
  buildLexicalFog(lexicalFog);

  // now build a pie chart for the three pie charts
  [gender, ethnicity, intersectionality].forEach(chart => buildPieChart(chart)); 


}