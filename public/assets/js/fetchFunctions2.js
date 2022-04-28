function insertRecord(healthType) {
    //console.log(data)

    const insulinDosesValue = document.querySelector('[name="insulinDosesValue"]').value;
    const insulinDosesComment = document.querySelector('[name="insulinDosesComment"]').value;
    const body = {
        healthType: healthType,
        insulinDosesValue: insulinDosesValue,
        insulinDosesComment: insulinDosesComment,
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