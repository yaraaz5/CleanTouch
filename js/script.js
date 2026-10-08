/*START*/

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("cleanTouchTheme");

  if (savedTheme === "green") {
    body.classList.add("theme-green");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isGreen = body.classList.contains("theme-green");

      if (isGreen) {
        body.classList.remove("theme-green");
        localStorage.setItem("cleanTouchTheme", "light");
      } else {
        body.classList.add("theme-green");
        localStorage.setItem("cleanTouchTheme", "green");
      }
    });
  }

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



document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sort");
  const servicesContainer = document.querySelector(".services-container");

  if (!sortSelect || !servicesContainer) return;

  let serviceBoxes = Array.from(
    servicesContainer.querySelectorAll(".service-box")
  );

  function renderServices(list) {
    servicesContainer.innerHTML = "";
    list.forEach((card) => servicesContainer.appendChild(card));
  }

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

  function applySort(value) {
    if (value === "a-z" || value === "z-a") {
      sortByName(value);
    } else if (value === "low-high" || value === "high-low") {
      sortByPrice(value);
    }
  }

  sortSelect.addEventListener("change", function () {
    applySort(this.value);
  });

  // Show the list in the order the dropdown says (previously it was shuffled
  // on load while the dropdown still read "A - Z").
  applySort(sortSelect.value);
});

/*------------------------------------------------------TALA-------------------------------------------------------------------*/



/* REQUEST A SERVICE PAGE */


if (document.getElementById("requestForm")) {

    
    const form = document.getElementById("requestForm");
    const service = document.getElementById("service");
    const fullName = document.getElementById("fullName");
    const date = document.getElementById("dueDate");
    const time = document.getElementById("time");
    const description = document.getElementById("description");

  
    const summaryBox = document.getElementById("requestSummary");
    const requestList = document.getElementById("requestList");

    let storedRequests = [];

    // "Book Now" on the Services page links here with ?service=<name>.
    // Pre-select the matching option (names differ slightly, e.g. "Folding"
    // vs "Folding Clothes Professionally", so match on the start of the name).
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested) {
        const wanted = requested.toLowerCase().replace(/[^a-z]/g, "");
        for (const option of service.options) {
            const name = option.value.toLowerCase().replace(/[^a-z]/g, "");
            if (option.value && name.startsWith(wanted)) {
                service.value = option.value;
                break;
            }
        }
    }

   
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let errors = [];


        if (service.value.trim() === "") {
            errors.push("Please select a service.");
        }


        let nameValue = fullName.value.trim();
        let hasBadChars = /[0-9?!@]/.test(nameValue);
        let isFull = nameValue.split(" ").length >= 2;

        if (nameValue === "" || hasBadChars || !isFull) {
            errors.push("Please enter a valid full name (no numbers or ?!@).");
        }


        if (date.value === "") {
            errors.push("Please select a valid date.");
        } else {
            const today = new Date();
            today.setHours(0,0,0,0);

            // "T00:00" makes the date local midnight (a bare "YYYY-MM-DD" is read as UTC)
            const selected = new Date(date.value + "T00:00");
            const diff = (selected - today) / (1000 * 60 * 60 * 24);

            if (diff < 2) {
                errors.push("Due date is too soon. Please choose a date at least 2 days from today.");
            }
        }

        if (description.value.trim().length < 100) {
            errors.push("Description must be at least 100 characters long.");
        }

        if (errors.length > 0) {
            alert("Please fix the following:\n\n• " + errors.join("\n• "));
            return;
        }

      
        const stay = confirm(
            "Your request has been sent successfully.\n\n" +
            "Click OK to stay here and view your requests,\n" +
            "or Cancel to return to the Customer Dashboard."
        );


        const requestObj = {
            service: service.value,
            name: nameValue,
            date: date.value,
            time: time.value || "(no time chosen)",
            description: description.value
        };

        if (stay) {
            summaryBox.style.display = "block";

            storedRequests.push(requestObj);

            const li = document.createElement("li");
            li.textContent =
                requestObj.service + " | " +
                requestObj.name + " | " +
                requestObj.date + " " +
                requestObj.time + " | " +
                requestObj.description;

            li.style.marginBottom = "10px";
            requestList.appendChild(li);

           
            form.reset();
        } else {
            window.location.href = "customer-dashboard.html";
        }
    });
}


//Voucher Extra Functionality 


const validVouchers = {
    "DISCOUNT10": 10,
    "CLEANTOUCH20": 20
};

const applyButton = document.getElementById("applyBtn");

if (applyButton) {
    applyButton.addEventListener("click", function () {
        const code = document.getElementById("voucher").value.trim().toUpperCase();

        if (code === "") {
            alert("Please enter a voucher code.");
            return;
        }


        if (validVouchers.hasOwnProperty(code)) {
            const discountValue = validVouchers[code];
            // CLEANTOUCH20 is advertised on the home page as 20% off, not 20 SAR
            alert("Voucher applied successfully! You get " + discountValue + "% off your order.");
        } else {
            alert("Invalid voucher code. Valid codes are DISCOUNT10 and CLEANTOUCH20");
        }
    });
}



/* SERVICE EVALUATION PAGE */
 

if (document.getElementById("evaluationForm")) {

    const form = document.getElementById("evaluationForm");
    const service = document.getElementById("evalService");
    const fullName = document.getElementById("evalName");
    const feedback = document.getElementById("feedback");

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



        if (serviceValue === "") {
            errors.push("Please select a service.");
            service.classList.add("field-error");
        }

        if (nameValue === "" || /[0-9?!@]/.test(nameValue)) {
            errors.push("Please enter your full name (no numbers or ?!@).");
            fullName.classList.add("field-error");
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


        const stars = parseInt(rating.value);

        if (stars >= 4) {
            alert("Thank you for your positive feedback!");
        } else {
            alert("Thank you for your review. We're sorry your experience wasn't perfect.");
        }


        window.location.href = "customer-dashboard.html";
    });
}




/*------------------------------------------------------TALA END -------------------------------------------------------------------*/

/*------------------------------------------------------YARA-------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("applicationForm");
  if (!form) return;

  var fullNameInput  = document.getElementById("fullName");
  var dobInput       = document.getElementById("dob");
  var emailInput     = document.getElementById("email");
  var expertiseInput = document.getElementById("expertise");
  var educationInput = document.getElementById("education");
  var skillsInput    = document.getElementById("skills");
  var reasonInput    = document.getElementById("reason");
  var photoInput     = document.getElementById("photo");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fullName  = fullNameInput.value.trim();
    var dobValue  = dobInput.value;
    var email     = emailInput.value.trim();
    var expertise = expertiseInput.value.trim();
    var education = educationInput.value.trim();
    var skills    = skillsInput.value.trim();
    var reason    = reasonInput.value.trim();
    var photoFile = photoInput.files[0];

    var errors = [];

   
    if (!fullName) errors.push("Full Name is required.");
    if (!dobValue) errors.push("Date of Birth is required.");
    if (!email) errors.push("Email is required.");
    if (!expertise) errors.push("Area of Expertise is required.");
    if (!education) errors.push("Education is required.");
    if (!skills) errors.push("Skills & Achievements field is required.");
    if (!reason) errors.push("Reason for applying is required.");
    if (!photoFile) errors.push("Photo upload is required.");

    
    if (fullName && /^\d/.test(fullName)) {
      errors.push("Full Name cannot start with a number.");
    }

    
    if (dobValue) {
      var dobDate = new Date(dobValue);
      var lastAllowed = new Date("2008-12-31");
      if (dobDate > lastAllowed) {
        errors.push("Date of Birth must not be after 2008.");
      }
    }

   
    if (photoFile && !photoFile.type.startsWith("image/")) {
      errors.push("Photo must be an image file (jpg, jpeg, png, gif).");
    }

   
    if (errors.length > 0) {
      alert("Please fix the following:\n\n• " + errors.join("\n• "));
      return;
    }

   
    alert("Thank you, " + fullName + "! Your application has been successfully submitted.");
    form.reset();
  });
});
/*------------------------------------------------------End YARA-------------------------------------------------------------------*/
/*------------------------------------------------------Najla — Phase 3: Services & Manage Staff ----------------------------------*/

/* ===================  A) Add New Service + Provider Dashboard  =================== */
document.addEventListener("DOMContentLoaded", function () {

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

      if (name === "")  errors.push("Service name is empty.");
      if (price === "") errors.push("Service price is empty.");
      if (desc === "")  errors.push("Service description is empty.");
      if (photo === "") errors.push("Service photo is missing.");

      if (name !== "" && /^\d/.test(name)) {
        errors.push("Service name cannot start with a number.");
      }

      if (price !== "" && isNaN(Number(price))) {
        errors.push("Service price must be a valid number.");
      }

      if (errors.length > 0) {
        alert("Please fix the following:\n\n• " + errors.join("\n• "));
        return;
      }

      var stored = localStorage.getItem("ct_services");
      var services = stored ? JSON.parse(stored) : [];

      services.push({
        name: name,
        price: Number(price),
        description: desc
      });

      localStorage.setItem("ct_services", JSON.stringify(services));

      alert('Service "' + name + '" has been added successfully.');

      addServiceForm.reset();
    });
  }

  var listContainer = document.getElementById("providerServicesList");

  if (listContainer) {

    var storedServices = localStorage.getItem("ct_services");
    var servicesArr = storedServices ? JSON.parse(storedServices) : [];

    // Keep the four built-in services and add the provider's new ones after
    // them. (Previously the list was cleared on every load, so a first-time
    // visitor saw "0 services" and adding one service hid the built-in four.)
    for (var i = 0; i < servicesArr.length; i++) {
      var s = servicesArr[i];

      var card = document.createElement("div");
      card.className = "service-card";

      var thumb = document.createElement("div");
      var img = document.createElement("img");
      img.src = "images/ddd.png";
      img.alt = s.name;
      img.className = "service-img";
      thumb.appendChild(img);

      // Build text with textContent so user input is never parsed as HTML
      var content = document.createElement("div");
      content.className = "content";
      var p = document.createElement("p");
      p.appendChild(document.createTextNode(s.name));
      p.appendChild(document.createElement("br"));
      p.appendChild(document.createTextNode(s.description));
      p.appendChild(document.createElement("br"));
      p.appendChild(document.createTextNode("SAR " + s.price));
      var edit = document.createElement("a");
      edit.className = "btn gray";
      edit.href = "#";
      edit.textContent = "Edit";
      content.appendChild(p);
      content.appendChild(edit);

      card.appendChild(thumb);
      card.appendChild(content);
      listContainer.appendChild(card);
    }

    var totalBox = document.getElementById("totalServices");
    if (totalBox) {
      totalBox.textContent = listContainer.querySelectorAll(".service-card").length;
    }
  }

  // Staff Members tile: the 4 original staff, minus any deleted, plus any added
  var staffCountBox = document.getElementById("staffCount");
  if (staffCountBox) {
    var removedDefaults = JSON.parse(localStorage.getItem("ct_removed_staff") || "[]");
    var addedStaff = JSON.parse(localStorage.getItem("ct_staff") || "[]");
    staffCountBox.textContent = DEFAULT_STAFF_COUNT - removedDefaults.length + addedStaff.length;
  }

});

// Number of staff members hard-coded in manage-staff.html / about.html
var DEFAULT_STAFF_COUNT = 4;

document.addEventListener("DOMContentLoaded", function () {

  var addStaffForm = document.getElementById("addStaffForm");
  if (!addStaffForm) return;   

  addStaffForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var name      = addStaffForm.elements["name"].value.trim();
    var email     = addStaffForm.elements["email"].value.trim();
    var dob       = addStaffForm.elements["dob"].value.trim();
    var expertise = addStaffForm.elements["expertise"].value.trim();
    var skills    = addStaffForm.elements["skills"].value.trim();
    var education = addStaffForm.elements["education"].value.trim();
    var photo     = addStaffForm.elements["photo"].value.trim(); 

    var errors = [];

    if (name === "")      errors.push("Name is empty.");
    if (email === "")     errors.push("Email is empty.");
    if (dob === "")       errors.push("Date of Birth is empty.");
    if (expertise === "") errors.push("Area of expertise is empty.");
    if (skills === "")    errors.push("Skills is empty.");
    if (education === "") errors.push("Education is empty.");
    if (photo === "")     errors.push("Photo is missing.");

    if (name !== "" && /^\d/.test(name)) {
      errors.push("Name cannot start with a number.");
    }

    var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== "" && !emailPattern.test(email)) {
      errors.push("Email is not valid.");
    }

    if (errors.length > 0) {
      alert("Please fix the following:\n\n• " + errors.join("\n• "));
      return;
    }

    var storedStaff = localStorage.getItem("ct_staff");
    var staffArr = storedStaff ? JSON.parse(storedStaff) : [];

    staffArr.push({
      name: name,
      email: email,
      dob: dob,
      expertise: expertise,
      skills: skills,
      education: education
    });

    localStorage.setItem("ct_staff", JSON.stringify(staffArr));

    alert('Staff member "' + name + '" has been added successfully.');

    addStaffForm.reset();
  });

});

document.addEventListener("DOMContentLoaded", function () {

  var manageStaffForm = document.getElementById("manageStaffForm");
  if (!manageStaffForm) return;   

  var staffList = manageStaffForm.querySelector(".staff-list");

  function memberName(item) {
    var nameEl = item.querySelector("span:last-child");
    return nameEl ? nameEl.textContent.trim() : "";
  }

  // The four original staff are written in the HTML. Remember their names, and
  // hide any the provider deleted earlier so deletions survive a page reload.
  var defaultNames = [];
  var removedDefaults = JSON.parse(localStorage.getItem("ct_removed_staff") || "[]");
  var defaultItems = staffList ? staffList.querySelectorAll(".staff-item") : [];
  for (var d = 0; d < defaultItems.length; d++) {
    var defaultName = memberName(defaultItems[d]);
    defaultNames.push(defaultName);
    if (removedDefaults.indexOf(defaultName) !== -1) {
      defaultItems[d].parentNode.removeChild(defaultItems[d]);
    }
  }

  var storedStaff = localStorage.getItem("ct_staff");
  var staffArr = storedStaff ? JSON.parse(storedStaff) : [];

  if (staffList && staffArr.length) {
    for (var i = 0; i < staffArr.length; i++) {
      var m = staffArr[i];

      // Same markup as the original staff; generic avatar (no photo is stored)
      var label = document.createElement("label");
      label.className = "staff-item";

      var check = document.createElement("input");
      check.type = "checkbox";
      check.className = "staff-check";

      var photoWrap = document.createElement("span");
      var photo = document.createElement("img");
      photo.src = "images/CustIcon.png";
      photo.alt = m.name;
      photo.width = 100;
      photo.height = 56;
      photo.style.objectFit = "contain";
      photoWrap.appendChild(photo);

      var nameSpan = document.createElement("span");
      nameSpan.textContent = m.name;

      label.appendChild(check);
      label.appendChild(photoWrap);
      label.appendChild(nameSpan);
      staffList.appendChild(label);
    }
  }

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

    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one member.");
      return;
    }

    var ok = confirm("Are you sure you want to delete selected member(s)?");
    if (!ok) {
      return;
    }

    for (var j = 0; j < selectedCheckboxes.length; j++) {
      var cb = selectedCheckboxes[j];
      var item = cb.parentNode;     // label.staff-item

      var name = memberName(item);
      if (name !== "") {
        selectedNames.push(name);
      }

      if (item && item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }

    if (selectedNames.length > 0) {
      var storedAgain = localStorage.getItem("ct_staff");
      var arrAgain = storedAgain ? JSON.parse(storedAgain) : [];

      var filtered = [];
      for (var k = 0; k < arrAgain.length; k++) {
        if (selectedNames.indexOf(arrAgain[k].name) === -1) {
          filtered.push(arrAgain[k]);
        }
      }

      localStorage.setItem("ct_staff", JSON.stringify(filtered));

      // Remember deleted original staff (they live in the HTML, not storage)
      var removed = JSON.parse(localStorage.getItem("ct_removed_staff") || "[]");
      for (var r = 0; r < selectedNames.length; r++) {
        if (defaultNames.indexOf(selectedNames[r]) !== -1 && removed.indexOf(selectedNames[r]) === -1) {
          removed.push(selectedNames[r]);
        }
      }
      localStorage.setItem("ct_removed_staff", JSON.stringify(removed));
    }

    manageStaffForm.reset();
  });

});



/*------------------------------------------------------End Najla Phase 3: Services & Manage Staff --------------------------------*/
