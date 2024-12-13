let wheel = document.querySelector('.wheel');
let spinBtn = document.querySelector('.spinBtn');
let popup = document.getElementById('popup');
let resultText = document.getElementById('resultText');
let closePopup = document.getElementById('closePopup');

// Define weighted probabilities for each slice
const prizes = [
    { label: "5% Off", probability: 10 },    // Top (slice 0)
    { label: "So Close", probability: 25 }, // Slice 1
    { label: "15% Off", probability: 10 },  // Slice 2
    { label: "So Close", probability: 25 }, // Slice 3
    { label: "20% Off", probability: 0 },   // Slice 4 (excluded)
    { label: "No luck today", probability: 55 }, // Slice 5
    { label: "50% Off", probability: 0 },   // Slice 6 (excluded)
    { label: "So Close", probability: 25 }, // Slice 7
];

const slices = prizes.length; // Total number of slices
const sliceAngle = 360 / slices; // Angle per slice
const cumulativeWeights = prizes.reduce((acc, prize, index) => {
    const weight = index === 0 ? prize.probability : prize.probability + acc[index - 1];
    return [...acc, weight];
}, []);

// Generate random prize based on weighted probabilities
function getRandomPrize() {
    const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (random < cumulativeWeights[i]) {
            return i; // Return the prize index
        }
    }
    return 0; // Default to the first prize
}

spinBtn.onclick = function () {
    const selectedPrizeIndex = getRandomPrize(); // Get a weighted random prize

    const baseRotation = 3600; // Spin multiple full rotations (e.g., 10 full spins)
    const sliceRotation = selectedPrizeIndex * sliceAngle; // Rotate to the selected slice
    const offsetToCenter = sliceAngle / 2; // Align pointer to the center of the slice
    const finalRotation = baseRotation - sliceRotation - offsetToCenter; // Subtract offset for pointer alignment

    // Rotate the wheel
    wheel.style.transition = "transform 5s ease-in-out";
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    // Show result in a popup after the animation ends
    setTimeout(() => {
        resultText.textContent = `You won: ${prizes[selectedPrizeIndex].label}`;
        popup.style.display = "flex";
    }, 5000); // Match the animation duration
};

// Close popup functionality
closePopup.onclick = function () {
    popup.style.display = "none";
};

function visualizeSlices() {
    prizes.forEach((prize, index) => {
        console.log(`Slice ${index + 1}: ${prize.label}`);
    });
}

visualizeSlices();
