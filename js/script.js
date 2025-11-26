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


//============= Voucher Extra Functionality ===============


// List of valid voucher codes and their discount values
const validVouchers = {
    "DISCOUNT10": 10,
    "CLEANTOUCH20": 20
};

// When the user clicks the Apply button
const applyButton = document.getElementById("applyBtn");

if (applyButton) {
    applyButton.addEventListener("click", function () {
        const code = document.getElementById("voucher").value.trim().toUpperCase();

        if (code === "") {
            alert("Please enter a voucher code.");
            return;
        }

        // Check if the voucher exists in our list
        if (validVouchers.hasOwnProperty(code)) {
            const discountValue = validVouchers[code];
            alert("Voucher applied successfully! You saved " + discountValue + " SAR.");
        } else {
            alert("Invalid voucher code. Valid codes are DISCOUNT10 and CLEANTOUCH20");
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

/*------------------------------------------------------YARA-------------------------------------------------------------------*/
// Validation for Application Form (Join Our Team)
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("applicationForm");
  if (!form) return;

  var fullNameInput = document.getElementById("fullName");
  var dobInput      = document.getElementById("dob");
  var emailInput    = document.getElementById("email");
  var expertiseInput= document.getElementById("expertise");
  var educationInput= document.getElementById("education");
  var photoInput    = document.getElementById("photo");
  var skillsInput   = document.getElementById("skills");
  var reasonInput   = document.getElementById("reason");
  var submitBtn     = document.getElementById("submitBtn");


  function isFormValid() {
    var fullName  = fullNameInput.value.trim();
    var dobValue  = dobInput.value;
    var email     = emailInput.value.trim();
    var expertise = expertiseInput.value.trim();
    var skills    = skillsInput.value.trim();
    var photoFile = photoInput.files[0];


    if (!fullName || !dobValue || !email || !expertise || !skills || !photoFile) {
      return false;
    }

  
    if (/^\d/.test(fullName)) {
      return false;
    }

  
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      return false;
    }

  
    if (!photoFile.type || photoFile.type.indexOf("image/") !== 0) {
      return false;
    }

    
    var dobDate       = new Date(dobValue);
    var lastAllowed   = new Date("2008-12-31");
    if (dobDate > lastAllowed) {
      return false;
    }

    return true;
  }

  
  function updateSubmitState() {
    if (isFormValid()) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }


  fullNameInput.addEventListener("input", updateSubmitState);
  dobInput.addEventListener("change", updateSubmitState);
  emailInput.addEventListener("input", updateSubmitState);
  expertiseInput.addEventListener("input", updateSubmitState);
  educationInput.addEventListener("input", updateSubmitState);
  photoInput.addEventListener("change", updateSubmitState);
  skillsInput.addEventListener("input", updateSubmitState);
  reasonInput.addEventListener("input", updateSubmitState);


  form.addEventListener("submit", function (e) {
    e.preventDefault(); // نمنع الإرسال العادي

    if (!isFormValid()) {
      alert("Please fill in all required fields correctly.");
      updateSubmitState();
      return;
    }

    var fullName = fullNameInput.value.trim();

    alert("Your application has been received. Thank you, " + fullName + "!");
    form.reset();
    submitBtn.disabled = true; 
  });
});
/*------------------------------------------------------End YARA-------------------------------------------------------------------*/
/*------------------------------------------------------Najla — Phase 3: Services & Manage Staff ----------------------------------*/

/* ===================  A) Add New Service + Provider Dashboard  =================== */
document.addEventListener("DOMContentLoaded", function () {

  /* --------- 1) Add New Service Page --------- */
  var addServiceForm = document.getElementById("addServiceForm");

  if (addServiceForm) {

    var nameInput  = document.getElementById("serviceName");
    var priceInput = document.getElementById("servicePrice");
    var descInput  = document.getElementById("serviceDescription");
    var photoInput = document.getElementById("servicePhoto");

    addServiceForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name  = nameInput.value.trim();
      var price = priceInput.value.trim();
      var desc  = descInput.value.trim();
      var photo = photoInput.value.trim();

      var errors = [];

      // فحص الحقول الفارغة برسالة محددة
      if (name === "")  errors.push("Service name is empty.");
      if (price === "") errors.push("Service price is empty.");
      if (desc === "")  errors.push("Service description is empty.");
      if (photo === "") errors.push("Service photo is missing.");

      // الاسم لا يبدأ برقم
      if (name !== "" && /^\d/.test(name)) {
        errors.push("Service name cannot start with a number.");
      }

      // السعر لازم رقم
      if (price !== "" && isNaN(Number(price))) {
        errors.push("Service price must be a valid number.");
      }

      // لو فيه أخطاء
      if (errors.length > 0) {
        alert("Please fix the following:\n\n• " + errors.join("\n• "));
        return;
      }

      // قراءة الخدمات القديمة
      var stored = localStorage.getItem("ct_services");
      var services = stored ? JSON.parse(stored) : [];

      // إضافة خدمة جديدة
      services.push({
        name: name,
        price: Number(price),
        description: desc
        // الصورة ثابتة في الداشبورد
      });

      // حفظ
      localStorage.setItem("ct_services", JSON.stringify(services));

      // تنبيه بالنجاح
      alert('Service "' + name + '" has been added successfully.');

      // تفريغ النموذج
      addServiceForm.reset();
    });
  }

  /* --------- 2) Provider Dashboard (عرض الخدمات + total) --------- */
  var listContainer = document.getElementById("providerServicesList");

  if (listContainer) {

    var storedServices = localStorage.getItem("ct_services");
    var servicesArr = storedServices ? JSON.parse(storedServices) : [];

    if (!servicesArr.length) {
      listContainer.innerHTML = "<p>No services added yet.</p>";
    } else {
      listContainer.innerHTML = ""; // تنظيف

      for (var i = 0; i < servicesArr.length; i++) {
        var s = servicesArr[i];

        var card = document.createElement("div");
        card.className = "service-card";

        card.innerHTML =
          '<div class="thumb">' +
            '<img src="images/ddd.png" alt="CleanTouch Service">' +
          '</div>' +
          '<div class="content">' +
            "<p>" +
              "<strong>" + s.name + "</strong><br>" +
              s.description + "<br>" +
              "SAR " + s.price +
            "</p>" +
            '<a href="#" class="btn gray" aria-disabled="true">Edit</a>' +
          "</div>";

        listContainer.appendChild(card);
      }
    }

    // تحديث رقم Total Services
    var totalBox = document.getElementById("totalServices");
    if (totalBox) {
      totalBox.textContent = servicesArr.length;
    }
  }

});

/* ===================  B) Add Staff (نفس فكرة Add Service)  =================== */
document.addEventListener("DOMContentLoaded", function () {

  var addStaffForm = document.getElementById("addStaffForm");
  if (!addStaffForm) return;   // مو في صفحة Add Staff

  addStaffForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var name      = addStaffForm.elements["name"].value.trim();
    var email     = addStaffForm.elements["email"].value.trim();
    var dob       = addStaffForm.elements["dob"].value.trim();
    var expertise = addStaffForm.elements["expertise"].value.trim();
    var skills    = addStaffForm.elements["skills"].value.trim();
    var education = addStaffForm.elements["education"].value.trim();
    var photo     = addStaffForm.elements["photo"].value.trim(); // بس للتأكد إنه مو فاضي لو تبين

    var errors = [];

    if (name === "")      errors.push("Name is empty.");
    if (email === "")     errors.push("Email is empty.");
    if (dob === "")       errors.push("Date of Birth is empty.");
    if (expertise === "") errors.push("Area of expertise is empty.");
    if (skills === "")    errors.push("Skills is empty.");
    if (education === "") errors.push("Education is empty.");
    if (photo === "")     errors.push("Photo is missing.");

    // الاسم لا يبدأ برقم
    if (name !== "" && /^\d/.test(name)) {
      errors.push("Name cannot start with a number.");
    }

    // RegEx بسيط من سلايد الـRegEx
    var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== "" && !emailPattern.test(email)) {
      errors.push("Email is not valid.");
    }

    if (errors.length > 0) {
      alert("Please fix the following:\n\n• " + errors.join("\n• "));
      return;
    }

    // قراءة الستاڤ القديم من localStorage
    var storedStaff = localStorage.getItem("ct_staff");
    var staffArr = storedStaff ? JSON.parse(storedStaff) : [];

    // إضافة موظف جديد
    staffArr.push({
      name: name,
      email: email,
      dob: dob,
      expertise: expertise,
      skills: skills,
      education: education
      // ما نحتاج نخزن الصورة فعلياً، بنعرض صورة ثابتة في manage-staff
    });

    localStorage.setItem("ct_staff", JSON.stringify(staffArr));

    alert('Staff member "' + name + '" has been added successfully.');

    addStaffForm.reset();
  });

});

/* ===================  C) Manage Staff (تحميل + Delete)  =================== */
document.addEventListener("DOMContentLoaded", function () {

  var manageStaffForm = document.getElementById("manageStaffForm");
  if (!manageStaffForm) return;   // مو في صفحة manage-staff

  var staffList = manageStaffForm.querySelector(".staff-list");

  // 1) تحميل الموظفين من localStorage وإضافتهم تحت الموجودين
  var storedStaff = localStorage.getItem("ct_staff");
  var staffArr = storedStaff ? JSON.parse(storedStaff) : [];

  if (staffList && staffArr.length) {
    for (var i = 0; i < staffArr.length; i++) {
      var m = staffArr[i];

      var label = document.createElement("label");
      label.className = "staff-item";

      label.innerHTML =
        '<input type="checkbox" class="staff-check">' +
        '<div><img src="images/emp-new.png" alt="' + m.name + '" width="100" height="56"></div>' +
        '<div>' + m.name + '</div>';

      staffList.appendChild(label);
    }
  }

  // 2) حذف الأعضاء المحددين عند الضغط على Delete
  manageStaffForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var inputs = manageStaffForm.getElementsByTagName("input");
    var selectedCheckboxes = [];
    var selectedNames = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "checkbox" && inputs[i].checked) {
        selectedCheckboxes.push(inputs[i]);
      }
    }

    // لو مافي ولا واحد محدد
    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one member.");
      return;
    }

    // تأكيد الحذف
    var ok = confirm("Are you sure you want to delete selected member(s)?");
    if (!ok) {
      return;
    }

    // حذف من الصفحة + جمع الأسماء عشان نحذفهم من localStorage
    for (var j = 0; j < selectedCheckboxes.length; j++) {
      var cb = selectedCheckboxes[j];
      var item = cb.parentNode;     // label.staff-item

      // اسم الموظف موجود في آخر div داخل الـlabel
      var nameDiv = item.querySelector("div:last-child");
      var memberName = nameDiv ? nameDiv.textContent : "";

      if (memberName !== "") {
        selectedNames.push(memberName);
      }

      if (item && item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }

    // تحديث localStorage: نحذف أي عنصر اسمه ضمن selectedNames
    if (selectedNames.length > 0) {
      var storedAgain = localStorage.getItem("ct_staff");
      var arrAgain = storedAgain ? JSON.parse(storedAgain) : [];

      var filtered = [];
      for (var k = 0; k < arrAgain.length; k++) {
        // نخلي فقط اللي اسمه مو موجود ضمن اللي انحذفوا
        if (selectedNames.indexOf(arrAgain[k].name) === -1) {
          filtered.push(arrAgain[k]);
        }
      }

      localStorage.setItem("ct_staff", JSON.stringify(filtered));
    }

    // نضمن إلغاء التحديد
    manageStaffForm.reset();
  });

});


/*------------------------------------------------------End Najla Phase 3: Services & Manage Staff --------------------------------*/
