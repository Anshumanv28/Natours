import 'https://api.maptiler.com/maps/streets/ol.js';

// Include the MapTiler library

// Initialize the map
const map = new maplibregl.Map({
  container: 'map', // container id
  style:
    'https://api.maptiler.com/maps/streets/style.json?key=YOUR_MAPTILER_API_KEY', // style URL
  center: [0, 0], // starting position [lng, lat]
  zoom: 2, // starting zoom
});

// Add navigation controls to the map
map.addControl(new maplibregl.NavigationControl());
