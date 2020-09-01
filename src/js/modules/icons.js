export default function Icons() {
   let icons;
   const hours = new Date().getHours();

   if (hours > 18) {
      icons = {
         thunderstorm: 'night-alt-thunderstorm',
         drizzle: 'night-alt-showers',
         rain: 'night-alt-rain',
         snow: 'night-alt-snow',
         mist: 'night-fog',
         smoke: 'smoke',
         haze: 'dust',
         dust: 'dust',
         fog: 'night-fog',
         sand: 'sandstorm',
         ash: 'dust',
         squall: 'dust',
         tornado: 'tornado',
         clear: 'night-clear',
         clouds: 'night-alt-cloudy',
      };
   } else {
      icons = {
         thunderstorm: 'day-thunderstorm',
         drizzle: 'showers',
         rain: 'day-rain',
         snow: 'snow',
         mist: 'fog',
         smoke: 'smoke',
         haze: 'dust',
         dust: 'dust',
         fog: 'day-fog',
         sand: 'sandstorm',
         ash: 'dust',
         squall: 'dust',
         tornado: 'tornado',
         clear: 'day-sunny',
         clouds: 'day-cloudy',
      };
   }

   return icons;
}
