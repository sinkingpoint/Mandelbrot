import numpy as np
import matplotlib.pyplot as plt
from flask import Flask, send_from_directory

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def get_main_page():
    return app.send_static_file('index.html')

@app.route('/ping')
def ping():
    return 'PING', 200

@app.route('/js/<path:path>')
def get_javascript(path):
    return send_from_directory('static/js', path)#

@app.route('/mandelbrot/<r>/<i>/<iterations>')
def mandelbrot(r, i, iterations):
    r, i, iterations = float(r), float(i), int(iterations)
    z = complex(r, i)
    c = z
    for n in range(iterations):
        if abs(z) > 2:
            return '{"iterations":' + str(n) + '}'
        z = z*z + c
    return '{"iterations":' + str(iterations) + '}'

if __name__ == '__main__':
    app.run(threaded=True)
