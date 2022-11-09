var oldWidth = 0;

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

  //Define path generator
  var us_path = d3.geoPath()
           .projection(us_projection);

  var svg = d3.select("#graph").html('')
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
  d3.json("https://rwjf-public.s3.amazonaws.com/counties-10.json")
  .then(function(data) {
    
    // Add states
    var states = topojson.feature(data, data.objects.states).features;

    svg.selectAll(".states")
       .data(states)
       .enter()
       .append("path")
       .attr("class", "states")
       .attr("d", us_path)
       .attr("stroke", "white")
       .attr("fill", "pink")
       .attr("stroke-width", 1);

  });


  var gs = d3.graphScroll()
      .container(d3.select('.scrollytell__container'))
      .graph(d3.selectAll('#graph'))
      .eventId('uniqueId1')  // namespace for scroll and resize events
      .sections(d3.selectAll('.data-section'))
      .on('active', function(i){
        console.log(i, "th");

        if (i == 0) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("fill", "pink");
        }

        if (i == 1) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("fill", "purple");
        }

        if (i == 2) {

          d3.selectAll('.states')
            .transition()
            .duration(500)
            .attr("fill", "red");
        }

      })

}

render()
d3.select(window).on('resize', render)

