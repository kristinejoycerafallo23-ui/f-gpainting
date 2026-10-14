// F&G Decorating Ltd — shared front-end behaviour
// Note: this is a static front-end demo. The quote form below simulates a
// submission in the browser. A real build should wire this to a backend
// (e.g. a form handler or CMS plugin) that emails the enquiry + photos to
// F&G Decorating and stores it securely per UK GDPR.

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

  // Quote form submit (client-side simulation)
  var quoteForm = document.getElementById("quote-form");
  var confirmBox = document.getElementById("confirmation");
  var refCode = document.getElementById("ref-code");
  if (quoteForm && confirmBox) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var ref = "FG-" + Math.floor(1000 + Math.random() * 9000);
      if (refCode) refCode.textContent = ref;
      quoteForm.style.display = "none";
      confirmBox.classList.add("show");
      confirmBox.scrollIntoView({ behavior: "smooth", block: "start" });
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
      var submitBtn = popupForm.querySelector("button[type=submit]");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(popupForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      }).then(function (response) {
        if (response.ok) {
          popupFormWrap.style.display = "none";
          popupSuccess.classList.add("show");
          try { sessionStorage.setItem("fgPopupSeen", "1"); } catch (err) {}
        } else {
          throw new Error("Form endpoint not configured");
        }
      }).catch(function () {
        // Fallback if the email service isn't set up yet: open a pre-filled
        // email to F&G Decorating instead, so the enquiry is never lost.
        var name = encodeURIComponent(formData.get("name") || "");
        var contact = encodeURIComponent(formData.get("contact") || "");
        var message = encodeURIComponent(formData.get("message") || "");
        var body = "Name: " + name + "%0APhone/Email: " + contact + "%0AMessage: " + message;
        window.location.href = "mailto:fgdecoratingltd@gmail.com?subject=New%20enquiry%20from%20website%20popup&body=" + body;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send & Get My Quote"; }
      });
    });
  }
});
