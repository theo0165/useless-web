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

const antipodes = getAntipoded(57.83625478896444, 12.241045118362768);
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
  .then(console.log);
