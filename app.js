function initAutocomplete() {
    const pickupInput = document.getElementById("pickup-location");
    const dropoffInput = document.getElementById("dropoff-location");

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
        types: ["geocode"], // Можно заменить на ["establishment"] для компаний
        componentRestrictions: {
            country: "uk"
        }, // Ограничение по стране
    });

    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, {
        types: ["geocode"],
        componentRestrictions: {
            country: "uk"
        },
    });

    // Пример: получение деталей выбранного места
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

document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".quiz_steps__formsItem");
    const stepIndicators = document.querySelectorAll(".quiz_step__item");
    const nextButtons = document.querySelectorAll(".quiz_btn");

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.style.display = i === index ? "block" : "none";

            const circle = stepIndicators[i].querySelector(".quiz_stepItem__circle");

            circle.classList.remove("active", "future", "completed");

            if (i < index) {
                circle.classList.add("completed");
            } else if (i === index) {
                circle.classList.add("active");
            } else {
                circle.classList.add("future");
            }
        });
    }


    // function validateStep(index) {
    //     const step = steps[index];
    //     const requiredInputs = step.querySelectorAll("input, select, textarea");
    //     let valid = true;

    //     requiredInputs.forEach((input) => {
    //         if (input.type !== "checkbox" && input.offsetParent !== null) {
    //             if (input.value.trim() === "" || input.value === "Hours required") {
    //                 input.classList.add("invalid");
    //                 valid = false;
    //             } else {
    //                 input.classList.remove("invalid");
    //             }
    //         }
    //     });
    //     return valid;
    // }

    nextButtons.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            // if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
            // }
        });
    });

    showStep(currentStep);
});