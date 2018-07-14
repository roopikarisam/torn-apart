import $ from "jquery";
import trapLegend from "./trap-legend";
import trapLayer from "./trap-layer";

export default function(map){
  map.dragging.enable();
  $(".leaflet-control-zoom").show();
  map.flyToBounds([[34.1638, -97.1375], [25.8439, -118.608244]]);
  $(map.getPanes().overlayPane).append("<svg id='d3-trap-svg'></svg>");
  const layer = trapLayer(map);
  layer.addTo(map);
  trapLegend();
}
