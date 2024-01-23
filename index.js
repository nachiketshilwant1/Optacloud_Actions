
const core = require('@actions/core');
const axios = require('axios');

// Get the input variables from the workflow file
const city = core.getInput('city');
const api_key = core.getInput('api_key');

// Define the API endpoint and parameters
const url = 'https://api.openweathermap.org/data/2.5/weather';
const params = {
  q: city,
  appid: api_key,
  units: 'metric'
};

// Make a GET request to the API and handle the response
axios.get(url, {params: params})
  .then(response => {
    const temp = response.data.main.temp;
    console.log(`The temperature in ${city} is ${temp} °C`);
    if (temp > 30) {
      core.setFailed(`The temperature in ${city} is too high for deployment`);
      core.setOutput('status', 'failed');
    } else {
      // Set the output variable
      core.setOutput('status', 'success');
    }
  })
  .catch(error => {
    core.setFailed(error.message);
    core.setOutput('status', 'failed');
  });
