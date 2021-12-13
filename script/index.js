getCoords()
  .then((coords) => {
    const antipode = getAntipode(coords.latitude, coords.longitude);

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
        updateWeather(data.fake, data.closest_city);
        setEvents(data.real, data.real_city, data.fake, data.closest_city);

        document
          .querySelector('#location-switch')
          .addEventListener('click', () => {
            mobileWeatherToggle(data);
          });
      });
  })
  .catch((error) => {
    document.querySelector('main').innerHTML =
      '<h1>Location permission required.</h1>';
  });
