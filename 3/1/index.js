
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    console.log("Backend Response:", data); 

    if (data.error) {
      document.getElementById("weatherResult").innerHTML = `<p>${data.error}</p>`;
      return;
    }

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.country}</h2>
      <img src="https:${data.icon}" alt="Weather Icon" />
      <h3>${data.temp}°C</h3>
      <p>${data.description}</p>
    `;
  } catch (error) {
    console.error("Fetch error:", error); 
    document.getElementById("weatherResult").innerHTML = `<p>Error: ${error.message}</p>`;
  }
}