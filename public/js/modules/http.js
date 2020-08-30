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

   async post(url, data) {
      this.response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      this.data = await this.response.json();

      return this.data;
   }

   async put(url, data) {
      this.response = await fetch(url, {
         method: 'PUT',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify(data),
      });
      this.data = await this.response.json();

      return this.data;
   }

   async delete(url) {
      this.response = fetch(url, { method: 'DELETE' });
      this.data = await (await this.response).json();

      return this.data;
   }
}

export default HTTP;
