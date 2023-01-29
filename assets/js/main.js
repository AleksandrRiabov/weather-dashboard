const API_KEY = '7934ac155857010eeb74ee09abd772be';

//Later need to get from localStorage
let searchHistory = ['London', 'Paris', 'Berlin'];
renderHistoryTownBtns()

//On form submit run this code 
$('#search-form').on('submit', function (e) {
  e.preventDefault();

  const searchQuery = $('#search-input').val();
  //If no input return
  if (!searchQuery.trim()) return

  //If town already in history remove it from history array first. 
  if (searchHistory.includes(searchQuery)) {
    searchHistory = searchHistory.filter(town => town !== searchQuery);
  }
  //Add new search query (town) to searchHistory array
  fetchTodaysWeather(searchQuery)
  fetchWeatherForecast(searchQuery)
  searchHistory.push(searchQuery);
  renderHistoryTownBtns();
});

//Function to fetch wheater details 
function fetchTodaysWeather(searchQuery) {
  const queryURL =
    `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}`
  //Fetch weather data from API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    //Display todays weather
    renderCurrentWeather(response);
  });
}

function fetchWeatherForecast(searchQuery) {
  const queryURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${API_KEY}`
  //Fetch weather data from API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(response => {
    console.log(formatData(response.list));
    //Get all required data from the response
    const data = formatData(response.list);
    renderForecast(data);
  });
}

//Function to render current weather info block
function renderCurrentWeather(response) {
  //Clear block from previous info
  $('#today').empty();

  //Create html for todays weather block
  const weatherBlock = `
  <div class='card p-3'>
  <div>
  <h2 class='day-title'>${response.name}  (${new Date().toLocaleDateString()})</h2>
  <img src='https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png' alt='weather icon'/>
  </div>
  <p>Temp: ${(response.main.temp - 273.15).toFixed(2)} °C </p>
  <p>Humidity: ${response.main.humidity} %</p>
  <p>Wind: ${response.wind.speed} /KPH</p>
  </div>
  `
  //append all cretaed elements to "today weather" block
  $('#today').append(weatherBlock);
}


//Function to render 5 days forecast info block
function renderForecast(data) {
  $('#forecast').empty()

  $('#forecast').append($('<h4>')
    .attr('class', 'col-sm-12 pl-0')
    .text('5-Day Frorecast: '));

  function createSingleDayCard(day) {
    return `<div class='card  col-sm-4 col-md-2 forecast-card'>
  <h5>${day.date}</>
  <img  src='https://openweathermap.org/img/wn/${day.icon}.png' alt='Wheather Icon'/>
  <p>Temp: ${(day.maxTemp - 273.15).toFixed(1)} °C</p>
  <p>Humidity: ${day.maxHumidity}</p>
  <p>Wind: ${day.maxWind} <span>KPH</span></p>
  </div>`
  }

  data.forEach(day => $('#forecast').append(createSingleDayCard(day)));
}

//Create buttons for each town
function renderHistoryTownBtns() {
  //Clear history block
  $('#history').empty();
  //Create and append new buttons to history block 
  searchHistory.slice().reverse().forEach(town => createHistoryBtn(town));
  console.log(searchHistory)
}

//Function to create and render single btn 
function createHistoryBtn(town) {

  const newTownBtn = $('<button>')
    .text(town)
    .attr('data-town', town)
    .attr('class', 'btn btn-secondary mb-3 history-btn');

  $('#history').append(newTownBtn);
}

//Add event listener to history btns
$('#history').on('click', '.history-btn', function () {
  console.log('clicked');
  const searchQuery = $(this).attr('data-town');
  fetchTodaysWeather(searchQuery);
  fetchWeatherForecast(searchQuery);
})

//Function to format response array. Takes array and returns array with required data
function formatData(list) {
  //Create an empty obj for formated data
  const data = {};

  //loop over the response and get required data such as(maxTemp, maxHumidity, maxWind..) into the 'data' obj 
  for (let i = 0; i < list.length; i++) {
    //Get date from response
    const date = list[i].dt_txt.slice(0, 10).replace(/-/g, '/');

    //If date is not exist in data obj, create day details obj
    if (!data[date]) {
      data[date] = {
        maxTemp: list[i].main.temp_max,
        maxHumidity: list[i].main.humidity,
        maxWind: list[i].wind.speed,
        icon: '',
        date
      }
    }

    //GET MAXIMUMS FOR THE DAY
    //If value in data obj is less then value in 'response.list' add the biggest value to the 'data' obj
    data[date].maxTemp = data[date].maxTemp < list[i].main.temp_max ? list[i].main.temp_max : data[date].maxTemp;
    data[date].maxHumidity = data[date].maxHumidity < list[i].main.humidity ? list[i].main.humidity : data[date].maxHumidity;
    data[date].maxWind = data[date].maxWind < list[i].wind.speed ? list[i].wind.speed : data[date].maxWind;

    //Get time from current 3h block
    const time = parseInt(list[i].dt_txt.slice(11, 13));
    //If time equals to 12 get the icon
    if (time === 12) data[date].icon = list[i].weather[0].icon;
    //If time is already after 12 get first available icon
    if (!data[date].icon && time > 12) data[date].icon = list[i].weather[0].icon;
  }

  //Make an array and return
  return Object.values(data);
}

