/* ──────────────────────────────────────────
   Google Maps Places Autocomplete           
────────────────────────────────────────── */
function initAutocomplete() {
    const pickupInput = document.getElementById("pickup-location");
    const dropoffInput = document.getElementById("dropoff-location");

    if (!window.google || !google.maps) return; // fail‑safe

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
        types: ["geocode"],
        componentRestrictions: {
            country: "uk"
        },
    });

    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, {
        types: ["geocode"],
        componentRestrictions: {
            country: "uk"
        },
    });

    pickupAutocomplete.addListener("place_changed", () => {
        const place = pickupAutocomplete.getPlace();
        console.log("Pickup place:", place);
    });

    dropoffAutocomplete.addListener("place_changed", () => {
        const place = dropoffAutocomplete.getPlace();
        console.log("Dropoff place:", place);
    });
}

window.addEventListener("load", initAutocomplete);

/* ──────────────────────────────────────────
   Multi‑step form logic                     
────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

    const dateInput = document.getElementById("trip-date");
    /* selectors */
    const steps = document.querySelectorAll(".quiz_steps__formsItem");
    const stepIndicators = document.querySelectorAll(".quiz_step__item");
    const nextButtons = document.querySelectorAll(".quiz_btn");
    const allInputs = document.querySelectorAll("input, select, textarea");
    const confirmButton = document.querySelector(".quiz_steps__formsItem:last-child .quiz_btn");
    const tabButtons = document.querySelectorAll(".quiz_tabs__btn");

    /* 1. auto‑save every field to localStorage */
    allInputs.forEach((el, i) => {
        if (!el.name && !el.id) el.dataset.key = `field-${i}`;
        const key = el.name || el.id || el.dataset.key;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            if (el.type === "checkbox") el.checked = saved === "true";
            else el.value = saved;
        }
        el.addEventListener("input", () => {
            if (el.type === "checkbox") localStorage.setItem(key, el.checked);
            else localStorage.setItem(key, el.value);
        });
    });

    flatpickr(dateInput, {
        enableTime: true, // показываем выбор времени
        dateFormat: "d.m.Y H:i", // формат, который увидит пользователь
        altInput: false, // оставляем одно поле
        minDate: "today", // нельзя выбрать прошедшую дату
        time_24hr: true,
        onChange() {
            /* Flatpickr ставит value программно, 
               поэтому вручную триггерим событие, 
               чтобы ваш autosave его поймал */
            dateInput.dispatchEvent(new Event("input", {
                bubbles: true
            }));
        }
    });


    /* 2. One‑way / By‑the‑hour tabs */
    const dropoffGroup = document.getElementById("dropoff-location").closest(".quiz_inputs");
    const hireDurationGroup = document.querySelector("select[name='hours']").closest(".quiz_inputs");

    function toggleMode(mode) {
        if (mode === "one-way") {
            dropoffGroup.style.display = "block";
            hireDurationGroup.style.display = "none";
        } else {
            dropoffGroup.style.display = "none";
            hireDurationGroup.style.display = "block";
        }
    }

    let tripMode = localStorage.getItem("tripMode") || "one-way";
    toggleMode(tripMode);

    tabButtons.forEach(btn => {
        const label = btn.textContent.trim().toLowerCase();
        if ((tripMode === "one-way" && label === "one way") || (tripMode === "by-the-hour" && label === "by the hour")) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            tripMode = label.startsWith("one") ? "one-way" : "by-the-hour";
            localStorage.setItem("tripMode", tripMode);
            toggleMode(tripMode);
        });
    });

    /* 3. stepper */
    let currentStep = 0;
    const setIndicatorState = (idx) => {
        stepIndicators.forEach((item, i) => {
            const circle = item.querySelector(".quiz_stepItem__circle");
            circle.classList.remove("active", "future", "completed");
            if (i < idx) circle.classList.add("completed");
            else if (i === idx) circle.classList.add("active");
            else circle.classList.add("future");
        });
    };
    const showStep = (idx) => {
        steps.forEach((el, i) => el.style.display = i === idx ? "block" : "none");
        setIndicatorState(idx);
    };

    /* 4. handle Select car + next */
    nextButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (btn.closest(".cars_price")) {
                const card = btn.closest(".quiz_steps__formsItem__cars");
                const carName = card.querySelector(".cars__head h3").textContent.trim();
                const carPrice = card.querySelector(".cars_price span").textContent.trim();
                localStorage.setItem("selectedCar", JSON.stringify({
                    name: carName,
                    price: carPrice
                }));
            }
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
                if (currentStep === steps.length - 1) populateSummary();
            }
        });
    });

    /* 5. populate final summary */
    function populateSummary() {
        const data = JSON.parse(localStorage.getItem("selectedCar") || "null");
        if (!data) return;
        const summaryText = document.querySelector(".quiz_steps__formsItem__preview__content p");
        if (summaryText) summaryText.textContent = `${data.name} – ${data.price}`;
    }

    /* 6. fake API + clear */
    confirmButton?.addEventListener("click", (e) => {
        e.preventDefault();
        confirmButton.classList.add("loading");
        confirmButton.querySelector("p").textContent = "Processing…";
        setTimeout(() => {
            alert("Booking confirmed! (demo)");
            localStorage.clear();
            location.reload();
        }, 1200);
    });

    /* init */
    showStep(currentStep);
});