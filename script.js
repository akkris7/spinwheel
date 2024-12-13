const wheel = document.querySelector('.wheel');
const spinBtn = document.getElementById('spinBtn');
const formPopup = document.getElementById('formPopup');
const resultPopup = document.getElementById('resultPopup');
const userForm = document.getElementById('userForm');
const resultText = document.getElementById('resultText');
const closeResultPopup = document.getElementById('closeResultPopup');

// Define prizes in clockwise order as they appear on the wheel
const prizes = [
    "5% Off",         // Slice 1
    "So Close 😔",    // Slice 2
    "15% Off",        // Slice 3
    "So Close 😔",    // Slice 4
    "20% Off",        // Slice 5 (Excluded)
    "No luck today 😞", // Slice 6
    "50% Off",        // Slice 7 (Excluded)
    "So Close 😔"     // Slice 8
];
const probabilities = [
    10, // 5% Off
    40, // So Close 😔
    10, // 15% Off
    40, // So Close 😔
    0,  // 20% Off (Excluded)
    40, // No luck today 😞
    0,  // 50% Off (Excluded)
    40  // So Close 😔
];

// Calculate cumulative weights
const totalWeight = probabilities.reduce((sum, weight) => sum + weight, 0);
const cumulativeWeights = probabilities.reduce((acc, weight) => {
    acc.push((acc.length ? acc[acc.length - 1] : 0) + weight);
    return acc;
}, []);

// Check if the user has already spun
const user = localStorage.getItem('user');
if (!user) {
    formPopup.style.display = 'flex';
} else {
    spinBtn.removeAttribute('disabled');
}

// Close result popup
closeResultPopup.onclick = function () {
    resultPopup.style.display = 'none';
};

// Handle form submission
// Handle form submission
// Handle form submission
userForm.onsubmit = async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const phoneError = document.getElementById('phoneError');

    // Validate Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        phoneError.textContent = "Invalid phone number. Please enter a valid 10-digit Indian phone number.";
        phoneError.style.display = "block";
        return;
    } else {
        phoneError.style.display = "none"; // Hide error message when valid
    }

    // Send data to Google Sheets
    const payload = { name, phone };
    try {
        const response = await fetch("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
            alert("Entry saved successfully!");
            formPopup.style.display = 'none';
            spinBtn.removeAttribute('disabled');
        } else {
            alert("Failed to save your entry. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting your entry.");
    }
};

// Select a slice based on probabilities
function getRandomSlice() {
    const random = Math.random() * totalWeight; // Random number between 0 and total weight
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random <= cumulativeWeights[i]) {
            return i; // Return the slice index
        }
    }
    return 0; // Fallback to first slice (shouldn't happen)
}

// Spin logic
spinBtn.onclick = function () {
    if (localStorage.getItem('hasSpun')) {
        alert("You have already spun the wheel!");
        return;
    }

    const randomSlice = getRandomSlice();
    const extraSpins = 360 * 10; // Ensure multiple full spins
    const finalAngle = extraSpins + randomSlice * (360 / prizes.length);

    // Rotate the wheel
    wheel.style.transition = "transform 5s ease-in-out";
    wheel.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        // Double-check the normalized angle for debugging
        const normalizedAngle = (finalAngle % 360) + (360 / prizes.length) / 2;
        const selectedSliceIndex = Math.floor(normalizedAngle / (360 / prizes.length)) % prizes.length;

        // Display the prize
        const prize = prizes[selectedSliceIndex];
        resultPopup.style.display = 'flex';
        resultText.textContent = prize;

        // Save spin status
        localStorage.setItem('hasSpun', true);
    }, 5000);
};
