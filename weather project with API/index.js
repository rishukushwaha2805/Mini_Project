async function getWeather() {
  const location = document.getElementById("location").value.trim();
  if (!location) {
    alert("Please enter a location!");
    return;
  }

  const apiKey = "8c675a84db2143e1ae9180155251309"; 
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found!");
    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeather(data) {
  document.getElementById("weatherDashboard").style.display = "block";

  // Current Weather
  document.getElementById("cityName").innerText = `${data.location.name}, ${data.location.country}`;
  document.getElementById("temperature").innerText = `${data.current.temp_c}°C`;
  document.getElementById("condition").innerText = data.current.condition.text;
  document.getElementById("icon").src = "https:" + data.current.condition.icon;
  document.getElementById("humidity").innerText = data.current.humidity + "%";
  document.getElementById("wind").innerText = data.current.wind_kph + " km/h";

  // Forecast
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";
  data.forecast.forecastday.forEach(day => {
    const d = new Date(day.date);
    const options = { weekday: 'short' };
    const dayName = d.toLocaleDateString('en-US', options);

    forecastDiv.innerHTML += `
      <div class="day">
        <p>${dayName}</p>
        <img src="https:${day.day.condition.icon}" alt="">
        <p>${day.day.avgtemp_c}°C</p>
      </div>
    `;
  });
}
