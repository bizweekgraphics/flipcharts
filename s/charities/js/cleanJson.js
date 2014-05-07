

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

var setBacker = function(data) {
  data.forEach(function(donation) {
    if(donation.backer === undefined) {
      donation.backer = donation["ultimate source"]
      delete donation["ultimate source"]
    }
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


var createNodes = function(data) {
  var nodeList = []
  data.forEach(function(object) {
    var fromMatch = _.where(nodeList, {name: object.from})
    if(fromMatch.length === 0) {
      nodeList.push({name: object.from})
    }
    var toMatch = _.where(nodeList, {name: object.to})
    if(toMatch.length === 0) {
      nodeList.push({name: object.to})
    }
  })
  return nodeList
}

var createLinks = function(data) {
  var linkList = []
  concat.forEach(function(object) {
    var newObj = {source: object.from, target: object.to, value: object.value, backer: object.backer}
    linkList.push(newObj)
  })
  return linkList
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

var mergeDuplicates = function(data) {
  var newArray = []
  data.forEach(function(object) {
    var newArrayMatch = _.where(newArray, {"source":object.source, "target":object.target})
    if(newArrayMatch.length === 0) {
      var sum = 0
      var matches = _.where(data, {"source":object.source, "target":object.target})
      matches.forEach(function(match) {
        sum += match.value
      })
      newArray.push({source: object.source, target:object.target, value: sum, backer: object.backer})
    }
  })
  return newArray
}