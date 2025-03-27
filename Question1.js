document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    const mealInput = document.getElementById('mealInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const loader = document.getElementById('loader');
    const resultMessage = document.getElementById('Error');

    searchBtn.addEventListener('click', searchMeals);
    mealInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchMeals();
        }
    });

    function searchMeals() {
        const mealName = mealInput.value.trim();

        resultsContainer.innerHTML = '';
        resultMessage.innerHTML = '';

        if (!mealName) {
            resultMessage.innerHTML = "Please enter a meal name in the search box!";
            resultMessage.style.color = "red";
            resultMessage.style.fontWeight = "bold";
            resultMessage.style.fontSize = "20px";
            return;
        }

        loader.style.display = 'block';
        resultMessage.style.display = 'none';

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                loader.style.display = 'none';

                if (data.meals === null) {
                    displayNoMealsFound();
                    return;
                }

                const mealsToShow = data.meals.slice(0, 3);
                displayMealsContent(mealsToShow);

                resultMessage.innerHTML = `Here are the available meals found<br> about <span style="color: red;">${mealName}</span>`;
                resultMessage.style.color = "dodgerblue";
                resultMessage.style.fontWeight = "bold";
                resultMessage.style.fontSize = "20px";
                resultMessage.style.display = 'block';
            })
            .catch(error => {
                loader.style.display = 'none';
                console.error('Error fetching data:', error);
                displayError();
            });
    }

    function displayMealsContent(meals) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.className = 'meal-card';

            const mealImage = document.createElement('img');
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;

            const mealName = document.createElement('h2');
            mealName.textContent = meal.strMeal;

            const mealCategory = document.createElement('p');
            mealCategory.innerHTML = `<strong>Category:</strong> ${meal.strCategory}`;

            const mealInstructions = document.createElement('p');
            let shortInstructions;

            if (meal.strInstructions.length > 300) {
                shortInstructions = meal.strInstructions.substring(0, 300) + '...';
            } else {
                shortInstructions = meal.strInstructions;
            }
            
            mealInstructions.innerHTML = `<strong>Instructions:</strong> ${shortInstructions}`;

            mealCard.appendChild(mealImage);
            mealCard.appendChild(mealName);
            mealCard.appendChild(mealCategory);
            mealCard.appendChild(mealInstructions);

            resultsContainer.appendChild(mealCard);
        });
    }

    function displayNoMealsFound() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'No meals found!';
        resultsContainer.appendChild(errorMessage);
    }

    function displayError() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'An error occurred while fetching data. Please try again.';
        resultsContainer.appendChild(errorMessage);
    }
});
