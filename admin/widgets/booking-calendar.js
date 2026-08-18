(function () {
  "use strict";

  var DAY_LABELS = ["P", "J2", "J3", "J4", "J5", "Ij", "J1"];
  var DAY_FULL = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
  ];
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  var STYLE_ID = "bcal-widget-style";

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function toISODate(y, m, d) {
    return y + "-" + pad(m + 1) + "-" + pad(d);
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function firstWeekday(y, m) {
    return new Date(y, m, 1).getDay(); // 0=Jumapili ... 6=Jumamosi
  }

  function toList(value) {
    if (value == null) return [];
    if (Array.isArray(value)) return value.slice();
    if (typeof value.toArray === "function") return value.toArray();
    if (typeof value.toJS === "function") return value.toJS();
    return [];
  }

  function itemDate(item) {
    if (item == null) return "";
    if (typeof item.get === "function") return item.get("date") || "";
    return item.date || "";
  }

  function itemNote(item) {
    if (item == null) return "";
    if (typeof item.get === "function") return item.get("note") || "";
    return item.note || "";
  }

  // Normalizes the field value (plain JS array or Immutable List of Maps)
  // into a plain array of { date, note }.
  function toBookedArray(value) {
    return toList(value)
      .map(function (item) {
        return { date: itemDate(item), note: itemNote(item) };
      })
      .filter(function (item) {
        return !!item.date;
      });
  }

  // Pure toggle: removes the entry for `iso` if present, otherwise appends
  // { date, note }. Always returns a NEW array.
  function applyToggle(booked, iso, note) {
    var out = booked.slice();
    for (var i = 0; i < out.length; i++) {
      if (out[i].date === iso) {
        out.splice(i, 1);
        return out;
      }
    }
    out.push({ date: iso, note: note || "" });
    return out;
  }

  function injectStyles() {
    if (!document.getElementById(STYLE_ID)) {
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent =
        ".bcal-wrap{background:#071e12;border:1px solid hsla(43,58%,95%,.12);border-radius:14px;padding:14px;color:#faf6ec;font-family:inherit;box-sizing:border-box}" +
        ".bcal-wrap *,.bcal-wrap *:before,.bcal-wrap *:after{box-sizing:border-box}" +
        ".bcal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:10px}" +
        ".bcal-title{font-weight:700;font-size:.9rem;letter-spacing:.02em;color:#faf6ec}" +
        ".bcal-nav{background:transparent;color:#d9b556;border:1px solid rgba(217,181,86,.25);border-radius:8px;width:32px;height:32px;font-size:1.1rem;line-height:1;cursor:pointer;transition:background-color .2s ease,border-color .2s ease;padding:0}" +
        ".bcal-nav:hover{background:rgba(217,181,86,.1);border-color:rgba(217,181,86,.5)}" +
        ".bcal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}" +
        ".bcal-weekday{text-align:center;font-size:.62rem;font-weight:700;letter-spacing:.06em;color:hsla(43,58%,95%,.4);padding-bottom:.35rem;align-self:center}" +
        ".bcal-cell{position:relative;aspect-ratio:1/1;min-height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;color:#faf6ec;background:rgba(217,181,86,.06);border:1px solid rgba(217,181,86,.2);cursor:pointer;transition:background-color .2s ease,border-color .2s ease;padding:0}" +
        ".bcal-cell--empty{background:transparent;border:none;cursor:default}" +
        ".bcal-cell--available:hover{background:rgba(217,181,86,.2);border-color:rgba(217,181,86,.55)}" +
        ".bcal-cell--booked{background:rgba(217,90,90,.12);border-color:rgba(217,90,90,.3);color:hsla(43,58%,95%,.6)}" +
        ".bcal-cell--booked:hover{border-color:rgba(217,90,90,.7)}" +
        ".bcal-cell--past{opacity:.28}" +
        ".bcal-cell--past:hover{opacity:.6}" +
        ".bcal-cell--today{box-shadow:inset 0 0 0 1.5px #d9b556}" +
        ".bcal-daynum{position:relative;z-index:1}" +
        ".bcal-cell--booked .bcal-daynum{font-size:.65rem;opacity:.7;position:absolute;top:3px;left:5px}" +
        ".bcal-icon{width:15px;height:15px;color:rgba(217,90,90,.85)}" +
        ".bcal-hint{margin-top:10px;font-size:.7rem;color:hsla(43,58%,95%,.5);line-height:1.45}" +
        ".bcal-preview{list-style:none;margin:0;padding:0;font-size:.85rem;color:#faf6ec}" +
        ".bcal-preview li{padding:2px 0}";
      document.head.appendChild(style);
    }
  }

  function register() {
    if (typeof window === "undefined" || !window.CMS) return false;
    var h = window.h;
    var createClass = window.createClass;
    if (!h || !createClass) return false;

    function lockIcon() {
      return h(
        "svg",
        {
          viewBox: "0 0 24 24",
          className: "bcal-icon",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          "aria-hidden": "true",
        },
        h("rect", { x: "5", y: "11", width: "14", height: "9", rx: "2" }),
        h("path", { d: "M8 11V8a4 4 0 0 1 8 0v3", strokeLinecap: "round" })
      );
    }

    var BookingCalendarControl = createClass({
      getInitialState: function () {
        var now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
      },

      shiftMonth: function (delta) {
        var m = this.state.month + delta;
        var y = this.state.year;
        if (m < 0) { m = 11; y -= 1; }
        if (m > 11) { m = 0; y += 1; }
        this.setState({ month: m, year: y });
      },

      toggleDay: function (iso) {
        var booked = toBookedArray(this.props.value);
        var existing = false;
        for (var i = 0; i < booked.length; i++) {
          if (booked[i].date === iso) { existing = true; break; }
        }
        if (existing) {
          // Instant unlock, no confirmation.
          this.props.onChange(applyToggle(booked, iso, ""));
          return;
        }
        var note = window.prompt(
          "Note for this day (optional):",
          "Private session"
        );
        if (note === null || note === undefined) return; // cancelled
        this.props.onChange(applyToggle(booked, iso, note));
      },

      render: function () {
        var self = this;
        var bookedMap = {};
        toBookedArray(this.props.value).forEach(function (b) {
          bookedMap[b.date] = b.note;
        });

        var year = this.state.year;
        var month = this.state.month;
        var total = daysInMonth(year, month);
        var lead = firstWeekday(year, month);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var cells = [];
        for (var w = 0; w < lead; w++) {
          cells.push(
            h("div", { key: "lead" + w, className: "bcal-cell bcal-cell--empty", "aria-hidden": "true" })
          );
        }

        for (var d = 1; d <= total; d++) {
          var iso = toISODate(year, month, d);
          var dateObj = new Date(year, month, d);
          var isPast = dateObj < today;
          var isBooked = Object.prototype.hasOwnProperty.call(bookedMap, iso);
          var isToday = dateObj.getTime() === today.getTime();

          var cls = "bcal-cell";
          var title = iso;
          if (isBooked) {
            cls += " bcal-cell--booked";
            title = "Booked: " + (bookedMap[iso] || "Booked") + " — click to unlock";
          } else if (isPast) {
            cls += " bcal-cell--past";
            title = iso + " (past date) — click to mark booked";
          } else {
            cls += " bcal-cell--available";
            title = iso + " — click to mark as booked";
          }
          if (isToday) cls += " bcal-cell--today";

          cells.push(
            h(
              "button",
              {
                key: iso,
                type: "button",
                className: cls,
                title: title,
                "aria-label": title,
                onClick: (function (target) {
                  return function () { self.toggleDay(target); };
                })(iso),
              },
              h("span", { className: "bcal-daynum" }, String(d)),
              isBooked ? lockIcon() : null
            )
          );
        }

        return h(
          "div",
          { className: "bcal-wrap" },
          h(
            "div",
            { className: "bcal-header" },
            h(
              "button",
              { type: "button", className: "bcal-nav", "aria-label": "Previous month", onClick: function () { self.shiftMonth(-1); } },
              "\u2039"
            ),
            h("div", { className: "bcal-title" }, MONTH_NAMES[month] + " " + year),
            h(
              "button",
              { type: "button", className: "bcal-nav", "aria-label": "Next month", onClick: function () { self.shiftMonth(1); } },
              "\u203A"
            )
          ),
          h(
            "div",
            { className: "bcal-grid", role: "grid" },
            DAY_LABELS.map(function (label, i) {
              return h(
                "div",
                { key: "h" + label, className: "bcal-weekday", role: "columnheader", "aria-label": DAY_FULL[i] },
                label
              );
            }).concat(cells)
          ),
          h(
            "div",
            { className: "bcal-hint" },
            "Click an unbooked day to mark it booked (lock); click again to unlock. " +
              "Past dates can still be edited (only visitors are blocked from those days)."
          )
        );
      },
    });

    var BookingCalendarPreview = createClass({
      render: function () {
        var booked = toBookedArray(this.props.value).sort(function (a, b) {
          return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        });
        if (!booked.length) {
          return h("div", { className: "bcal-preview" }, "No booked dates.");
        }
        return h(
          "ul",
          { className: "bcal-preview" },
          booked.map(function (b) {
            return h("li", { key: b.date }, b.date + (b.note ? " — " + b.note : ""));
          })
        );
      },
    });

    injectStyles();
    window.CMS.registerWidget("booking-calendar", BookingCalendarControl, BookingCalendarPreview);
    return true;
  }

  if (register()) return;

  // Node/headless export so the pure logic can be unit-smoked without a browser.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      toBookedArray: toBookedArray,
      applyToggle: applyToggle,
      toISODate: toISODate,
      daysInMonth: daysInMonth,
      firstWeekday: firstWeekday,
    };
  }
})();
