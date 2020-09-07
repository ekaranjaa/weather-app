export default class HTTP {
   static async checkOnlineStatus() {
      // We generate a random number on every request to avoid service worker caching
      const random = Math.round(Math.random() * 999999);

      try {
         const online = await fetch(`/?rand=${random}`);
         return online.status >= 200 && online.status < 300;
      } catch (err) {
         return false;
      }
   }

   async get(url) {
      const response = await fetch(url);
      const data = await response.json();

      return data;
   }
}
