// 게시글 업로드 모달

// 모달 띄우기
$("#open-post-modal").on('click', function () {
    $(".modal-overlay2").fadeIn();
    $('body').css("overflow", "hidden");
});


$(document).on('click', function (e) {
    if ($(".modal-overlay2").is(e.target)) {
        $(".modal-overlay2").fadeOut();
        $('body').css("overflowY", "scroll");
    }
    ;
});


// 게시글 상세 모달 띄우기
$(document).on('click', function () {
    $(".open-modal").click(function () {
        $(".comment-modal").fadeIn();
        $('body').css("overflow", "hidden");
    });
});

function openModal(i) {
    $(`.open-modal-${i}`).click(function () {
        $(`.modal-overlay-${i}`).fadeIn();
        $('body').css("overflow", "hidden");
    });
};

//모달 닫기
$(document).on('click', function (e) {
    if ($(".comment-modal").is(e.target)) {
        $(".comment-modal").fadeOut();
        $('body').css("overflowY", "scroll");
    }
    ;
});


$(document).ready(function () {
    // 페이지 로드 시 post_listing 에 대한 값을 불러온다
    // bsCustomFileInput.init()
    post_listing()
    alert('안녕')
})


/* GET 요청 ajax 코드 */
function post_listing() {
    $.ajax({
        type: "GET", url: "/listing", data: {}, success: function (response) {
            let posts = JSON.parse(response['posts'])

            for (let i = 0; i < posts.length; i++) {
                let post_picture = posts[i]['post_pictures']
                let post_comment = posts[i]['post_comments']
                let post_pic = posts[i]['post_pic']
                let post_id = posts[i]['_id']['$oid']


                let temp_html = `<button class="open-modal-${i}" onclick="openModal(${i})" style=" border: none; background: none;">
                                 <img class="profilepage-image" src="../static/${post_pic}">
                                 </button>`
                let temp2_html = `
                            <div class="modal-overlay-${i} comment-modal" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 1;background-color: rgba(0, 0, 0, 0.4);">
                                <div id="modal-script" class="modal_body" style="">
                                    <div style="display: flex; flex-direction: row;">
                                        <img class="modal-image" src="../static/${post_pic}">
                                        <div>
                                            <!--                댓글창 상단 내 프로필-->
                                            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 450px; height: 55px;border-bottom: 1px solid #edebeb">
                                                <div style="display: flex; flex-direction: row;">
                                                    <a href=""><img class="box-profile"
                                                                    src="http://kaihuastudio.com/common/img/default_profile.png"></a>
                                                    <p style="margin-left: 10px;">user_id</p>
                                                </div>
                                                <div>
                                                    <button id="" class="btn-open-popup"
                                                            style="border: none; background-color: white; margin-top: 5px;">
                                                        <span class="material-icons-outlined" style="margin-right: 15px;">more_horiz</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <!--                댓글창 상단 아래 피드설명란-->
                            
                                            <!--                댓글들-->
                                            <div class="comment-area ${post_id}" style="display: flex; flex-direction: column;">
                                                <div style="display: flex; flex-direction: row;">
                                                    <a href=""><img class="box-profile"
                                                                    src="http://kaihuastudio.com/common/img/default_profile.png"></a>
                                                    <p style="margin-left: 10px;">user_id</p>
                                                    <p style="margin-left: 5px; text-align: left"><span style="font-weight: lighter; color: dodgerblue;">${post_picture}</span><br>
                                                    ${post_comment}
                                                    </p>
                                                </div>
                                            </div>
                                            <!--                하단 댓글창-->
                                            <div>
                                                <div style="display: flex; flex-direction: row; justify-content: space-between; border-top: 1px solid #edebeb; height: 30px;">
                                                    <div style="margin-left: 10px;">
                                                        <span class="material-icons-outlined">favorite_border</span>
                                                        <span class="material-icons-outlined">mode_comment</span>
                                                        <span class="material-icons-outlined">send</span>
                                                    </div>
                                                    <div style="margin-right: 10px;">
                                                        <span class="material-icons-outlined">bookmark_border</span>
                                                    </div>
                                                </div>
                                                <div style="text-align: left; margin-left: 10px; height: 30px;"><span style="font-weight: bold">kyumin1020</span>님
                                                    <span style="font-weight: bold">외 62,364명</span>이 좋아합니다
                                                </div>
                                                <div style="font-weight: lighter; font-size: 10px; text-align: left; margin-left: 10px;">1일전</div>
                                                <!--댓글달기-->
                                                <div style="display:flex; flex-direction: row; align-items: center; height: 45px; margin-top: 10px; border-top: solid 1px #dbdbdb;">
                                                    <span style="margin-left: 8px; margin-top: 7px;" class="material-symbols-outlined">mood</span>
                                                    <input type="text" class="form-control"
                                                           style="box-shadow: none; border: none; border-radius: 0px;  height: 45px; margin-top: 1px;" id="${post_id}"
                                                           placeholder="댓글 달기 ..."/>
                                                    <button id="comment-1" onclick="add_comment1('${post_id}')"
                                                            style="background-color: white; border: none; width: 50px;  height: 39px; margin-right: 8px; text-decoration: none; color: cornflowerblue; font-weight: bold;">
                                                        <p>게시</p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                $('.my-posts').append(temp_html)
                $('.modal-post').append(temp2_html)
            }
        }
    })
}


/* POST 요청 ajax 코드 */
function post_posting() {
    // 고유 id let 함수로 정의
    let picture = $('#post_picture').val()
    let comment = $('#post_comment').val()
    let pic = $('#customFile')[0].files[0]
    let form_data = new FormData()

    form_data.append("picture_give", picture)
    form_data.append("pic_give", pic)
    form_data.append("comment_give", comment)

    $.ajax({
        type: "POST",
        url: "/posting",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}