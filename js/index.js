// d3.graphScroll()
//     .sections(d3.selectAll('#sections > div'))
//     .on('active', function(i){ console.log(i + 'th section active') })

var oldWidth = 0;
var rural_color = "#00835D";
var urban_color = "#16343E";

function render() {
  if (oldWidth == innerWidth) return
  oldWidth = innerWidth

  var width = height = d3.select('#graph').node().offsetWidth
  var r = 40


  if (innerWidth <= 925){
    width = innerWidth
    height = innerHeight*.7
  }

  //Define map projection
  var us_projection = d3.geoAlbersUsa()
             .translate([width/2, height/2])
             .scale([500]);

  var ga_projection = d3.geoTransverseMercator()
      .rotate([83.2, -32.7])
      .translate([width/2, height/2])
      .scale([5000]);

  var oconee_projection = d3.geoTransverseMercator()
      .rotate([83.44, -33.84])
      .translate([width/2, height/2])
      .scale([70000]);

  var blk_projection = d3.geoTransverseMercator()
      .rotate([83.39, -33.855])
      .translate([width/2, height/2])
      .scale([240000]);

  //Define path generator
  var us_path = d3.geoPath()
           .projection(us_projection);

  var ga_path = d3.geoPath()
            .projection(ga_projection);

  var oconee_path = d3.geoPath()
            .projection(oconee_projection);

  var blk_path = d3.geoPath()
            .projection(blk_projection);

  //Create SVG element
  var svg = d3.select("#graph").html('')
        .append("svg")
        .attr("width", width)
        .attr("height", height);

  var svg = d3.select('#graph').html('')
    .append('svg')
      .attrs({width: width, height: height})

    //Create SVG element
  var svg = d3.select("#graph").html('')
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
  d3.queue()
  .defer(d3.json, "data/counties-10.json")
  .defer(d3.json, "data/ga_tract_v02.json")
  .defer(d3.json, "data/oconee_blk_topojson.json")
  .defer(d3.csv, "data/ga_tract_rurality.csv")
  .await(function(error, json1, json2, json4, csv1) {

    if (error) throw error;
    
    // Add states and counties
    var counties = topojson.feature(json1, json1.objects.counties).features;
    counties = counties.filter(function(d) { return d.id.slice(0,2) == "13"});
    var states = topojson.feature(json1, json1.objects.states).features;

    svg.selectAll(".states")
       .data(states)
       .enter()
       .append("path")
       .attr("class", "states")
       .attr("d", us_path)
       .attr("stroke", "white")
       .attr("fill", fill_colors[0])
       .attr("stroke-width", 1);

    svg.selectAll(".counties")
       .data(counties)
       .enter()
       .append("path")
       .attr("class", "counties")
       .attr("d", ga_path)
       .attr("stroke", "white")
       .attr("fill", "none")
       .attr("stroke-width", 2)
       .attr("opacity", 0);


    // Add in tracts
    var tracts = topojson.feature(json2, json2.objects.tl_2018_13_tract).features;
    tracts = tracts.filter(function(d) { return d.properties.COUNTYFP == "219"; });

    for (let i = 0; i < tracts.length; i++) {
      let match = csv1.filter((d) => d.geoid == tracts[i].properties.GEOID);
      if (match.length > 0) {
        tracts[i].properties["rural_fhfa"] = +match[0]["rural_fhfa"];
        tracts[i].properties["rural_cbsa_2013"] = +match[0]["rural_cbsa_2013"];
      }
    }

    svg.selectAll(".tracts")
       .data(tracts)
       .enter()
       .append("path")
       .attr("class", "tracts")
       .attr("d", oconee_path)
       .attr("stroke", "white")
       .attr("fill", "none")
       .attr("stroke-width", 3)
       .attr("opacity", 0);


    console.log("json4 ", json4);
    // Add in blocks
    var blks = topojson.feature(json4, json4.objects.oconee_blk_geojson).features;

    // Filter to the tract
    blks = blks.filter(function(d) { return d.properties.COUNTYFP10 == "219"; });
    // blks = blks.filter(function(d) { return d.properties.TRACTCE10 == "030400"; });

    svg.selectAll(".blks")
       .data(blks)
       .enter()
       .append("path")
       .attr("class", "blks")
       .attr("d", ga_path)
       .attr("stroke", "white")
       .attr("fill", "none")
       .attr("stroke-width", 1)
       .attr("opacity", 0);

  });

  //var fill_colors = ["#16343E", "#456E66", "#74A88D", "#A3E2B5"];
  var fill_colors = ["#753984", "#234FBF", "#E74F2A", "#259299"];

  var gs = d3.graphScroll()
      .container(d3.select('#container'))
      .graph(d3.selectAll('#container #graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('#container #sections > div'))
      .on('active', function(i){
        console.log(i, "th");

        // USA
        if (i == 0) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("d", us_path);

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", us_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", us_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", us_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

        }

        // Georgia
        if (i == 1) {

          // Add zoom and opacity
          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("d", ga_path);

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", ga_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[1]);

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", ga_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", ga_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

        }

        // oconee
        if (i == 2) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("d", oconee_path);

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[1]);

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[2]);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);
        }

        // Blocks in a tract
        if (i == 3) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("d", blk_path);

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", blk_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[1]);

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", blk_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[2]);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", blk_path)
            .transition()
            .duration(500)
            .attr("opacity", function(d) {
              if (d.properties.TRACTCE10 == "030400") {
                return 1;
              }
              return 0;
            })
            .attr("fill", function(d) {
              if (d.properties.TRACTCE10 == "030400") {
                return fill_colors[3];
              }
              return fill_colors[2];
            });

        }

        // Zoom to Oconee
        if (i == 4) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("d", oconee_path);

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[1]);

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", fill_colors[2]);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

        }

        // CBSA
        if (i == 5) {

          d3.selectAll('.counties')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", function(d) {
              if (d.id == "13219") {
                return urban_color;
              }
              else {
                return fill_colors[1];
              }
            });

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .attr("fill", fill_colors[2]);

        }

        // FHFA
        if (i == 6) {

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", function(d) {
              if (d.properties.rural_fhfa == 1) {
                return rural_color;
              }
              else {
                return urban_color;
              }
            })


          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 0);

        }

        // Census
        if (i == 7) {

          d3.selectAll('.tracts')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .attr("fill", fill_colors[2]);

          d3.selectAll('.blks')
            .transition()
            .duration(500)
            .attr("d", oconee_path)
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .attr("fill", function(d) {
              if (d.properties.UR10 == "R") {
                return rural_color;
              }
              return urban_color;
            });

        }

      })

}

render()
d3.select(window).on('resize', render)

