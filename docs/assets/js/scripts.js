/* global DCOs, detention, crossing */
// jQuery available as $
// Leaflet available as L
// Turf available as turf
// Markdown-it available as markdownit
// d3 available as d3

// Fire up markdown
const md = markdownit({html: true}).use(markdownitFootnote);

// Intialize the map as the variable "map"
// This also hides the + / - zoom controls.
const map = L.map("mapdiv", { 
  center: [0,0], 
  zoom: 5, 
  zoomSnap: 0.25, 
  zoomControl: false 
});
map.fitBounds([[24.396, -124.848974, 24.396308], [49.384, -66.885444]]);
const mapnik = L.tileLayer.provider("OpenStreetMap.Mapnik");
const esri = L.tileLayer.provider("Esri.WorldImagery");
const baseLayers = {
  "OSM Mapnik": mapnik,
  "ESRI World": esri
};
mapnik.addTo(map);
L.control.layers(baseLayers).addTo(map);

// Angrily show all the official ICE detention facilities they also map
// OfficialICEDCs["features"].forEach( dc => {
//   L.marker([dc["lat"], dc["lon"]])
//     .bindPopup(dc["popup"])
//     .addTo(map);
// });

// Fire up the d3/svg engine.
// These are only really messed with when calling reset();
const svg = d3.select(map.getPanes().overlayPane).append("svg").attr("width", $( window ).width()).attr("height", $( window ).height()),
  g = svg.append("g").attr("class", "leaflet-zoom-hide");
  // const blackSites = [];

d3.json("web-data/blacksites.json", (error, collection) => {
  if (error) throw error;
  // d3 is very clever w/ geojson (paths and transforms), but if we want
  // to simply take latlngs and make them into points we can 
  // subsequently build on, we have to get a bit craftier.
  const blackSites = [{}, {}, {}, {}];
  // collection.features.forEach(feature => {
  //   feature.LatLng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
  //   for(let i = 1; i <= feature.properties.count; i++) {
  //     blackSites.push({dco: feature.properties.dco, latLng: feature.LatLng});
  //   }
  // });
  // console.log(blackSites);
  const simulation = d3.forceSimulation(blackSites)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter($(window).width / 2, $(window).height / 2))
    .on("tick", ticked);


  // function ticked() {
  //   var u = d3.select('svg')
  //     .selectAll('circle')
  //     .data(blackSites)

  //   u.enter()
  //     .append('circle')
  //     .attr('r', 5)
  //     .merge(u)
  //     .attr('cx', function(d) {
  //       return d.x
  //     })
  //     .attr('cy', function(d) {
  //       return d.y
  //     })

  //   u.exit().remove()
  // }
  
  // collection.features.forEach(feature => {
  //   console.log("now drawing for", feature.properties.dco);
  //   console.log("should be this many nodes:", feature.properties.count);
  //   feature.LatLng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
  //   const nodes = d3.range(feature.properties.count).map(() => { return {type: 1}; });
  //   const dots = g.selectAll("circle")
  //     .data(nodes)
  //     .enter().append("circle")
  //     .classed(feature.properties.dco, true)
  //     .attr("r", 5)
  //     .attr("fill", "#333");
  //   const simulation = d3.forceSimulation(nodes)
  //     .force("charge", d3.forceCollide().radius(10))
  //     .force("r", d3.forceRadial(20, map.latLngToLayerPoint(feature.LatLng).x, map.latLngToLayerPoint(feature.LatLng).y ))
  //     .on("tick", ticked);

  //   function ticked() {
  //     dots.attr("cx", d => d.x)
  //       .attr("cy", d => d.y);
  //   }
  // });
  // const features = g.selectAll("text")
  //   .data(collection.features)
  //   .enter().append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "18")
  //   .attr("fill", "#333")
  //   .attr("id", d => d.properties.dco)
  //   // .attr("opacity", 0.0)
  //   .classed("dco", true)
  //   .text(d => d.properties.dco);

  // const 
  //   console.log(nodes.length);
  //   console.log(feature.properties.dco);

  // });

  // map.on("viewreset", reset());
  // map.on("zoomend", reset);
  // reset();

  // function reset() {
  //   features.attr("transform", d => `translate(${map.latLngToLayerPoint(d.LatLng).x},${map.latLngToLayerPoint(d.LatLng).y})`);
  // }
});

d3.csv("web-data/ice-facs_geocoded.csv", null,
  list => {
  // iterate over the list object
    list.forEach(place => {
      let circleStyle;
      if (place["Type.Detailed"] === "JUVENILE"){
        circleStyle = {
          color: "#0000dd",
          fillColor: "#0000dd",
          opacity: 0.4,
          fillOpacity: 0.2
        };
      } else {
        circleStyle = {
          color: "#0000dd",
          fillColor: "#0000dd",
          fillOpacity: 0.1,
          opacity: 0.1,
          weight: 0,
          radius: 4
        };
      }
      if(!isNaN(place.lat)){
        const lat = +place.lat;
        const lng = +place.lon;
        L.circleMarker([lat, lng], circleStyle
        )//.addTo(map);//.bindPopup(`<h3><a href="${place.lien}">${place.nom}</a></h3>`).addTo(map);
      }
      // Alternatively, we can use icons from font-awesome.
      // L.marker([place.latitude, place.longitude],
      //   { icon: L.divIcon(
      //     { html: `<i style="color: ${color}" class="fa fa-${icon}"></i>`, iconSize: [30, 30] }
      //   )}
      // ).bindTooltip(place.nom).addTo(map);
    });
  });
 
// Now add the other layers.
[[crossing, "#00dd00"], [detention, "#dd0000"]].forEach( geojson => {
  let popup;
  L.geoJSON(geojson[0], {
    pointToLayer(f, l) {
      if (geojson[0] === detention) {
        const latlng = `${l.lat}${l.lng}`;popup = `<div class="row"><div class="col-6"><h4>${f.properties["Name"]}</h4></div><div class="col-6"><img class="img-fluid" alt="${f.properties["Name"]} satellite photo" src="imgs/sat-${latlng}.png"></div></div>`;
      } else {
        popup = `<h4>${f.properties["Name"]}</h4>`;
      }
      return L.circleMarker(l, {fillColor: geojson[1], color: geojson[1]}).bindPopup(popup);
    }
  })//.addTo(map);
});

//////// TEXTUAL CONTENT
// 
// Use jQuery & Markdown to manipulate the html elements.
$("#card-header-text").html("<strong>Frontera Crisis</strong>");

// on load…
fillCard("welcome");

$(".nav-tab").click(function(){
  $(".nav-tab").removeClass("active");
  $(this).addClass("active");
  fillCard($(this).data("file"));
});

function fillCard(mdFile, divId = "nav-tabs-body"){
  $.ajax({ url: `markdown-files/${mdFile}.md`,
    success(markdown) {
      $(`#${divId}`).html(md.render(markdown));
    }
  });
}
