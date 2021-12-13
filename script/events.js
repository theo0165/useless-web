const setEvents = (data, realCity, fake, fakeCity) => {
  current.icon.addEventListener('mouseenter', (e) => {
    current.icon.classList = getWeatherIcon(data.current.weather[0].id);
  });

  current.icon.addEventListener('mouseout', () => {
    current.icon.classList = getWeatherIcon(fake.current.weather[0].id);
  });

  current.location.addEventListener('mouseenter', () => {
    current.location.textContent =
      realCity.name + ', ' + regionNames.of(realCity.countryCode);
  });

  current.location.addEventListener('mouseout', () => {
    current.location.textContent =
      fakeCity.name + ', ' + regionNames.of(fakeCity.countryCode);
  });

  current.temp.addEventListener('mouseenter', () => {
    current.temp.textContent = Math.floor(data.current.temp) + '°C';
  });

  current.temp.addEventListener('mouseout', () => {
    current.temp.textContent = Math.floor(fake.current.temp) + '°C';
  });

  current.weatherText.addEventListener('mouseenter', () => {
    current.weatherText.textContent = data.current.weather[0].description;
  });

  current.weatherText.addEventListener('mouseout', () => {
    current.weatherText.textContent = fake.current.weather[0].description;
  });

  const forecasts = document.querySelectorAll('.single-forecast');

  forecasts.forEach((forecast, i) => {
    const forecastIcon = forecast.querySelector('.forecast-icon i');
    const forecastHigh = forecast.querySelector('.forecast-high');
    const forecastLow = forecast.querySelector('.forecast-low');

    forecastIcon.addEventListener('mouseenter', () => {
      forecastIcon.classList = getWeatherIcon(data.daily[i].weather[0].id);
    });

    forecastIcon.addEventListener('mouseout', () => {
      forecastIcon.classList = getWeatherIcon(fake.daily[i].weather[0].id);
    });

    forecastHigh.addEventListener('mouseenter', () => {
      forecastHigh.textContent =
        'High: ' + Math.floor(data.daily[i].temp.max).toString() + '°C';
    });

    forecastHigh.addEventListener('mouseout', () => {
      forecastHigh.textContent =
        'High: ' + Math.floor(fake.daily[i].temp.max).toString() + '°C';
    });

    forecastLow.addEventListener('mouseenter', () => {
      forecastLow.textContent =
        'Low: ' + Math.floor(data.daily[i].temp.min).toString() + '°C';
    });

    forecastLow.addEventListener('mouseout', () => {
      forecastLow.textContent =
        'Low: ' + Math.floor(fake.daily[i].temp.min).toString() + '°C';
    });
  });
};
