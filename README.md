# Birdhouse 2

Version 2.0 of menu management app birdhouse now build upon Node.JS framework for easy scaling.

## What the app is about

This app will use separate frontend and backend application.
Frontend will utilize ReactJS application.
Backend will be an express REST API for handling whole business logic.

## Getting Started

The following instructions are meant to help you with installation.
Right now there is no automatic installer available

### Getting started

Birdhouse requirements are:

- Node.js and NPM
- Some webserver that can handle HTML/CSS/JS
- Some backendserver that runs Mongo and Node
- Cloned GIT to your server

### Frontend installation

- cd to folder "./frontend"
- .dummyenv file to fit your needs and rename it to fit your needs.
- run the following command:

`npm run build`

- Copy content of folder "./frontend/build" to your webroot folder

### Backend installation

- Have backend server with running mongodb server
- cd to folder "./backend"
- Change dummy env file to fit your needs
- Configure firewall accordingly
- Run backend with following command:

`npm start`

## Using Birdhouse

This paragraph will follow shortly

## Authours

- Peter Vogelmann

## License

This project is under the GNU GPL3 License - see [LICENSE.md](LICENSE.md) for details

## Acknowledgments

None right now
