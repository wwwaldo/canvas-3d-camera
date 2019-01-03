import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D



def transform_points():
    # near and far planes ( no mention of clipping )
    n = -1 
    f = -3

    # this is 4D because we need to do translation transforms as well.
    P = np.array( [
        [n, 0, 0 , 0],
        [0, n, 0,  0],
        [0, 0, n+f, -f*n],
        [0, 0, 1, 0]
    ])

    # the orthographic transform is the one which turns the unit cube 
    # into an arbitrary cube. We also tend to call it a 'windowing transform'


    return

def plot_wrap(pt):
    # we usually represent points in 3D as homogenous points.
    
    # so we have 
    # [x, y, z, 1]
    # as the homogenous coordinate

    # then we need to use some kind of perspective transform
    # to convert it into 2D. Oh, we can just remove the depth coordinate
    # since our canvas isn't supposed to...
    return


def draw_sphere():
    # point cloud for a sphere

    phi = np.linspace(0, np.pi, 25)
    theta = np.linspace(0, 2 * np.pi, 25)

    T, P = np.meshgrid(theta, phi) # every possible value

    # spherical point cloud
    data_x, data_y, data_z = np.cos(T) * np.sin(P), \
                             np.sin(T) * np.sin(P), \
                             np.cos(P)
    data_x = data_x.reshape(-1) # bad
    data_y = data_y.reshape(-1)
    data_z = data_z.reshape(-1)

    # rescale the sphere
    data_x *= 0.3
    data_y *= 0.3
    data_z *= 0.3 
    
    x, y, z = np.copy(data_x), np.copy(data_y), np.copy(data_z)
    z -= 2.
    y += 2.6
    x -= 1.1
    # move the sphere out along the z axis, because life is difficult
    
    data_z -= 8
    # angle the sphere a little

    # two spheres
    data_x = np.append(data_x, x) 
    data_y = np.append(data_y, y) 
    data_z = np.append(data_z, z) 

    fig, ax = plt.subplots()

    # "very standard viewing port"
    ax.set_xlim([-1, 1])
    ax.set_ylim([-1, 1])
    
    # here's what happens when we try to plot the x and y data and 
    # throw out our z data
    # ax.scatter(data_x, data_y)
    
    
    # let's apply the perspective transform first.
    # what's the near plane? z=-1
    # what's the far plane? z=-5

    znear = -.1 # also the projection plane!
    zfar = -1000
    n, f = znear, zfar 

    P = np.array( [
        [n, 0, 0 , 0],
        [0, n, 0,  0],
        [0, 0, n+f, -f*n],
        [0, 0, 1., 0]
    ])

    # make points 
    pts = [
        np.array([x, y, z, 1.]) for x, y, z in zip(
            data_x.reshape(-1),
            data_y.reshape(-1), 
            data_z.reshape(-1))
    ]
    print(pts[0])
    
    # apply the perspective transform
    transformed = []
    for pt in pts:
        # wow, what an asshole. need to normalize by z
        temp = P @ pt 
        temp = temp / temp[3]
        transformed.append( temp )

    for t in transformed:
        ax.scatter(t[0], t[1])
        
    plt.show()

    return

    
    #plt.show()



    # compare with plt's standard map
    fig = plt.figure()
    ax = fig.gca(projection='3d')
    ax.scatter(data_x, data_y, data_z)
    plt.show()


if __name__ == '__main__':
    print('hello world')

    draw_sphere()