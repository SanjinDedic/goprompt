# Documentation for GopromptAPI.js

This document provides an overview of the `GopromptAPI` class available in `GopromptAPI.js`.

## Import

The `GopromptAPI` class does not need any additional imports.

## Class: `GopromptAPI`

This class provides an interface for sending requests to the backend API.

```javascript
export default class GopromptAPI {
    //...
}
```

### Constructor: `constructor(baseUrl)`

The `GopromptAPI` class constructor accepts a string parameter, `baseUrl`, which represents the base URL of the API.

```javascript
constructor(baseUrl) {
    //...
}
```

### Method: `fetchToken(responseCredential)`

This async method fetches a token from the API by sending a POST request to the `/token` endpoint. It uses the response credential provided as an authorization bearer token.

```javascript
async fetchToken(responseCredential) {
    //...
}
```

### Method: `fetchPrompts(user)`

This async method fetches prompts for a particular user by sending a POST request to the `/get-prompts` endpoint. It uses the `user` provided as the body of the request.

```javascript
async fetchPrompts(user) {
    //...
}
```

### Method: `savePrompts(data)`

This async method saves prompts for a user by sending a POST request to the `/save-prompts` endpoint. The user email is fetched from session storage and included in the data sent as the body of the request.

```javascript
async savePrompts(data) {
    //...
}
```

## Usage

The `GopromptAPI` class is used for interacting with the backend API. After constructing an instance of `GopromptAPI` with the base URL of the API, you can use the `fetchToken`, `fetchPrompts`, and `savePrompts` methods to send requests to the API.

## Limitations

This class depends on the API endpoints being correctly configured and responsive.

## Dependencies

This class uses the Fetch API for sending requests to the backend API.

## Further Development

Additional methods could be added to handle other API endpoints, such as updating prompts or deleting prompts. Error handling could also be improved, for instance, by retrying requests that fail due to network issues.