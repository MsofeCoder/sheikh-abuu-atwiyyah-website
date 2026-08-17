(function () {
  "use strict";
  window.SAA = window.SAA || {};

  var CONFIG = {
    WHATSAPP_NUMBER: "255783040837",
    PHONE_DISPLAY: "+255 783 040 837",
    BASE_URL: "https://sheikhatwiyyah.netlify.app/",
  };

  for (var key in CONFIG) {
    if (Object.prototype.hasOwnProperty.call(CONFIG, key)) {
      window.SAA[key] = CONFIG[key];
    }
  }
})();