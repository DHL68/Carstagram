// 모달
$(document).on('click',function () {
// 모달 띄우기
    $(".btn-open-popup").click(function () {
        $(".modal-overlay").fadeIn();
        $('body').css("overflow", "hidden");
    });
// 모달 닫기
    $(".close-area").click(function () {
        $(".modal-overlay").fadeOut();
        $('body').css("overflow", "scroll");
    });
});

// 팔로우 버튼 클릭시 팔로잉 변경
$(document).on('click',function () {
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
$(document).on('click',function () {
    show_comment()
});

function add_comment(post_id) {
    let comment = $('#exampleFormControlInput1').val()

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
    $('.${post_id}').empty();
    $.ajax({
        type: "GET",
        url: "/comment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comments']


                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Car_sta</span> ${comment}</p>`

                $('.${post_id}').append(temp_html)
            }
        }
    });
}
