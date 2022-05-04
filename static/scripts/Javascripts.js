// Get the modal
var modal = document.getElementById("myModal");
// var modal_2 = document.getElementById("myModal_2");
// var modal_3 = document.getElementById("myModal_3");

// modals = [modal, modal_2, modal_3]

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// var btn_2 = document.getElementById("myBtn_2");
// var btn_3 = document.getElementById("myBtn_3");



// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
// btns = [btn, btn_2, btn_3]

// When the user clicks on the button, open the modal

btn.onclick = function () {
  modal.style.display = "block";
}
  // // When the user clicks on the button, open the modal
  // btns[1].onclick = function() {
  //   modal_2.style.display = "block";
  // }
  // // When the user clicks on the button, open the modal
  // btns[2].onclick = function() {
  //   modal_3.style.display = "block";
  // }


// $(document).ready(function () {
//
//   let btns = document.querySelectorAll('.mmybtn .mybtn');
//
//   [].forEach.call(btns, function (btn) {
//     btn.addEventListener("click", click, false)
//   });
//
//   window.onclick = function (event) {
//     if (event.target == modal) {
//       modal.style.display = "none";
//     }
//   }
//
// })


// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// window.onclick = function(event) {
//   if (event.target == modal_2) {
//     modal_2.style.display = "none";
//   }
// }
// window.onclick = function(event) {
//   if (event.target == modal_3) {
//     modal_3.style.display = "none";
//   }
// }


//   if (event.target == modal) {
//     modal.style.display = "none";
//     document.body.style.overflowY = "";
//   }
//   if (event.target == modal) {
//   modal.style.display = "none";
//   document.body.style.overflowY = "";
//   }
// }