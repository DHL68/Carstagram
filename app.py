from pymongo import MongoClient
# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt
# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime
# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

client = MongoClient('localhost', 27017)
db = client.Carstagram

# JWT 토큰을 만들 때 필요한 비밀문자열입니다. 아무거나 입력해도 괜찮습니다.
# 이 문자열은 서버만 알고있기 때문에, 내 서버에서만 토큰을 인코딩(=만들기)/디코딩(=풀기) 할 수 있습니다.
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
        user_info = db.user.find_one({"id": payload['id']})
        return render_template('main.html', nickname=user_info["nick"])
    # 만약 해당 token의 로그인 시간이 만료되었다면, 아래와 같은 코드를 실행합니다.
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        # 만약 해당 token이 올바르게 디코딩되지 않는다면, 아래와 같은 코드를 실행합니다.
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/main')
def main():
    msg = request.args.get("msg")
    return render_template('main.html', msg=msg)

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)

@app.route('/login2')
def login_2():
    msg = request.args.get("msg")
    return render_template('main.html', msg=msg)

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
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    userid_receive = request.form['userid_give']
    exists = bool(db.users.find_one({"userid": userid_receive}))
    return jsonify({'result': 'success', 'exists': exists})


# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['useremail_give']
    pw_receive = request.form['password_give']

    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    # pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # id, 암호화된pw을 가지고 해당 유저를 찾습니다.
    result = db.user.find_one({'id': id_receive, 'pw': pw_receive})

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
        userinfo = db.user.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})


# 회원가입 서버
@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    userid_receive = request.form['userid_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    doc = {
        "userid": userid_receive,  # 아이디
        "pw": pw_hash,  # 비밀번호
        "profile_name": userid_receive,  # 프로필 이름 기본값은 아이디
        "profile_pic": "",  # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png",  # 프로필 사진 기본 이미지
        "profile_info": ""  # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


# 회원가입(POST) API
@app.route('/sign_up', methods=['POST'])
def user_infor():
    id_receive = request.form['id_give']
    email_receive = request.form['email_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nickname_give']
    pwcf_receive = request.form['pwcf_give']

    res = db.users.find({}, {'_id': False})

    # 최초 DB가 없을때도 실행하기 위해 추가함
    if id_receive == '' or email_receive == '' or pw_receive == '' or pwcf_receive == '' or nickname_receive == '':
        return jsonify({'ans': 'fail', 'msg': '공백이 있습니다'})
    elif '@' not in email_receive or '.' not in email_receive:
        return jsonify({'ans': 'fail', 'msg': '이메일 형식이 아닙니다.'})
    elif pwcf_receive != pw_receive:
        return jsonify({'ans': 'fail', 'msg': '비밀번호가 다릅니다'})
    elif nickname_receive != nickname_receive:
        return jsonify({'ans': 'fail', 'msg': '닉네임이 다릅니다'})


    for list in res:
        # 공백 처리, 해당 부분에서 약간의 오류를 발생시키면 html 스크립트 공백체크가 작동한다..
        if id_receive == '' or email_receive == '' or pw_receive == '' or pwcf_receive == '' or nickname_receive == '':
            return jsonify({'ans': 'fail', 'msg': '공백이 있습니다'})
        # 이메일 형식 체크 @, '.' 포함 여부 확인
        elif '@' not in email_receive or '.' not in email_receive:
            return jsonify({'ans': 'fail', 'msg': '이메일 형식이 아닙니다.'})
        # 회원가입 시 중복 ID, Email 처리
        elif list['name'] == id_receive or list['email'] == email_receive or list['nickname'] == nickname_receive:
            return jsonify({'ans': 'fail', 'msg': '아이디 또는 이름 또는 이메일 중복!'})
        # 2차 비밀번호 체크
        elif pwcf_receive != pw_receive:
            return jsonify({'ans': 'fail', 'msg': '비밀번호가 다릅니다'})

    PW = hashlib.sha256(pw_receive.encode()).hexdigest()
    PW2 = hashlib.sha256(pwcf_receive.encode()).hexdigest()
    print(PW)
    print(PW2)
    doc = {
        'id': id_receive,
        'email': email_receive,
        'pw': PW,
        'pwcf': PW2,
        'nickname': nickname_receive
    }
    db.users.insert_one(doc)

    return jsonify({'ans': 'success', 'msg': '가입완료'})





# 로그인서버
@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    userid_receive = request.form['userid_give']
    pw_receive = request.form['pw_give']

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': userid_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': userid_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
