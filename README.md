# Blade Terminal

Blade Terminal is a versatile web-based terminal interface designed to facilitate command-line interactions with remote servers or local systems through a user-friendly web interface. This repository houses the complete source code for the Blade Terminal application, providing a seamless bridge between users and their systems.
# Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [index.js Overview](#indexjs-overview)
  - [Key Functionalities](#key-functionalities)
- [Files](#files)
- [External Dependencies](#external-dependencies)
- [Directories and Files](#directories-and-files)
- [Additional Notes](#additional-notes)
- [Additional Resources](#additional-resources)
  - [Windows Commands Documentation](#windows-commands-documentation)
  - [Basic Unix Commands](#basic-unix-commands)
  - [Getting User IP](#getting-user-ip)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/StunsIO/BladeTerminal.git

# Navigate to the source directory
cd BladeTerminal/src

# Install the required dependencies
npm install

# Start the application
npm start
```

## Usage

1. **Login Page**: Access the login page at `<http|https>://<HOST|localhost>:<PORT|8013>/login` and enter the token for authentication.

2. **Terminal Page**: After successful login, you will be redirected to the terminal page where you can enter commands.

3. **Commands**: Enter commands in the input field and press "Submit". The output will be displayed below.

4. **Get Server Info**: Click the "Get Server Info" button to retrieve information about the server. This includes details about system resources and disk space.

5. **Logout**: To log out, use the "logout" command.

Please note that the "Get Server Info" button provides additional insights into the server's status and resource utilization.


## index.js Overview

The `index.js` file serves as the main entry point for the Blade Terminal application. It utilizes the Express framework to handle HTTP requests, execute system commands, and manage user authentication.

### Key Functionalities

1. **Server Setup**: Sets up an Express server and configures it to use EJS as the view engine. It also includes middleware for serving static files and parsing request bodies.

2. **User Authentication**:
   - Generates a 64-character authentication token using the `generateToken` function.
   - Implements routes for user login, logout, and authentication checks.

3. **Routes**:
   - **Login Page**: Renders the login page when accessed.
   - **Login Endpoint**: Validates the user-provided token and authenticates the user.
   - **Logout Endpoint**: Logs the user out and redirects to the login page.
   - **Terminal Page**: Renders the terminal page for authenticated users, displaying system information based on the user's platform.
   - **Execute Command Endpoint**: Executes commands sent via POST request, handling both Windows and Linux platforms.
   - **Server Info Endpoint**: Retrieves and formats server information based on the user's platform.

4. **User Authentication Middleware**: Utilizes the `requireAuth` function to ensure that only authenticated users have access to certain routes.

5. **Starting the Server**: Listens for incoming requests on the specified port, with a default of 8013, and logs the server's address.

6. **Token Generation Function**: Generates a random token of the specified length using a combination of alphanumeric characters.



## Files

| File                         | Description                                     |
|------------------------------|-------------------------------------------------|
| `src/index.js`                | Express server managing routes and serving HTML. |
| `src/views/login.ejs`         | HTML code for the login page.                    |
| `src/views/index.ejs`         | HTML code for the terminal page.                 |
| `src/public/app.js`           | JavaScript code for handling terminal functions. |
| `src/public/style.css`        | CSS file for styling the application.            |


## External Dependencies

| Dependency                                                        | Description                               |
|-------------------------------------------------------------------|-------------------------------------------|
| [Prism CSS](https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css)                   | Syntax highlighting for code blocks.      |
| [Prism Tomorrow CSS](https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-tomorrow.min.css)    | Additional Prism theme.                  |
| [Google Material Icons](https://fonts.googleapis.com/icon?family=Material+Icons)                        | Icons for UI elements.                    |

## Directories and Files

```
│
├── src
│ ├── views
│ │ ├── login.ejs
│ │ └── index.ejs
│ ├── public
│ │ ├── app.js
│ │ └── style.css
│ └── index.js
```

## Additional Notes

- The login page (`views/login.ejs`) provides a simple form to enter a token for authentication.

- The terminal page (`views/index.ejs`) displays system information, allows input of commands, and provides links for documentation and support.

- The terminal supports syntax highlighting using Prism.

- Make sure to have the necessary CSS and JavaScript files linked in your HTML.

## Additional Resources

### Windows Commands Documentation

For detailed information on Windows commands, you can refer to the official Microsoft documentation:

- [Windows Commands Documentation](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)

This resource provides comprehensive documentation for a wide range of commands available on the Windows platform.

### Basic Unix Commands

If you are working on a Unix-based system, you can explore basic Unix commands using the following resource:

- [Basic Unix Commands](https://mally.stanford.edu/~sr/computing/basic-unix.html)

This guide offers an introduction to essential Unix commands and their usage.

### Getting User IP

To retrieve the public IP address of a user, you can use the [ipify API](https://api.ipify.org/). This API allows you to easily obtain the user's external IP address.

### License
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
