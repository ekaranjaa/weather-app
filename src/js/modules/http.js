class HTTP {
   constructor() {
      this.response;
      this.data;
   }

   async get(url) {
      this.response = fetch(url);
      this.data = await (await this.response).json();

      return this.data;
   }
}

export default HTTP;
