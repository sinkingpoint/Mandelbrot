#!/bin/sh

mkdir -p /opt/mandelbrot
cd /opt/mandelbrot
wget https://quirl.co.nz/bin/mandelbrot/mandelbrot_latest.zip
apt-get update
apt-get install -y unzip python-pip python-dev
unzip mandelbrot_latest.zip
pip install -r requirements.txt
screen -S mandelbrot -d -m python mandelbrot.py
