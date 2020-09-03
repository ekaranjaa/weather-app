// Import regenerator to handle babel regenerator error while using es6 features.
import 'regenerator-runtime/runtime.js';

// Importing modules
import '../scss/style.scss';
import UI from './modules/ui.js';
import HTTP from './modules/http.js';
import Store from './modules/store.js';

/**
 * We load the document background once everything else is
 * loaded to minimize load time.
 */
document.addEventListener('DOMContentLoaded', () => UI.loadBg());

// Get the weather from the user's location
navigator.geolocation.getCurrentPosition((position) => {
   const lat = position.coords.latitude;
   const lon = position.coords.longitude;

   window.onload = () => getWeatherInfo(lat, lon);
});

(() => {
   const UII = new UI(); // User Interface Instance

   /**
    * We initiate the loadEventInfo event and pass getWeatherInfoByCity
    * method which gets the event information once the button associated
    * with it is clicked.
    */
   UII.loadEventInfo(getWeatherInfoByCity);

   /**
    * We initiate the search event and pass searchLocation method
    * which handles the search query once the form is submitted.
    */
   UII.search(searchLocation);
})();

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
 * @param lon
 */
function getWeatherInfo(lat, lon) {
   UI.loading();

   const UII = new UI();
   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   HTTP.checkOnlineStatus().then((res) => {
      if (res) {
         UII.updateOnlineStatus('online');

         req.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
         )
            .then((res) => {
               UII.setCurrentWeather(res);
               Store.saveWeather('current', res);
            })
            .catch((err) => console.log(err));

         req.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
         )
            .then((res) => {
               UII.setHourlyWeather(res.daily[0]);
               Store.saveWeather('hourly', res.daily[0]);
            })
            .catch((err) => console.log(err));

         req.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
         )
            .then((res) => {
               UII.setDailyWeather(res.daily);
               Store.saveWeather('daily', res.daily);
            })
            .catch((err) => console.log(err));
      } else {
         UII.updateOnlineStatus('offline');
         UII.setCurrentWeather(Store.getWeather('current'));
         UII.setHourlyWeather(Store.getWeather('hourly'));
         UII.setDailyWeather(Store.getWeather('daily'));
      }
   });
}

/**
 * We call the getWeatherInfo after every ten minutes
 * since that's how long the api takes to update weather
 * info.
 */
setTimeout(() => {
   const target = Store.getWeather('current');
   const lat = target.coord.lat;
   const lon = target.coord.lon;

   getWeatherInfo(lat, lon);
}, 1000 * 60 * 10);

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

   const UII = new UI();
   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   HTTP.checkOnlineStatus().then((res) => {
      if (res) {
         UII.updateOnlineStatus('online');

         req.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
         )
            .then((res) => {
               UII.setCurrentWeather(res);

               const lat = res.coord.lat;
               const lon = res.coord.lon;

               req.get(
                  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
               )
                  .then((res) => {
                     UII.setHourlyWeather(res.daily[0]);
                     Store.saveWeather('hourly', res.daily[0]);
                  })
                  .catch((err) => console.log(err));

               req.get(
                  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
               )
                  .then((res) => {
                     UII.setDailyWeather(res.daily);
                     Store.saveWeather('daily', res.daily);
                  })
                  .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
      } else {
         UII.updateOnlineStatus('offline');
         UII.setCurrentWeather(Store.getWeather('current'));
         UII.setHourlyWeather(Store.getWeather('hourly'));
         UII.setDailyWeather(Store.getWeather('daily'));
      }
   });
}

/**
 * This is the method we use for search queries
 *
 * @param query
 */
function searchLocation(query) {
   UI.searching();

   const UII = new UI();
   const req = new HTTP();
   const apiKey = process.env.API_KEY;

   HTTP.checkOnlineStatus().then((res) => {
      if (res) {
         req.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
         )
            .then((res) => UII.setSearchResults(res, getWeatherInfo))
            .catch((err) => console.log(err));
      } else {
         const errorRes = {
            cod: 503,
            message: "looks like you're offline.",
         };
         UII.setSearchResults(errorRes, getWeatherInfo);
      }
   });
}

// Register the service worker
if ('serviceWorker' in navigator) {
   navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registered'))
      .catch((err) => console.log('SW registration failed'));
}
