import HTTP from './modules/http.js';
import * as UI from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
   UI.loadBg();
});
UI.activateMenu();

navigator.geolocation.getCurrentPosition((position) => {
   const req = new HTTP();
   let lat = position.coords.latitude;
   let long = position.coords.longitude;

   req.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=bbd01c6c17c4679bbe4ed1f606945865`
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
