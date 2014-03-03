// Javascript Custom to theme

// DOM Ready

// menubar for small screen devices
$(function() {
	$('#menubar .open-switch').click(function() {
		if($('#menubar').hasClass('open')) {
			$('#menubar').animate({
				top: -120
			}, function() { 
				$('#menubar').removeClass('open');
			});	
		} else {
			$('#menubar').animate({
				top: 0
			}, function() { 
				$('#menubar').addClass('open');
			});
		}
	});
});	


// detect small mobile device to implement CSS changes
$(function() {
	
	//Check for touch-screen mobile devices and show hidden content
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
 		$('.project-meta').css('opacity', '1');
 		};
 		
});


$(function() { 
    createHover();
});
function createHover() {
    $(".project-item").unbind('mouseenter').unbind('mouseleave'); // reset the hover to prevent doubling
    $(".project-item").bind("mouseenter",function() { // create hover
        $(".thumb-title", this).fadeTo("slow", 1); // Sets the opacity to 100% on hover   
}).bind("mouseleave",function(){   
        $(".thumb-title", this).fadeTo("slow", 0); // Sets the opacity back to 0 on mouseout
});
   
}
