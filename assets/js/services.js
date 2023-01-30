const API_KEY = '7934ac155857010eeb74ee09abd772be';

//Function to fetch wheater details 
export async function fetchTodaysWeather(searchQuery) {
  try {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}`
    //Fetch weather data from API
    const response = await $.ajax({ url: queryURL, method: "GET" });
    return response
  } catch (error) {
    console.log('Current Weather request error: ', error.status, error.statusText);
    return error;
  }
}


//Function to fetch 5 days forecast
export async function fetchWeatherForecast(searchQuery) {
  try {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&appid=${API_KEY}`
    //Fetch weather data from API
    const response = await $.ajax({ url: queryURL, method: "GET" });
    //Get all required data from the response
    const data = formatData(response.list);
    return data;
  } catch (error) {
    console.log('Weather Forecast request error: ', error.status, error.statusText);
    return error;
  }
}




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
  return (Object.values(data)).slice(0, 5);
}