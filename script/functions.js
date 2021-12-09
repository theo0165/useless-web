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

const translateMonth = (month) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December',
  ];

  return months[month - 1];
};

const getWeatherIcon = (code) => {
  const prefix = 'wi wi-';
  let icon = icons[code].icon;

  // If we are not in the ranges mentioned above, add a day/night prefix.
  if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
    icon = 'day-' + icon;
  }

  // Finally tack on the prefix.
  return prefix + icon;
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
