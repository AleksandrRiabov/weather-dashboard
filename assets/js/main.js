//Later need to get from localStorage
let searchHistory = ['London', 'Paris', 'Berlin'];
renderHistoryTownBtns()
const API_KEY = '7934ac155857010eeb74ee09abd772be';

//Form event listener
$('#search-form').on('submit', function (e) {
  e.preventDefault();
  const searchQuery = $('#search-input').val();
  //If no input return
  if (!searchQuery.trim()) return

  //If town already in history remove it from history array first
  if (searchHistory.includes(searchQuery)) {
    searchHistory = searchHistory.filter(town => town !== searchQuery);
  }
  //add new search query (town) to searchJistory array
  fetchTodaysWeather(searchQuery)
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
    console.log(response)
    //Display todays weather
    renderCurrentWeather(response);
  });
}

//Function to render current weather info block
function renderCurrentWeather(response) {
  //Create elements, get all required details from response and add to relevant element
  const title = $('<h2>').text(`${response.name}  (${new Date().toLocaleDateString()})`);
  const temperature = $('<p>').text(`Temp: ${(response.main.temp - 273.15).toFixed(2)} °C`);
  const humidity = $('<p>').text(`Humidity: ${response.main.humidity} %`);
  const wind = $('<p>').text(`Temp: ${response.wind.speed} /KPH`);
  //append all cretaed elements to "today weather" block
  $('#today').append(title, temperature, humidity, wind);
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
    .attr('class', 'btn btn-secondary mb-3');

  $('#history').append(newTownBtn);
}
