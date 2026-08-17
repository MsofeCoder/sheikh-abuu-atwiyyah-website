(function () {
  "use strict";

  window.SAA = window.SAA || {};
  var WHATSAPP_NUMBER = (window.SAA && window.SAA.WHATSAPP_NUMBER) || "255783040837";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  var burgerOpen = document.getElementById("burger-open");
  var burgerClose = document.getElementById("burger-close");

  if (navToggle && mobileMenu) {
    function setMenu(open) {
      mobileMenu.classList.toggle("hidden", !open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Funga menyu" : "Fungua menyu");
      if (burgerOpen) burgerOpen.classList.toggle("hidden", open);
      if (burgerClose) burgerClose.classList.toggle("hidden", !open);
    }

    navToggle.addEventListener("click", function () {
      setMenu(mobileMenu.classList.contains("hidden"));
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        setMenu(false);
        navToggle.focus();
      }
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
        var active = i === current;
        s.setAttribute("data-active", String(active));
        s.setAttribute("aria-hidden", String(!active));
        if (active) {
          s.removeAttribute("inert");
        } else {
          s.setAttribute("inert", "");
        }
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
      if (prefersReducedMotion || slides.length < 2) {
        testimonialTimer = null;
        return;
      }
      testimonialTimer = setInterval(next, 6500);
    }

    if (slides.length > 1) {
      restart();
      track.addEventListener("mouseenter", function () {
        if (testimonialTimer) clearInterval(testimonialTimer);
      });
      track.addEventListener("mouseleave", restart);
      track.addEventListener("focusin", function () {
        if (testimonialTimer) clearInterval(testimonialTimer);
      });
      track.addEventListener("focusout", function () {
        if (!prefersReducedMotion) restart();
      });
    }

    renderState();
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
    function setFieldError(input, hasError) {
      var field = input.closest(".field");
      if (!field) return;
      field.classList.toggle("has-error", hasError);
      input.setAttribute("aria-invalid", String(hasError));
    }

    function clearErrors() {
      form.querySelectorAll(".field.has-error").forEach(function (f) {
        f.classList.remove("has-error");
      });
      form.querySelectorAll("[aria-invalid='true']").forEach(function (el) {
        el.setAttribute("aria-invalid", "false");
      });
    }

    function isValidPhone(value) {
      var digits = String(value).replace(/\D/g, "");
      return digits.length >= 9 && digits.length <= 13;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      ["input", "change"].forEach(function (evt) {
        el.addEventListener(evt, function () {
          var field = el.closest(".field");
          if (field && field.classList.contains("has-error")) {
            setFieldError(el, false);
          }
        });
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var fullName = form.fullName.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var prefDate = form.prefDate.value;
      var prefTime = form.prefTime.value;
      var message = form.message.value.trim();

      var ok = true;
      if (!fullName) { setFieldError(form.fullName, true); ok = false; }
      if (!phone || !isValidPhone(phone)) { setFieldError(form.phone, true); ok = false; }
      if (!service) { setFieldError(form.service, true); ok = false; }
      if (!ok) {
        showToast("Tafadhali angalia sehemu zilizoashiriwa.");
        var firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var lines = [
        "Assalamu Alaykum, ningependa kuweka miadi.",
        "Jina: " + fullName,
        "Simu: " + phone,
        "Huduma: " + service
      ];
      if (prefDate) lines.push("Tarehe ninayopendelea: " + prefDate);
      if (prefTime) lines.push("Muda ninapopendelea: " + prefTime);
      if (message) lines.push("Ujumbe: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;

      window.open(url, "_blank", "noopener");
      showToast("Unaelekezwa kwenye WhatsApp...");
    });
  }

  /* ---------------- Back to top ---------------- */
  var backTop = document.getElementById("back-to-top");
  if (backTop) {
    function onScrollTop() {
      if (window.scrollY > 600) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    }
    onScrollTop();
    window.addEventListener("scroll", onScrollTop, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  window.SAA.observeReveal = observeReveal;
})();