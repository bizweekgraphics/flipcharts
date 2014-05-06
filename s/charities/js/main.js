//For each object iterate through all the objects

//if the object.donor = that first object
//then object.children.push(object.donor)
var tree = {
  "donor": "blackbox",
  "children": [
    {
      "name": "Fred Taylor",
      "children": []
    },
    {
      "name": "David Gelbaum",
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
    data.forEach(function(otherDonation) {

    }
  })
}