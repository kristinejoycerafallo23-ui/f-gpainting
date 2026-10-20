// F&G Decorating Ltd — shared front-end behaviour
// Note: the quote and popup forms open a pre-filled email to F&G Decorating.
// To receive submissions (and photos) directly, connect a form service.

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (el) {
        if (el !== item) el.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
    });
  });

  // Gallery filter pills (data-cat may hold several space-separated categories)
  var pills = document.querySelectorAll(".filter-pill");
  var tiles = document.querySelectorAll(".gallery-tile");
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      var cat = pill.getAttribute("data-cat");
      tiles.forEach(function (tile) {
        var cats = (tile.getAttribute("data-cat") || "").split(" ");
        var show = cat === "all" || cats.indexOf(cat) !== -1;
        tile.style.display = show ? "flex" : "none";
      });
    });
  });

  // Gallery lightbox — click any project photo to enlarge
  var lightbox = document.getElementById("lightbox-overlay");
  if (lightbox) {
    var lightboxImg = document.getElementById("lightbox-img");
    var lightboxCaption = document.getElementById("lightbox-caption");
    var lightboxClose = document.getElementById("lightbox-close");
    document.querySelectorAll(".gallery-photo img").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.src = img.getAttribute("src");
        lightboxImg.alt = img.getAttribute("alt") || "";
        lightboxCaption.textContent = img.getAttribute("data-caption") || "";
        lightbox.classList.add("open");
      });
    });
    function closeLightbox() { lightbox.classList.remove("open"); }
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // Photo upload preview (quote page)
  var photoInput = document.getElementById("photo-input");
  var thumbRow = document.getElementById("thumb-row");
  var uploadBox = document.getElementById("upload-box");
  if (photoInput && thumbRow && uploadBox) {
    uploadBox.addEventListener("click", function () { photoInput.click(); });
    photoInput.addEventListener("change", function () {
      thumbRow.innerHTML = "";
      var files = Array.from(photoInput.files || []).slice(0, 10);
      files.forEach(function (file) {
        var thumb = document.createElement("div");
        thumb.className = "thumb";
        if (file.type && file.type.indexOf("image") === 0) {
          var img = document.createElement("img");
          img.src = URL.createObjectURL(file);
          thumb.appendChild(img);
        } else {
          thumb.textContent = file.name;
        }
        thumbRow.appendChild(thumb);
      });
    });
  }

  // Service detail modal (used on single-page build where services open
  // in a detail panel instead of a separate page)
  var serviceModal = document.getElementById("service-modal-overlay");
  if (serviceModal) {
    var serviceModalBody = document.getElementById("service-modal-body");
    var serviceModalClose = document.getElementById("service-modal-close");
    document.querySelectorAll("[data-service]").forEach(function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        var key = card.getAttribute("data-service");
        var tpl = document.getElementById("service-tpl-" + key);
        if (tpl && serviceModalBody) {
          serviceModalBody.innerHTML = tpl.innerHTML;
          serviceModal.classList.add("open");
          serviceModal.scrollTop = 0;
        }
      });
    });
    function closeServiceModal() { serviceModal.classList.remove("open"); }
    if (serviceModalClose) serviceModalClose.addEventListener("click", closeServiceModal);
    serviceModal.addEventListener("click", function (e) {
      if (e.target === serviceModal) closeServiceModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeServiceModal();
    });
  }

  // Quote wizard — step navigation
  var wizardSteps = document.querySelectorAll(".wizard-step");
  var progressSteps = document.querySelectorAll(".wizard-progress-step");
  var progressFill = document.getElementById("wizard-progress-fill");
  if (wizardSteps.length && progressSteps.length) {
    var totalSteps = wizardSteps.length;

    function showStep(n) {
      wizardSteps.forEach(function (s) {
        s.classList.toggle("active", parseInt(s.getAttribute("data-step"), 10) === n);
      });
      progressSteps.forEach(function (p) {
        var stepNum = parseInt(p.getAttribute("data-step"), 10);
        p.classList.toggle("active", stepNum === n);
        p.classList.toggle("done", stepNum < n);
      });
      if (progressFill) {
        var pct = ((n - 1) / (totalSteps - 1)) * 88; // leave inset to match circle positions
        progressFill.style.width = pct + "%";
      }
      var form = document.getElementById("quote-form");
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.querySelectorAll(".wizard-next").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var currentStep = btn.closest(".wizard-step");
        var requiredFields = currentStep.querySelectorAll("[required]");
        var valid = true;
        requiredFields.forEach(function (f) {
          if (!f.reportValidity()) valid = false;
        });
        if (!valid) return;
        var n = parseInt(currentStep.getAttribute("data-step"), 10);
        if (n < totalSteps) showStep(n + 1);
      });
    });
    document.querySelectorAll(".wizard-back").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var currentStep = btn.closest(".wizard-step");
        var n = parseInt(currentStep.getAttribute("data-step"), 10);
        if (n > 1) showStep(n - 1);
      });
    });
    progressSteps.forEach(function (p) {
      p.addEventListener("click", function () {
        var n = parseInt(p.getAttribute("data-step"), 10);
        if (p.classList.contains("done") || p.classList.contains("active")) showStep(n);
      });
      p.style.cursor = "pointer";
    });
  }

  // Quote form submit: opens a pre-filled email to F&G Decorating
  var quoteForm = document.getElementById("quote-form");
  var confirmBox = document.getElementById("confirmation");
  if (quoteForm && confirmBox) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var lines = [];
      quoteForm.querySelectorAll(".field").forEach(function (field) {
        var label = field.querySelector("label");
        var inputs = field.querySelectorAll("input, textarea, select");
        if (!label || !inputs.length) return;
        var vals = [];
        inputs.forEach(function (inp) {
          if (inp.type === "file") return;
          if ((inp.type === "checkbox" || inp.type === "radio") && !inp.checked) return;
          if (inp.value) vals.push(inp.value);
        });
        if (vals.length) lines.push(label.textContent.replace("*", "").trim() + ": " + vals.join(", "));
      });
      quoteForm.querySelectorAll("fieldset").forEach(function (fs) {
        var legend = fs.querySelector("legend");
        var checked = [];
        fs.querySelectorAll("input:checked").forEach(function (i) {
          checked.push(i.value && i.value !== "on" ? i.value : (i.parentElement.textContent || "").trim());
        });
        if (legend && checked.length) lines.push(legend.textContent.trim() + ": " + checked.join(", "));
      });
      var submitBtn = quoteForm.querySelector("button[type=submit]");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      function done() {
        quoteForm.style.display = "none";
        confirmBox.classList.add("show");
        confirmBox.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      function fallback() {
        window.location.href = "mailto:fgdecoratingltd@gmail.com?subject=" +
          encodeURIComponent("Free quote request from website") +
          "&body=" + encodeURIComponent(lines.join("\n") +
          "\n\n(Please attach your photos to this email, or send them via WhatsApp 07351 052123.)");
        done();
      }

      // Shrink phone photos so the whole request stays small enough to email
      function shrink(file) {
        return new Promise(function (resolve) {
          if (!file.type || file.type.indexOf("image/") !== 0 || file.type === "image/gif") return resolve(file);
          var img = new Image();
          var url = URL.createObjectURL(file);
          img.onload = function () {
            var max = 1400, w = img.width, h = img.height, r = Math.min(1, max / Math.max(w, h));
            var c = document.createElement("canvas");
            c.width = Math.round(w * r); c.height = Math.round(h * r);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            URL.revokeObjectURL(url);
            c.toBlob(function (b) {
              resolve(b ? new File([b], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }) : file);
            }, "image/jpeg", 0.75);
          };
          img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
          img.src = url;
        });
      }

      var photos = Array.from((document.getElementById("photo-input") || {}).files || []).slice(0, 10);
      Promise.all(photos.map(shrink)).then(function (files) {
        // Normal multipart form post (the only mode FormSubmit documents for attachments),
        // sent into a hidden iframe so the visitor stays on the page.
        var frameName = "fg-quote-frame";
        var frame = document.createElement("iframe");
        frame.name = frameName; frame.style.display = "none";
        document.body.appendChild(frame);
        var f = document.createElement("form");
        f.method = "POST"; f.enctype = "multipart/form-data";
        f.action = "https://formsubmit.co/fgdecoratingltd@gmail.com";
        f.target = frameName; f.style.display = "none";
        function add(n, v) {
          var i = document.createElement("input");
          i.type = "hidden"; i.name = n; i.value = v; f.appendChild(i);
        }
        add("_subject", "Free quote request from website");
        add("_template", "table");
        add("_captcha", "false");
        lines.forEach(function (l) {
          var i = l.indexOf(": ");
          add(i > -1 ? l.slice(0, i) : l, i > -1 ? l.slice(i + 2) : "");
        });
        files.forEach(function (file, idx) {
          var inp = document.createElement("input");
          inp.type = "file"; inp.name = "photo" + (idx + 1);
          var dt = new DataTransfer(); dt.items.add(file); inp.files = dt.files;
          f.appendChild(inp);
        });
        document.body.appendChild(f);
        var finished = false;
        function finish() { if (!finished) { finished = true; done(); } }
        frame.addEventListener("load", finish);
        // The reply from FormSubmit can't be read cross-site, so don't wait on it for long
        setTimeout(finish, 4000);
        f.submit();
      }).catch(fallback);
    });
  }

  // Timed popup — appears once per visit, 10 seconds after page load
  var popupOverlay = document.getElementById("popup-overlay");
  var popupClose = document.getElementById("popup-close");
  var popupForm = document.getElementById("popup-form");
  var popupFormWrap = document.getElementById("popup-form-wrap");
  var popupSuccess = document.getElementById("popup-success");

  function dismissPopup() {
    if (popupOverlay) popupOverlay.classList.remove("show");
    try { sessionStorage.setItem("fgPopupSeen", "1"); } catch (err) {}
  }

  if (popupOverlay) {
    var alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem("fgPopupSeen") === "1"; } catch (err) {}

    if (!alreadySeen) {
      setTimeout(function () {
        popupOverlay.classList.add("show");
      }, 10000);
    }

    if (popupClose) popupClose.addEventListener("click", dismissPopup);
    popupOverlay.addEventListener("click", function (e) {
      if (e.target === popupOverlay) dismissPopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && popupOverlay.classList.contains("show")) dismissPopup();
    });
  }

  if (popupForm) {
    popupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var formData = new FormData(popupForm);
      var name = formData.get("name") || "";
      var contact = formData.get("contact") || "";
      var message = formData.get("message") || "";
      var body = "Name: " + name + "\nPhone/Email: " + contact + "\nMessage: " + message;
      window.location.href = "mailto:fgdecoratingltd@gmail.com?subject=" +
        encodeURIComponent("New enquiry from website popup") +
        "&body=" + encodeURIComponent(body);
      if (popupFormWrap) popupFormWrap.style.display = "none";
      if (popupSuccess) popupSuccess.classList.add("show");
      try { sessionStorage.setItem("fgPopupSeen", "1"); } catch (err) {}
    });
  }
});
