const core = require('@actions/core');
const axios = require('axios');

// Get the input variables from the workflow file
const api_key = core.getInput('api_key');

// Define the API endpoint and parameters
const url = "https://pluginactions.onrender.com/analyze/data";
const params = {
  token: api_key,
};

// Make a GET request to the API and handle the response
axios.get(url, {params: params})
  .then(response => {
    const msg = response.data.message;
    console.log(JSON.stringify(response.data.result));
    if (msg == "fail") {
      core.setFailed(`Token is not present`);
      core.setOutput('status', 'failed');
    } else {
      // core.setOutput('api_response', JSON.stringify(response.data));
      core.setOutput('status', 'success');
    }
  })
  .catch(error => {
    core.setFailed(error.message);
    core.setOutput('status', 'failed');
  });