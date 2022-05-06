from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

from datetime import datetime

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.Carstagram

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


# 홈페이지 불러오기
@app.route('/')
def main():
    return render_template('index.html')


# 개인페이지 불러오기
@app.route('/user')
def user():
    return render_template('user.html')


@app.route("/comment", methods=["POST"])
def new_comment():
    comment_receive = request.form['comment_give']

    doc = {
        'comments': comment_receive
    }
    db.comments.insert_one(doc)

    return jsonify({'msg': '댓글작성완료!'})


@app.route("/comment", methods=["GET"])
def comment():
    comment_list = list(db.comments.find({}, {'_id': False}))

    return jsonify({'comments': comment_list})


#
# post 리스팅 메서드
#
@app.route('/listing', methods=['GET'])
def post_listing():
    posts = list(db.post.find({}, {'_id': False}))

    return jsonify({'posts': posts})


#
# post 업로드 메서드
#
@app.route('/posting', methods=['POST'])
def post_posting():
    picture_receive = request.form["picture_give"]
    comment_receive = request.form["comment_give"]

    post_pic = request.files["pic_give"]

    # 새로운 날짜 이름 만들기
    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    filename = f'post_pic-{mytime}'

    # 확장자 뺴기
    extension = post_pic.filename.split('.')[-1]

    # 새로운 이름으로 저장하기
    save_to = f'static/{filename}.{extension}'
    post_pic.save(save_to)

    doc = {
        'post_pictures': picture_receive,
        'post_comments': comment_receive,
        'post_pic': f'{filename}.{extension}'
    }
    db.post.insert_one(doc)

    return jsonify({'msg': '업로드 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5500, debug=True)
