![Under Construction](https://emojicdn.elk.sh/🚧)


🚧 **Work in Progress** 🚧

This project is currently under development. 

# Real-Time Chat App

This is a real-time chat application built using React Native, Expo, Django, and Django Channels. Users can create accounts, send friend requests, accept them, and message their friends in real-time using websockets.

## Features

* Account creation and authentication
* Friend requests and acceptance
* Real-time messaging with friends
* User-friendly interface
* Cross-platform compatibility (iOS, Android)

## Prerequisites

Before running this application locally or deploying it to a server, ensure you have the following prerequisites installed:

* Node.js and npm
* Python and pip
* Redis server


## Getting Started

Follow these steps to get the application up and running on your local machine:

### Backend (Django)

1. Clone the repository:

    ```bash
    git clone https://github.com/AnamariaGM/Banteroo
    ```

2. Navigate to the backend directory:

    ```bash
    cd https://github.com/AnamariaGM/Banteroo/api
    ```

3. Create and activate a virtual environment (optional but recommended):

    ```bash
    python -m venv env
    source env/bin/activate
    ```

4. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Configure Environment Variables:

    - Create a `.env` file in the root directory of your project.
    - Add necessary environment variables. Here's an example:

      ```plaintext
      # Django settings
      SECRET_KEY=your_secret_key_here
      DEBUG=False
      ALLOWED_HOSTS=your_domain_or_IP_here

      # Redis configuration
      REDIS_HOST=127.0.0.1
      REDIS_PORT=6379

      # Database configuration (if using SQLite)
      DB_NAME=db.sqlite3
      DB_USER=
      DB_PASSWORD=
      DB_HOST=
      DB_PORT=

      # Other settings...
      ```

6. Run Migrations:

    ```bash
    python manage.py migrate
    ```

### Frontend (React Native)

1. Navigate to the frontend directory:

    ```bash
    cd https://github.com/AnamariaGM/Banteroo/app
    ```

2. Install Node.js dependencies:

    ```bash
    npm install
    ```

3. Start the Expo development server:

    ```bash
    npm start
    ```

4. Use the Expo Go app on your mobile device or an emulator to view the app.


### Dependencies

#### Frontend(Expo)
* `@expo-google-fonts/leckerli-one`: Google Fonts for the application's typography.
* `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-native-fontawesome`: Font Awesome for icons.
* `@react-native-async-storage/async-storage`: AsyncStorage for storing data asynchronously.
* `@react-navigation/bottom-tabs`, `@react-navigation/native`, `@react-navigation/native-stack`: React Navigation for navigation in the application.

* `axios`: Promise-based HTTP client for making requests to the backend.

* `expo`, `expo-app-loading, expo-font`, `expo-secure-store`, `expo-status-bar`: Expo SDK for building the application.

* `react`, `react-native`: React and React Native for building the user interface.

* `react-hook-form`: Performant, flexible and extensible forms with easy-to-use validation.

* `react-native-encrypted-storage`, `react-native-image-picker`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`: Additional dependencies for React Native development.

* `zustand`: State management library for React.
#### Backend(Django)
* `channels`: Asynchronous support for Django, enabling real-time functionality.

* `daphne`: HTTP, HTTP2, and WebSocket protocol server for ASGI and ASGI-HTTP, developed as part of Django Channels.

* `corsheaders`: Django application for handling Cross-Origin Resource Sharing (CORS).

* `rest_framework_simplejwt`: JSON Web Token (JWT) authentication for Django REST Framework.

  ### Configuration
#### Backend (Django)
* Settings: `core/settings.py`
    * Django settings including database configuration, security settings, CORS settings, and more.
* ASGI Application: `core/asgi.py`
    * ASGI application configuration for Daphne and Channels.
& Routing: `core/routing.py`
    * URL routing for WebSocket connections.
#### Frontend (Expo)
* App Entry: `node_modules/expo/AppEntry.js`
    * Main entry point for the Expo application.
* Scripts:
    * npm start: Start the Expo development server.
    * npm run android: Start the Expo development server for Android.
    * npm run ios: Start the Expo development server for iOS.


