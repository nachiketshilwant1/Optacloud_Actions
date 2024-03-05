const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

async function run() {
  try {
    // Get the input variables from the workflow file
    const api_key = core.getInput('api_key');

    // Define the API endpoint
    const url = "https://pluginactions.onrender.com/analyze/data";

    // Get repository information from the GitHub context
    const repoName = github.context.repo.repo;
    const branchName = github.context.ref.replace('refs/heads/', '');

    // Print repository and branch information
    console.log(`Repository: ${repoName}`);
    console.log(`Branch: ${branchName}`);

    // Make a GET request to the API
    const response = await axios.get(url, {
      params: { token: api_key },
    });

    // Check the response status
    if (!response.data.status) {
      throw new Error(response.data.Message || "Database design issue");
    }

    // Log the token message
    console.log(response.data.TokenMessage);

    // Log the results
    const results = response.data.result;
    for (const [key, value] of Object.entries(results)) {
      if (Array.isArray(value)) {
        value.forEach(element => console.log(element));
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Set the action's output
    core.setOutput('status', 'success');
  } catch (error) {
    core.setFailed(error.message);
    core.setOutput('status', 'failed');
  }
}

run();
