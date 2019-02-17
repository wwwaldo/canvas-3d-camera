/*
A selection of pre-made Models for injection into the world.
*/

import { Point3D, rotatePoints } from "./quaternion";
import { Model } from "./camera";

// A 2D Grid.
class Grid2D{
    x: number // leftmost point
    y: number // bottommost point
    n: number // unit normal (TODO)
    N: number // Number of nodes
    lx: number 
    ly: number

    // Todo: Subclass the grid as a model
    verts: Point3D[]
    faces: number[][]

    
    constructor(x: number, y: number, N: number){
        this.x = x
        this.y = y 

        this.lx = 1 // TODO: generalize
        this.ly = 1
        this.N = 10;
    }

    makeVertsAndFaces(){
        let dx = this.lx / this.N;
        let dy = this.ly / this.N;

        // Make all of the vertices 
        let i : number ; let j : number;
        for (i = 0; i < this.N; i++){
            for (j = 0; j < this.N; j++){
                this.verts.push(new Point3D( this.x + i * dx, this.y + j * dy, 0));
            }
        }

        // Make all of the faces (upper triangles)
        for (i = 0; i <  this.N - 1; i++){
            for (j = 0; j < this.N - 1; j++){
                let nx = j + 1 + i * this.N;
                let ny = j + (i + 1) * this.N;
                let idx = j + i * this.N;
                this.faces.push([idx, nx, ny])
            }
        }

        // Make all of the faces (lower triangles)
        for (i = 1; i <  this.N; i++){
            for (j = 1; j < this.N; j++){
                let nx = j - 1 + i * this.N;
                let ny = j + (i - 1) * this.N;
                let idx = j + i * this.N;
                this.faces.push([idx, nx, ny])
            }
        }

    }

    makeModel(){
        return new Model(this.verts, this.faces, 'PlaneGeometry');
    }

}