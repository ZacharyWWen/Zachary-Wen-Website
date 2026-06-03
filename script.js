(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    window.addEventListener("pointermove", function (event) {
      var x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      var y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      root.style.setProperty("--mx", x.toFixed(3));
      root.style.setProperty("--my", y.toFixed(3));
    });
  }

  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  function decodeEmailToken(token) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var cleanToken = token.replace(/[^A-Za-z0-9+/=]/g, "");
    var output = "";
    var buffer = 0;
    var bits = 0;

    for (var index = 0; index < cleanToken.length; index += 1) {
      var character = cleanToken.charAt(index);
      if (character === "=") break;
      var value = alphabet.indexOf(character);
      if (value < 0) continue;

      buffer = (buffer << 6) | value;
      bits += 6;

      if (bits >= 8) {
        bits -= 8;
        output += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    return output;
  }

  document.querySelectorAll(".email-reveal").forEach(function (button) {
    button.addEventListener("click", function () {
      var token = button.getAttribute("data-token");
      var output = button.parentElement.querySelector(".email-output");
      if (!token || !output) return;
      var address = decodeEmailToken(token);
      if (!/@/.test(address)) return;
      output.innerHTML =
        'Email for relevant inquiries: <a href="mailto:' +
        address +
        '?subject=Relevant%20inquiry%20for%20Zachary%20Wen">' +
        address +
        "</a>";
      button.textContent = "Email revealed";
      button.disabled = true;
    });
  });
})();
