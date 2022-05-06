// 간단한 회원가입 함수입니다.
// 아이디, 비밀번호, 닉네임을 받아 DB에 저장합니다.
function sign_up() {
    $.ajax({
        type: "POST",
        url: "/sign_up",
        data: {
            id_give: $('#userid').val(),
            pw_give: $('#userpw').val(),
            pwcf_give: $('#userpwcf').val(),
            nickname_give: $('#usernick').val(),
            email_give: $('#useremail').val()

        },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('회원가입이 완료되었습니다.')
                window.location.href = '/login'
            } else {
                alert(response['msg'])
            }
        }
    })
}
// 이 클래스를 로그인 화면에서 숨겨야하는 요소
// function toggle_sign_up() {
//     $("#sign-up-box").toggleClass("is-hidden")
//     $("#div-sign-in-or-up").toggleClass("is-hidden")
//     $("#btn-check-dup").toggleClass("is-hidden")
//     $("#help-id").toggleClass("is-hidden")
//     $("#help-password").toggleClass("is-hidden")
//     $("#help-password2").toggleClass("is-hidden")
// }
// 아아디 정규표현식
function is_nickname(asValue) {
    var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
    return regExp.test(asValue);
}
// 비밀번호 정규표현식
function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}
// 아이디 중복확인 클라이언트
function check_dup() {
    let userid = $("#input-username").val()
    console.log(username)
    if (userid == "") {
        $("#help-id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    if (!is_nickname(userid)) {
        $("#help-id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
        $("#input-username").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
    $.ajax({
        type: "POST",
        url: "/sign_up/check_dup",
        data: {
            username_give: userid
        },
        success: function (response) {

            if (response["exists"]) {
                $("#help-id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
                $("#input-username").focus()
            } else {
                $("#help-id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
            }
            $("#help-id").removeClass("is-loading")

        }
    });
}

