const core = require("@actions/core");
const axios = require("axios");
const github = require("@actions/github");

async function run() {
  try {
    // Get the input variables from the workflow file
    const api_key = core.getInput("api_key", { required: true });

    // Define the API endpoint
    const url = "https://pluginactions.onrender.com/sql/optacloud";

    // Get repository and user information from the GitHub context
    const repoName = github.context.repo.repo;
    const branchName = github.context.ref.replace("refs/heads/", "");
    const userName = github.context.actor; // Get the username of the GitHub user

    // Make a GET request to the API
    const response = await axios.get(url, {
      params: {
        token: api_key,
        repo: repoName,
        branch: branchName,
        user: userName,
      },
    });
  console.log(response.data);
    // Validate the response data
    if (!response.data.status) {
      throw new Error(
        response.data.Message || "Failed but message not shown"
      );
    }

    // Log the message if available
    console.log(response.data.Message);

    // Set the action's output
    core.setOutput("status", "success");
  } catch (error) {
    // Log the error and set the action's output to failed
    console.error("Error:", error.message);
    core.setFailed(error.message);
    core.setOutput("status", "failed");
  }
}

run();
