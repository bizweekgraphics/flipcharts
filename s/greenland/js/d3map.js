var margin = {top: 0, right: 0, bottom: 0, left: 0}
var padding = {top: 0, right: 0, bottom: 0, left: 0}
var outerWidth = 500
var outerHeight = 600
var innerWidth = outerWidth - margin.left - margin.right
var innerHeight = outerHeight - margin.top - margin.bottom
var width = innerWidth - padding.left - padding.right
var height = innerHeight - padding.top - padding.bottom
var aspect = width/height
var backgroundColor = "rgba(255, 255, 255, 0)"

var svg = d3.select('.chart-wrapper').append('svg')
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('id', 'chart')
	.attr('viewBox', '0 0 ' + width + ' ' + height)
	.attr('preserverAspectRatio', 'xMinYMin')

var latMin = d3.min(greenland, function(point) {
	return point.latitude
})

var lngMin = d3.min(greenland, function(point) {
	return point.longitude
})

var latMax = d3.max(greenland, function(point) {
	return point.latitude
})

var lngMax = d3.max(greenland, function(point) {
	return point.longitude
})

// calculated in maxHelper.rb
var meltMax = 160


var meltX = d3.scale.linear() 
	.domain([0, meltMax/2, meltMax])
	.range(["#e4eaf5", "yellow", "red"])

var x = d3.scale.linear()
	.domain([lngMin, lngMax])
	.range([60, width + 60])

var y = d3.scale.linear()
	.domain([latMin, latMax])
	.range([height + 10, -10])

var arrowX = d3.scale.linear()
	.domain([0, 100])
	.range([10, 90])

var tickScale = d3.scale.linear()
	.domain([meltMax, 0])
	.range([233, 35])

var keyTextScale = d3.scale.linear()
	.domain([meltMax, 0])
	.range([230, 35])


var appendMap = function(year) {

	var projection = d3.geo.transverseMercator()
		.center([-20, 78])
		.scale(1200)
		.rotate([35, 5, 25])


	var path = d3.geo.path()
		.projection(projection)

	svg.append('g')
		.attr('id', 'greenland')
		.selectAll('path')
		.data(greenlandMap.features)
		.enter().append('path')
		.attr('d', path)
		.style('fill', backgroundColor)

	var meltProjection = d3.select('svg')
		.selectAll('circle')
		.data(greenland)

	//append melt circles to svg
	meltProjection.enter()
		.append('circle')
		// .attr('cx', function(d){
		// 	return x(d.longitude)
		// })
		// .attr('cy', function(d){
		// 	return y(d.latitude)
		// })
		.attr('cx', function(d) {
			return projection([d.longitude, d.latitude])[0]
		})
		.attr('cy', function(d) {
			return projection([d.longitude, d.latitude])[1]
		})
		.attr('r', 2.5)
		.attr('class', 'data')
		.on('mouseover', function(d) {
			var days = (d["year " + year])
			// var text;
			// if(days === 1){
			// 	text = "1 Day"
			// } else {
			// 	text = days + " Days"
			// }
			var text = days

			d3.select('#key-tick').attr('x', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('x', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
		})
		.style('fill', function(d) {
			if(d["year " + year] === 0){
				return backgroundColor
			} else {
				return meltX(d["year " + year])			
			}
		})

	d3.select('svg')
		.append('foreignObject')
		.attr('width', 200)
		.attr('height', 50)
		.attr('x', 35)
		.attr('y', 400)
		.append('xhtml:div')
		.attr('class', 'key-proj')

	d3.select('svg')
		.append('text')
		.attr('width', 300)
		.attr('height', 300)
		.attr('x', 35)
		.attr('y', 460)
		.attr('id', 'key-tick')
		.text('▲')
		.style('font-size', '2em')
		.style('text-anchor', 'middle')
		.append('tspan')
		.attr('width', 300)
		.attr('height', 100)
		.attr('x', 35)
		.attr('y', 500)
		.attr('id', 'key-text')
		.attr('class', 'key')
		.text('0')
		.style('font-size', '1.2em')
		.style('font-family', 'Ubuntu')
		.style('text-anchor', 'middle')

	d3.select('svg')
		.append('text')
		.text('Days Where Melting')
		.attr('width', 200)
		.attr('height', 150)
		.attr('x', 135)
		.attr('y', 360)
		.attr('class', 'key-text')
		.style('text-anchor', 'middle')
		.append('tspan')
		.attr('x', 135)
		.attr('y', 385)
		.text('Was Observed')
		.style('text-anchor', 'middle')





	//append number of melt days to svg
	// d3.select('svg')
	// 	.append('text')
	// 	.text('')
	// 	.attr('width', 100)
	// 	.attr('height', 150)
	// 	.attr('x', 600)
	// 	.attr('y', 350)
	// 	.attr('id', 'day-text')
	// 	.style('font-size', '3em')
	// 	.style('fill', 'white')

	// //appends key div to svg
	// d3.select('svg')
	// 	.append('foreignObject')
	// 	.attr('width', 200)
	// 	.attr('height', 900)
	// 	.attr('x', 45)
	// 	.attr('y', 60)
	// 	.append('xhtml:div')
	// 	.attr('class', 'key-proj')

	// //appends key min text to svg
	// d3.select('svg')
	// 	.append('foreignObject')
	// 		.attr('width', 100)
	// 		.attr('height', 100)
	// 		.attr('x', 0)
	// 		.attr('y', 600)
	// 		.append('xhtml:p')
	// 		.attr('id', 'key-min')
	// 		.attr('class', 'key-text')
	// 		.text('0')
	// 		.style('font-size', '2em')

	// //appends key max text to svg
	// d3.select('svg')
	// 	.append('foreignObject')
	// 		.attr('width', 100)
	// 		.attr('height', 100)
	// 		.attr('x', -35)
	// 		.attr('y', 50)
	// 		.append('xhtml:p')
	// 		.attr('id', 'key-max')
	// 		.attr('class', 'key-text')
	// 		.text('160')
	// 		.style('font-size', '2em')

	// //appends tick to key scale
	// d3.select('svg')
	// 	.append('foreignObject')
	// 	.attr('width', 300)
	// 	.attr('height', 100)
	// 	.attr('x', 22)
	// 	.attr('y', 568)
	// 	.attr('id', 'key-tick')
	// 	.append('xhtml:p')
	// 	.text('—')
	// 	.style('font-size', '5em')

	// //appends day text to key
	// d3.select('svg')
	// 	.append('foreignObject')
	// 	.attr('width', 300)
	// 	.attr('height', 100)
	// 	.attr('x', 110)
	// 	.attr('y', 600)
	// 	.attr('id', 'key-text')
	// 	.attr('class', 'key')
	// 	.append('xhtml:p')
	// 	.text('0 days')
	// 	.style('font-size', '2em')
	// 	.style('font-family', 'Ubuntu')
}

var updateProjection = function(year) {

	d3.selectAll('.data')
		.on('mouseover', function(d) {
			var days = (d["year " + year])
			var text;
			// if(days === 1){
			// 	text = "1 Day"
			// } else {
			// 	text = days + " Days"
			// }

			var text = days 

			d3.select('#key-tick').attr('x', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('x', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
		})
		.style('fill', function(d) {
			if(d["year " + year] === 0){
				return backgroundColor
			} else {
				return meltX(d["year " + year])			
			}
		})
}


