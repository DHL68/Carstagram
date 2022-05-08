
// 게시글 상세 속 모달
$(document).on('click', function () {
// 모달 띄우기
    $(".btn-open-popup").click(function () {
        $(".modal-overlay1").fadeIn();
        $('body').css("overflow", "hidden");
    });
// 모달 닫기
    $(".close-area").click(function () {
        $(".modal-overlay1").fadeOut();
    });
});


// 댓글 달기
// 수정 필요 ready
$(document).ready(function () {
    setTimeout(function () {
        show_comment();
    }, 500);
});


function add_comment1(post_id) {
    let comment = $(`#${post_id}`).val()

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
                // let user_id = rows[i]['user_id']
                console.log(post_id)

                let temp_html = `
                            <div class = "${post_id}"style="display: flex; flex-direction: row;">
                                <a href=""><img class="box-profile"
                                                src="https://blog.kakaocdn.net/dn/b0ZMMh/btq4eKTyBG4/aVgQqfsq543UByfJSaK0cK/img.jpg"></a>
                                <p style="margin-left: 10px;">${post_id}</p>
                                <p style="font-weight: lighter; margin-left: 10px;">${comment}</p>
                            </div>`

                $(`.${post_id}`).append(temp_html)
            }
        }
    });
}