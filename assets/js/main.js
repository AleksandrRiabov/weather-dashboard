import { fetchTodaysWeather, fetchWeatherForecast } from "./services.js";
import showModal from "./modal.js";

//Array to keap truck of search history
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

//Simple loading component
const loading = `<div id='loading'> Loading... Please wait.</div>`;

//Run the function to generate history btns if there any history
renderHistoryTownBtns();

//On form submit run this code 
$('#search-form').on('submit', function (e) {
  e.preventDefault();

  const searchQuery = $('#search-input').val();
  //If no input return
  if (!searchQuery.trim()) return

  //Add new search query (town) to searchHistory array
  generateTodaysWeather(searchQuery);
  generateWeatherForecast(searchQuery);

  //Clean input
  $('#search-input').val('');
});

///////////////// Request Functions

//Function to fetch and render wheater details 
async function generateTodaysWeather(searchQuery) {
  $('#today').append(loading);//Loading started message
  try {
    //Make a request
    const response = await fetchTodaysWeather(searchQuery);
    //If town already in history remove it from history array first. 
    if (searchHistory.includes(searchQuery)) {
      searchHistory = searchHistory.filter(town => town !== searchQuery);
    }
    if (response.name) searchHistory.push(searchQuery);
    //Save to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    //Display todays weather
    renderCurrentWeather(response);
    renderHistoryTownBtns();
  } catch (error) {
    //If error, show modal window with the error message
    showModal(`Request error: ${error.status} ${error.statusText}`);
    $('#today').children('#loading').remove();
  }
}

//Function to fetch and render 5 days forecast
async function generateWeatherForecast(searchQuery) {
  $('#forecast').append(loading);
  try {
    //Fetch weather data from API
    const response = await fetchWeatherForecast(searchQuery);
    renderForecast(response);
  } catch (error) {
    $('#forecast').children('#loading').remove();
  }
}


////////// Render Functions

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

  $('#forecast').append($('<h4>').text('5-Day Frorecast: '));

  function createSingleDayCard(day) {
    return `
    <div class='card forecast-card'>
      <h5>${day.date}</>
      <div>
         <img src='https://openweathermap.org/img/wn/${day.icon}.png' alt='Wheather Icon'/>
      </div>
      <p>Temp: ${Math.round(day.maxTemp - 273.15)} °C</p>
      <p>Humidity: ${day.maxHumidity}%</p>
      <p>Wind: ${day.maxWind} <span>KPH</span></p>
    </div>`
  }
  const cardsContainer = $('<div>').attr('class', 'cards-container')

  data.forEach(day => $(cardsContainer).append(createSingleDayCard(day)));
  $('#forecast').append(cardsContainer);
}


/////////////// History Buttons /////////

//Create buttons for each town
function renderHistoryTownBtns() {
  //Clear history block
  $('#history').empty();
  //Create and append new buttons to history block 
  searchHistory.slice().reverse().forEach(town => createHistoryBtn(town));
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
  const searchQuery = $(this).attr('data-town');
  generateTodaysWeather(searchQuery);
  generateWeatherForecast(searchQuery);
});


showModal('Welcome to Weather Dashboard! Please insert location!');