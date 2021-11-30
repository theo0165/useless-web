let currentLocation = false;

const getAntipode = (lat, lon) => {
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
/*
const antipodes = getAntipoded(currentLocation[0], currentLocation[1]);
console.log(
  'antipode location',
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
      'closest city from server',
      'https://www.google.se/maps/@' +
        data.closest_city.lat +
        ',' +
        data.closest_city.lon +
        ',14z'
    );
  });*/

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const antipode = getAntipode(
      position.coords.latitude,
      position.coords.longitude
    );

    console.log(
      'antipode location',
      'https://www.google.se/maps/@' +
        antipode[0].toString() +
        ',' +
        antipode[1].toString() +
        ',14z'
    );

    fetch(
      'https://theosandell.com/api/antipodeWeather/getWeather.php?lat=' +
        antipode[0] +
        '&lon=' +
        antipode[1]
    )
      .then((request) => request.json())
      .then((data) => {
        console.log(data);
        console.log(
          'closest city from server',
          'https://www.google.se/maps/@' +
            data.closest_city.lat +
            ',' +
            data.closest_city.lon +
            ',14z'
        );
      });
  });
} else {
  //Error
  throw new Error('Could not get location');
}
