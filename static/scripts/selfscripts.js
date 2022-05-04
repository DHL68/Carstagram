// 모달 열기
    const modal = document.getElementById("modal-option");
    const buttonOpenModal = document.getElementById("open-modal");
    buttonOpenModal.addEventListener("click", e => {
        modal.style.top = window.pageYOffset + 'px'; // 모달띄울시, 스크롤이 내려가면 창이 뜨는 위치 수정
        modal.style.display = "flex";  // 모달 나타나게하기
        document.body.style.overflowY = "hidden"; // 모달 띄웠을때 스크롤안되게하기

    });
    // 모달 x 눌러 닫기
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