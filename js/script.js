(function () {
  "use strict";

  window.SAA = window.SAA || {};
  var WHATSAPP_NUMBER = "255783040837";

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      navToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Reveal-on-scroll ---------------- */
  function observeReveal(root) {
    var scope = root || document;
    var revealEls = scope.querySelectorAll(".reveal:not(.in-view)");
    if (!revealEls.length) return;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }
  observeReveal(document);

  /* ---------------- Testimonial slider (reusable) ---------------- */
  var testimonialTimer = null;

  function initTestimonialSlider() {
    var track = document.getElementById("testimonial-track");
    var dotsWrap = document.getElementById("testimonial-dots");
    if (!track || !dotsWrap) return;

    if (testimonialTimer) {
      clearInterval(testimonialTimer);
      testimonialTimer = null;
    }

    var slides = Array.prototype.slice.call(track.querySelectorAll(".testimonial-slide"));
    if (!slides.length) return;

    var current = slides.findIndex(function (s) {
      return s.getAttribute("data-active") === "true";
    });
    if (current < 0) current = 0;

    dotsWrap.innerHTML = "";
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute("data-active", String(i === current));
      dot.setAttribute("aria-label", "Nukuu ya " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });

    function renderState() {
      slides.forEach(function (s, i) {
        s.setAttribute("data-active", String(i === current));
      });
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.setAttribute("data-active", String(i === current));
      });
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      renderState();
    }

    function next() {
      goTo(current + 1);
    }

    function restart() {
      if (testimonialTimer) clearInterval(testimonialTimer);
      if (slides.length > 1) testimonialTimer = setInterval(next, 6500);
    }

    if (slides.length > 1) {
      restart();
      track.addEventListener("mouseenter", function () {
        if (testimonialTimer) clearInterval(testimonialTimer);
      });
      track.addEventListener("mouseleave", restart);
    }
  }

  window.SAA.initTestimonialSlider = initTestimonialSlider;
  initTestimonialSlider();

  /* ---------------- Toast helper ---------------- */
  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("show");
    }, 3200);
  }

  /* ---------------- Booking form -> WhatsApp ---------------- */
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fullName = form.fullName.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var prefDate = form.prefDate.value;
      var message = form.message.value.trim();

      if (!fullName || !phone || !service) {
        showToast("Tafadhali jaza jina, namba ya simu, na huduma.");
        return;
      }

      var lines = [
        "Assalamu Alaykum, ningependa kuweka miadi.",
        "Jina: " + fullName,
        "Simu: " + phone,
        "Huduma: " + service
      ];
      if (prefDate) lines.push("Tarehe ninayopendelea: " + prefDate);
      if (message) lines.push("Ujumbe: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;

      window.open(url, "_blank", "noopener");
      showToast("Unaelekezwa kwenye WhatsApp...");
    });
  }

  window.SAA.observeReveal = observeReveal;
})();
