// import HTTP from 'http';

if ('serviceWorker' in navigator) {
   window.onload = () => {
      navigator.serviceWorker
         .register('/sw.js')
         .then((reg) => console.log('SW registered', reg))
         .catch((err) => console.log('SW registration failed', err));
   };
}
