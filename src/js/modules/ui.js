import Icons from './icons.js';

export function loadBg() {
   document.body.classList.add('loaded');
}

export function loading() {
   const currentWeatherEl = document.getElementById('currentWeather');
   const hourlyWeatherEl = document.getElementById('hourlyWeather');
   const dailyWeatherEl = document.querySelector('#dailyWeather table tbody');

   currentWeatherEl.innerHTML = `
      <div class="spinner"></div>
   `;

   hourlyWeatherEl.innerHTML = `
      <div class="spinner"></div>
   `;

   dailyWeatherEl.innerHTML = `
      <tr>
         <td></td>
         <td></td>
         <td>
            <div class="spinner"></div>
         </td>
         <td></td>
         <td></td>
      </tr>
   `;
}

export function setCurrentWeather(weather) {
   const currentWeatherEl = document.getElementById('currentWeather');
   const country = weather.sys.country;
   const city = weather.name;
   const temp = weather.main;
   const icon = () => {
      return Icons()[weather.weather[0].main.toLowerCase()];
   };
   const description = () => {
      let desc = weather.weather[0].description;
      desc = `${desc.charAt(0).toUpperCase()}${desc.slice(1)}`;

      return desc;
   };
   const time = () => {
      let time = new Date(weather.dt * 1000);
      const day = time.toLocaleDateString(time, { weekday: 'short' });
      const month = time.toLocaleDateString(time, { month: 'short' });
      const date = time.getDate();

      time = `${day} ${month} ${date}`;

      return time;
   };

   currentWeatherEl.innerHTML = '';

   currentWeatherEl.innerHTML = `
      <div class="time">
         <h2 class="location">${city}, ${country}</h2>
         <p class="date">${time()}</p>
      </div>
      <div class="status">
         <div class="icon">
            <p>
               <i class="wi wi-${icon()}"></i>
               <span>${description()}</span>
            </p>
         </div>
         <div class="units">
            <h1>${Math.round(temp.temp)}<sup>o</sup></h1>
         </div>
      </div>
   `;

   eventStatus(city, Math.round(temp.temp));

   setAverageWeather(temp);
}

function eventStatus(city, temp) {
   const statusEl = document.getElementById('eventStatus');
   let status;

   if (temp >= 15 && temp <= 25) {
      status = 'EVENT POSSIBLE';
      statusEl.classList.add('safe');
   } else {
      status = 'EVENT NOT POSSIBLE';
      statusEl.classList.remove('safe');
   }

   if (city === 'New York') {
      statusEl.innerHTML = `
         <p>${status}</p>
      `;
   }
}

function setAverageWeather(temp) {
   const averageWeatherEl = document.getElementById('averageWeather');
   const averages = ['Min', 'Max'];

   averageWeatherEl.innerHTML = '';

   averages.forEach((av) => {
      averageWeatherEl.innerHTML += `
         <div class="chip">
            <span class="title">${av}</span>
            <span class="units">
               ${Math.round(temp.temp_min)}<sup>o</sup>C
            </span>
         </div>
      `;
   });
}

export function setHourlyWeather(weather) {
   const hourlyWeatherEl = document.getElementById('hourlyWeather');
   const temp = weather.temp;
   const timesOfDay = [
      { name: 'Moring', key: 'morn' },
      { name: 'Afternoon', key: 'day' },
      { name: 'Evening', key: 'eve' },
      { name: 'Night', key: 'night' },
   ];

   hourlyWeatherEl.innerHTML = '';

   timesOfDay.forEach((time) => {
      hourlyWeatherEl.innerHTML += `
         <div class="chip">
            <div class="chip-head">
               <p>${time.name}</p>
            </div>
            <div class="chip-body">
               <p class="units">
                  ${Math.round(temp[time.key])}<sup>o</sup>C
               </p>
            </div>
         </div>
      `;
   });
}

export function setDailyWeather(weather) {
   const dailyWeatherEl = document.querySelector('#dailyWeather table tbody');
   const days = () => {
      const baseDate = new Date('8/31/2020');
      const weekDays = ['Today'];

      for (let i = 0; i < 7; i++) {
         weekDays.push(
            baseDate.toLocaleDateString(baseDate, { weekday: 'long' })
         );
         baseDate.setDate(baseDate.getDate() + 1);
      }

      return weekDays;
   };

   dailyWeatherEl.innerHTML = '';

   weather.forEach((day, index) => {
      const humidity = day.humidity;
      const description = () => {
         let desc = day.weather[0].description;
         desc = `${desc.charAt(0).toUpperCase()}${desc.slice(1)}`;

         return desc;
      };
      const wind = Math.round(day.wind_speed);
      const icon = () => {
         return Icons()[day.weather[0].main.toLowerCase()];
      };
      const temp = () => {
         const temp = day.temp;

         return {
            max: Math.round(temp.max),
            min: Math.round(temp.min),
         };
      };

      dailyWeatherEl.innerHTML += `
         <tr>
            <td>${days()[index]}</td>
            <td>${humidity}%</td>
            <td><i class="wi wi-${icon()}"></i>&nbsp;${description()}</td>
            <td>
               <span>${temp().max}<sup>o</sup>C</span>
               <span>${temp().min}<sup>o</sup>C</span>
            </td>
            <td>${wind}m/s</td>
         </tr>
      `;
   });
}
