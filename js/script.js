document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  /* ================= Theme Switcher ================= */
  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("cleanTouchTheme");

  // تطبيق الثيم المحفوظ سابقاً
  if (savedTheme === "green") {
    body.classList.add("theme-green");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isGreen = body.classList.contains("theme-green");

      if (isGreen) {
        // رجوع للوضع العادي
        body.classList.remove("theme-green");
        localStorage.setItem("cleanTouchTheme", "light");
      } else {
        // تفعيل الثيم الأخضر
        body.classList.add("theme-green");
        localStorage.setItem("cleanTouchTheme", "green");
      }
    });
  }

  /* ================= Back to Top Button ================= */
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 200) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ================= Real-Time Clock in Footer ================= */
  const clockEl = document.getElementById("clock");

  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      clockEl.textContent = timeStr;
    }

    updateClock();
    setInterval(updateClock, 1000);
  }
});


/* ====================== SERVICES PAGE SORTING ====================== */
document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sort");
  const servicesContainer = document.querySelector(".services-container");

  // إذا ليست صفحة السيرفس، تجاهل
  if (!sortSelect || !servicesContainer) return;

  let serviceBoxes = Array.from(
    servicesContainer.querySelectorAll(".service-box")
  );

  /* إعادة عرض البطاقات */
  function renderServices(list) {
    servicesContainer.innerHTML = "";
    list.forEach((card) => servicesContainer.appendChild(card));
  }

  /* ترتيب عشوائي */
  function shuffleServices() {
    const shuffled = [...serviceBoxes].sort(() => Math.random() - 0.5);
    renderServices(shuffled);
  }

  /* ترتيب بالأبجدية */
  function sortByName(order) {
    const sorted = [...serviceBoxes].sort((a, b) => {
      const nameA = a.querySelector("h3").innerText.toLowerCase();
      const nameB = b.querySelector("h3").innerText.toLowerCase();

      return order === "a-z"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    renderServices(sorted);
  }

  /* ترتيب بالسعر */
  function sortByPrice(order) {
    const sorted = [...serviceBoxes].sort((a, b) => {
      const priceA = parseInt(
        a.querySelector(".price").innerText.replace("SAR", "").trim()
      );
      const priceB = parseInt(
        b.querySelector(".price").innerText.replace("SAR", "").trim()
      );

      return order === "low-high" ? priceA - priceB : priceB - priceA;
    });

    renderServices(sorted);
  }

  /* عند تغيير القائمة */
  sortSelect.addEventListener("change", function () {
    if (this.value === "a-z" || this.value === "z-a") {
      sortByName(this.value);
    } else if (this.value === "low-high" || this.value === "high-low") {
      sortByPrice(this.value);
    }
  });

  /* ترتيب عشوائي عند فتح الصفحة */
  shuffleServices();
});

/*------------------------------------------------------TALA-------------------------------------------------------------------*/
/*  This code is written in a clean, simple style
 *  that matches your course slides: DOM, events,
 *  validation, alert(), confirm(), and basic RegEx.*/


/* ====================================================
   SECTION 1 — REQUEST A SERVICE PAGE 
   ==================================================== */

if (document.getElementById("requestForm")) {

    // Get form elements
    const form = document.getElementById("requestForm");
    const service = document.getElementById("service");
    const fullName = document.getElementById("fullName");
    const date = document.getElementById("dueDate");
    const time = document.getElementById("time");
    const description = document.getElementById("description");

    // Where we show added requests (if user chooses to stay)
    const summaryBox = document.getElementById("requestSummary");
    const requestList = document.getElementById("requestList");

    let storedRequests = [];   // temporary list (erased when page closes)

    // Form submission handler
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let errors = [];

        /* -----------------------------
           VALIDATION (From Phase 3 PDF)
           ----------------------------- */

        // No service selected
        if (service.value.trim() === "") {
            errors.push("Please select a service.");
        }

        // Validate full name (must contain two names, no numbers/symbols)
        let nameValue = fullName.value.trim();
        let hasBadChars = /[0-9?!@]/.test(nameValue);
        let isFull = nameValue.split(" ").length >= 2;

        if (nameValue === "" || hasBadChars || !isFull) {
            errors.push("Please enter a valid full name (no numbers or ?!@).");
        }

        // Validate date (must be at least 2 days ahead)
        if (date.value === "") {
            errors.push("Please select a valid date.");
        } else {
            const today = new Date();
            today.setHours(0,0,0,0);

            const selected = new Date(date.value);
            const diff = (selected - today) / (1000 * 60 * 60 * 24);

            if (diff < 2) {
                errors.push("Due date is too soon. Please choose a date at least 2 days from today.");
            }
        }

        // Description must be 100+ characters
        if (description.value.trim().length < 100) {
            errors.push("Description must be at least 100 characters long.");
        }

        // If any errors exist → show alert and STOP
        if (errors.length > 0) {
            alert("Please fix the following:\n\n• " + errors.join("\n• "));
            return;
        }

        /* -----------------------------
           FORM IS VALID → CONFIRM BOX
           ----------------------------- */
        const stay = confirm(
            "Your request has been sent successfully.\n\n" +
            "Click OK to stay here and view your requests,\n" +
            "or Cancel to return to the Customer Dashboard."
        );

        // Build request object
        const requestObj = {
            service: service.value,
            name: nameValue,
            date: date.value,
            time: time.value || "(no time chosen)",
            description: description.value
        };

        if (stay) {
            // Show the summary box
            summaryBox.style.display = "block";

            // Add to temporary list
            storedRequests.push(requestObj);

            // Display visually
            const li = document.createElement("li");
            li.textContent =
                requestObj.service + " | " +
                requestObj.name + " | " +
                requestObj.date + " " +
                requestObj.time + " | " +
                requestObj.description;

            li.style.marginBottom = "10px";
            requestList.appendChild(li);

            // Reset form for new entry
            form.reset();
        } else {
            // Return to dashboard
            window.location.href = "customer-dashboard.html";
        }
    });
}



/* ====================================================
   SECTION 2 — SERVICE EVALUATION PAGE 
   ==================================================== */

if (document.getElementById("evaluationForm")) {

    const form = document.getElementById("evaluationForm");
    const service = document.getElementById("evalService");
    const fullName = document.getElementById("evalName");
    const feedback = document.getElementById("feedback");

    // Remove red highlight (small helper function)
    function clearHighlight() {
        service.classList.remove("field-error");
        fullName.classList.remove("field-error");
        feedback.classList.remove("field-error");
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        clearHighlight();

        let errors = [];

        const serviceValue = service.value.trim();
        const nameValue = fullName.value.trim();
        const feedbackValue = feedback.value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');

        /* -----------------------------
           VALIDATION (From PDF)
           ----------------------------- */

        if (serviceValue === "") {
            errors.push("Please select a service.");
            service.classList.add("field-error");
        }

        if (!rating) {
            errors.push("Please choose a rating.");
        }

        if (feedbackValue === "") {
            errors.push("Please enter feedback.");
            feedback.classList.add("field-error");
        }

        if (errors.length > 0) {
            alert("Please fix the following:\n\n• " + errors.join("\n• "));
            return;
        }

        /* -----------------------------
           CHECK RATING AND THANK USER
           ----------------------------- */
        const stars = parseInt(rating.value);

        if (stars >= 4) {
            alert("Thank you for your positive feedback!");
        } else {
            alert("Thank you for your review. We're sorry your experience wasn't perfect.");
        }

        // Redirect back to dashboard
        window.location.href = "customer-dashboard.html";
    });
}




/*------------------------------------------------------TALA-------------------------------------------------------------------*/