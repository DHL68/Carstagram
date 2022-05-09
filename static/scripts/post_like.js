// $(document).ready(function () {
//     show_like();
// });

$(window).ready(function () {
    // 500s 시간 지연
    setTimeout(function(){ show_like(); }, 500);
});

// 좋아요 기능 POST
function add_like(post_id) {
    // let post_likes = $(`#${post_id}`).val()
    $.ajax({
        type: "POST",
        url: "/api/like",
        data: {post_id_give: post_id},
        success: function (response) {
            console.log(response)

            alert(response['msg']);

            window.location.reload()
        }
    });
}

// // 좋아요 기능 GET
// function show_like() {
//     $.ajax({
//         type: "GET",
//         url: "/api/like",
//         data: {},
//         success: function (response) {
//             // console.log(response['post_likes'])
//             let rows = response['post_likes']
//
//             for (let i = 0; i < rows.length; i++) {
//                 let post_likes = rows[i]['post_likes']
//                 let post_like_id = rows[i]['post_id']
//
//                 let temp_html = `
//                     <div>
//                         좋아요 ${post_likes}개
//                     </div>
//                     `
//
//                 console.log(post_likes)
//
//                 $(`.${post_like_id}`).show(temp_html)
//             }
//         }
//     });
// }

// ========================================================================================================
// ========================================================================================================

// function toggle_like(post_id, type) {
//     console.log(post_id, type)
//     let $a_like = $(`#${post_id} a[aria-label='${type}']`)
//     let $i_like = $a_like.find("i")
//     let class_s = {"heart": "fa-heart", "star": "fa-star", "like": "fa-thumbs-up"}
//     let class_o = {"heart": "fa-heart-o", "star": "fa-star-o", "like": "fa-thumbs-o-up"}
//     if ($i_like.hasClass(class_s[type])) {
//         $.ajax({
//             type: "POST",
//             url: "/api/like",
//             data: {
//                 post_id_give: post_id,
//                 type_give: type,
//                 action_give: "unlike"
//             },
//             success: function (response) {
//                 console.log("unlike")
//                 $i_like.addClass(class_o[type]).removeClass(class_s[type])
//                 $a_like.find("span.like-num").text(response["count"])
//             }
//         })
//     } else {
//         $.ajax({
//             type: "POST",
//             url: "/api/like",
//             data: {
//                 post_id_give: post_id,
//                 type_give: type,
//                 action_give: "like"
//             },
//             success: function (response) {
//                 console.log("like")
//                 $i_like.addClass(class_s[type]).removeClass(class_s[type])
//                 $a_like.find("span.like-num").text(response["count"])
//             }
//         })
//     }
// }