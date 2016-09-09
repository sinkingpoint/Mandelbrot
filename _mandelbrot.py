import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, send_from_directory

def mandelbrot(r, i, iterations):
    z = complex(r, i)
    c = z
    for n in range(iterations):
        if abs(z) > 2:
            return n
        z = z*z + c
    return iterations

def draw(xmin, xmax, ymin, ymax, width, height, max_iterations):
    r1 = np.linspace(xmin, xmax, width)
    r2 = np.linspace(ymin, ymax, height)
    print r1
    return np.reshape(np.array([mandelbrot(r, i, max_iterations) for r in r1 for i in r2]), (width, height))

if __name__ == '__main__':
    print mandelbrot(0, 0, 100)
    #plt.imshow(draw(-0.001, 0.001, -0.001, 0.001, 10, 10, 100))
    plt.imshow(draw(-2, 0.5, -1.25, 1.25, 10, 10, 100))
    #plt.imshow(draw(0.275, 0.3, 0, 0.025, 500, 500, 100))
    #plt.imshow(draw(-0.74877, -0.74872, 0.065053, 0.065103, 500, 500, 100))
    plt.show()
