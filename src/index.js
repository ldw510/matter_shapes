import "pathseg";
import {
  Engine,
  Runner,
  Common,
  Composite,
  Svg,
  Bodies,
  Mouse,
  MouseConstraint,
  Vertices
} from "matter-js";
import PolyDecomp from "poly-decomp";

import "./styles.css";
import Render from "./render";
import shapes from "./shapes";

const DESIGN_PERIMETER = 1920 * 2 + 1080 * 2;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WINDOW_PERIMETER = WIDTH * 2 + HEIGHT * 2;
const SCALE = WINDOW_PERIMETER / DESIGN_PERIMETER;

// Provide concave decomposition support library
Common.setDecomp(PolyDecomp);

// Create an engine
let engine = Engine.create(),
  world = engine.world;

// Create a renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    pixelRatio: "auto",
    width: WIDTH,
    height: HEIGHT,
    wireframes: false,
    wireframeBackground: "#fff"
  }
});
Render.run(render);

// Create runner
let runner = Runner.create();
Runner.run(runner, engine);

// Create shapes
shapes.forEach((shape) => {
  // Convert paths to vertices
  const vertexSets = shape.paths.map((path) =>
    Vertices.scale(Svg.pathToVertices(path, 30), SCALE, SCALE)
  );

  const getRandomBetween = (min, max) => Math.random() * (max - min) + min;

  // Create the physics body
  const body = Bodies.fromVertices(
    getRandomBetween(WIDTH * 0.3, WIDTH * 0.7),
    getRandomBetween(HEIGHT * -0.5, HEIGHT * -5),
    // getRandomBetween(-100 + HEIGHT * -1, -100 + HEIGHT * -2),
    vertexSets,
    {
      label: shape.name,
      render: {
        sprite: {
          texture: shape.texture,
          xScale: 0.5 * SCALE,
          yScale: 0.5 * SCALE
        }
      }
    }
  );

  // Add the body to the world
  Composite.add(world, body);
});

// Add walls and floor
Composite.add(world, [
  Bodies.rectangle(-50, 0, 50, HEIGHT * 2, {
    isStatic: true,
    label: "leftWall"
  }),
  Bodies.rectangle(WIDTH + 50, 0, 50, HEIGHT * 2, {
    isStatic: true,
    label: "rightWall"
  }),
  Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 50, {
    isStatic: true,
    label: "floor"
  })
]);

// Add mouse control
// TODO: Disable on mobile
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });

Composite.add(world, mouseConstraint);

// Keep the mouse in sync with rendering
render.mouse = mouse;
