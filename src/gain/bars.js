import $ from "jquery";
import _ from "lodash";
import { select, selectAll } from "d3-selection";
import { stack } from "d3-shape";
import { axisLeft, axisBottom } from "d3-axis";
import { scaleBand, scaleOrdinal, scaleLinear } from "d3-scale";
import Tip from "d3-tip";
import { bigMoneyFormat } from "../utils";
import { green, orange, pink, lime, beige, tan, lavender } from "../constants";
// import gainBarsLegend from "./bars-legend";
import Data from "../../data/gain/minority-data.json";

export default function(width, height){
  const margins = { bottom: 35, left: 70, right: 15 };
  const keys = Data.minorityCategories;
  const countData = [{type: "Minority"}, {type:"Woman"}];
  _.each(Data.minorityCategories, cat => {
    countData[0][cat] = Data.minorityCompanies[cat].count;
    countData[1][cat] = Data.intersectionalCompanies[cat].count;
  });
  const valueData = [{type: "Minority"}, {type:"Woman"}];
  _.each(Data.minorityCategories, cat => {
    valueData[0][cat] = Data.minorityCompanies[cat].value;
    valueData[1][cat] = Data.intersectionalCompanies[cat].value;
  });
  keys.push("female");
  countData[1].female = Data.minorityCompanies.female.count;
  valueData[1].female = Data.minorityCompanies.female.value;

  const svg = select("#gain-bars-svg")
    .attr("height", height)
    .attr("width", width);
  const g = svg.append("g")
    .attr("transform", `translate(${margins.left},0)`);
  const tip = Tip()
    .attr("class", "tooltip")
    .offset([-10, 0])
    .html(tooltip);
  svg.call(tip);


  const y = scaleBand()
    .rangeRound([0, height/2 - margins.bottom])
    .domain(["Minority", "Woman"])
    .paddingInner(0.05)
    .align(0.1);
  const countX = scaleLinear()
    .range([0, width - margins.left - margins.right])
    .domain([0, 0.4 * Data.totalParents]);
  const valueX = scaleLinear()
    .range([0, width - margins.left - margins.right])
    .domain([0, 0.4 * Data.totalValue]);
  const z = scaleOrdinal()
    .range([green, orange, pink, lime, beige, tan, lavender])
    .domain(keys);

  g.append("g")
    .selectAll("g")
    .data(stack().keys(Data.minorityCategories)(countData))
    .enter().append("g")
    .attr("fill", d => z(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("y", d => y(d.data.type))
    .attr("x", d => countX(d[0]))
    .attr("height", y.bandwidth())
    .attr("width", d => {
      if(_.isNaN(countX(d[1]) - countX(d[0]))){
        return 0;
      } else {
        return countX(d[1]) - countX(d[0]);
      }
    })
    .on("mouseover", function(d){
      tip.show(d, this);
    })
    .on("mouseout", function(d){
      tip.hide(d, this);
    });


  g.append("g")
    .attr("class", "axis y-axis")
    .call(axisLeft(y));

  g.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height/2 - margins.bottom})`)
    .call(axisBottom(countX));

  const countText = g.append("text")
    .attr("transform", `translate(${width/2},${height/2 - margins.bottom + 30})`)
    .attr("data-i18n", "ta-companies")
    .text($.i18n("ta-companies"));

  countText.style("text-anchor", "middle");

  const value = g.append("g")
    .attr("transform", `translate(0, ${height/2 + 5})`);
    
  value.selectAll("g")
    .data(stack().keys(Data.minorityCategories)(valueData))
    .enter().append("g")
    // .each(d => console.log(d))
    .attr("fill", d => z(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("y", d => y(d.data.type))
    .attr("x", d => valueX(d[0]))
    .attr("height", y.bandwidth())
    .attr("width", d => {
      if(_.isNaN(valueX(d[1]) - valueX(d[0]))){
        return 0;
      } else {
        return valueX(d[1]) - valueX(d[0]);
      }
    });

  value.append("g")
    .attr("class", "axis y-axis")
    .call(axisLeft(y));

  value.append("g")
    .attr("class", "axis gain-value-axis")
    .attr("transform", `translate(0,${height/2 - margins.bottom})`)
    .call(axisBottom(valueX).ticks(null, "$s"));

  const valueText = value.append("text")
    .attr("transform", `translate(${width/2},${height/2 - margins.bottom + 30})`)
    .attr("data-i18n", "ta-total-value-of-awards-since-2014")
    .text($.i18n("ta-total-value-of-awards-since-2014"));
  
  valueText.style("text-anchor", "middle");

  const babyHeight = 0.5 * (height/2 - margins.bottom);

  const babyY = scaleBand()
    .rangeRound([0, babyHeight])
    .domain(["Minority", "Woman"])
    .paddingInner(0.05)
    .align(0.1);

  const babyCountX = scaleLinear()
    .range([0, width - margins.left - margins.right - countX(0.3 * Data.totalParents) ])
    .domain([0, Data.totalParents ]);

  const babyValueX = scaleLinear()
    .range([0, width - margins.left - margins.right - valueX(0.3 * Data.totalValue)])
    .domain([0, Data.totalValue]);

  const babyCount = g.append("g")
    .attr("id", "baby-count")
    .attr("transform", `translate(${countX(0.3 * Data.totalParents)}, 0)`);

  const babyValue = value.append("g")
    .attr("id", "baby-value")
    .attr("transform", `translate(${valueX(0.3 * Data.totalValue)}, 0)`);
  
  babyCount.selectAll("g")
    .data(stack().keys(Data.minorityCategories)(countData))
    .enter().append("g")
    .attr("fill", d => z(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("y", d => babyY(d.data.type))
    .attr("x", d => babyCountX(d[0]))
    .attr("height", babyY.bandwidth())
    .attr("width", d => {
      if(_.isNaN(babyCountX(d[1]) - babyCountX(d[0]))){
        return 0;
      } else {
        return babyCountX(d[1]) - babyCountX(d[0]);
      }
    });

  babyCount.append("path")
    .attr("stroke", "black")
    .attr("d", `M ${babyCountX(Data.totalParents)},0 V ${ babyHeight }`);

  babyCount.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${ babyHeight })`)
    .call(axisBottom(babyCountX).ticks(5));

  babyCount.append("text")
    .attr("transform", `translate(${babyCountX(Data.totalParents) - 10}, 0)rotate(-90)`)
    .style("text-anchor", "end")
    .text(`${$.i18n("ta-total")}: ${Data.totalParents}`);

  babyValue.selectAll("g")
    .data(stack().keys(Data.minorityCategories)(valueData))
    .enter().append("g")
    .attr("fill", d => z(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("y", d => babyY(d.data.type))
    .attr("x", d => babyValueX(d[0]))
    .attr("height", babyY.bandwidth())
    .attr("width", d => {
      if(_.isNaN(babyValueX(d[1]) - babyValueX(d[0]))){
        return 0;
      } else {
        return babyValueX(d[1]) - babyValueX(d[0]);
      }
    });

  babyValue.append("g")
    .attr("class", "axis gain-value-axis")
    .attr("transform", `translate(0,${ babyHeight })`)
    .call(axisBottom(babyValueX).ticks(5, "$s"));

  babyValue.append("path")
    .attr("stroke", "black")
    .attr("d", `M ${babyValueX(Data.totalValue)},0 V ${ babyHeight }`);

  babyValue.append("text")
    .attr("transform", `translate(${babyValueX(Data.totalValue) - 10}, 0)rotate(-90)`)
    .style("text-anchor", "end")
    .text(`${$.i18n("ta-total")}: $${bigMoneyFormat(Data.totalValue)}`);

  // const babyValue = g.append("g");

  // gainBarsLegend(g, z);

  selectAll(".gain-value-axis")
    .selectAll("text")
    .text(function(){
      return select(this).text().replace(/G/, "B");
    });

  function tooltip(d){
    return `${$.i18n(`ta-${d}-owned-company`)}<br />
      <ul>
        <li>Blah</li>
      </ul>
      `;
  }

}

