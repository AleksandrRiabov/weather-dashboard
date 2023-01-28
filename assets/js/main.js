//Later need to get from localStorage
let searchHistory = ['London', 'Paris', 'Berlin'];
renderHistoryTownBtns()
const API_KEY = '7934ac155857010eeb74ee09abd772be';

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
    renderForecast();
  });
}

function fetchWeatherForecast(searchQuery) {
  const queryURL =
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${API_KEY}`
  //Fetch weather data from API
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(formatData(response));
    //Get all required data from the response
    const data = formatData(response);
    //Display todays weather
    renderForecast(data);
  });
}

//Function to render current weather info block
function renderCurrentWeather(response) {
  //Clear block from previous info
  $('#today').empty();

  //Create elements, get all required details from response and add to relevant element
  const title = $('<h2>').text(`${response.name}  (${new Date().toLocaleDateString()})`);
  const temperature = $('<p>').text(`Temp: ${(response.main.temp - 273.15).toFixed(2)} °C`);
  const humidity = $('<p>').text(`Humidity: ${response.main.humidity} %`);
  const wind = $('<p>').text(`Temp: ${response.wind.speed} /KPH`);

  const card = $('<div>').attr('class', 'card p-3');
  card.append(title, temperature, humidity, wind)
  //append all cretaed elements to "today weather" block
  $('#today').append(card);
}


//Function to render 5 days forecast info block
function renderForecast(data) {
  $('#forecast').empty()

  $('#forecast').append($('<h4>')
    .attr('class', 'col-sm-12 pl-0')
    .text('5-Day Frorecast: '));

  function createSingleDayCard(day) {
    return `<div class='card bg-dark mr-3 col-sm-4 col-md-2 forecast-card'>
  <h5>${day.date}</>
  <img  src='https://openweathermap.org/img/wn/${day.icon}.png' alt='Wheather Icon'/>
  <p>Humidity: ${day.maxHumidity}</p>
  <p>Temp: ${day.maxTemp}</p>
  <p>Wind: ${day.maxWind} KPH</p>
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
    .attr('class', 'btn btn-secondary mb-3');

  $('#history').append(newTownBtn);
}


//Get Max numbers for each day.Max Temperature, Max Wind, Max Humidity.
function formatData(response) {
  //Split response array by single days. 
  //ChankSize is equal to 8 because each element in response array represents 3hours. 3*8 = 24 (1day)
  const splitedByDay = splitArray(response.list, 8);

  return splitedByDay.map(day => {
    //get the max numbers of the day
    let maxTemperature = -Infinity;
    let maxWind = -Infinity;
    let maxHumidity = - Infinity;
    //loop over the day find the max values and assign to the variables above.
    day.forEach(threeHours => {
      if (maxTemperature < threeHours.main.temp_max) maxTemperature = threeHours.main.temp_max;
      if (maxWind < threeHours.wind.speed) maxWind = threeHours.wind.speed;
      if (maxHumidity < threeHours.main.humidity) maxHumidity = threeHours.main.humidity;
    });

    //Create and return the obj with required data for a single day
    return {
      date: (day[0].dt_txt).slice(0, 10),
      icon: day[5].weather[0].icon,
      maxTemp: (maxTemperature - 273.15).toFixed(2),
      maxWind,
      maxHumidity
    }
  });

  //Function to split array to smaller chanks. Returns array of arrays
  function splitArray(arr, chankSize) {
    const splitedArr = []
    for (let i = 0; i < arr.length; i += chankSize) {
      splitedArr.push(arr.slice(i, i + chankSize));
    }
    return splitedArr;
  }
}