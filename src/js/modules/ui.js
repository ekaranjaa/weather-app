import Icons from './icons.js';

export function loadBg() {
   if (window.outerWidth > 768) {
      document.body.style.background = "url('/images/bg.jpg')";
   } else {
      document.body.style.background = "url('/images/bg2.jpg')";
   }
   document.body.style.backgroundPosition = 'center';
   document.body.style.backgroundSize = 'cover';
   document.body.style.backgroundRepeat = 'no-repeat';
   document.body.style.backgroundAttachment = 'fixed';
}

export function activateSidebar() {
   const menu = document.querySelector('.search');
   const toggleBtn = document.querySelector('.menu-toggle');
   const closeBtn = document.querySelector('.menu-close');

   toggleBtn.onclick = () => {
      document.body.classList.toggle('hide_content');
      menu.parentElement.classList.toggle('block');
      menu.classList.toggle('active');
   };

   closeBtn.onclick = () => {
      document.body.classList.remove('hide_content');
      menu.parentElement.classList.remove('block');
      menu.classList.remove('active');
   };
}

export function setCurrentWeather(weather) {
   const currentWeatherEl = document.querySelector('.weather-current');
   const country = weather.sys.country;
   const city = weather.name;
   const temp = Math.round(weather.main.temp);
   const description = () => {
      let desc = weather.weather[0].description;
      desc = `${desc.charAt(0).toUpperCase()}${desc.slice(1)}`;

      return desc;
   };
   const icon = () => Icons()[weather.weather[0].main.toLowerCase()];
   const time = () => {
      let time = new Date(weather.dt * 1000);
      const day = time.toLocaleDateString(time, { weekday: 'short' });
      const month = time.toLocaleDateString(time, { month: 'short' });
      const date = time.getDate();
      const year = time.getFullYear();
      const hour = time.toLocaleTimeString(time);

      time = `${day} ${month} ${date} ${year} ${hour}`;

      return time;
   };

   currentWeatherEl.innerHTML = `
      <div class="time">
         <h2>${country}, ${city}</h2>
         <p>${time()}</p>
      </div>
      <div class="status">
         <div class="icon">
            <p><i class="wi wi-${icon()}"></i></p>
            <p>${description()}</p>
         </div>
         <h1 class="units">${temp}<sup>o</sup></h1>
      </div>
   `;

   eventProbability(temp);
}

function eventProbability(temp) {
   const probabilityEl = document.querySelector('.event_probability');
   let probability;

   if (temp > 15 && temp < 25) {
      probability = 'EVENT POSSIBLE';
      probabilityEl.classList.add('safe');
   } else {
      probability = 'EVENT NOT POSSIBLE';
      probabilityEl.classList.remove('safe');
   }

   probabilityEl.innerHTML = `
      <p>${probability}</p>
   `;
}

export function setDailyWeather(weather) {
   const weeklyWeatherEl = document.querySelector('.weather-weekly');

   const days = () => {
      const baseDate = new Date('8/31/2020');
      const weekDays = [];

      for (let i = 0; i < 7; i++) {
         weekDays.push(
            baseDate.toLocaleDateString(baseDate, { weekday: 'long' })
         );
         baseDate.setDate(baseDate.getDate() + 1);
      }

      return weekDays;
   };

   weather.forEach((day, index) => {
      const temp = () => {
         const temp = day.temp;

         return {
            max: Math.round(temp.max),
            min: Math.round(temp.min),
         };
      };
      const icon = () => Icons()[day.weather[0].main.toLowerCase()];

      weeklyWeatherEl.innerHTML += `
         <div class="card">
            <div class="card-head">
               <p>${days()[index]}</p>
            </div>
            <div class="card-body">
               <i class="wi wi-${icon()}"></i>
            </div>
            <div class="card-footer">
               <p class="units">
                  <span class="max">${temp().max}<sup>o</sup></span>
                  <span class="min">${temp().min}<sup>o</sup></span>
               </p>
            </div>
         </div>
      `;
   });
}
