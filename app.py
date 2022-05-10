from pymongo import MongoClient
# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt
# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
from _datetime import datetime, timedelta
# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from bson.json_util import dumps

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

client = MongoClient('localhost', 27017)
db = client.Carstagram
SECRET_KEY = 'SPARTA'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


#################################
##  HTML을 주는 부분             ##
#################################


@app.route('/')
def home():
    # 현재 이용자의 컴퓨터에 저장된 cookie 에서 mytoken 을 가져옵니다.
    token_receive = request.cookies.get('mytoken')

    try:
        # 암호화되어있는 token의 값을 우리가 사용할 수 있도록 디코딩(암호화 풀기)해줍니다!
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['email']})


        return render_template('main.html', email=user_info["email"])

    # 만약 해당 token의 로그인 시간이 만료되었다면, 아래와 같은 코드를 실행합니다.
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        # 만약 해당 token이 올바르게 디코딩되지 않는다면, 아래와 같은 코드를 실행합니다.
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


# 메인페이지 불러오기
@app.route('/main')
def main():
    return render_template('main.html')


@app.route('/user/<email>')
def user_page(email):
    # 각 사용자의 프로필과 글을 모아볼 수 있는 공간
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        status = (email == payload["email"])  # 내 프로필이면 True, 다른 사람 프로필 페이지면 False

        user_info = db.users.find_one({"email": email}, {"_id": False})

        return render_template('self.html', user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))



@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


@app.route('/sign_up')
def sign_up_page():
    # if request.method == 'POST':
    #     return redirect(url_for('test'))
    return render_template('sign_up.html')


#################################
##  로그인을 위한 API            ##
#################################

# [회원가입 API]
# id, pw, nickname을 받아서, mongoDB에 저장합니다.
# 저장하기 전에, pw를 sha256 방법(=단방향 암호화. 풀어볼 수 없음)으로 암호화해서 저장합니다.
@app.route('/sign_up', methods=['POST'])
def register():
    name_receive = request.form['name_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']
    email_receive = request.form['email_give']
    num_receive = request.form['num_give']


    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {
        'name': name_receive,
        'pw': pw_hash,
        'nick': nickname_receive,
        'email': email_receive,
        "num" : num_receive
    }

    db.users.insert_one(doc)

    return jsonify({'result': 'success'})


@app.route('/check_email', methods=['POST'])
def check_dub1():
    email_receive = request.form['email_give']
    exist = bool(db.users.find_one({"email": email_receive}))

    return jsonify({'result': 'success', 'exist': exist})


@app.route('/check_nick', methods=['POST'])
def check_dub2():
    nickname_receive = request.form['nickname_give']
    exists = bool(db.users.find_one({"nick": nickname_receive}))

    return jsonify({'result': 'success', 'exists': exists})


# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/api/login', methods=['POST'])
def api_login():
    email_receive = request.form['useremail_give']
    pw_receive = request.form['password_give']
    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    # id, 암호화된pw을 가지고 해당 유저를 찾습니다.

    result = db.users.find_one({'email': email_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급합니다.

    if result is not None:
        # JWT 토큰에는, payload와 시크릿키가 필요합니다.
        # 시크릿키가 있어야 토큰을 디코딩(=암호화 풀기)해서 payload 값을 볼 수 있습니다.
        # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
        # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
        payload = {
            'email': email_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # token을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# 유저 정보 불러오기 메인,개인페이지

@app.route("/info", methods=["GET"])
def user_info():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['email']}, {'_id': False})

        # print(user_info)

        return jsonify({'users': user_info})
    except jwt.exceptions.DecodeError:
        return jsonify({'msg': '회원 정보가 존재하지 않습니다.'})



@app.route('/recommend', methods=['GET'])
def recommend_user():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"email": payload['email']}, {'_id': False})


        user_list = list(db.users.find({}, {'_id': False}).limit(5).sort("num", -1))
        print(user_list)


        return jsonify({'users': user_list, 'user': user_info})
    except jwt.exceptions.DecodeError:
        return jsonify({'msg': '회원 정보가 존재하지 않습니다.'})



#
# post 업로드 메서드
#
@app.route('/posting', methods=['POST'])
def post_posting():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.users.find_one({"email": payload["email"]})
        hashtag_receive = request.form["hashtag_give"]
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]

        post_picture = request.files["picture_give"]

        # 새로운 날짜 이름 만들기
        today = datetime.now()
        mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

        filename = f'post_pic-{mytime}'

        # 확장자 뺴기
        extension = post_picture.filename.split('.')[-1]

        # 새로운 이름으로 저장하기
        save_to = f'static/image/{filename}.{extension}'
        post_picture.save(save_to)

        doc = {
            "usernick": user_info["nick"],
            "post_hashtag": hashtag_receive,
            "post_comment": comment_receive,
            "post_picture": f'{filename}.{extension}',
            "date": date_receive
        }
        db.posts.insert_one(doc)

        return jsonify({'msg': '업로드 완료!'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


#
# post 리스팅 메서드
#
@app.route('/listing', methods=['GET'])
def post_listing():
    posts = dumps(list(db.posts.find({})))

    return jsonify({'posts': posts})


#
# post 리스팅 메서드
#
@app.route('/listing', methods=['GET'])
def post_listin():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 포스팅 목록 받아오기

        # 서버에서는 DB에서 최근 20개의 포스트를 받아와 리스트로 넘겨줍니다.
        # 나중에 좋아요 기능을 쓸 때 각 포스트를 구분하기 위해서 MongoDB가 자동으로 만들어주는 _id 값을 이용할 것인데요,
        # ObjectID라는 자료형이라 문자열로 변환해주어야합니다.
        my_usereamil = payload["email"]
        usernick_receive = request.args.get("nickname_give")
        # 값이 들어가있으면..
        if usernick_receive == "":
            posts = dumps(list(db.posts.find({}).sort("date", -1).limit(20)))
        else:
            posts = list(db.posts.find({"usernick": usernick_receive}).sort("date", -1).limit(20))

        # 우선 서버에서 포스트 목록을 보내줄 때 그 포스트에 달린 하트가 몇 개인지, 내가 단 하트도 있는지 같이 세어 보내줍니다.
        for post in posts:
            post["_id"] = str(post["_id"])

            post["count_heart"] = db.likes.count_documents({"post_id": post["_id"], "type": "heart"})
            post["heart_by_me"] = bool(
                db.likes.find_one({"post_id": post["_id"], "type": "heart", "email": my_usereamil}))

        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "posts": posts})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# post 댓글작성

@app.route("/comment", methods=["POST"])
def new_comment():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.users.find_one({"email": payload['email']})
        comment_receive = request.form['comment_give']
        post_receive = request.form['post_give']

        doc = {
            "usernick": user_info["nick"],
            'comments': comment_receive,
            'post_id': post_receive
        }
        db.comments.insert_one(doc)

        return jsonify({'msg': '댓글작성완료!'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


# get 댓글 불러오기

@app.route("/comment", methods=["GET"])
def comment():
    comment_list = list(db.comments.find({}, {'_id': False}))

    return jsonify({'comments': comment_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
