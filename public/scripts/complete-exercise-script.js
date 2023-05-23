// Get the reference to the totalTime, stepsTaken, exerciseType, and caloriesBurned elements
const totalTimeElement = document.getElementById('totalTime');
const stepsTakenElement = document.getElementById('stepsTaken');
const exerciseTypeElement = document.getElementById('exerciseType');
const caloriesBurnedElement = document.getElementById('caloriesBurned');
const hiddenTotalTimeElement = document.getElementById('hiddenTotalTime');
const hiddenCaloriesBurnedElement = document.getElementById('hiddenCaloriesBurned');

// Retrieve the total time from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const totalTime = urlParams.get('time');

// Update the totalTime element and hiddenTotalTime value with the actual total time
totalTimeElement.textContent = totalTime;
hiddenTotalTimeElement.value = totalTime;

// Calculate calories burned when stepsTaken and exerciseType are changed
function calculateCaloriesBurned() {
  const stepsTaken = parseInt(stepsTakenElement.value);
  const exerciseType = exerciseTypeElement.value;
  let caloriesBurned = 0;

  // Retrieve user information from session
  const weightElement = document.getElementById('userWeight');
  const ageElement = document.getElementById('userAge');
  const heightElement = document.getElementById('userHeight');
  const activityLevelElement = document.getElementById('userActivityMultiplier');
  
  const weight = parseFloat(weightElement.dataset.weight);
  const age = parseInt(ageElement.dataset.age);
  const height = parseFloat(heightElement.dataset.height);
  const activityLevel = parseFloat(activityLevelElement.dataset.activityMultiplier);
  

  if (exerciseType === 'run') {
    const runDurationHours = totalTime / 3600;
    const totalMETHours = runDurationHours * 7;
    caloriesBurned = totalMETHours * (0.035 * weight + 0.029 * age - 0.026 * height + 0.193) * stepsTaken * activityMultiplier;
  } else if (exerciseType === 'walk') {

  }

  // Update the caloriesBurned element and hiddenCaloriesBurned value
  caloriesBurnedElement.textContent = caloriesBurned;
  hiddenCaloriesBurnedElement.value = caloriesBurned;
}

// Add event listeners to stepsTaken and exerciseType elements
stepsTakenElement.addEventListener('input', calculateCaloriesBurned);
exerciseTypeElement.addEventListener('change', calculateCaloriesBurned);