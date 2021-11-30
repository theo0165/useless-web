const current = {
  wrapper: document.querySelector('section.weather'),
  icon: document.querySelector('section.weather .icon'),
  location: document.querySelector('section.weather .location'),
  temp: document.querySelector('section.weather .current'),
  highLow: document.querySelector('section.weather .high-low'),
};

const forecastWrapper = document.querySelector('.forecast');

console.log(current);

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

const getCoords = () => {
  console.log('Asking for location permission');
  return new Promise((resolve, reject) =>
    navigator.permissions
      ? // Permission API is implemented
        navigator.permissions
          .query({
            name: 'geolocation',
          })
          .then((permission) =>
            // is geolocation granted?
            permission.state === 'granted'
              ? navigator.geolocation.getCurrentPosition((pos) =>
                  resolve(pos.coords)
                )
              : reject(new Error('Permission not granted'))
          )
      : // Permission API was not implemented
        reject(new Error('Permission API is not supported'))
  );
};

getCoords()
  .then((coords) => {
    console.log('permission');
    const antipode = getAntipode(coords.latitude, coords.longitude);

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
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  })
  .catch((error) => {
    console.log(error);
    document.querySelector('main').innerHTML =
      '<h1>Location permission required.</h1>';
  });
