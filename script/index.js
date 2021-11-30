let currentLocation = false;

const getAntipoded = (lat, lon) => {
  let antipodes = [];

  antipodes.push(lat * -1);

  if (lon > 0) {
    antipodes.push((180 - lon) * -1);
  } else {
    antipodes.push((-180 - lon) * -1);
  }

  return antipodes;
};

//TODO: Fix location...
navigator.geolocation.getCurrentPosition((location) => {
  currentLocation = [location.coords.latitude, location.coords.longitude];
  console.log(
    location,
    'https://www.google.se/maps/@' +
      location.coords.latitude.toString() +
      ',' +
      location.coords.longitude.toString() +
      ',14z'
  );
});

const antipodes = getAntipoded(currentLocation[0], currentLocation[1]);
console.log(
  'https://www.google.se/maps/@' +
    antipodes[0].toString() +
    ',' +
    antipodes[1].toString() +
    ',14z'
);

fetch(
  'https://theosandell.com/api/antipodeWeather/getWeather.php?lat=' +
    antipodes[0] +
    '&lon=' +
    antipodes[1]
)
  .then((request) => request.json())
  .then((data) => {
    console.log(data);
    console.log(
      'https://www.google.se/maps/@' +
        data.closest_city.lat +
        ',' +
        data.closest_city.lon +
        ',14z'
    );
  });
