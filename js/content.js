(function () {
  "use strict";

  var WHATSAPP_NUMBER = (window.SAA && window.SAA.WHATSAPP_NUMBER) || "255783040837";

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    });
  }

  var RESOURCE_TAGS = {
    pdf: "Kitabu cha PDF",
    makala: "Makala",
    audio: "Audio",
    video: "Video",
  };

  var RESOURCE_CTA = {
    pdf: { withUrl: "Pakua PDF", withoutUrl: "Omba nakala" },
    makala: { withUrl: "Soma Makala", withoutUrl: "Omba makala" },
    audio: { withUrl: "Sikiliza", withoutUrl: "Omba kiungo" },
    video: { withUrl: "Tazama", withoutUrl: "Omba kiungo" },
  };

  /* ---------------- Testimonials ---------------- */
  function renderTestimonials(items) {
    var track = document.getElementById("testimonial-track");
    var dotsWrap = document.getElementById("testimonial-dots");
    if (!track || !dotsWrap || !items || !items.length) return;

    var quoteSvg =
      '<svg class="quote-mark" viewBox="0 0 40 32" fill="currentColor" aria-hidden="true">' +
      '<path d="M0 20.3C0 10.1 6.6 2.6 17.4 0l2.3 4.7C13 6.6 9.4 10.8 8.9 16.4c1-.5 2.2-.8 3.6-.8 5 0 8.6 3.6 8.6 8.4 0 5-3.9 8.6-9 8.6C5 32.6 0 27 0 20.3Zm22 0C22 10.1 28.6 2.6 39.4 0l2.3 4.7C35 6.6 31.4 10.8 30.9 16.4c1-.5 2.2-.8 3.6-.8 5 0 8.6 3.6 8.6 8.4 0 5-3.9 8.6-9 8.6-7.1 0-12.1-5.6-12.1-12.3Z"/></svg>';

    track.innerHTML = items
      .map(function (t, i) {
        return (
          '<blockquote class="testimonial-slide" data-active="' + (i === 0) + '">' +
          quoteSvg +
          '<p class="font-display text-xl sm:text-2xl text-green-900 leading-relaxed">' + escapeHtml(t.quote) + "</p>" +
          '<footer class="mt-6 text-sm font-semibold tracking-wide text-ink/60">' +
          escapeHtml(t.name) + (t.location ? " &middot; " + escapeHtml(t.location) : "") +
          "</footer></blockquote>"
        );
      })
      .join("");

    dotsWrap.innerHTML = "";

    if (window.SAA && typeof window.SAA.initTestimonialSlider === "function") {
      window.SAA.initTestimonialSlider();
    }
  }

  /* ---------------- Resources ---------------- */
  function renderResources(items) {
    var grid = document.getElementById("resource-grid");
    if (!grid || !items || !items.length) return;

    grid.innerHTML = items
      .map(function (r) {
        var tag = RESOURCE_TAGS[r.type] || "Rasilimali";
        var cta = RESOURCE_CTA[r.type] || RESOURCE_CTA.pdf;
        var hasUrl = r.url && String(r.url).trim().length > 0;
        var isPdf = r.type === "pdf";
        var href = hasUrl ? r.url : waLink("Assalamu Alaykum, ningependa kupata: " + r.title);
        var label = hasUrl ? cta.withUrl : cta.withoutUrl;
        var linkAttrs =
          'href="' + escapeHtml(href) + '"' +
          (hasUrl ? ' target="_blank" rel="noopener"' + (isPdf ? ' download="' + escapeHtml(r.title) + '.pdf"' : "") : ' target="_blank" rel="noopener"');

        return (
          '<div class="resource-card reveal in-view">' +
          '<span class="resource-tag">' + escapeHtml(tag) + "</span>" +
          '<h3 class="font-display text-lg font-semibold mt-4">' + escapeHtml(r.title) + "</h3>" +
          '<p class="mt-2 text-sm text-cream/60 leading-relaxed">' + escapeHtml(r.description) + "</p>" +
          '<a ' + linkAttrs + ' class="resource-link">' + escapeHtml(label) + " &rarr;</a>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------------- Posters ---------------- */
  function layoutPosters(grid, count) {
    var cls = "mt-14 grid gap-6";
    if (count === 1) cls += " poster-grid--single";
    else if (count === 2) cls += " poster-grid--two";
    else cls += " sm:grid-cols-2 lg:grid-cols-4";
    grid.className = cls;
  }

  function renderPosters(items) {
    var grid = document.getElementById("poster-grid");
    if (!grid || !items || !items.length) return;

    grid.innerHTML = items
      .map(function (p) {
        var src = (p.thumb && String(p.thumb).trim()) ? p.thumb : p.image;
        var caption = p.caption || "Bango";
        return (
          '<a href="' + escapeHtml(p.image) + '" target="_blank" rel="noopener" class="poster-card reveal in-view">' +
          '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(caption) + '" loading="lazy" decoding="async" width="720">' +
          '<span class="poster-caption">' + escapeHtml(caption) + "</span>" +
          "</a>"
        );
      })
      .join("");

    layoutPosters(grid, items.length);
  }

  /* ---------------- Working hours ---------------- */
  function renderHours(hours) {
    var wrap = document.getElementById("hours-table");
    if (!wrap || !hours || !hours.length) return;

    wrap.innerHTML = hours
      .map(function (h) {
        return (
          '<div class="hours-row">' +
          '<span class="hours-day">' + escapeHtml(h.day) + "</span>" +
          '<span class="hours-time">' + escapeHtml(h.time) + "</span>" +
          (h.note ? '<span class="hours-note">' + escapeHtml(h.note) + "</span>" : "") +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------------- Time slots (dynamic per selected date) ---------------- */
  var settingsCache = null;

  function prefDateValue() {
    var el = document.getElementById("pref-date");
    return el ? el.value : "";
  }

  function slotsForDate(iso, settings) {
    var defaults = (settings && Array.isArray(settings.slots)) ? settings.slots.slice() : [];
    if (!iso) return defaults;

    if (settings.dateSlots && Array.isArray(settings.dateSlots)) {
      for (var i = 0; i < settings.dateSlots.length; i++) {
        if (settings.dateSlots[i] && settings.dateSlots[i].date === iso) {
          return (settings.dateSlots[i].slots || []).slice();
        }
      }
    }

    if (settings.slotByDay && Array.isArray(settings.slotByDay)) {
      var weekday = new Date(iso + "T00:00:00").getDay();
      for (var j = 0; j < settings.slotByDay.length; j++) {
        if (settings.slotByDay[j] && Number(settings.slotByDay[j].weekday) === weekday) {
          return (settings.slotByDay[j].slots || []).slice();
        }
      }
    }

    return defaults;
  }

  function renderSlots(slots, settings) {
    var group = document.getElementById("slot-group");
    var input = document.getElementById("pref-time");
    if (!group) return;

    var list = (Array.isArray(slots) && slots.length) ? slots : null;
    if (!list) {
      group.innerHTML = '<p class="slot-empty">Hakuna muda uliopatikana kwa siku hiyo. Tafadhali chagua tarehe nyingine.</p>';
      if (input) input.value = "";
      return;
    }

    group.innerHTML = list
      .map(function (t) { return '<button type="button" class="slot-btn" data-time="' + escapeHtml(t) + '" aria-pressed="false">' + escapeHtml(t) + "</button>"; })
      .join("");

    group.querySelectorAll(".slot-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var wasSelected = btn.classList.contains("selected");
        group.querySelectorAll(".slot-btn.selected").forEach(function (b) {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        });
        if (!wasSelected) {
          btn.classList.add("selected");
          btn.setAttribute("aria-pressed", "true");
          if (input) input.value = btn.getAttribute("data-time");
        } else if (input) {
          input.value = "";
        }
      });
    });
  }

  function updateSlotsForDate(settings) {
    var input = document.getElementById("pref-date");
    var iso = input ? input.value : "";
    renderSlots(slotsForDate(iso, settings), settings);
  }

  /* ---------------- About: photo + credentials ---------------- */
  function renderAbout(settings) {
    var img = document.getElementById("about-photo");
    if (img && settings && settings.photo && String(settings.photo).trim()) {
      img.src = settings.photo;
    }

    var chips = document.getElementById("credential-chips");
    if (chips && settings && Array.isArray(settings.credentials) && settings.credentials.length) {
      chips.innerHTML = settings.credentials
        .map(function (c) {
          return (
            '<div class="credential-chip">' +
            '<b class="chip-value">' + escapeHtml(c.value) + "</b>" +
            '<span class="chip-label">' + escapeHtml(c.label) + "</span>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    fetchJson("content/testimonials.json")
      .then(function (data) { renderTestimonials(data.items); })
      .catch(function () { /* keep static fallback already in HTML */ });

    fetchJson("content/resources.json")
      .then(function (data) { renderResources(data.items); })
      .catch(function () { /* keep static fallback already in HTML */ });

    fetchJson("content/posters.json")
      .then(function (data) { renderPosters(data.items); })
      .catch(function () { /* keep static fallback already in HTML */ });

    fetchJson("content/settings.json")
      .then(function (data) {
        settingsCache = data;
        renderHours(data.hours);
        renderSlots(slotsForDate(prefDateValue(), data), data);
        renderAbout(data);
        var prefDate = document.getElementById("pref-date");
        if (prefDate) {
          prefDate.addEventListener("change", function () { updateSlotsForDate(settingsCache); });
        }
      })
      .catch(function () { /* keep static fallback already in HTML */ });

    if (window.SAA && typeof window.SAA.initCalendar === "function") {
      window.SAA.initCalendar();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
