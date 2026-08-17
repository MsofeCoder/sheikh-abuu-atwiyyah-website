(function () {
  "use strict";

  window.SAA = window.SAA || {};

  var MONTH_NAMES = [
    "Januari", "Februari", "Machi", "Aprili", "Mei", "Juni",
    "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba",
  ];
  // Order matches JS getDay(): 0=Jumapili(Sunday) ... 6=Jumamosi(Saturday)
  var DAY_LABELS_BY_INDEX = ["P", "J2", "J3", "J4", "J5", "Ij", "J1"];

  var state = {
    year: null,
    month: null, // 0-indexed
    bookedMap: {}, // 'YYYY-MM-DD' -> note
    weeklyOff: [0],
    selected: null,
    initialized: false,
  };

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function toISODate(y, m, d) {
    return y + "-" + pad(m + 1) + "-" + pad(d);
  }

  function startOfToday() {
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }

  function lockIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" class="cal-icon" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<rect x="5" y="11" width="14" height="9" rx="2"/>' +
      '<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function closedIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" class="cal-icon" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
      '<path d="M12 3a9 9 0 1 0 9 9c0-.4 0-.8-.06-1.2A6.5 6.5 0 0 1 12 3Z" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    });
  }

  function loadData() {
    var bookedPromise = fetchJson("content/bookings.json")
      .then(function (data) {
        var map = {};
        (data.booked || []).forEach(function (b) {
          if (b && b.date) map[b.date] = b.note || "Imejaa";
        });
        return map;
      })
      .catch(function () {
        return {};
      });

    var settingsPromise = fetchJson("content/settings.json")
      .then(function (data) {
        return Array.isArray(data.weeklyOff) ? data.weeklyOff.map(Number) : [0];
      })
      .catch(function () {
        return [0];
      });

    return Promise.all([bookedPromise, settingsPromise]).then(function (res) {
      state.bookedMap = res[0];
      state.weeklyOff = res[1];
    });
  }

  function render() {
    var grid = document.getElementById("calendar-grid");
    var label = document.getElementById("calendar-label");
    var selectedOut = document.getElementById("calendar-selected");
    if (!grid || !label) return;

    label.textContent = MONTH_NAMES[state.month] + " " + state.year;

    var firstDay = new Date(state.year, state.month, 1);
    var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    var startWeekday = firstDay.getDay(); // 0=Sun
    var today = startOfToday();

    var cells = [];

    var headerHtml = DAY_LABELS_BY_INDEX.map(function (l) {
      return '<div class="cal-weekday">' + l + "</div>";
    }).join("");

    for (var i = 0; i < startWeekday; i++) {
      cells.push('<div class="cal-cell cal-cell--empty" aria-hidden="true"></div>');
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var dateObj = new Date(state.year, state.month, d);
      var iso = toISODate(state.year, state.month, d);
      var weekday = dateObj.getDay();
      var isPast = dateObj < today;
      var isBooked = Object.prototype.hasOwnProperty.call(state.bookedMap, iso);
      var isClosed = state.weeklyOff.indexOf(weekday) !== -1;
      var isToday = dateObj.getTime() === today.getTime();
      var isSelected = state.selected === iso;

      var cls = ["cal-cell"];
      var icon = "";
      var disabled = false;

      if (isPast) {
        cls.push("cal-cell--past");
        disabled = true;
      } else if (isBooked) {
        cls.push("cal-cell--booked");
        icon = lockIconSvg();
        disabled = true;
      } else if (isClosed) {
        cls.push("cal-cell--closed");
        icon = closedIconSvg();
        disabled = true;
      } else {
        cls.push("cal-cell--available");
      }

      if (isToday) cls.push("cal-cell--today");
      if (isSelected) cls.push("cal-cell--selected");

      var title = isBooked
        ? "Imejaa: " + state.bookedMap[iso]
        : isClosed
        ? "Tumefungwa siku hii"
        : isPast
        ? "Tarehe imepita"
        : "Inapatikana — bofya kuchagua";

      cells.push(
        '<button type="button" class="' + cls.join(" ") + '" data-date="' + iso + '" ' +
        (disabled ? "disabled" : "") + ' title="' + title + '" aria-label="' + iso + " — " + title + '">' +
        '<span class="cal-daynum">' + d + "</span>" +
        icon +
        "</button>"
      );
    }

    grid.innerHTML = headerHtml + cells.join("");

    if (selectedOut) {
      if (state.selected) {
        selectedOut.textContent = "Tarehe uliyochagua: " + state.selected;
        selectedOut.classList.remove("hidden");
      } else {
        selectedOut.classList.add("hidden");
      }
    }

    Array.prototype.forEach.call(grid.querySelectorAll(".cal-cell--available"), function (btn) {
      btn.addEventListener("click", function () {
        state.selected = btn.getAttribute("data-date");
        var input = document.getElementById("pref-date");
        if (input) input.value = state.selected;
        render();
      });
    });
  }

  function shiftMonth(delta) {
    var m = state.month + delta;
    var y = state.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    state.month = m;
    state.year = y;
    render();
  }

  function wireNav() {
    var prev = document.getElementById("calendar-prev");
    var next = document.getElementById("calendar-next");
    if (prev) prev.addEventListener("click", function () { shiftMonth(-1); });
    if (next) next.addEventListener("click", function () { shiftMonth(1); });
  }

  /* Arrow-key navigation for the grid (roving focus within the month) */
  function isoToDate(iso) {
    var parts = iso.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function wireGridKeys() {
    var grid = document.getElementById("calendar-grid");
    if (!grid) return;

    grid.addEventListener("keydown", function (e) {
      var active = document.activeElement;
      if (!active || !active.classList || !active.classList.contains("cal-cell")) return;
      var dateAttr = active.getAttribute("data-date");
      if (!dateAttr) return;

      var d = isoToDate(dateAttr);
      var first = new Date(state.year, state.month, 1);
      var last = new Date(state.year, state.month + 1, 0);
      var target = null;

      switch (e.key) {
        case "ArrowLeft": target = new Date(d); target.setDate(d.getDate() - 1); break;
        case "ArrowRight": target = new Date(d); target.setDate(d.getDate() + 1); break;
        case "ArrowUp": target = new Date(d); target.setDate(d.getDate() - 7); break;
        case "ArrowDown": target = new Date(d); target.setDate(d.getDate() + 7); break;
        case "Home": target = new Date(first); break;
        case "End": target = new Date(last); break;
        default: return;
      }

      if (target < first || target > last) return;
      e.preventDefault();
      var iso = toISODate(target.getFullYear(), target.getMonth(), target.getDate());
      var btn = grid.querySelector('.cal-cell[data-date="' + iso + '"]');
      if (btn) btn.focus();
    });
  }

  window.SAA.initCalendar = function () {
    if (state.initialized) return;
    state.initialized = true;

    var now = new Date();
    state.year = now.getFullYear();
    state.month = now.getMonth();

    wireNav();
    wireGridKeys();
    loadData().then(render).catch(render);
  };
})();
