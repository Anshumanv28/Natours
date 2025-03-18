// filepath: c:\work\github\Natours-\public\js\maptiler.js
/* eslint-disable */

console.log('hello from the client side :D');
const mapElement = document.getElementById('map');
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);

  console.log(locations);

  var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1, // starting zoom
  });

  locations.forEach((loc) => {
    // Create a marker
    new maplibregl.Marker().setLngLat(loc.coordinates).addTo(map);
  });
} else {
  console.error('Map element not found');
}
