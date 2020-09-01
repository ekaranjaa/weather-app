// Import regenerator to handle babel regenerator error while using es6 features.
import 'regenerator-runtime/runtime.js';

// Importing the modules
import '../scss/style.scss';
import HTTP from './modules/http.js';
import * as UI from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => UI.loadBg());

// Perform all API actions here then pass the response the UI
navigator.geolocation.getCurrentPosition((position) => {
   const lat = position.coords.latitude;
   const long = position.coords.longitude;
   window.onload = () => getWeatherInfo(lat, long);
});

document.getElementById('loadEventInfo').onclick = () => {
   getWeatherInfoByCity('New York');
};

function getWeatherInfo(lat, long) {
   UI.loading();

   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   // We get the current weather with location information
   req.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setCurrentWeather(res))
      .catch((err) => console.log(err));

   // We get the current weather only for the Hourly data
   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setHourlyWeather(res.daily[0]))
      .catch((err) => console.log(err));

   // We get the daily weather updates
   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
   )
      .then((res) => UI.setDailyWeather(res.daily))
      .catch((err) => console.log(err));
}

function getWeatherInfoByCity(cityName) {
   UI.loading();

   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   /*
      - We get the weather info that matches the `cityName` provided then pass the
      response all the way down to the necessary UI elements
   */
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

// Register the service worker
if ('serviceWorker' in navigator) {
   window.onload = () => {
      navigator.serviceWorker
         .register('/sw.js')
         .then((reg) => console.log('SW registered'))
         .catch((err) => console.log('SW registration failed'));
   };
}
