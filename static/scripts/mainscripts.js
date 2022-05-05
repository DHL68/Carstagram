// 모달
$(function(){
// 모달 띄우기
  $(".btn-open-popup").click(function(){
    $(".modal-overlay").fadeIn();
    $('body').css("overflow", "hidden");
  });
// 모달 닫기
  $(".close-area").click(function(){
    $(".modal-overlay").fadeOut();
    $('body').css("overflow", "scroll");
  });
});

// function q2() {
//     let post = $('#feed_box')
//     $('#feed').append(post)
// }

// 댓글 달기, 게시글 추가하기
$(document).ready(function () {
    show_comment()
});


function save_post() {
    let posting_picture = $('#posting_picture').val()
    let posting_comment = $('#posting_comment').val()

    $.ajax({
        type: 'POST',
        url: '/main',
        data: {posting_picture_give: posting_picture, posting_comment_give: posting_comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

function add_comment() {
    let comment = $('#exampleFormControlInput1').val()

    $.ajax({
        type: 'POST',
        url: '/main/comment',
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
        url: "/main/comment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Kang_Jun</span> ${comment}</p>`

                $('#comment-q1').append(temp_html)
            }
        }
    });
}

function show_self_comment() {
    $.ajax({
        type: "GET",
        url: "/api/comment",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Kang_Jun</span> ${comment}</p>`

                $('#comment-q1').append(temp_html)
            }
        }
    });
}