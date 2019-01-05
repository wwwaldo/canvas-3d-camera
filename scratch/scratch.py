import numpy as np
import matplotlib.pyplot as plt 
from mpl_toolkits.mplot3d import Axes3D

# Implementation of quaternions.

class Quaternion:
    def __init__(self, r, i, j, k):
        self.r, self.i, self.j, self.k = r, i, j, k

    def __str__(self):
        return f"({self.r},{self.i},{self.j},{self.k})"


def multiplyQuaternions(q, r):
    a = r.r * q.r - r.i * q.i - r.j * q.j - r.k * q.k
    b = r.r * q.i + r.i * q.r - r.j * q.k + r.k * q.j
    c = r.r * q.j + r.i * q.k + r.j * q.r - r.k * q.i
    d = r.r * q.k - r.i * q.j + r.j * q.i + r.k * q.r
    return Quaternion(a, b, c, d)

def invertQuaternion(q):
    scaling = q.r ** 2 + q.i ** 2 + q.j ** 2 + q.k ** 2
    temp = (1. / scaling) * np.array( [
        q.r, -q.i, -q.j, -q.k
    ])

    return Quaternion(temp[0], temp[1], temp[2], temp[3])


if __name__ == '__main__':

    # represent a point as a quaternion.
    mypoint = np.array([2, 0, 0])

    x0 = np.linalg.norm(mypoint)
    print(x0)

    y0 = 1 - 2. / (1. + x0 ** 2) # the scalar part 

    scaling_factor = np.sqrt( (1. - y0 ** 2) / np.linalg.norm(mypoint) ** 2 )
    rescaled = scaling_factor * mypoint 

    quaternion_out = np.append([y0], rescaled )
    print(f"Quaternion repr of {mypoint} : {quaternion_out}")
    quaternion = Quaternion(quaternion_out[0], quaternion_out[1], quaternion_out[2], quaternion_out[3])
    
    print(np.linalg.norm(quaternion_out))

    # let's rotate this!
    
    # polar quaternion multiplication 
    angle = np.pi / 4 # 90 degrees; should rotate to j
    scalar_part = np.cos( angle )
    vector_part = np.sin( angle ) * np.array( [0, 0, 1.])
    polar_quaternion = Quaternion( scalar_part, vector_part[0],
        vector_part[1], vector_part[2] )

    polar_inverse = invertQuaternion(polar_quaternion)

    # do the rotation (left-associatively)
    result = multiplyQuaternions(polar_quaternion, quaternion)
    result = multiplyQuaternions(result, polar_inverse)
    print(result)


