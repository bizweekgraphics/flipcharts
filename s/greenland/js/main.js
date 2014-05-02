$(document).ready(function() {

	var slideScale = d3.scale.linear()
		.domain([1979,2013])
		.range([-5.5, 90])

	$('.year-slide').on('input', function(event) {
		var year = this.value
		var yearText = $('#slide-text')
		yearText.text(year)
		d3.select('#slide-text')
			.style('left', function() {
				return slideScale(year) + '%'
			})

		updateProjection(year)
	})

	var interval;

	$('#animation').click(function() {
		$('#animation').css('display', 'none')
		$('#stop-animation').css('display', 'block')
		var year = $('#slide-text').text()
		interval = setInterval(function() {
			if(year === 2014){
				year = 1979
			}
			updateProjection(year)

			var yearText = $('#slide-text')
			yearText.text(year)
			d3.select('#slide-text')
				.style('left', function() {
					return slideScale(year) + '%'
				})
			document.querySelector('input[type=range]').value = year;
			$('#slide-text').text(year++)
		}, 1)
	})

	$('#stop-animation').click(function() {
		clearInterval(interval)
		$('#stop-animation').css('display', 'none')
		$('#animation').css('display', 'block')
	})


	appendMap(1979)
})




$(window).on('resize', function() {
	var chart = $('svg')
	var container = chart.parent()
	var targetWidth = container.width();
	if(Math.round(targetWidth / aspect) < window.innerHeight){
		chart.attr('width', targetWidth);
		chart.attr('height', Math.round(targetWidth / aspect));
	}
}).trigger('resize')


