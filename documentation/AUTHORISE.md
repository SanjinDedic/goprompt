# Documentation for Authorize.js

This document provides a brief overview of the `Authorize` class available in `Authorize.js`.

## Import

The `Authorize` class is imported from `gopromptapi.js`.

```javascript
import GopromptAPI from './gopromptapi.js';
```

## Class: `Authorize`

This class handles the status of the user's authorization.

```javascript
export default class Authorize {
    //...
}
```

### Constructor: `constructor(status)`

The `Authorize` class constructor accepts a boolean parameter, `status`. It checks the status and accordingly initializes `GopromptAPI` or handles click event on `buttonDiv`.

```javascript
constructor(status) {
    //...
}
```

### Method: `handleCredentialResponse(response)`

This async method handles the response from the user's credential. It fetches the user token using the `GopromptAPI` helper, and manages user consent to the privacy policy and email opt-in through a modal window.

```javascript
async handleCredentialResponse(response) {
    //...
}
```

### Method: `onGAPILoad()`

This method is called when Google API is loaded. It initializes Google accounts and renders a Google sign-in button in the `buttonDiv` element.

```javascript
onGAPILoad() {
    //...
}
```

## Usage

The `Authorize` class is primarily used for user authorization. Depending on the `status` value passed to the constructor, it initializes `GopromptAPI` (when `status` is `true`), or sets a click event on the `buttonDiv` that stores a user email in session storage and redirects to `myprompt.html` (when `status` is `false`).

When Google API loads, it sets up a callback to handle the response from the user's Google account credential, rendering a Google sign-in button in the `buttonDiv` element.

## Limitations

This class depends heavily on specific DOM elements existing and being accessible (e.g., 'buttonDiv', 'myModal', 'submitButton', etc.). If these elements are not present in the HTML document, errors will occur.

## Dependencies

This class uses the `GopromptAPI` class to fetch the user token and the Google Accounts API for Google sign-in functionality.

## Further Development

Additional features could include a more flexible way to handle elements and different ways of authorization other than Google sign-in.