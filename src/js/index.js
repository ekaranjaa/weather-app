// Import regenerator to permit usage of advanced es6 features.
import 'regenerator-runtime/runtime.js';

// Importing the modules
import '../scss/style.scss';
import HTTP from './modules/http.js';
import * as UI from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
   UI.loadBg();
   UI.activateSidebar();
});

navigator.geolocation.getCurrentPosition((position) => {
   const req = new HTTP();
   const lat = position.coords.latitude;
   const long = position.coords.longitude;
   const apiKey = process.env.API_KEY;

   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}`
   )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
});

// Register the service worker
if ('serviceWorker' in navigator) {
   window.onload = () => {
      navigator.serviceWorker
         .register('/sw.js')
         .then((reg) => console.log('SW registered', reg))
         .catch((err) => console.log('SW registration failed', err));
   };
}
