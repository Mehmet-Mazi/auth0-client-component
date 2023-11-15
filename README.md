# Auth Element

[![npm version](https://badge.fury.io/js/auth0-client-component.svg)](https://badge.fury.io/js/auth0-client-component)

This JavaScript script defines a custom web component named `AuthElem` for handling authentication using Auth0 for SPA. The primary objective of this web component is to quickly enable user authentication in your web applications. The script enables user authentication, sign-up, login, and logout functionalities.

## Installation

Install the Auth0 Client Component using npm:

```bash
npm install auth0-client-component
```

## Usage

To use this script, follow these steps:

1. Include the script in your HTML file:

   ```html
   <script type="module" src="path/to/AuthElem.js"></script>
   ```

2. Create an instance of the `AuthElem` element in your HTML:

   ```html
   <auth-element></auth-element>
   ```

3. Ensure you have the necessary HTML templates for authenticated and unauthenticated states. The element will dynamically render the appropriate template based on the user's authentication status.

   ```html
   <!-- Unauthenticated Template -->
   <template id="unauthenticated">
       <!-- Your unauthenticated content here -->
   </template>

   <!-- Authenticated Template -->
   <template id="authenticated">
       <!-- Your authenticated content here -->
   </template>
   ```

4. Customize the stylesheet by providing a path or use the default stylesheet named "auth-element-style.css."

   ```html
   <auth-element data-stylesheet="path/to/custom-stylesheet.css"></auth-element>
   ```

## Methods

- **`getUserData()`**: Retrieves user data if authenticated.
- **`isAuthenticated()`**: Checks if the user is authenticated.
- **`fetchAuthConfig(authConfigURL)`**: Fetches authentication configuration from the specified URL.
- **`configureClient()`**: Configures the Auth0 client with the obtained authentication configuration.
- **`signUp()`**: Initiates the sign-up process and redirects the user to the specified URI after completion.
- **`login()`**: Initiates the login process and redirects the user to the specified URI after completion.
- **`logout()`**: Logs the user out and redirects to the specified URI after completion.
- **`render()`**: Renders the appropriate content based on the user's authentication status.

## Events

- **`load`**: Dispatched when the element is fully loaded and configured.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Element Example</title>
    <script type="module" src="path/to/AuthElem.js"></script>
</head>
<body>

    <!-- Unauthenticated Template -->
    <template id="unauthenticated">
        <div>
            <p>Welcome! Please log in or sign up.</p>
            <button data-login>Login</button>
            <button data-signup>Sign Up</button>
        </div>
    </template>

    <!-- Authenticated Template -->
    <template id="authenticated">
        <div>
            <p>Welcome, [Username]!</p>
            <button data-logout>Logout</button>
        </div>
    </template>

    <!-- Auth Element Instance -->
    <auth-element data-stylesheet="path/to/custom-stylesheet.css"></auth-element>

</body>
</html>
```

Note: Replace `[Username]` with the actual username once authenticated.

Feel free to customize the templates and styles to fit your application's design.