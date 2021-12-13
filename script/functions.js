let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const forecastsWrapper = document.querySelector('.forecast');

//Background colors depending on current temperature
const bgColors = {
  blue: '#71A6D2', // BLUE < 10 degrees
  orange: '#e67e22', // ORANGE < 25 & > 10
  red: '#CE2029', // RED > 25 degrees
};

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

const updateWeather = (data, city) => {
  if (Math.floor(data.current.temp) <= 10) {
    document.body.style.background = bgColors.blue;
  } else if (Math.floor(data.current.temp) >= 25) {
    document.body.style.background = bgColors.red;
  } else {
    document.body.style.background = bgColors.orange;
  }

  current.temp.textContent = Math.floor(data.current.temp) + '°C';
  current.weatherText.textContent = data.current.weather[0].description;
  current.location.textContent =
    city.name + ', ' + regionNames.of(city.countryCode);
  current.icon.classList = getWeatherIcon(data.current.weather[0].id);

  data.daily.forEach((forecast) => {
    const forecastWrapper = document.createElement('div');
    const forecastIcon = document.createElement('div');
    const forecastIconText = document.createElement('i');
    const weatherInfo = document.createElement('div');
    const date = document.createElement('h4');
    const highLowWrapper = document.createElement('div');
    const high = document.createElement('p');
    const low = document.createElement('p');
    const seperator = document.createElement('p');

    const forecastDate = new Date(forecast.dt * 1000);

    forecastWrapper.classList.add('single-forecast');
    forecastIcon.classList.add('forecast-icon');
    weatherInfo.classList.add('forecast-info');
    date.classList.add('forecast-date');
    highLowWrapper.classList.add('forecast-high-low');
    high.classList.add('forecast-high');
    low.classList.add('forecast-low');

    forecastIcon.appendChild(forecastIconText);
    weatherInfo.appendChild(date);
    weatherInfo.appendChild(highLowWrapper);
    highLowWrapper.appendChild(high);
    highLowWrapper.appendChild(seperator);
    highLowWrapper.appendChild(low);

    forecastWrapper.appendChild(forecastIcon);
    forecastWrapper.appendChild(weatherInfo);

    forecastIconText.classList = getWeatherIcon(forecast.weather[0].id);
    date.textContent =
      forecastDate.getDate() +
      ' ' +
      translateMonth(forecastDate.getMonth()) +
      ' ' +
      forecastDate.getFullYear();
    high.textContent = 'High: ' + Math.floor(forecast.temp.max) + '°C';
    seperator.textContent = ' | ';
    low.textContent = 'Low: ' + Math.floor(forecast.temp.min) + '°C';

    forecastsWrapper.append(forecastWrapper);
  });
};
