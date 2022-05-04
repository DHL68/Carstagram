from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.Carstagram

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}




from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# 홈페이지 불러오기
@app.route('/')
def home():
    return render_template('index.html')

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

# 게시글에 댓글 작성
@app.route("/main/post", methods=["POST"])
def new_comment():
    comment_receive = request.form['comment_give']

    doc = {
        'post_comment': comment_receive
    }

    db.posts.insert_one(doc)
    return jsonify({'msg':'댓글작성완료!'})


@app.route("/main/post", methods=["GET"])
def post_comment():
    comment_list = list(db.posts.find({}, {'_id': False}))
    return jsonify({'comments':comment_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
