(function () {
  "use strict";
  window.SAA = window.SAA || {};

  var CONFIG = {
    WHATSAPP_NUMBER: "255679155676",
    PHONE_DISPLAY: "+255 679 155 676",
    EMAIL: "sheikhabuuatwiyyah@gmail.com",
    BASE_URL: "https://abuuatwiyyah.netlify.app/",
  };

  for (var key in CONFIG) {
    if (Object.prototype.hasOwnProperty.call(CONFIG, key)) {
      window.SAA[key] = CONFIG[key];
    }
  }
})();