# encoding: utf-8
from math import floor, ceil, atan, pi
from flask import Flask, render_template, request, redirect, url_for
import json
import pickle
import numpy as np
from KDEpy import FFTKDE
from sklearn.neighbors import KDTree
import os
import cv2 as cv

app = Flask(__name__)
data_path = r'static\data'


@app.route('/')
def hello_world():
    return redirect(url_for('index'))


@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/save', methods=['POST'])
def save():
    data_name = str(request.form['data_name'])
    results = json.loads(request.form['results'])
    save_path = os.path.join(data_path, 'our_scatterplots_with_r_adjustment', data_name + '.json')
    with open(save_path, 'w') as fw:
        json.dump(results, fw)
    print(data_name, 'saved')
    return json.dumps({})


if __name__ == '__main__':
    app.run(debug=True, port=5301)
