function emitNotification() {
    var socket = io(/* "ws://localhost:3000" */);
    console.log("socket.id");
    console.log(socket);
    console.log("emmiting message")
    socket.emit('notification', { msg: "test" });

}
function initSocket() {
    var socket = io();
    console.log("socket.id");
    console.log(socket);

    console.log("init listerner")
    socket.on('notification', function (data) {
        console.log(data)
        var slideout = document.getElementById('notification_clinician');
         slideout.innerHTML = data.msg;
         slideout.classList.toggle('visible');
         setTimeout(function () {
            slideout.classList.toggle('visible');
        }, 4000);
    });
}