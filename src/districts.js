import $ from "jquery";
import districtsDraw from "./districts/draw";
import districtsLegend from "./districts/legend";
import { mapZoomEnable } from "./utils";
import { lower48Bounds } from "./constants";

export default function(map){
  mapZoomEnable(map);
  districtsDraw(map);
  $("#d3-districts-svg").show();
  map.flyToBounds(lower48Bounds);
  districtsLegend();
}

