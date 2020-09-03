import Icons from './icons.js';

export default class UI {
   constructor() {
      this.currentWeather;
      this.hourlyWeather;
      this.dailyWeather;
   }

   static loadBg() {
      document.body.classList.add('loaded');
   }

   static loading() {
      const currentWeatherEl = document.getElementById('currentWeather');
      const hourlyWeatherEl = document.getElementById('hourlyWeather');
      const dailyWeatherEl = document.querySelector(
         '#dailyWeather table tbody'
      );

      currentWeatherEl.innerHTML = ``;

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

   static searching() {
      const searchResultsEl = document.getElementById('searchResults');

      searchResultsEl.innerHTML = `
         <div class="spinner"></div>
      `;
   }

   /**
    * This method acceptsthe loading status and alerts
    * the user if thy're offline.
    *
    * @param status
    */
   updateOnlineStatus(status) {
      const onlineStatusEl = document.getElementById('onlineStatus');

      if (status === 'offline') {
         onlineStatusEl.classList.add('active');
         onlineStatusEl.innerHTML = `
            <p>The current information may be innacurate since you're offline.</p>
         `;
      } else {
         onlineStatusEl.classList.remove('active');
         onlineStatusEl.innerHTML = '';
      }
   }

   /**
    * This method accepts the getWeatherInfoByCity method
    * and loads event information once the user clicks the
    * associated button.
    *
    * @param action
    */
   loadEventInfo(action) {
      const loadEventInfoEl = document.getElementById('loadEventInfo');

      loadEventInfoEl.onclick = () => {
         action('New York');
      };
   }

   /**
    * This method gets the current weather, sets it globally then
    * proceeds to print the data to the dom.
    *
    * Same thing with setHourlyWeather and setDailyWeather
    *
    * @param weather
    */
   setCurrentWeather(weather) {
      this.currentWeather = weather;
      const currentWeatherEl = document.getElementById('currentWeather');
      const country = weather.sys.country;
      const city = weather.name;
      const temp = Math.round(weather.main.temp);
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

         time = `${day}, ${month} ${date}`;

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
               <h1>${temp}<sup>o</sup></h1>
            </div>
         </div>
      `;

      this.setEventStatus();
      this.setAverageWeather();
   }

   setEventStatus() {
      const statusEl = document.getElementById('eventStatus');
      const loadEventInfoEl = document.getElementById('loadEventInfo');
      const weather = this.currentWeather;
      const city = weather.name;
      const temp = Math.round(weather.main.feels_like);
      let status;

      if (city !== 'New York') {
         loadEventInfoEl.classList.add('active');
         statusEl.innerHTML = '';
         return;
      } else {
         loadEventInfoEl.classList.remove('active');

         if (temp >= 15 && temp <= 30) {
            status = 'EVENT POSSIBLE';
            statusEl.classList.add('safe');
         } else {
            status = 'EVENT NOT POSSIBLE';
            statusEl.classList.remove('safe');
         }

         statusEl.innerHTML = `
            <p>${status}</p>
         `;
      }
   }

   setAverageWeather() {
      const averageWeatherEl = document.getElementById('averageWeather');
      const weather = this.currentWeather;
      const temp = weather.main;
      const averages = [
         { name: 'Min', key: 'temp_min' },
         { name: 'Max', key: 'temp_max' },
      ];

      averageWeatherEl.innerHTML = '';

      averages.forEach((av) => {
         averageWeatherEl.innerHTML += `
            <div class="chip">
               <span class="title">${av.name}</span>
               <span class="units">
                  ${Math.round(temp[av.key])}<sup>o</sup>C
               </span>
            </div>
         `;
      });
   }

   setHourlyWeather(weather) {
      this.hourlyWeather = weather;
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

   setDailyWeather(weather) {
      this.dailyWeather = weather;
      const dailyWeatherEl = document.querySelector(
         '#dailyWeather table tbody'
      );
      const days = () => {
         const baseDate = new Date('8/31/2020');
         const currentDate = new Date();
         const weekDays = ['Today'];

         for (let i = 0; i < 7; i++) {
            weekDays.push(`
            ${baseDate.toLocaleDateString(baseDate, { weekday: 'short' })},
            ${currentDate.toLocaleDateString(currentDate, { month: 'short' })}
            ${currentDate.getDate()}
         `);
            baseDate.setDate(baseDate.getDate() + 1);
            currentDate.setDate(currentDate.getDate() + 1);
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
         const tempAv = () => {
            if (this.currentWeather.name !== 'New York') return;
            return (temp().max + temp().min) / 2;
         };

         dailyWeatherEl.innerHTML += `
            <tr>
               <td>
                  <span class="status ${
                     tempAv() >= 15 && tempAv() <= 30 && 'safe'
                  }"></span>
                  ${days()[index]}
               </td>
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

   /**
    * This method takes the searchLocation method as
    * a parameter and calls it once the search form
    * is submitted
    *
    * @param action
    */
   search(action) {
      const searchFormEl = document.getElementById('searchForm');
      const query = document.getElementById('searchInput');

      searchFormEl.onsubmit = (e) => {
         e.preventDefault();
         action(query.value);
      };
   }

   /**
    * This method takes the weather response returned
    * from a search and the getWeatherInfo method which
    * we'll pass to the loadSearchResults method below
    * which will load search results globally.
    *
    * We seperate this from the global weather responses
    * of this object since these results are just a preview.
    *
    * @param weather
    * @param action
    */
   setSearchResults(weather, action) {
      const searchResultsEl = document.getElementById('searchResults');

      if (weather.cod == 404) {
         let message = weather.message;
         message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;

         searchResultsEl.innerHTML = `
         <p class="error">${message}</p>
         `;

         return;
      }

      const country = weather.sys.country;
      const city = weather.name;
      const coord = weather.coord;
      const temp = weather.main;
      const wind = Math.round(weather.wind.speed);
      const icon = () => {
         return Icons()[weather.weather[0].main.toLowerCase()];
      };
      const description = () => {
         let desc = weather.weather[0].description;
         desc = `${desc.charAt(0).toUpperCase()}${desc.slice(1)}`;

         return desc;
      };

      searchResultsEl.innerHTML = '';

      searchResultsEl.innerHTML = `
         <div class="card" data-lat="${coord.lat}" data-lon="${coord.lon}">
            <div class="card-head">
               <i class="wi wi-${icon()}"></i>
            </div>
            <div class="card-body">
               <p>
                  <strong>${city}, ${country}</strong> 
                  [${coord.lon}, ${coord.lat}], 
                  <i>${description()}</i>
               </p>
               <p class="summary">
                     <span class="main">
                        ${Math.round(temp.temp)}<sup>o</sup>C
                     </span>
                     temp from
                     <span>
                        ${Math.round(temp.temp_min)}<sup>o</sup>C
                     </span>
                     to
                     <span>
                        ${Math.round(temp.temp_max)}<sup>o</sup>C
                     </span>,
                     wind 
                     <span>
                        ${wind}
                     </span>
               </p>
            </div>
         </div>
      `;

      this.loadSearchResults(action);
   }

   loadSearchResults(action) {
      const resultCardEls = document.querySelectorAll('#searchResults .card');

      resultCardEls.forEach((card) => {
         card.onmouseover = () => {
            card.parentElement.classList.add('active');
         };

         card.onclick = () => {
            const query = document.getElementById('searchInput');
            query.value = '';

            const lat = card.getAttribute('data-lat');
            const lon = card.getAttribute('data-lon');

            action(lat, lon);

            card.parentElement.classList.remove('active');
            card.parentElement.innerHTML = '';
         };
      });
   }
}
