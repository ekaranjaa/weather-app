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
