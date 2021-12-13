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
        setEvents(data.real, data.real_city, data.fake, data.closest_city);

        document
          .querySelector('#location-switch')
          .addEventListener('click', () => {
            mobileWeatherToggle(data);
          });
      });
  })
  .catch((error) => {
    console.log(error);
    document.querySelector('main').innerHTML =
      '<h1>Location permission required.</h1>';
  });
