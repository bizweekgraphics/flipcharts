var scrubProgress;
var gamma, beta, alpha;

var mouseScrub = d3.scale.linear()
    .domain([0,$(document).width()])
    .range([0, 1]);

var tiltScrub = d3.scale.linear()
    .domain([-4,4])
    .range([0, 1])
    .clamp(true);

var rank = d3.scale.linear()
    .domain([0,24])
    .range([$(document).height()-20, 20]);

d3.tsv("data/dogs.tsv", function(error, data) {
  
  //coercing from strings to numbers
  data.forEach(function(d, i) {
    $.each(d, function(j, value) {
      data[i][j] = +value;
    })
  });
  
  var scales = new Object();
  
  $.each(data[0], function(i, value) {
    scales[i] = d3.scale.linear()
      .domain([0,1])
      .range([data[0][i],data[1][i]]);
    
    if(i=="Year") {
      //
    } else {
      d3.select("#data").append("div").text(i).classed(i, true);
    }
  });
  
  d3.select("body").on("mousemove", function(d,i) {
  
    scrubProgress = d3.mouse(d3.select("body").node())[0];
  
    $.each(data[0], function(i, value) {
      
      if(i=="Year") {
        d3.select("#year").text(Math.round(scales[i](mouseScrub(scrubProgress))));
      } else {      
        d3.select("."+i)
          .style("top", rank(scales[i](mouseScrub(scrubProgress))) + "px" );
      }
    });
  
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
        
        $.each(data[0], function(i, value) {
      
          if(i=="Year") {
            d3.select("#year").text(Math.round(scales[i](tiltScrub(gamma))));
          } else {      
            d3.select("."+i)
              .style("top", rank(scales[i](tiltScrub(gamma))) + "px" );
          }
        });
        
      }
    }, false);
  
  } 
  else {
    desktopMode();
  }
  
});


