(function () {
    console.log("Starting js...")
    sideBarController();
})();

function sideBarController() {
    var btn = document.getElementById("sidebar-button");
    var main_sidebar = document.querySelector("#main_sidebar");
    if (btn) {
        btn.onclick = function (event) {
            if (main_sidebar.classList.contains("sidebar-open")) {
                main_sidebar.classList.remove("sidebar-open");
            } else {
                main_sidebar.classList.add("sidebar-open");
            }
        }
    }
    if (main_sidebar) {
        main_sidebar.onclick = function (event) {
            console.log(event.srcElement)
            var el = event.srcElement;
            if (el.id != "main_sidebar") return;
            console.log("removebg")
            main_sidebar.classList.remove("sidebar-open");
        }
    }

}

function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";

    var span = modal.querySelector(".wt-modal-close");
    if (span) {
        span.style.cursor = "pointer";
        span.onclick = function () {
            modal.style.display = "none";
        }
    }



    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function enableEditMode(healthDataName, enable) {
    console.log("enableEditMode")
    console.log(healthDataName)
    var showBlock = document.getElementById(healthDataName + "_ShowBlock");
    var editBlock = document.getElementById(healthDataName + "_EditBlock");

    console.log("showBlock")
    console.log(showBlock)
    console.log("editBlock")
    console.log(editBlock)
    if (enable) {
        editBlock.style.display = "block";
        showBlock.style.display = "none";
    } else {
        showBlock.style.display = "block";
        editBlock.style.display = "none";
    }
}