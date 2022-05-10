// $(document).ready(function () {
//     // 페이지 로드 시 post_listing 에 대한 값을 불러온다
//     // bsCustomFileInput.init()
//     post_listing("{{ user_email.email }}")
// })

/* POST 요청 ajax 코드 */
function post_posting() {
    // 고유 id let 함수로 정의
    let hashtag = $('#post_hashtag').val()
    let comment = $('#post_comment').val()
    let today = new Date().toISOString()

    let picture = $('#customFile')[0].files[0]
    let form_data = new FormData()

    form_data.append("hashtag_give", hashtag)
    form_data.append("picture_give", picture)
    form_data.append("comment_give", comment)
    form_data.append("date_give", today)

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

/* GET 요청 ajax 코드 */
function post_listing(email) {
    // if (email == undefined) {
    //     email = ""
    // }

    console.log(email)

    // $("#my-posts").empty()
    $.ajax({
        type: "GET",
        url: `/listing?email_give=${email}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response['posts']

                console.log(posts)

                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let post_hashtag = posts[i]['post_hashtag']
                    let post_comment = posts[i]['post_comment']
                    let post_picture = posts[i]['post_picture']
                    let post_id = posts[i]['_id']['$oid']
                    let post_nick = posts[i]['usernick']


                    let temp_html = `<button class="open-modal-${i}" onclick="openModal(${i})" style=" border: none; background: none;">
                                 <img class="profilepage-image" src="../static/image/${post_picture}">
                                 </button>`
                    let temp2_html = `
                            <div class="modal-overlay-${i} comment-modal" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 1;background-color: rgba(0, 0, 0, 0.4);">
                                <div id="modal-script" class="modal_body" style="">
                                    <div style="display: flex; flex-direction: row;">
                                        <img class="modal-image" src="../static/image/${post_picture}">
                                        <div>
                                            <!--                댓글창 상단 내 프로필-->
                                            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 450px; height: 55px;border-bottom: 1px solid #edebeb">
                                                <div style="display: flex; flex-direction: row;">
                                                    <a href=""><img class="box-profile"
                                                                    src="http://kaihuastudio.com/common/img/default_profile.png"></a>
                                                    <p style="margin-left: 10px;">${post_nick}</p>
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
                                                    <p style="margin-left: 10px;">${post_nick}</p>
                                                    <p style="margin-left: 5px; text-align: left"><span style="font-weight: lighter; color: dodgerblue;">${post_hashtag}</span><br>
                                                    ${post_comment}
                                                    </p>
                                                </div>
                                            </div>
                                            <!--                하단 댓글창-->
                                            <div>
                                                <div style="display: flex; flex-direction: row; justify-content: space-between; border-top: 1px solid #edebeb; height: 30px;">
                                                        <div style="margin-left: 10px;">
                                                            <button class="like-btn" onclick="toggle_like('${post['_id']}', 'heart')"><span class="material-icons-outlined fa ${class_heart}">favorite_border</span></button>
                                                            <span class="material-icons-outlined">mode_comment</span>
                                                            <span class="material-icons-outlined">send</span>
                                                        </div>
                                                    <div style="margin-right: 10px;">
                                                        <span class="material-icons-outlined">bookmark_border</span>
                                                    </div>
                                                </div>
                                                <div style="text-align: left; margin-left: 10px; height: 30px;"><span style="font-weight: bold">좋아요</span>
                                                    <!--                좋아요-->
                                                <div class="like_reset">좋아요 ${num2str(post["count_heart"])}개</div>
                                                </div>
                                                <div style="font-weight: lighter; font-size: 10px; text-align: left; margin-left: 10px;">${time_before}</div>
                                                <!--댓글달기-->
                                                <div style="display:flex; flex-direction: row; align-items: center; height: 45px; margin-top: 10px; border-top: solid 1px #dbdbdb;">
                                                    <span style="margin-left: 8px; margin-top: 7px;" class="material-symbols-outlined">mood</span>
                                                    <input type="text" class="form-control"
                                                           style="box-shadow: none; border: none; border-radius: 0px;  height: 45px; margin-top: 1px;" id="${post['_id']}"
                                                           placeholder="댓글 달기 ..."/>
                                                    <button id="comment-1" onclick="add_comment1('${post['_id']}')"
                                                            style="background-color: white; border: none; width: 50px;  height: 39px; margin-right: 8px; text-decoration: none; color: cornflowerblue; font-weight: bold;">
                                                        <p>게시</p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    $("#my-posts").append(temp_html)
                    $('.modal-post').append(temp2_html)
                }
            }
        }
    })
}

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


<<<<<<< HEAD
$(document).ready(function () {
    // 페이지 로드 시 post_listing 에 대한 값을 불러온다
    // bsCustomFileInput.init()
    post_listing()
})

// 포스트시간 나타내기
function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

=======
// 포스트시간 나타내기
function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

>>>>>>> origin/personal_branch_DH_2
    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
<<<<<<< HEAD
}

/* POST 요청 ajax 코드 */
function post_posting() {
    // 고유 id let 함수로 정의
    let hashtag = $('#post_hashtag').val()
    let comment = $('#post_comment').val()
    let today = new Date().toISOString()

    let picture = $('#customFile')[0].files[0]
    let form_data = new FormData()

    form_data.append("hashtag_give", hashtag)
    form_data.append("picture_give", picture)
    form_data.append("comment_give", comment)
    form_data.append("date_give", today)

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

/* GET 요청 ajax 코드 */
function post_listing() {
    $.ajax({
        type: "GET",
        url: "/listing",
        data: {},
        success: function (response) {
            let posts = JSON.parse(response['posts'])

            for (let i = 0; i < posts.length; i++) {
                let post = posts[i]
                let time_post = new Date(post["date"])
                let time_before = time2str(time_post)
                let post_hashtag = posts[i]['post_hashtag']
                let post_comment = posts[i]['post_comment']
                let post_picture = posts[i]['post_picture']
                let post_id = posts[i]['_id']['$oid']
                let post_nick = posts[i]['usernick']


                let temp_html = `<button class="open-modal-${i}" onclick="openModal(${i})" style=" border: none; background: none;">
                                 <img class="profilepage-image" src="../static/image/${post_picture}">
                                 </button>`
                let temp2_html = `
                            <div class="modal-overlay-${i} comment-modal" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 1;background-color: rgba(0, 0, 0, 0.4);">
                                <div id="modal-script" class="modal_body" style="">
                                    <div style="display: flex; flex-direction: row;">
                                        <img class="modal-image" src="../static/image/${post_picture}">
                                        <div>
                                            <!--                댓글창 상단 내 프로필-->
                                            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 450px; height: 55px;border-bottom: 1px solid #edebeb">
                                                <div style="display: flex; flex-direction: row;">
                                                    <a href=""><img class="box-profile"
                                                                    src="http://kaihuastudio.com/common/img/default_profile.png"></a>
                                                    <p style="margin-left: 10px;">${post_nick}</p>
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
                                                    <p style="margin-left: 10px;">${post_nick}</p>
                                                    <p style="margin-left: 5px; text-align: left"><span style="font-weight: lighter; color: dodgerblue;">${post_hashtag}</span><br>
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
                                                <div style="text-align: left; margin-left: 10px; height: 30px;"><span style="font-weight: bold">좋아요</span>
                                                    <span style="font-weight: bold">62,364</span>개
                                                </div>
                                                <div style="font-weight: lighter; font-size: 10px; text-align: left; margin-left: 10px;">${time_before}</div>
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


=======
}

>>>>>>> origin/personal_branch_DH_2
