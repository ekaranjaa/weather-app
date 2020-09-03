export default class Store {
   static getWeather(type) {
      let weather;

      if (localStorage.getItem(type) === null) {
         weather = [];
      } else {
         weather = JSON.parse(localStorage.getItem(type));
      }

      return weather;
   }

   static saveWeather(type, data) {
      localStorage.setItem(type, JSON.stringify(data));
   }
}
