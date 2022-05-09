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
    };
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


// 댓글 달기
// 수정 필요 ready
<<<<<<< HEAD:static/scripts/mainscripts.js
$(window).ready(function () {
    // 500s 시간 지연
    setTimeout(function(){ show_comment(); }, 500);
    // show_comment();
=======
$(document).ready(function () {
    setTimeout(function () {
        show_comment();
    }, 500);
>>>>>>> origin/personal_branch:static/scripts/mainscript.js
});


function add_comment(post_id) {
    let comment = $(`#${post_id}`).val()
<<<<<<< HEAD:static/scripts/mainscripts.js
=======

>>>>>>> origin/personal_branch:static/scripts/mainscript.js
    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {comment_give: comment, post_give: post_id},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

// 동기 비동기 콜에 대해서 연구
// 렌더링 한 다음의 호출 방법에 대해서 연구(메소드)
function show_comment() {
<<<<<<< HEAD:static/scripts/mainscripts.js
=======

>>>>>>> origin/personal_branch:static/scripts/mainscript.js
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            // console.log(response['comments'])
            let rows = response['comments']

            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comments']
                let post_id = rows[i]['post_id']
<<<<<<< HEAD:static/scripts/mainscripts.js

                let temp_html = `
                <p style="font-weight: lighter">
                <span style="font-weight: bold">
                Car_sta
                </span>${comment}
                </p>`
                // console.log(`.${post_id}`)
                // console.log(temp_html)
=======
                // let user_id = rows[i]['user_id']
                console.log(post_id)

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">${post_id}</span> ${comment}</p>`

>>>>>>> origin/personal_branch:static/scripts/mainscript.js
                $(`.${post_id}`).append(temp_html)
            }
        }
    });
}
