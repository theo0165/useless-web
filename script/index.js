let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const current = {
  wrapper: document.querySelector('section.weather'),
  icon: document.querySelector('section.weather .icon i'),
  location: document.querySelector('section.weather .location'),
  temp: document.querySelector('section.weather .current-temp'),
  weatherText: document.querySelector('section.weather .weather-text'),
};
const forecastsWrapper = document.querySelector('.forecast');

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

const updateWeather = (data, city) => {
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

getCoords()
  .then((coords) => {
    const antipode = getAntipode(coords.latitude, coords.longitude);

    console.log(
      'antipode location',
      'https://www.google.se/maps/@' +
        antipode[0].toString() +
        ',' +
        antipode[1].toString() +
        ',14z'
    );

    console.log(
      'https://theosandell.com/api/antipodeWeather/getWeather.php?fakeLat=' +
        antipode[0] +
        '&fakeLon=' +
        antipode[1] +
        '&realLat=' +
        coords.latitude +
        '&realLon=' +
        coords.longitude
    );

    fetch(
      'https://theosandell.com/api/antipodeWeather/getWeather.php?fakeLat=' +
        antipode[0] +
        '&fakeLon=' +
        antipode[1] +
        '&realLat=' +
        coords.latitude +
        '&realLon=' +
        coords.longitude
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        updateWeather(data.fake, data.closest_city);
      });
  })
  .catch((error) => {
    console.log(error);
    document.querySelector('main').innerHTML =
      '<h1>Location permission required.</h1>';
  });
