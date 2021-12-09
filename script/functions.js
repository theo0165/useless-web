const current = {
  wrapper: document.querySelector('section.weather'),
  icon: document.querySelector('section.weather .icon i'),
  location: document.querySelector('section.weather .location'),
  temp: document.querySelector('section.weather .current-temp'),
  weatherText: document.querySelector('section.weather .weather-text'),
};

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

const mobileWeatherToggle = (data) => {
  if (document.body.classList.contains('real')) {
    current.icon.classList = getWeatherIcon(data.fake.current.weather[0].id);
    current.location.textContent =
      data.closest_city.name +
      ', ' +
      regionNames.of(data.closest_city.countryCode);
    current.temp.textContent = Math.floor(data.fake.current.temp) + '°C';
    current.weatherText.textContent = data.fake.current.weather[0].description;
    document.body.classList.remove('real');
  } else {
    current.icon.classList = getWeatherIcon(data.real.current.weather[0].id);
    current.location.textContent =
      data.real_city.name + ', ' + regionNames.of(data.real_city.countryCode);
    current.temp.textContent = Math.floor(data.real.current.temp) + '°C';
    current.weatherText.textContent = data.real.current.weather[0].description;
    document.body.classList.add('real');
  }
};
