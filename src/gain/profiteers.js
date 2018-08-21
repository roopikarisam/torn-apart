import { select } from "d3-selection";
import { rem, green, orange, pink, lime, beige, tan } from "../constants";
// import gainBarsLegend from "./bars-legend";
// import getDecoration from "../get-decoration";
import { bigMoneyFormat } from "../utils";
import Data from "../../data/gain/minority-data.json";

export default function(){
  const list = select("#gain-profiteers-list");
  const colors = [green, orange, pink, lime, beige, tan];
  const racialCats = Data.minorityCategories.map( d => d );
  racialCats.pop();

  list.selectAll("div")
    .data(racialCats)
    .enter().append("div")
    .attr("class", "d-flex")
    .html((d,i) => {
      const profiteer = Data.biggestProfiteers[d];
      // const company = getDecoration(profiteer.duns);
      return `<div class="mr-2"><svg width="${rem}" height="${rem}">
          <rect width="${rem}" height="${rem}" 
          transform="translate(0,${0})" fill="${colors[i]}">
        </svg></div>
        <div>
          <h4>
            <small><span data-i18n="ta-${d}"></span>:</small>
            ${profiteer.duns}, <strong>$${bigMoneyFormat(profiteer.value)}</strong>
          </h4>
        </div>`;
    });

}
