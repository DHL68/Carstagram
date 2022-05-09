
from pymongo import MongoClient
# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt
# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime
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

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


#post 댓글작성

@app.route("/comment", methods=["POST"])
def new_comment():
    comment_receive = request.form['comment_give']
    post_receive = request.form['post_give']
    # id_receive = request.form['id_give']

    doc = {
        'comments': comment_receive,
        'post_id': post_receive
        # 'user_id' : id_receive
    }
    db.comments.insert_one(doc)

    return jsonify({'msg': '댓글작성완료!'})

#get 댓글 불러오기

@app.route("/comment", methods=["GET"])
def comment():
    comment_list = list(db.comments.find({}, {'_id': False}))

    return jsonify({'comments': comment_list})


#
# post 리스팅 메서드
#
@app.route('/listing', methods=['GET'])
def post_listing():
    posts = dumps(list(db.posts.find({})))

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
    db.posts.insert_one(doc)

    return jsonify({'msg': '업로드 완료!'})



SECRET_KEY = 'SPARTA'


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
        user_info = db.users.find_one({"id": payload['id']})
        print(user_info)
        return render_template('main.html', nickname=user_info["nick"])
    # 만약 해당 token의 로그인 시간이 만료되었다면, 아래와 같은 코드를 실행합니다.
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        # 만약 해당 token이 올바르게 디코딩되지 않는다면, 아래와 같은 코드를 실행합니다.
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

# 메인페이지 불러오기
@app.route('/main')
def main():
    return render_template('main.html')

# 개인페이지 불러오기

@app.route('/user')
def user():
    return render_template('self.html')

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
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']
    email_receive = request.form['email_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {'id': id_receive, 'pw': pw_hash, 'nick': nickname_receive, 'email': email_receive}

    db.users.insert_one(doc)

    return jsonify({'result': 'success'})


# 아이디 중복확인 서버
# @app.route('/sign_up/check_dup', methods=['POST'])
# def check_dup():
#     username_receive = request.form['username_give']
#     exists = bool(db.users.find_one({"username": username_receive}))
#     return jsonify({'result': 'success', 'exists': exists})


# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['useremail_give']
    pw_receive = request.form['password_give']
    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    # id, 암호화된pw을 가지고 해당 유저를 찾습니다.
    result = db.users.find_one({'id': id_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급합니다.
    if result is not None:
        # JWT 토큰에는, payload와 시크릿키가 필요합니다.
        # 시크릿키가 있어야 토큰을 디코딩(=암호화 풀기)해서 payload 값을 볼 수 있습니다.
        # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
        # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # token을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# [유저 정보 확인 API]
# 로그인된 유저만 call 할 수 있는 API입니다.
# 유효한 토큰을 줘야 올바른 결과를 얻어갈 수 있습니다.
# (그렇지 않으면 남의 장바구니라든가, 정보를 누구나 볼 수 있겠죠?)
@app.route('/api/nick', methods=['GET'])
def api_valid():
    token_receive = request.cookies.get('mytoken')

    # try / catch 문?
    # try 아래를 실행했다가, 에러가 있으면 except 구분으로 가란 얘기입니다.

    try:
        # token을 시크릿키로 디코딩합니다.
        # 보실 수 있도록 payload를 print 해두었습니다. 우리가 로그인 시 넣은 그 payload와 같은 것이 나옵니다.
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        print(payload)

        # payload 안에 id가 들어있습니다. 이 id로 유저정보를 찾습니다.
        # 여기에선 그 예로 닉네임을 보내주겠습니다.
        userinfo = db.users.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})

# 회원가입 서버
@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    useremail_receive = request.form['useremail_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "useremail": useremail_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "profile_name": useremail_receive,  # 프로필 이름 기본값은 아이디
        "profile_pic": "",  # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png",  # 프로필 사진 기본 이미지
        "profile_info": ""  # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

<<<<<<< HEAD
=======

# # 로그인서버
# @app.route('/sign_in', methods=['POST'])
# def sign_in():
#     # 로그인
#
#     useremail_receive = request.form['useremail_give']
#     password_receive = request.form['password_give']
#     print(useremail_receive)
#
#     pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
#     result = db.users.find_one({'useremail': useremail_receive, 'password': pw_hash})
#     # result = db.user.find({})
#
#     if result is not None:
#         payload = {
#             'id': useremail_receive,
#             'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
#         }
#         token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
#
#         return jsonify({'result': 'success', 'token': token})
#     # 찾지 못하면
#     else:
#         return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


>>>>>>> origin/sign_branch
if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
