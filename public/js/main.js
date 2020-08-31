import HTTP from './modules/http.js';
import * as UI from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
   UI.loadBg();
});
UI.activateMenu();

navigator.geolocation.getCurrentPosition((position) => {
   const req = new HTTP();
   const lat = position.coords.latitude;
   const long = position.coords.longitude;

   req.get('/env.json')
      .then((res) => {
         req.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${res.apiKey}`
         )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
      })
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
