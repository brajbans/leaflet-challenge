// Store our API endpoint as earthquakeUrl.
let earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the earthquake URL/
d3.json(earthquakesUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("Location: " + feature.properties.place + "<br>Date: " + new Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag + "<br>More Info " + feature.properties.url);
  }


  
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  function createCircle(feature, latlng){
    let depth = {
      radius:feature.properties.mag*5,
      fillColor: chooseColor(feature.properties.mag),
      color: chooseColor(feature.properties.mag),
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.6
    }
    return L.circleMarker(latlng, depth);
  }



  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircle
  });

  // Function to choose color of cirlces for Map Plot based on Magnitude
//Passes to CreateCircleMarker function above
function chooseColor(mag) {
  // console.log(mag)
  switch(true) {
      //case (0 <= mag && mag < 1.0):
        //colour #red for intensity of magnitude;
      case (1.0 <= mag && mag <= 2.5):
        return "#7DD112";
      case (2.5 <= mag && mag <= 4.0):
        return "#F29F4B";
      case (4.0 <= mag && mag <= 5.5):
        return "#FC5C1A";
      case (5.5 <= mag && mag <= 7.0):
        return "#C50000";
      case (7.0 <= mag && mag <= 15.0):
        return "#870202";
      default:
        return "#AAFD5D";
  }
};


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      17.6078, -8.0817
    ],
    zoom: 2.5,
    layers: [street, earthquakes]
  });

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [1.0, 2.5, 4.0, 5.5, 7.0, 15.0];
    let colors = chooseColor;
    let labels = [];

    function chooseColor(mag) {
      // console.log(mag)
      switch(true) {
      //case (0 <= mag && mag < 1.0):
      //colour #red for intensity of magnitude;
      case (1.0 <= mag && mag <= 2.5):
        return "#7DD112";
      case (2.5 <= mag && mag <= 4.0):
        return "#F29F4B";
      case (4.0 <= mag && mag <= 5.5):
        return "#FC5C1A";
      case (5.5 <= mag && mag <= 7.0):
        return "#C50000";
      case (7.0 <= mag && mag <= 15.0):
        return "#870202";
      default:
        return "#AAFD5D";
  }
  };

    // Add the minimum and maximum.
    let legendInfo = "<h2>Intensity of Earthquake</h2>" 
      
    div.innerHTML = legendInfo;


    limits.forEach(function(limit, index) {
      labels.push(`<li style="background:${chooseColor(limit)}"> ${limit} </li>`);
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };


  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);

};
