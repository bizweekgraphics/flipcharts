$(document).ready(function() {
  for(var i=0;i<6;i++) {
    var r = Math.floor(255 * Math.random())
    var g = Math.floor(255 * Math.random())
    var b = Math.floor(255 * Math.random())

    var el = $('<div class="drag-bar">drag</div>')    
    $('#pile').append(el)
    el.css('background', "rgb(" + r + ',' + g + ',' + b + ')')

    var dropEl = $('<div class="drop">drop</div>')
    $('#drop').append(dropEl)
  }

  $('.drag-bar').draggable({
    stack: '#pile div',
    // revert: true
  })

  var dropEvent = function(event, ui) {
    console.log('test')
    ui.draggable.position( {of: $(this), my: 'left top', at: 'left top' })
  }

  $('.drop').droppable({
    hoverClass: "drop-hover",
    drop: dropEvent
  })





})

