// 모달 열기
const modal = document.getElementById("modal-option");
const buttonOpenModal = document.getElementById("open-modal");
buttonOpenModal.addEventListener("click", e => {
    modal.style.top = window.pageYOffset + 'px'; // 모달띄울시, 스크롤이 내려가면 창이 뜨는 위치 수정
    modal.style.display = "flex";  // 모달 나타나게하기
    document.body.style.overflowY = "hidden"; // 모달 띄웠을때 스크롤안되게하기

});
// 모달 취소 눌러 닫기
const buttonCloseModal = document.getElementById("close-modal");
buttonCloseModal.addEventListener("click", e => {
    modal.style.display = "none";
    document.body.style.overflowY = "visible";
});
// 모달 아닌곳 눌러 닫기
modal.addEventListener("click", e => {
    const evTarget = e.target
    if (evTarget.classList.contains("modal-overlay")) {
        modal.style.display = "none";
        document.body.style.overflowY = "visible";
    }
});


// // function add_comment() {
// //     let comment = $('#exampleFormControlInput1').val()
// //     let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Kang_Jun</span>${comment}</p>`
// //     $('#comment-q1').append(temp_html)
// }

function q2() {
    let post = $('#feed_box')
    $('#feed').append(post)
}

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
        url: '/main/post',
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
        url: "/main/post",
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['post_comment']

                let temp_html = `<p style="font-weight: lighter"><span style="font-weight: bold">Kang_Jun</span> ${comment}</p>`

                $('#comment-q1').append(temp_html)
            }
        }
    });
}