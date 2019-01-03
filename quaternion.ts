export {Point3D, Quaternion, rotatePoints};

class Quaternion {
  r: number;
  i: number;
  j: number;
  k: number;

  constructor(r :number, i :number, j :number, k :number) {
    this.r = r;
    this.i = i;
    this.j = j;
    this.k = k;
  }
}

class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(x:number , y:number, z:number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Utilities for quaternions
function multiply(q: Quaternion, r: Quaternion): Quaternion {
  let a = r.r * q.r - r.i * q.i - r.j * q.j - r.k * q.k;
  let b = r.r * q.i + r.i * q.r - r.j * q.k + r.k * q.j;
  let c = r.r * q.j + r.i * q.k + r.j * q.r - r.k * q.i;
  let d = r.r * q.k - r.i * q.j + r.j * q.i + r.k * q.r;
  return new Quaternion(a, b, c, d);
}

function invert(q: Quaternion): Quaternion{
  let scaling = q.r ** 2 + q.i ** 2 + q.j ** 2 + q.k ** 2;
  let res : number[] = [ q.r, -q.i, -q.j, -q.k ];
  res.forEach( el => el / scaling);

  // "...res" doesn't work :(
  return new Quaternion(res[0], res[1], res[2], res[3]);
}

function pointToQuaternion(p: Point3D): Quaternion {
  // based on the 1D stereographic projection.
  let x0_squared = p.x ** 2 + p.y ** 2 + p.z ** 2;
  let y0 = 1 - 2 / ( 1 + x0_squared );
  
  let scaling = Math.sqrt( (1 - y0 ** 2)  / x0_squared );
  
  let rescaled : number[] = [p.x, p.y, p.z].map( el => scaling * el);
  return new Quaternion( y0, rescaled[0], rescaled[1], rescaled[2]);
}

function quaternionToPoint(q: Quaternion): Point3D {
  let y0 = q.r;
  let norm_squared = 2 / (1 - y0) - 1;

  let scaling = Math.sqrt( norm_squared / ( 1 - y0 ** 2) );

  let p = [q.i, q.j, q.k].map( el => scaling * el );
  return new Point3D( p[0], p[1], p[2] );
}

// Rotate p *around* the axis v ccw by the angle theta.
function rotatePoints(p: Point3D[], v: Point3D, theta: number): Point3D[] {
  let angle = theta / 2;
  let scalar_part = Math.cos( angle );
  let vector_part = [v.x, v.y, v.z].map( el => Math.sin( angle ) * el);

  let polar_quaternion = new Quaternion(scalar_part, vector_part[0],
    vector_part[1], vector_part[2]);
  let polar_inverse = invert(polar_quaternion);

  let result : Point3D[] = p.map( pt => pointToQuaternion(pt) )
    .map( quat => multiply(polar_quaternion, quat) )
    .map( semiquat => multiply(semiquat, polar_inverse) ) 
    .map( res => quaternionToPoint(res) );

  return result;
}

// "tests"
{
  const point = new Point3D(2, 0, 0);

  let quaternion = pointToQuaternion(point);
  console.log(quaternion);
  // Expected: {r: 0.4, i: 0.8, j: 0, k: 0}

  let transformed = rotatePoints( [point], new Point3D(0, 0, 1), Math.PI / 2.);
  console.log(transformed);
  // Expected: {x: 0, y: 2, z: 0}
}

{
  const point = new Point3D(Math.sqrt(2), 0, 0);
  let transformed = rotatePoints( [point], new Point3D(0, 0, 1), Math.PI / 4.);
  console.log(transformed);
  // Expected: {x: 1, y: 1, z: 0}
}
