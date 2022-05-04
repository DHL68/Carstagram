from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.Carstagram

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/user')
def user():
    return render_template('user.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
