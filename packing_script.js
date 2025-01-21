document.getElementById("destination_form").addEventListener("submit", async function (event) {
  // Prevent the form from submitting normally
  event.preventDefault();

  // Retrieve location input
  const location = document.getElementById("location").value;

  if (!location) {
      alert("Please enter a location!");
      return;
  }

  // OpenWeatherMap API Keys and URLs
  const apiKey = "17f351f3eb6bbbc60a114900c2abcd86";
  const geocodeAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

  try {
      // Call Geocoding API to get latitude and longitude
      const geocodeResponse = await fetch(geocodeAPI);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
          alert("Location not found! Please check your input.");
          return;
      }

      const latitude = geocodeData[0].lat;
      const longitude = geocodeData[0].lon;

      // Call Weather API to get current weather
      const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      const weatherResponse = await fetch(weatherAPI);
      const weatherData = await weatherResponse.json();

      const destinationTemp = weatherData.main.temp;
      const destinationCondition = weatherData.weather[0].main.toLowerCase(); // e.g., "rain", "snow", etc.

      // Determine destination based on weather
      let destination;
      if (destinationTemp >= 25) {
          destination = "HOT";
      } else if (destinationTemp <= 14) {
          destination = "COLD";
      }

      if (destinationCondition === "snow") {
          destination = "SNOWY";
      } else if (destinationCondition === "rain") {
          destination = "RAINY";
      }

      // Packing list logic
      const trip_length = parseInt(document.getElementById("trip_length").value, 10);
      const fancy = document.querySelector('input[name="fancy"]:checked').value;

      let packing_list = [
          { item: "shorts", amount: 0.25 },
          { item: "pants", amount: 0.25 },
          { item: "t-shirts", amount: 1 },
          { item: "long sleeved shirts", amount: 0.5 },
          { item: "underwear", amount: 1 },
          { item: "socks", amount: 1 },
      ];

      packing_list = packing_list.map((item) => ({
          item: item.item,
          amount: Math.ceil(item.amount * trip_length),
      }));

      if (fancy === "FANCY") {
          packing_list.push({ item: "fancy outfit", amount: 1 });
      }

      if (destination === "SNOWY" || destination === "COLD") {
          packing_list.push({ item: "jacket", amount: 1 });
          packing_list = packing_list.map((item) => {
              if (item.item === "shorts" || item.item === "t-shirts") {
                  return { item: item.item, amount: 0 };
              } else if (item.item === "long sleeved shirts") {
                  return { item: item.item, amount: Math.ceil(item.amount / 2) };
              }
              return item;
          });
      }

      if (destination === "HOT") {
          packing_list = packing_list.map((item) => {
              if (
                  item.item === "pants" ||
                  item.item === "long sleeved shirts" ||
                  item.item === "socks"
              ) {
                  return { item: item.item, amount: 0 };
              }
              return item;
          });
          packing_list.push({ item: "pair of sandals", amount: 1 });
      }

      if (destination === "RAINY") {
          packing_list.push({ item: "Raincoat", amount: 1 });
      }

      // Update the UI
      document.getElementById("list_result").innerHTML = `Your destination is ${destination}`;
      const final_list = document.getElementById("final_list");
      final_list.innerHTML = "";
      packing_list.forEach((item) => {
          if (item.amount > 0) {
              final_list.innerHTML += `<li>${item.amount} ${item.item}</li>`;
          }
      });

      document.getElementById("sample_list").style.display = "none";
      document.getElementById("list_result").style.display = "block";

  } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching weather data. Please try again.");
  }
});