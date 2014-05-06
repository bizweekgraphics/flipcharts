var removeSpace = function(data) {
  var jsonString = JSON.stringify(data)
  jsonString = jsonString.replace(' amount ', 'amount')
  jstonString = jsonString.replace(' type ', 'donationType')
  return JSON.parse(jsonString)
}

var parseAmount = function(data) {
  data.map(function(donation) {
    var amount = parseInt(donation[" amount "].match(/\d+/g).join(''))
    donation[" amount "] = amount
  })
}