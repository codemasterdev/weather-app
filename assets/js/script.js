var apiKey = "de81cbd7917a62a289c2cd964e2ccb23";

var searchCityBtn = document.querySelector("#searchCityBtn");
// top part of data
var selectedCityHeaderEl = document.querySelector("#currentCityHeder");
var tempEl = document.querySelector("#displayTemp");
var windEl = document.querySelector("#displayWind");
var humidityEl = document.querySelector("#displayHumidity");
var uvEl = document.querySelector("#displayUV");
// 5 day forecast
var forecastEl = document.querySelector("#forecast");
var forecastHeaderEl = document.querySelector("#forecastHeader");

var citySearchEl = document.querySelector("#cityInput");

$(forecastHeaderEl).hide();

function getCity(cityName) {
    var apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=imperial" +
        "&appid=" +
        apiKey;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            saveCity(cityName);
            response.json().then(function (data) {
                var date = new Date(data.dt * 1000);
                // some reason the month is 1 behind :shrug:
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                selectedCityHeaderEl.textContent =
                    data.name + " (" + month + "/" + day + "/" + year + ")";

                var apiUrlAll =
                    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                    data.coord.lat +
                    "&lon=" +
                    data.coord.lon +
                    "&units=imperial&appid=" +
                    apiKey;
                fetch(apiUrlAll).then(function (response) {
                    response.json().then(function (data) {
                        // display data
                        displayData(data);
                        // display 5 day forecast
                        displayForecast(data);
                    });
                });
            });
        } else {
            alert("Error: Please enter a valid city");
        }
    });
}

function displayData(status) {
    $(forecastHeaderEl).show();
    tempEl.textContent = status.current.temp + "°F";
    windEl.textContent = status.current.wind_speed + " MPH";
    humidityEl.textContent = status.current.humidity + "%";
    uvEl.textContent = status.current.uvi;
    uvEl.classList = "px-2 rounded text-white uvText";

    if (status.current.uvi <= 2) {
        uvEl.classList.add('bg-success');
    } else if (status.current.uvi <= 7) {
        uvEl.classList.add('bg-warning');
    } else {
        uvEl.classList.add('bg-danger');
    }
}

function displayForecast(data) {
    forecastEl.textContent = '';
    for (let i = 0; i < 5; i++) {
        // date
        var date = new Date(data.daily[i].dt * 1000);
        // some reason the month is 1 behind :shrug:
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();

        var displayForecast = document.createElement("div");
        var forecastHeader = document.createElement("h3");
        var forecastIcon = document.createElement("img");
        var forecastTemp = document.createElement('p');
        var forecastWind = document.createElement('p');
        var forecastHum = document.createElement('p');
        // div
        displayForecast.classList = "col bg-primary whiteText";
        // header
        forecastHeader.textContent = month + "/" + day + "/" + year;
        // icon
        var iconCode = data.daily[i].weather[0].icon;
        var iconUrl = 'https://openweathermap.org/img/w/' + iconCode + '.png';
        forecastIcon.src = iconUrl;
        forecastIcon.alt = data.daily[i].weather[0].main;
        // temp
        forecastTemp.textContent = data.daily[i].temp.day + " °F";
        // wind
        forecastWind.textContent = data.daily[i].wind_speed + " MPH";
        // humidity
        forecastHum.textContent = data.daily[i].humidity + ' %';
        // append elements
        forecastEl.appendChild(displayForecast);
        displayForecast.appendChild(forecastHeader);
        displayForecast.appendChild(forecastIcon);
        displayForecast.appendChild(forecastTemp);
        displayForecast.appendChild(forecastWind);
        displayForecast.appendChild(forecastHum);
    }
}

function searchCity() {
    var city = citySearchEl.value.trim();
    var cityName = city.split(" ").join("%20");
    if (cityName) {
        getCity(cityName);
    } else {
        alert("Please enter a city");
    }
}

function saveCity(cityName) {
    var prevSearches = JSON.parse(localStorage.getItem('recentSearches'));
    if (prevSearches === null) prevSearches = [];
    var cityName = cityName.split('%20').join(' ');
    var searched = {
        'city': cityName
    };
    localStorage.setItem('searched', JSON.stringify(searched));
    prevSearches.unshift(searched);
    localStorage.setItem('recentSearches', JSON.stringify(prevSearches));
};

function retrieveCity() {
    var recentSearches = localStorage.getItem('recentSearches');
    recentSearches = JSON.parse(recentSearches);
    var recentBtnEl = document.querySelector('#recentBtns');

    for (let i = 0; i < 10; i++) {
        if (i < 0 || i > 10) {
            break;
        }
        var recentBtn = document.createElement('button');
        var btnText = (recentSearches[i].city);
        recentBtn.classList = 'btn btn-secondary';
        recentBtn.textContent = btnText;
        recentBtnEl.appendChild(recentBtn);
        recentBtn.addEventListener("click", function () {
            getCity(this.textContent);
            // console.log(this.textContent)
        });
    }
}


searchCityBtn.addEventListener("click", searchCity);
retrieveCity();