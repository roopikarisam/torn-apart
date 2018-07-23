import $ from "jquery";
import updateTexts from "./update-texts";
import contracts from "./contracts";
import districts from "./districts";
import beds from "./beds";
import explorer from "./explorer";
import galaxy from "./galaxy";
import lines from "./lines";
import shame from "./shame";
import clearIntervals from "./clear-intervals";
import { mapZoomDisable } from "./utils";

export default function (viz, map){
  $("#navbarList").collapse("hide");
  clearIntervals(); // kill all timed functions like banned viz.
  mapZoomDisable(map); // disable zoom by default.
  $(".viz-hide").hide(); // hide all the vizualizations.
  $("#tooltip").hide(); // hide the tooltip.
  switch (viz) {
  case "shame":
    shame(map);
    updateTexts();
    break;
  case "galaxy":
    galaxy(map);
    updateTexts();
    break;
  case "explorer":
    explorer(map);
    updateTexts();
    break;
  case "contracts":
    contracts(map);
    updateTexts();
    break;
  case "lines":
    lines(map);
    updateTexts();
    break;
  case "districts":
    districts(map);
    updateTexts();
    break;
  case "beds":
    beds(map);
    updateTexts();
    break;
  }
}

