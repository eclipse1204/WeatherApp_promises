let API_KEY="ad72464d041848f5d769448c6e520085";
// const API_KEY = "168771779c71f3d64106d8a88376808a";

const userTab=document.querySelector(".data-userWeather");
const searchTab=document.querySelector(".data-searchWeather");
const grant_location=document.querySelector(".grant-location-container");
const grant_access_button=document.querySelector(".data-grantAccess");
const loading_container=document.querySelector(".loading-container");
const form_container=document.querySelector(".form-container");
const user_info_container=document.querySelector(".user-info-container");
const data_cityName=document.querySelector(".data-cityName");
const data_temp=document.querySelector(".data-temp");
const data_countryIcon=document.querySelector(".data-countryIcon");
const data_weatherDesc=document.querySelector(".data-weatherDesc");
const data_weatherIcon=document.querySelector(".data-weatherIcon");
const data_windspeed=document.querySelector(".data-windspeed");
const data_humidity=document.querySelector(".data-humidity");
const data_cloudiness=document.querySelector(".data-cloudiness");
const data_searchInput=document.querySelector(".data-searchInput");

let currentTab=userTab;
currentTab.classList.add("current_tab");

user_info_container.classList.add("deactivate");
loading_container.classList.add("deactivate");
form_container.classList.add("deactivate");
grant_location.classList.add("deactivate");

function switchTab(clickedTab){
    if(currentTab!=clickedTab)
    {
        currentTab.classList.remove("current_tab");
        currentTab=clickedTab;
        currentTab.classList.add("current_tab");
        if(clickedTab==searchTab)
        {
            grant_location.classList.add("deactivate");
            user_info_container.classList.add("deactivate");
            form_container.classList.remove("deactivate");
        }
        else
        {
            form_container.classList.add("deactivate");
            user_info_container.classList.add("deactivate");
            getLocationPermission();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getLocationPermission()
{
    if(sessionStorage.getItem("latitude")!=null)
    {
        display_location_weather();
    }
    else
    {
        grant_location.classList.remove("deactivate");
    }
}

getLocationPermission();

async function display_location_weather()
{
    grant_location.classList.add("deactivate");
    loading_container.classList.remove("deactivate");
    let latitude=sessionStorage.getItem("latitude");
    let longitude=sessionStorage.getItem("longitude");
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        let result=await response.json();
        console.log(result);
        renderWeatherInfo(result);
        loading_container.classList.add("deactivate");
        user_info_container.classList.remove("deactivate");
    }
    catch(e)
    {
        alert("ERROR");
        console.log("ERROR");
        console.log(e);
        loading_container.classList.add("deactivate");
    }
}

function renderWeatherInfo(result){
    data_cityName.textContent=result.name;
    data_temp.textContent=(result.main.temp-273.15).toFixed(2)+" °C";
    data_countryIcon.src=`https://flagcdn.com/144x108/${result?.sys?.country.toLowerCase()}.png`;
    data_weatherDesc.textContent=result.weather[0].description;
    data_weatherIcon.src=`http://openweathermap.org/img/w/${result?.weather?.[0]?.icon}.png`;
    data_windspeed.textContent=result.wind.speed+" m/s";
    data_humidity.textContent=result.main.humidity+" %";
    data_cloudiness.textContent=result.clouds.all+" %";
}

function getLocation() {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("Geolocation not supported");
    }
}

function showPosition(position) {
    sessionStorage.setItem("latitude", position.coords.latitude);
    sessionStorage.setItem("longitude", position.coords.longitude);
    display_location_weather();
}

grant_access_button.addEventListener("click",()=>{
    getLocation();
});

form_container.addEventListener("submit",(event)=>{
    event.preventDefault();
    console.log(data_searchInput.value);
    if(data_searchInput.value==="")
    {
        return;
    }
    display_location_weather_city(data_searchInput.value);
});

async function display_location_weather_city(cityName)
{
    user_info_container.classList.add("deactivate");
    loading_container.classList.remove("deactivate");
    try{
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        let result=await response.json();
        console.log(result);
        renderWeatherInfo(result);
        loading_container.classList.add("deactivate");
        user_info_container.classList.remove("deactivate");
    }
    catch(e)
    {
        console.log(e);
        alert("ERROR");
        console.log("ERROR");
        loading_container.classList.add("deactivate");
    }
}