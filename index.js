const core = require('@actions/core');
const axios = require('axios');
const github = require('@actions/github');

// Get the input variables from the workflow file
const api_key = core.getInput('api_key');

// Define the API endpoint and parameters
const url = "https://pluginactions.onrender.com/analyze/data";
const params = {
  token: api_key,
};

    // Get repository information
    const repository = context.payload.repository;
    const repoName = repository.full_name;
    const branchName = context.ref.split('/').slice(-1)[0];

    // Print repository and branch information
    console.log(`Repository: ${repoName}`);
    console.log(`Branch: ${branchName}`);

// Make a GET request to the API and handle the response
axios.get(url, {params: params})
  .then(response => {
    const msg = response.data.status;
   
    
    if (msg == false) {
      core.setFailed(response.data.Message || "Database design issue");
      core.setOutput('status', 'failed');
    } else {
       console.log(response.data.TokenMessage);
    // console.log(JSON.stringify(response.data.result));

    
     Object.keys(response.data.result).forEach(key => {
        const value = response.data.result[key];
        if (Array.isArray(value)) {
          value.forEach((element) => {
            console.log(element);
          });
        }else {
          console.log(value);
        }  
        });

      // core.setOutput('api_response', JSON.stringify(response.data));
      core.setOutput('status', 'success');
    }
  })
  .catch(error => {
    core.setFailed(error.message);
    core.setOutput('status', 'failed');
  });