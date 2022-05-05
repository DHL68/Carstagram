<<<<<<< HEAD
=======
from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

from datetime import datetime

import requests
from bs4 import BeautifulSoup

>>>>>>> personal_branch_DH
from pymongo import MongoClient
<<<<<<< HEAD
=======
client = MongoClient('localhost', 27017)
<<<<<<< HEAD
db = client.carstagram
>>>>>>> personal_branch_DH

client = MongoClient('localhost', 27017)
db = client.Carstagram

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


# 저장 - 예시
doc = {'name':'bobby','age':21}
db.carstagram.insert_one(doc)

from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

<<<<<<< HEAD
# 홈페이지 불러오기
@app.route('/')
def main():
    return render_template('index.html')
=======
@app.route('/')
def home():
    return render_template('main.html')
>>>>>>> personal_branch_DH

# 개인페이지 불러오기
@app.route('/user')
def user():
    return render_template('user.html')

# 새로운 게시글 작성
@app.route("/main", methods=["POST"])
def new_post():
    posting_picture_receive = request.form['posting_picture_give']
    posting_comment_receive = request.form['posting_comment_give']

    doc = {
        'posting_picture': posting_picture_receive,
        'posting_comment': posting_comment_receive
    }

    db.posts.insert_one(doc)
    return jsonify({'msg':'작성완료!'})


@app.route("/comment", methods=["POST"])
def new_comment():
    comment_receive = request.form['comment_give']

    doc = {
        'comment': comment_receive
    }

    db.comments.insert_one(doc)
    return jsonify({'msg':'댓글작성완료!'})


@app.route("/comment", methods=["GET"])
def comment():
    comment_list = list(db.comments.find({}, {'_id': False}))
    return jsonify({'comments':comment_list})




<<<<<<< HEAD
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
=======

# 개인 글쓰기(POST) API
# 해당 페이지의 경로 지정, 메서드 구분 지정
@app.route('/personal', methods=['GET', 'POST'])
# write 함수 지정
def write():
    # 조건문 지정 post 메서드 일 때
    if request.method == "POST":
        cur_time = time.strftime("%y%m%d_%H%M%S")
        title = request.form.get('title')
        contents = request.form.get('contents')
        # year = request.form.get('year')
        # month = request.form.get('month')
        # day = request.form.get('day')
        # date = year + "년 " + month + "월 " + day +"일"
        if 'email' in session:
            id = session['email']

        # DB 에 저장 (값의 테이블 지정)
        db = {
            'email': id,
            'title': title,
            'contents': contents,
            'pubdate': cur_time,
            'date': date
        }
        # 저장
        aaa.insert_one(db)

        redirect(url_for('bulletin_rd'))
        return jsonify({'ans': 'success', 'msg': "작성 완료"})
    else:
        return render_template('personal_main.html')



# 개인 글보기(GET) API
@app.route("/bulletin_rd", methods=['GET'])
def bulletin_rd():
    diary_data = list(aaa.find({'email':session['email']}, {'_id': False}).sort('date', 1))
    print(diary_data)
    return jsonify({'all_data': diary_data})














=======
db = client.dbparc

## HTML을 주는 부분
@app.route('/')
def home():
   return render_template('main.html')
>>>>>>> personal_branch_DH

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

    return jsonify({'msg':'업로드 완료!'})

if __name__ == '__main__':
<<<<<<< HEAD
    app.run('0.0.0.0', port=5500, debug=True)

>>>>>>> personal_branch_DH
=======
   app.run('0.0.0.0',port=5000,debug=True)
>>>>>>> personal_branch_DH
