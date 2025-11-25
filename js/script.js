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