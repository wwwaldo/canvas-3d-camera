// Hurray, ECMAScript 2015!
import { Point3D, rotatePoints } from "./quaternion";

// TODO: move this to quaternion
const enum RotationAxis {
  zAxis,
  xyPlane
}

class CanvasPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Camera {
  position: Point3D;

  xlim: number; // limits of the projecting screen
  ylim: number;

  canvas_xlim: number; // inherited from the canvas
  canvas_ylim: number;

  ctx: any; // for drawing

  radius: number; // radius of drawn points
  world: Point3D[]; // TODO: update
  render: Point3D[];

  faces: number[][];

  constructor(xlim: number, ylim: number, canvas: HTMLCanvasElement) {
    this.position = new Point3D(0, 0, 2);

    this.xlim = xlim;
    this.ylim = ylim;

    this.canvas_xlim = canvas.width / 2;
    this.canvas_ylim = canvas.height / 2;

    this.ctx = canvas.getContext("2d");

    this.radius = 5;
    this.world = [];
    this.render = [];

    this.faces = [];
  }
}

/* The world is a set of points. To make the camera see a point, we need to
    add it to the world. */
function addToWorld(c: Camera, p: Point3D) {
  let tmp = [p.x, p.y, p.z].map(
    (el, i) => el - [c.position.x, c.position.y, c.position.z][i]
  );

  c.world.push(new Point3D(tmp[0], tmp[1], tmp[2]));
  c.render.push(new Point3D(tmp[0], tmp[1], tmp[2]));
}

/* Add a face to the camera. */
function addFace(c: Camera, face: number[]) {
  let nverts = c.world.length;
  let inds = face.slice(1, face.length); // discard first coord
  
  if ( !inds.every( ind => nverts >= ind ) ){
    return -1;
  }
  c.faces.push(inds);
}


function rotateCamera(c: Camera, theta: number, phi: number) {
  let theta_axis = new Point3D(0, 1, 0);
  let phi_axis = new Point3D(-1, 0, 0);

  c.render = rotatePoints(c.world, theta_axis, theta);
  c.render = rotatePoints(c.render, phi_axis, phi);
}

function renderWorld(c: Camera) {
  c.ctx.clearRect(0, 0, c.canvas_xlim * 2, c.canvas_ylim * 2);
  
  // TODO: Change this to Debug
  c.render.forEach(pt => {
    displayPoint(c, snapPoint(c, pt));
  });

  // No z-buffering: render faces
  // this is all fucked up rn
  c.faces.forEach(face => {
    displayFace(c, face)
  });
}

/* Internals */

function displayFace(c: Camera, face: number[]){
  if (c.ctx) {
    let pts = c.render.map( pt => snapPoint(c, pt))
    pts = pts.filter( pt => face.includes( pts.indexOf(pt) ) )
 
    c.ctx.beginPath();
    c.ctx.moveTo( pts[0].x, pts[0].y );

    pts.slice(1, pts.length).forEach(
      pt => c.ctx.lineTo(pt.x, pt.y)
    );
    
    //c.ctx.stroke(); // use c.ctx.fill() for fill triangles
    c.ctx.fillStyle = `rgb(0, ${c.faces.indexOf(face) * 8}, 0)`;
    c.ctx.fill();
  }
}

function displayPoint(c: Camera, p: CanvasPoint) {
  if (c.ctx) {
    c.ctx.beginPath();
    c.ctx.arc(p.x, p.y, c.radius, 0, Math.PI * 2);
    c.ctx.closePath();
    c.ctx.fill();
  }
}

function projectPoint(c: Camera, p: Point3D): number[] {
  // orthographic projection ("lose the z coordinate")
  // return [p.x, p.y];

  // Perspective transformation
  //let [n, f] = [znear, zfar];
  let projected_point = [ // translated from perspective matrix
    (p.x) / (1 - p.z / c.position.z),
    (p.y) / (1 - p.z / c.position.z),
    (p.z) / (1 - p.z / c.position.z)
  ];

  return [projected_point[0], projected_point[1]];
}

// Analogous to the "viewing transform"
function snapPoint(c: Camera, p: Point3D): CanvasPoint {
  let [x, y] = projectPoint(c, p);
  y = -y; // The canvas API is weird: pos y corresponds to down

  // transform world coordinates to canvas coordinates.
  x /= c.xlim * 2;
  y /= c.ylim * 2;
  x *= c.canvas_xlim * 2;
  y *= c.canvas_ylim * 2;

  // Translate the points to the canvas origin.
  x += c.canvas_xlim;
  y += c.canvas_ylim;

  return new CanvasPoint(x, y);
}

export { addToWorld, renderWorld, Camera, rotateCamera, RotationAxis, addFace };
//export * from "./camera";
