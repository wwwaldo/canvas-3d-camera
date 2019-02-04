import * as camera from "./camera";
import * as quat from "./quaternion";
import { deflateRaw } from "zlib";

// via https://people.sc.fsu.edu/~jburkardt/data/ply/dodecahedron.ply
// now hosted statically! (note: Object.values is ES2017)


const dodecahedron_verts: quat.Point3D[] = Object.values(
  require("./dodecahedron.json")
);
const dodecahedron_faces: number[][] = Object.values(
  require("./dodeca_faces.json")
) // If rendering a wireframe for debug, use "./dodeca_lines.json"

// debug
// const dodecahedron_verts: quat.Point3D[] = [new quat.Point3D(0, 0, -2)];

// @ts-ignore
const canvas: HTMLCanvasElement = document.getElementById("theCanvas");
const c = new camera.Camera(0.01, 0.01, canvas); //TODO: couple this to near plane length

const m = new camera.Model(dodecahedron_verts, dodecahedron_faces);
camera.addModelToWorld(c, m);

// Animation

// Register those callbacks!
var theta : number = 0;
var phi : number = 0;

document.getElementById("theta").addEventListener("input", event => {
  // @ts-ignore
  let value = event.target.value - event.target.defaultValue;
  theta = (value / 50) * Math.PI ; // Convert value to radians
  c.theta = theta;
});

document.getElementById("phi").addEventListener("input", event => {
  // @ts-ignore
  let value = event.target.value - event.target.defaultValue;
  phi = (value / 50) * (Math.PI / 2);
  c.phi = phi;
});

// Navigation keys
document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  //console.log(keyName);
  const speed = 0.1 // Better way to specify this?
  if (keyName === "ArrowDown"){
    c.position.z += speed;
  } if (keyName === "ArrowUp" ){
    c.position.z -= speed;
  } if (keyName === "ArrowLeft"){
    c.position.x -= speed;
  } if (keyName === "ArrowRight"){
    c.position.x += speed;
  } if (keyName === "q"){
    c.position.y -= speed;
  } if (keyName === "e"){
    c.position.y += speed;
  }
})


function draw(){
  c.models[0].rotateModel();
  camera.renderWorld(c);
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw)

