var margin = {top: 0, right: 20, bottom: 0, left: 20}
var width = 800 - margin.left - margin.right
var height = 600 - margin.bottom - margin.top
var aspect = width/height
var backgroundColor = "white"

var svg = d3.select('.chart-wrapper').append('svg')
	.attr('width', '100%')
	.attr('height', '100%')
	.attr('id', 'chart')
	.attr('viewBox', '0 0 800 800')
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
	.range([200, width])

var y = d3.scale.linear()
	.domain([latMin, latMax])
	.range([height, 0])

var arrowX = d3.scale.linear()
	.domain([0, 100])
	.range([10, 90])

var tickScale = d3.scale.linear()
	.domain([meltMax, 0])
	.range([8, 568])

var keyTextScale = d3.scale.linear()
	.domain([meltMax, 0])
	.range([43, 600])


var appendMap = function(year) {


	var meltProjection = d3.select('svg')
		.selectAll('circle')
		.data(greenland)

	//append melt circles to svg
	meltProjection.enter()
		.append('circle')
		.attr('cx', function(d){
			return x(d.longitude)
		})
		.attr('cy', function(d){
			return y(d.latitude)
		})
		.attr('r', 3)
		.attr('class', 'data')
		.on('mouseover', function(d) {
			var days = (d["year " + year])
			var text;
			if(days === 1){
				text = "1 Day"
			} else {
				text = days + " Days"
			}
			d3.select('#key-tick').attr('y', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('y', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
			d3.select('#key-text').style('font-size', '2em')
			d3.select('#key-text').style('font-family', 'Ubuntu')
		})
		.on('touchstart', function(d) {
			var days = (d["year " + year])
			var text;
			if(days === 1){
				text = "1 Day"
			} else {
				text = days + " Days"
			}
			d3.select('#key-tick').attr('y', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('y', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
			d3.select('#key-text').style('font-size', '2em')
			d3.select('#key-text').style('font-family', 'Ubuntu')
		})
		.on('touchmove', function(d) {
			var days = (d["year " + year])
			var text;
			if(days === 1){
				text = "1 Day"
			} else {
				text = days + " Days"
			}
			d3.select('#key-tick').attr('y', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('y', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
			d3.select('#key-text').style('font-size', '2em')
			d3.select('#key-text').style('font-family', 'Ubuntu')
		})
		.style('fill', function(d) {
			if(d["year " + year] === 0){
				return backgroundColor
			} else {
				return meltX(d["year " + year])			
			}
		})

	//append number of melt days to svg
	d3.select('svg')
		.append('text')
		.text('')
		.attr('width', 100)
		.attr('height', 150)
		.attr('x', 600)
		.attr('y', 350)
		.attr('id', 'day-text')
		.style('font-size', '3em')
		.style('fill', 'white')

	//appends key div to svg
	d3.select('svg')
		.append('foreignObject')
		.attr('width', 200)
		.attr('height', 900)
		.attr('x', 45)
		.attr('y', 60)
		.append('xhtml:div')
		.attr('class', 'key-proj')

	//appends key min text to svg
	d3.select('svg')
		.append('foreignObject')
			.attr('width', 100)
			.attr('height', 100)
			.attr('x', 0)
			.attr('y', 600)
			.append('xhtml:p')
			.attr('id', 'key-min')
			.attr('class', 'key-text')
			.text('0')
			.style('font-size', '2em')

	//appends key max text to svg
	d3.select('svg')
		.append('foreignObject')
			.attr('width', 100)
			.attr('height', 100)
			.attr('x', -35)
			.attr('y', 50)
			.append('xhtml:p')
			.attr('id', 'key-max')
			.attr('class', 'key-text')
			.text('160')
			.style('font-size', '2em')

	//appends tick to key scale
	d3.select('svg')
		.append('foreignObject')
		.attr('width', 300)
		.attr('height', 100)
		.attr('x', 22)
		.attr('y', 568)
		.attr('id', 'key-tick')
		.append('xhtml:p')
		.text('—')
		.style('font-size', '5em')

	d3.select('svg')
		.append('foreignObject')
		.attr('width', 300)
		.attr('height', 100)
		.attr('x', 110)
		.attr('y', 600)
		.attr('id', 'key-text')
		.attr('class', 'key')
		.append('xhtml:p')
		.text('0 days')
		.style('font-size', '2em')
		.style('font-family', 'Ubuntu')
}

var updateProjection = function(year) {

	d3.selectAll('.data')
		.on('mouseover', function(d) {
			var days = (d["year " + year])
			var text;
			if(days === 1){
				text = "1 Day"
			} else {
				text = days + " Days"
			}
			d3.select('#key-tick').attr('y', function(){
				return tickScale(days)
			})

			d3.select('#key-text').attr('y', function() {
				return keyTextScale(days)
			})
			d3.select('#key-text').text(text)
			d3.select('#key-text').style('font-size', '2em')
			d3.select('#key-text').style('font-family', 'Ubuntu')
		})
		.style('fill', function(d) {
			if(d["year " + year] === 0){
				return backgroundColor
			} else {
				return meltX(d["year " + year])			
			}
		})
}


