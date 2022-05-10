// 모달
$(document).on('click', function () {
// 모달 띄우기
    $(".btn-open-popup").click(function () {
        $(".modal-overlay").fadeIn();
        $('body').css("overflow", "hidden");
    });
// 모달 닫기
    $(".close-area").click(function () {
        $(".modal-overlay").fadeOut();
        $('body').css("overflowY", "scroll");
    });
});
$(document).on('click', function (e) {
    if ($(".modal-overlay").is(e.target)) {
        $(".modal-overlay").fadeOut();
        $('body').css("overflowY", "scroll");
    }
    ;
});

// 팔로우 버튼 클릭시 팔로잉 변경
$(document).on('click', function () {
    $('.follow-btn').click(function () {
        if ($(this).html() == '팔로우') {
            $(this).html('팔로잉');


        } else {
            $(this).html('팔로우');
        }
    });
});

function follow() {

    let userfollowing = $("#userfollowing").val()
    let userfollower = $("#userfollower").val()

    $.ajax({
        type: "POST",
        url: "/follow",
        data: {
            following_give: userfollowing,
            follower_give: userfollower
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
// 팔로우기능
//   function follow(eim,n) {
//       $.ajax({
//         url: "{% url 'instagram:follow' 1 %}". replace('1',n),
//         data : {'csrfmiddlewaretoken': '{{ csrf_token }}', 'current_url': window.location.href },
//         dataType: "json",
//         type: "POST",
//         success: function(response) {
//           if (response.is_follow == 0) {
//             $(eim).attr("class", "btn btn-light");
//             $(eim).attr("onclick", "follow(this, '" + n + "')");
//             $(eim).text("팔로잉");
//             if (eim.id == "follow_btn_list"){
//               $("#followerCounter").text(response.followerCount);
//             }
//             else if (eim.id == "follow_btn"){
//               if (response.list_page_user == response.user){
//                 $("#followingCounter").text(response.followingCount);
//               }
//             }
//           }
//           else if (response.is_follow == 1) {
//             $(eim).attr("class", "btn btn-primary");
//             $(eim).attr("onclick", "follow(this, '" + n + "')");
//             $(eim).text("팔로우");
//             if (eim.id == "follow_btn_list"){
//               $("#followerCounter").text(response.followerCount);
//             }
//             else if (eim.id == "follow_btn"){
//               if (response.list_page_user == response.user){
//                 $("#followingCounter").text(response.followingCount);
//               }
//             }
//           }
//         },
//         error: function(xhr) {
//           alert("팔로우를 하는 과정에서 에러가 발생하였습니다.");
//         }
//       });
//     }


// 댓글 달기
// 수정 필요 ready
$(document).ready(function () {
    setTimeout(function () {
        show_comment();
    }, 500);
});


function add_comment(post_id) {
    let comment = $(`#${post_id}`).val()
    console.log(comment)
    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {comment_give: comment, post_give: post_id},
        success: function (response) {
            alert(response['msg'])
            // console.log(post_id)
            window.location.reload()
        }
    })
}

// 로그아웃 함수
// 로그아웃은 내가 가지고 있는 토큰만 쿠키에서 없애면 됩니다.
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

function show_comment() {

    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comments']
                let post_id = rows[i]['post_id']
                let usernick = rows[i]['usernick']
                // console.log(post_id)

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">${usernick}</span> ${comment}</p>`

                $(`.${post_id}`).append(temp_html)
            }
        }
    });
}

// 로그인한 유저정보 불러오기
$(document).ready(function () {
    my_info()
})

function my_info() {
    $.ajax({
        type: "GET",
        url: "/info",
        data: {},
        success: function (response) {
            let row = response['users']
            let usernick = row['nick']
            let username = row['name']

            // console.log(usernick, username)

            let temp_html = `
                            <div class="left-profile">
                                <a href="/user/<email>"><img class="profile"
                                                             src="http://kaihuastudio.com/common/img/default_profile.png"></a>
                            </div>
                            <div style="color: white; margin-left: 10px; font-weight: bold; font-size: 12px; margin-top: 10px;">
                                ${usernick}<br>
                                <p style="font-size: 13px; color: #dbdbdb; font-weight: lighter;">${username}</p>
                            </div>
                            <div style="margin-left: 44.1%; font-size: 12px;">
                                <button style="background: none; border: none; color: cornflowerblue">전환</button>
                            </div>`

            $('#user-info').append(temp_html)
        }
    });
};