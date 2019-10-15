'use strict';

const request = require('request');

//let subscriptionKey = process.env['5d15d701f04f48158a893814cbf1d00a'];
//let endpoint = process.env['https://doggo-thebot-vision.cognitiveservices.azure.com/']
// if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }


let subscriptionKey = "5d15d701f04f48158a893814cbf1d00a";
let endpoint = "https://doggo-thebot-vision.cognitiveservices.azure.com/vision/v2.1/analyze?visualFeatures=Categories&language=en";
var uriBase = endpoint;

const imageUrl =
    'https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg';

// Request parameters.
const params = {
    'width': '100',
    'height': '100',
    'smartCropping': 'true'
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  } else {
    console.log(body);
  }
});