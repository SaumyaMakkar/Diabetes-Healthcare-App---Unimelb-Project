
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";

    var span = modal.querySelector(".wt-modal-close");
    if(span) {
        span.style.cursor= "pointer";
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