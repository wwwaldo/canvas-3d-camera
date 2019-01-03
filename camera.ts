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

  constructor(xlim: number, ylim: number, canvas: HTMLCanvasElement) {
    this.position = new Point3D(0,0,1);

    this.xlim = xlim;
    this.ylim = ylim;

    this.canvas_xlim = canvas.width / 2;
    this.canvas_ylim = canvas.height / 2;

    this.ctx = canvas.getContext("2d");

    this.radius = 5;
    this.world = [];
    this.render = [];
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

function rotateCamera(c: Camera, theta: number, phi: number) {
    let theta_axis = new Point3D(0, 1, 0);
    let phi_axis = new Point3D(-1, 0, 0);

    c.render = rotatePoints( c.world, theta_axis, theta);
    c.render = rotatePoints( c.render, phi_axis, phi);
}

function renderWorld(c: Camera) {
  c.ctx.clearRect(0, 0, c.canvas_xlim * 2, c.canvas_ylim * 2);
  c.render.forEach( (pt) => {
      displayPoint( c, snapPoint(c, pt) );
  });
}

/* Internals */

function displayPoint(c: Camera, p: CanvasPoint) {
  if (c.ctx) {
    c.ctx.beginPath();
    c.ctx.arc(p.x, p.y, c.radius, 0, Math.PI * 2);
    c.ctx.closePath();
    c.ctx.fill();
  }
}

function projectPoint(c: Camera, p: Point3D): number[] {
  //TODO: actual projection.
  if (p.z > 0){
      return [Infinity, Infinity]
  } 
  return [p.x, p.y];
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

export { addToWorld, renderWorld, Camera, rotateCamera, RotationAxis };
//export * from "./camera";
