
// 간단한 회원가입 함수입니다.
// 아이디, 비밀번호, 닉네임을 받아 DB에 저장합니다.
function sign_up() {
    let useremail = $("#useremail").val()
    let username = $("#username").val()
    let usernick = $("#usernick").val()
    let userpw = $("#userpw").val()
    let today = new Date().toISOString()

    if (useremail == "") {
        alert("이메일을 입력해주세요.")
        return;
    } else if (username == "") {
        alert("이름을 입력해주세요.")
        return;
    } else if (usernick == "") {
        alert("닉네임을 입력해주세요.")
        return;
    } else if (userpw == "") {
        alert("비밀번호를 입력해주세요.")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/sign_up",
        data: {

            name_give: username,
            pw_give: userpw,
            nickname_give: usernick,
<<<<<<< HEAD
            email_give: useremail

=======
            email_give: useremail,
            date_give: today
>>>>>>> 679f43b05133379727eb92b84aa22025002a2471
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




// 아이디 중복확인 클라이언트
function check_email() {

    let useremail = $("#useremail").val()


    $.ajax({
        type: "POST",
        url: "/check_email",
        data: {
            email_give: useremail
        },
        success: function (response) {
        console.log(response)
            if (response["exist"]) {
                alert("중복된 이메일입니다.")
            } else if (useremail == "") {
                alert("이메일을 입력해주세요.")
            } else {
                alert("사용가능한 정보입니다.")
            }
        }
    });
}

// // 회원가입 클라이언트
//     function sign_up_save() {
//         let useremail = $("#input-useremail").val()
//         let password = $("#input-password").val()
//         let password2 = $("#input-password2").val()
//         console.log(useremail, password, password2)
//
//
//         if ($("#help-id").hasClass("is-danger")) {
//             alert("아이디를 다시 확인해주세요.")
//             return;
//         } else if (!$("#help-id").hasClass("is-success")) {
//             alert("아이디 중복확인을 해주세요.")
//             return;
//         }
//
//         if (password == "") {
//             $("#help-password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
//             $("#input-password").focus()
//             return;
//         } else if (!is_password(password)) {
//             $("#help-password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
//             $("#input-password").focus()
//             return
//         } else {
//             $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
//         }
//         if (password2 == "") {
//             $("#help-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
//             $("#input-password2").focus()
//             return;
//         } else if (password2 != password) {
//             $("#help-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
//             $("#input-password2").focus()
//             return;
//         } else {
//             $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
//         }
//         $.ajax({
//             type: "POST",
//             url: "/sign_up/save",
//             data: {
//                 useremail_give: useremail,
//                 password_give: password
//             },
//
//         });
//
//     }

function check_nick() {

    let usernick = $("#usernick").val()

    $.ajax({
        type: "POST",
        url: "/check_nick",
        data: {
            nickname_give: usernick
        },
        success: function (response) {

            if (response["exists"]) {
                alert("중복된 닉네임입니다.")
            } else if (usernick == "") {
                alert("닉네임을 입력해주세요.")
            } else {
                alert("사용가능한 정보입니다.")
            }
        }
    });
}



