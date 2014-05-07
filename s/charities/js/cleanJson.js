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


var remove = function(data) {
  data.forEach(function(donation) {
    donation.to = donation[" to "]
    donation.from = donation[" from "]
    delete donation[" from "]
    delete donation[" to "]
  })
}


//if a donor is also a recipient, then it is more than one layer away

var tree = {
  "donor": "blackbox",
  "children": [
    {
      "name": "Taylor",
      "children": []
    },
    {
      "name": "Gelbaum",
      "children": []
    },
    {
      "name": "Shechtel",
      "children": []
    },
    {
      "name": "TGS",
      "children": []
    },
    {
      "name": "Another Roseland foundation",
      "children": []
    }
  ]
}

var mergeAmount = function(data) {
  var output = []
  data.forEach(function(donation) {
    var outputMatches = _.where(output, {from: donation.foundation, to: donation.recipient, backer: donation.backer})
    if(outputMatches.length === 0) {
      var matches = _.where(data, {foundation: donation.foundation, recipient: donation.recipient, backer: donation.backer})
      var sum = 0
      matches.forEach(function(match) {
        sum += match[" amount "]
      }) 
      var newObject = {from: donation.foundation, to: donation.recipient, amount: sum, certainty: donation.certainty, backer: donation.backer}
      output.push(newObject)
    }
  })
  return output
}

var createTree = function(data) {
  data.forEach(function(donation) {
    donation.name = donation.donor
    donation.children = []
    var source = donation["ultimate source"]
    var parent = _.find(tree.children, function(child) {
      return child.name === source
    })
    parent.children.push(donation)
  })
}

var recursiveTree = function(data) {
  data.forEach(function(donation) {
    donation.name = donation.donor
    var recipient = donation.recipient
    _.find(tree.children, function(child) {
      return donation.name
    }) 
  })
}