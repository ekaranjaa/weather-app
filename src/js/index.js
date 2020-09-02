// Import regenerator to handle babel regenerator error while using es6 features.
import 'regenerator-runtime/runtime.js';

// Importing modules
import '../scss/style.scss';
import HTTP from './modules/http.js';
import * as UI from './modules/ui.js';

/**
 * We load the document background once everything else is
 * loaded to minimize load time.
 */
document.addEventListener('DOMContentLoaded', () => UI.loadBg());

// Perform all API actions here then pass the response the UI
navigator.geolocation.getCurrentPosition((position) => {
   const lat = position.coords.latitude;
   const long = position.coords.longitude;

   window.onload = () => getWeatherInfo(lat, long);
});

/**
 * We initiate the loadEventInfo event and pass getWeatherInfoByCity
 * method which gets the event information once the button associated
 * with it is clicked.
 */
UI.loadEventInfo(getWeatherInfoByCity);

/**
 * We initiate the search event and pass searchLocation method
 * which handles the search query once the form is submitted.
 */
UI.search(searchLocation);

/**
 * This is the method responsible for
 * loading weather data initially.
 *
 * We use it to load search and saved location
 * data as well.
 *
 * The methods referenced here fetch the current,
 * hourly and daily weather respectively.
 *
 * @param lat
 * @param long
 */
function getWeatherInfo(lat, long) {
   UI.loading();

   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   req.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setCurrentWeather(res))
      .catch((err) => console.log(err));

   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setHourlyWeather(res.daily[0]))
      .catch((err) => console.log(err));

   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setDailyWeather(res.daily))
      .catch((err) => console.log(err));
}

/**
 * We use this method to get weather information by city name.
 *
 * The methods referenced here get the weather info that matches the
 * `cityName` provided then pass the response all the way down to
 * the necessary UI elements.
 *
 * @param cityName
 */
function getWeatherInfoByCity(cityName) {
   UI.loading();

   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   req.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
   )
      .then((res) => {
         UI.setCurrentWeather(res);

         const lat = res.coord.lat;
         const long = res.coord.lon;

         req.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
         )
            .then((res) => UI.setHourlyWeather(res.daily[0]))
            .catch((err) => console.log(err));

         req.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
         )
            .then((res) => UI.setDailyWeather(res.daily))
            .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
}

/**
 * This is the method we use for search queries
 *
 * @param query
 */
function searchLocation(query) {
   UI.searching();

   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   req.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setSearchResults(res, getWeatherInfo))
      .catch((err) => console.log(err));
}

// Register the service worker
if ('serviceWorker' in navigator) {
   window.onload = () => {
      navigator.serviceWorker
         .register('/sw.js')
         .then((reg) => console.log('SW registered'))
         .catch((err) => console.log('SW registration failed'));
   };
}
