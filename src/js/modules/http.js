export default class HTTP {
   static async checkOnlineStatus() {
      try {
         const online = await fetch('https://api.github.com/users/ekaranjaa');
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
