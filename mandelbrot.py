import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, send_from_directory
import json

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def get_main_page():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def get_javascript(path):
    return send_from_directory('static/js', path)#

@app.route('/styles/<path:path>')
def get_css(path):
    return send_from_directory('static/styles', path)#

@app.route('/ping')
def ping():
    return 'PING', 200

def mandelbrot_pixel(r, i, iterations):
    z = complex(r, i)
    c = z
    for n in range(iterations):
        if abs(z) > 2:
            return n
        z = z*z + c
    return iterations

@app.route('/mandelbrot/<xmin>/<xmax>/<ymin>/<ymax>/<w>/<h>/<iterations>')
def mandelbrot(xmin, xmax, ymin, ymax, w, h, iterations):
    try:
        xmin, ymin, xmax, ymax, w, h, iterations = float(xmin), float(ymin), float(xmax), float(ymax), int(w), int(h), int(iterations)
    except ValueError, e:
        print e
        return '{"error":"Incorrect Arguments"}', 400
    return_val = []
    r1 = np.linspace(xmin, xmax, w)
    r2 = np.linspace(ymin, ymax, h)
    for r in r1:
        for i in r2:
            return_val.append(mandelbrot_pixel(r, i, iterations))
    assert len(return_val) == w * h
    return '{"iterations":' + str(return_val) + '}'

def draw(xmin, xmax, ymin, ymax, width, height, max_iterations):
    colors = mandelbrot(xmin, xmax, ymin, ymax, width, height, max_iterations)
    result = json.loads(colors)['iterations']
    plt.imshow(np.reshape(np.array(result), (width, height)))
    plt.show()

if __name__ == '__main__':
    app.run(threaded=True)
