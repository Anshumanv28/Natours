// filepath: c:\work\github\Natours-\public\js\maptiler.js
/* eslint-disable */

export const displayMap = (locations) => {
  const map = new maplibregl.Map({
    container: 'map',
    style:
      'https://api.maptiler.com/maps/outdoor-v2/style.json?key=WgUUlo7MhekUD36G7RGz',
    scrollZoom: false,
  });

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
};
