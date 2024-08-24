/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2hhbnRvNzg2IiwiYSI6ImNtMDducmRqbjBxOGgycXM0aXVhc204MTcifQ.k8CTfqN1m7s_SC8FIwBt7w';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/shanto786/cm07rxaxv00ko01phfnyr5728',
  scrollZoom: false
  // center: [-118.243683, 34.052235],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day${loc.day}:${loc.description}</p>`)
    .addTo(map);

  //Extend map to bound to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    letf: 100,
    right: 100
  }
});
