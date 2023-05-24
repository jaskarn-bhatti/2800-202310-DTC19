// Get the reference to the totalTime, stepsTaken, exerciseType, and caloriesBurned elements
const totalTimeElement = document.getElementById('totalTime');
const stepsTakenElement = document.getElementById('stepsTaken');
const exerciseTypeElement = document.getElementById('exerciseType');
const caloriesBurnedElement = document.getElementById('caloriesBurned');
const hiddenTotalTimeElement = document.getElementById('hiddenTotalTime');
const hiddenStepsTakenElement = document.getElementById('hiddenStepsTaken');
const hiddenExerciseTypeElement = document.getElementById('hiddenExerciseType');
const hiddenCaloriesBurnedElement = document.getElementById('hiddenCaloriesBurned');
const saveExerciseButton = document.getElementById('saveExerciseButton');

// Retrieve the total time from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const totalTime = urlParams.get('time');

// Update the totalTime element and hiddenTotalTime value with the actual total time
totalTimeElement.textContent = totalTime;
hiddenTotalTimeElement.value = totalTime;

// Function to calculate activity multiplier based on activity level
function getActivityMultiplier(activityLevel) {
    if (activityLevel === 'sedentary') {
        return 1.2;
    } else if (activityLevel === 'lightlyActive') {
        return 1.375;
    } else if (activityLevel === 'moderatelyActive') {
        return 1.55;
    } else if (activityLevel === 'veryActive') {
        return 1.725;
    }
    // Default value
    return 1.2;
}

// Calculate calories burned when the "Calculate Calories" button is clicked
function calculateCaloriesBurned() {
    const stepsTaken = parseInt(stepsTakenElement.value);
    const exerciseType = exerciseTypeElement.value;
    let caloriesBurned = 0;
    let baseMETVal = 0;

    // Update the hidden input fields
    hiddenStepsTakenElement.value = stepsTaken;
    hiddenExerciseTypeElement.value = exerciseType;

    // Retrieve user information from session
    const weightElement = document.getElementById('userWeight');
    const ageElement = document.getElementById('userAge');
    const heightElement = document.getElementById('userHeight');
    const activityLevelElement = document.getElementById('userActivityLevel');

    const weight = parseFloat(weightElement.dataset.weight);
    const age = parseInt(ageElement.dataset.age);
    const height = parseFloat(heightElement.dataset.height);
    const activityLevel = activityLevelElement.value;
    const activityModifier = getActivityMultiplier(activityLevel);

    if (exerciseType === 'run') {
        baseMETVal = 7;
    } else if (exerciseType === 'walk') {
        baseMETVal = 3.5;
    }

    const runDurationHours = parseInt(totalTime) / 3600;
    const totalMETHours = runDurationHours * baseMETVal;
    if (isNaN(stepsTaken)) {
        // Set caloriesBurned to 0 if stepsTaken is NaN or blank
        caloriesBurned = 0;
    } else {
        caloriesBurned = totalMETHours * (0.035 * weight + 0.029 * age - 0.026 * height + 0.193) * stepsTaken * activityModifier;
    }

    // Enable the save exercise button
    saveExerciseButton.disabled = false;

    // Update the caloriesBurned element and hiddenCaloriesBurned value
    caloriesBurnedElement.textContent = caloriesBurned.toFixed(2);
    hiddenCaloriesBurnedElement.value = caloriesBurned;
}

// Add event listeners to stepsTaken and exerciseType elements
stepsTakenElement.addEventListener('input', calculateCaloriesBurned);
exerciseTypeElement.addEventListener('change', calculateCaloriesBurned);

