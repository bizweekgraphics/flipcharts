//For each object iterate through all the objects

//if the object.donor = that first object
//then object.children.push(object.donor)
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