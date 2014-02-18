var mouseX, scrubX;
var gamma, beta, alpha;

var width = $(document).width(),
    height = $(document).height();

var mouseScrub = d3.scale.linear()
    .domain([0,$(document).width()])
    .range([0, 1])
    .clamp(true);

var tiltScrub = d3.scale.linear()
    .domain([-4,4])
    .range([0, 1])
    .clamp(true);

d3.tsv("data/cindy.tsv", function(error, data) {
  
  //coercing from strings to numbers
  data.forEach(function(d, i) {
    $.each(d, function(j, value) {
      data[i][j] = +value;
    })
  });
  
  console.log(data);
  
  $.each(data[0], function(i, d) {
    var slide = d3.select("#container").append("div")
        .classed("slide", true)
        .attr("id", i)
        .style("background-image", "url(img/dogs/"+i+".jpg)")
      .append("div")
        .classed("slide-text", true);
    
    slide.append("h2").text(i);
    slide.append("h3").text(d);
  });
    
  d3.select("body").on("mousemove", function() {
  
    mouseX = d3.mouse(d3.select("body").node())[0];
    scrubX = mouseScrub(mouseX);
    changeSlide(scrubX);
  
  });
  

 
  if (window.DeviceOrientationEvent) {

    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      gamma 	= eventData.gamma;	// - left-to-right + (degrees)
      beta 	  = eventData.beta;	  // - back-to-front + (degrees)
      alpha 	= eventData.alpha	  // compass direction (degrees)
            
      if(gamma == null || beta == null || alpha == null) {
        // desktopMode();
      } else {
        
        scrubX = tiltScrub(gamma);
        changeSlide(scrubX);
        
      }
    }, false);
  
  } 
  else {
    // desktopMode();
  }
  
  
});

function changeSlide(scrubX) {
  //console.log($(document).width()*scrubX);
  console.log("translate("+(width*scrubX)+",0)");
  //console.log($(document).width()*scrubX);
  /*
  d3.select("#Terriers").style("opacity", scrubX);
  d3.select("#Dachshunds").style("opacity", 1-scrubX);
  */
  
  d3.select("#Terriers").style("-webkit-transform", "translate("+(width*scrubX)+"px,0)");
  d3.select("#Dachshunds").style("-webkit-transform", "translate("+(-width+width*scrubX)+"px,0)");
  
}