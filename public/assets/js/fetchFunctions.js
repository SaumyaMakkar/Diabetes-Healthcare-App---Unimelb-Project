function insertRecord(healthType) {
    //console.log(data)

    const value = document.querySelector('[name="'+healthType+'Value"]').value;
    const comment = document.querySelector('[name="'+healthType+'Comment"]').value;
    const body = {
        healthType: healthType,
        value: value,
        comment: comment,
    }
    console.log(body)
    console.log("...loding")
    fetch(`/patient_home/insertRecord`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + user.currentUser.token 
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then(response => {
        window.location.reload();
    })
    /*  .then(data => {
         console.log(data)
         var slideout = document.getElementById('notification_object');
         slideout.innerHTML = data.msg;
         slideout.classList.toggle('visible');
         enableEditMode('glucose',false);
     }); */

}