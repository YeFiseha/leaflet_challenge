// API endpoint as queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
});

// Create a basemap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Add earthquake data (magnitude and depth) to the map
d3.json(queryURL).then(function (data) {
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[3]),
      color: "black",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
  }

  // Add color to earthquake data based on magitude and depth
  function mapColor(depth) {
    switch (true) {
      case depth > 90:
        return "#CB2B3E";
      case depth > 70:
        return "#9C2BCB";
      case depth > 50:
        return "#CB8427";
      case depth > 30:
        return "#FFD326";
      case depth > 10:
        return "#CAC428";
      default:
        return "#2AAD27";
    }
  }

  function mapRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 6;
  }

  // Add circlemarker to earthquake data on the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyle,

    // Pop-up data when circles are clicked
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Location: " +
          feature.properties.place +
          "<br>Depth: " +
          feature.geometry.coordinates[3]
      );
    },
  }).addTo(myMap);

  // Legend with colors that correlate with earthquake depth
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        mapColor(depth[i] + 1) +
        '"></i> ' +
        depth[i] +
        (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
});