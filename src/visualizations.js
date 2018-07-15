import $ from "jquery";
import initMap from "./map-init";
import showViz from "./show-viz";

const map = initMap("visualizations-mapdiv");
const theViz = window.location.href.replace(/^.*#/, "");
let timer;

showViz(theViz, map);
// jQuery behaviors:
// to hide the charts when we click on the navbar in mobile
$(".navbar-toggler").click(() => $("#charts-div").hide());
// make the legend click-hideable.
$("#legend").click(function(){ $(this).hide(); });
// highlight the proper visualization
$("[href='/torn-apart/visualizations.html#" + theViz + "']").addClass("active");
$(".viz-button").click(function() {
  clearTimeout(timer);
  $(".viz-button").removeClass("active");
  $( this ).addClass("active");
  showViz($( this ).attr("href").replace(/^.*#/, ""), map);
});

