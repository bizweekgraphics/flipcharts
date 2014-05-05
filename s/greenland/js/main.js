$(document).ready(function() {

	//initializing jquerynouislider
	var toolTip = $.Link({
		target: '-tooltip-'
	});

	$("#slider").noUiSlider({
		start: 1979,
		step: 1,
		range: {
			'min': 1979,
			'max': 2013
		},
		serialization: {
		lower: [ toolTip ],
		format: {
			decimals: 0
		}
	}
	});

	$("#slider").on({
		slide: function() {
			year = $('#slider').val()
			updateProjection(year)
		}
	})

	//ensures that svg will fit inside the window
	if(window.innerWidth > 480) {
		$('svg').css('max-height', window.innerHeight - $('.title').height())	
	}

	var interval;

	//sets listeners for animation button
	$('#animation').click(function() {
		$('#animation').css('display', 'none')
		$('#stop-animation').css('display', 'block')
		var year = $('#slider').val()
		interval = setInterval(function() {
			if(year === 2014){
				year = 1979
			}
			updateProjection(year)
			$('#slider').val(year++)

		}, 1)
	})

	//stops animation and kills setInterval
	$('#stop-animation').click(function() {
		clearInterval(interval)
		$('#stop-animation').css('display', 'none')
		$('#animation').css('display', 'block')
	})

	appendMap(1979)
})



