// Helper function to fetch meals from the API
async function getMeals(url) {
    const response = await fetch(url); // Fetch data from the provided URL
    const data = await response.json(); // Parse the response as JSON
    return data.meals || []; // Return the list of meals or an empty array
  }
  
  // function to check if a particular meal is present in favorite's list
  function isFavorite(id) {
    const arr = JSON.parse(localStorage.getItem("favouritesList")) || [];
    return arr.includes(id);
  }
  
  // function to update the main card section with meal HTML
  function updateMainCard(mealData) {
    const html = `
      <div id="card" class="card mb-3" style="width: 20rem;">
        <img src="${mealData.strMealThumb}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${mealData.strMeal}</h5>
          <div class="d-flex justify-content-between mt-5">
            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${mealData.idMeal})">More Details</button>
            <button id="main${mealData.idMeal}" class="btn btn-outline-light ${isFavorite(mealData.idMeal) ? "active" : ""}" onclick="addRemoveToFavList(${mealData.idMeal})" style="border-radius:50%">
            <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    return html;
  }
  
  // function to show the 404 error message
  function showNotFoundError() {
    return `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center">
              <span class="display-1 d-block">Not Found</span>
              <div class="mb-4 lead">
                The meal you are looking for was not found.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Helper function to show there are no meals added to favorites
  function showNoFavMealsMessage() {
    return `
      <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-12 text-center text-light">
              <span class="display-4 d-block">No Favourite Meal Added to List.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Function to show the meal list based on the search input
  async function showMealList() {
    const inputValue = document.getElementById("my-search").value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`;
    const meals = await getMeals(url); // Fetch and retrieve meals data
    let html = "";
  
    if (meals.length === 0) {
      html = showNotFoundError(); // Display "Not Found" message if no meals were found
    } else {
      meals.forEach((mealData) => {
        html += updateMainCard(mealData); // Create HTML cards for each meal
      });
    }
  
    document.getElementById("main-card").innerHTML = html; // Update the main card section with the generated HTML
  }
  
  // Function to show instructions in the main card section
  async function showMealDetails(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`; // Construct the API URL for meal details
    const mealData = await getMeals(url); // Fetch and retrieve meal details data
    const html = `
      <div id="meal-details" class="mb-5">
        <!-- Add Back Button -->
        <button class="btn btn-outline-light mb-3" onclick="goBack()">Back</button>
        <!-- Meal Details -->
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
          <div id="meal-thumbnail">
            <img class="mb-2" src="${mealData[0].strMealThumb}" alt="" srcset="">
          </div>
          <div id="details">
            <h3>${mealData[0].strMeal}</h3>
            <h6>Category : ${mealData[0].strCategory}</h6>
            <h6>Area : ${mealData[0].strArea}</h6>
          </div>
        </div>
        <div id="meal-instruction" class="mt-3">
          <h5 class="text-center">Instruction :</h5>
          <p>${mealData[0].strInstructions}</p>
        </div>
        <div class="text-center">
          <a href="${mealData[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
        </div>
      </div>
    `;
  
    document.getElementById("main-card").innerHTML = html; // Update the main card section with meal details
  }
  
  // Function to go back to the previous page
  function goBack() {
    showMealList(); // Return to the list of meals
  }
  
  // Function to show all the favorite meals in the favorites
  async function showFavMealList() {
    const arr = JSON.parse(localStorage.getItem("favouritesList")) || []; // Retrieve favorites list from local storage or create an empty array
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="; // Base API URL for meal lookup
    let html = "";
  
    if (arr.length === 0) {
      html = showNoFavMealsMessage(); // Display "No Favourite Meal Added" message if no favorite meals are present
    } else {
      for (const id of arr) {
        const mealData = await getMeals(url + id);
        html += updateMainCard(mealData[0]); // Create HTML cards for favorite meals
      }
    }
  
    document.getElementById("favourites-body").innerHTML = html; // Update the favorites body with the generated HTML
  }
  
  // Function to add or remove a meal from the favorite's 
  function addRemoveToFavList(id) {
    const arr = JSON.parse(localStorage.getItem("favouritesList")) || []; // Retrieve favorites list from local storage or create an empty array
    const index = arr.indexOf(id);
  
    if (index === -1) {
      arr.push(id); // Add the meal ID to the favorites list
      localStorage.setItem("favouritesList", JSON.stringify(arr));
      showNotificationModal("Your meal has been added to your favorites list.", "text-success"); // Show a success notification
    } else {
      arr.splice(index, 1);
      localStorage.setItem("favouritesList", JSON.stringify(arr));
      showNotificationModal("Your meal has been removed from your favorites list.", "text-danger"); // Show a removal notification
    }
  
    showMealList(); // Refresh the meal list
    showFavMealList(); // Refresh the favorite meal list
  }
  
  // Function to show the notification modal
  function showNotificationModal(message, className) {
    const modalElement = document.getElementById("notificationModal"); // Get the notification modal element
    const notificationText = document.getElementById("notificationText"); // Get the notification text element
  
    if (modalElement && notificationText) {
      notificationText.textContent = message;
      notificationText.classList.remove("text-success", "text-danger"); // Remove previous notification classes
      notificationText.classList.add(className); // Add the specified class for success or error
  
      const modal = new bootstrap.Modal(modalElement); // Create a Bootstrap modal instance
      modal.show();
  
      setTimeout(() => {
        modal.hide(); // Automatically hide the modal after 2 seconds
      }, 2000);
    }
  }