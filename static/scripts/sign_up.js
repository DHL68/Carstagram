// 간단한 회원가입 함수입니다.
// 아이디, 비밀번호, 닉네임을 받아 DB에 저장합니다.
function sign_up() {

    let useremail = $("#useremail").val()
    let username = $("#username").val()
    let usernick = $("#usernick").val()
    let userpw = $("#userpw").val()

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
<<<<<<< HEAD
            name_give: $('#username').val(),
            pw_give: $('#userpw').val(),
            nickname_give: $('#usernick').val(),
            email_give: $('#useremail').val()

=======
            name_give: username,
            pw_give: userpw,
            nickname_give: usernick,
            email_give: useremail
>>>>>>> personal_branch
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

<<<<<<< HEAD
// function remove_dup() {
//     if ($("#help-email-exist").text == "중복된 닉네임입니다.") {
//         // $("#help-email-exist").remove();
//     };
// };

<<<<<<< HEAD

// 아이디 중복확인 클라이언트
function check_dup() {
    console.log("check_dup")
    let useremail = $("#input-useremail").val()
    console.log(useremail)
    if (useremail == "") {
        $("#useremail").text("아이디를 입력해주세요.")
        return;
    }
    if (!is_nickname(useremail)) {
        $("#useremail").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이")
        $("#input-useremail").focus()
        return;
    }
    $("#help-id").addClass("is-loading")
=======
=======
>>>>>>> origin/personal_branch
// 아이디 중복확인 클라이언트
function check_email() {

    let useremail = $("#useremail").val()

>>>>>>> personal_branch
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
<<<<<<< HEAD
// 회원가입 클라이언트
function sign_up() {
    let useremail = $("#useremail").val()
    let password = $("#password").val()
    let password2 = $("#password2").val()
    console.log(useremail, password, password2)


   if (useremail == "") {
        $("#useremail").text("아이디를 입력해주세요.")
        return;
    }
     if (!is_nickname(useremail)) {
        $("#useremail").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이")
        $("#input-useremail").focus()
        return;
    }
    if (password == "") {
        $("#password").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        return;
    } else if (!is_password(password)) {
        $("#password").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자")
        return;
    } else {
        $("#help-password").text("사용할 수 있는 비밀번호입니다.").removeClass("is-danger").addClass("is-success")
    }
    if (password2 == "") {
        $("#help-password2").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else if (password2 != password) {
        $("#help-password2").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
        $("#input-password2").focus()
        return;
    } else {
        $("#help-password2").text("비밀번호가 일치합니다.").removeClass("is-danger").addClass("is-success")
    }
    $.ajax({
        type: "POST",
        url: "/sign_up",
        data: {
           name_give: $('#username').val(),
            pw_give: $('#userpw').val(),
            nickname_give: $('#usernick').val(),
            email_give: $('#useremail').val()
        },
        success: function (response) {
            alert("회원가입을 축하드립니다!")
            window.location.replace("/login")
        }
    });

}
=======

<<<<<<< HEAD
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
>>>>>>> personal_branch
=======
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
// $("#help-email-exist").text("중복된 이메일입니다.");
//                 $("#useremail").focus()
// $("#help-nick-exist").text("중복된 닉네임입니다.")
//                 $("#usernick").focus()


>>>>>>> origin/personal_branch
