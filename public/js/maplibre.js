// filepath: c:\work\github\Natours-\public\js\maptiler.js
/* eslint-disable */

console.log('hello from the client side :D');
const mapElement = document.getElementById('map');
// if (mapElement) {
const locations = JSON.parse(mapElement.dataset.locations);

console.log(locations);

var map = new maplibregl.Map({
  container: 'map', // container id
  // style: 'https://demotiles.maplibre.org/style.json', // style URL
  // style:
  //   'https://api.maptiler.com/maps/streets-v2/style.json?key=WgUUlo7MhekUD36G7RGz', // MapTiler style URL
  style:
    'https://api.maptiler.com/maps/outdoor-v2/style.json?key=WgUUlo7MhekUD36G7RGz', // MapTiler style URL
  scrollZoom: false,
  // center: [-118.11349, 34.111745], // starting position [lng, lat]
  // zoom: 10, // starting zoom
  // interactive: false,
});

locations.forEach((loc) => {
  // Create a marker
  new maplibregl.Marker().setLngLat(loc.coordinates).addTo(map);
});
// } else {
//   console.error('Map element not found');
// }

const bounds = new maplibregl.LngLatBounds();

locations.forEach((loc) => {
  // Create a marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new maplibregl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new maplibregl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
