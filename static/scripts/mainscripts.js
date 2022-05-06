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
$(document).on("click","comment-1",function () {
    show_comment()
});

function add_comment() {
    let comment = $('#exampleFormControlInput1').val()

    $.ajax({
        type: 'POST',
        url: '/comment',
        data: {comment_give: comment},
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

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Car_sta</span> ${comment}</p>`

                $('#comment-q1').append(temp_html)
            }
        }
    });
}
