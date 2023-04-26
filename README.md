# WebGL 3D rotating Cube/Sphere/Cylinder

A simple WebGL/React app used to render rotating Cube, Sphere and Cylinder.
There is an option to enable variation of the width, radius and height of mentioned objects and a slider as well to adjust the speed of this variation.

WebGL is a JavaScript API for rendering interactive 3D and 2D graphics within any compatible web browser without the use of plugins. It is being used in this project to render the rotating objects.

The variation can be done locally in browser (using JavaScript) or received from the Flask/Python server through a websocket (remotely).

[Live Demo](https://imaginative-cat-228fb6.netlify.app/)

## Components and data

The source code is organized as follows:

### Components

* [App](./src/App.tsx): The main component of the application. Uses useReducer hook to hold custom object state. It holds the actions for randomizer activation, its speed of variation and choice of local or remote update. It renders the object by giving appropriate vertices and indices arrays and a random value (width/radius/height) to the Object component as props.

* [Object](./src/components/Object/Object.tsx): This component uses WebGL to render objects using the received indices and vertices arrays.

### Data

* [Cube Data](./src/components/Object/ObjectData/cubeData.tsx): Contains vertices and indices for the cube.

* [Cylinder Data](./src/components/Object/ObjectData/cylinderData.tsx): Contains vertices and indices for the cylinder.

* [Sphere Data](./src/components/Object/ObjectData/sphereData.tsx): Contains vertices and indices for the sphere.


## Getting Started

To run the project locally:

1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running npm install.
4. Run the development server using npm start.
5. Open http://localhost:3000 in your browser.