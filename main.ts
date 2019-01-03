import * as camera from "./camera";
import * as quat from "./quaternion";

// via https://people.sc.fsu.edu/~jburkardt/data/ply/dodecahedron.ply
// now hosted statically! (note: Object.values is ES2017)


const dodecahedron_verts: quat.Point3D[] = Object.values(
  require("./dodecahedron.json")
);

// debug
// const dodecahedron_verts: quat.Point3D[] = [new quat.Point3D(0, 0, -2)];

// @ts-ignore
const canvas: HTMLCanvasElement = document.getElementById("theCanvas");
const c = new camera.Camera(3, 3, canvas);

dodecahedron_verts.forEach(pt => camera.addToWorld(c, pt));

// Register those callbacks!
var theta : number = 0;
var phi : number = 0;


document.getElementById("theta").addEventListener("input", event => {
  // @ts-ignore
  let value = event.target.value - event.target.defaultValue;
  theta = (value / 50) * Math.PI ; // Convert value to radians
  camera.rotateCamera(c, theta, phi);
  console.log(c.render[0].z)

  camera.renderWorld(c);
});

document.getElementById("phi").addEventListener("input", event => {
  // @ts-ignore
  let value = event.target.value - event.target.defaultValue;
  phi = (value / 50) * (Math.PI / 2);

  camera.rotateCamera(c, theta, phi);
  camera.renderWorld(c);
});

camera.renderWorld(c);
