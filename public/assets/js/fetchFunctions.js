function insertRecord(healthType) {
    //console.log(data)

    const value = document.querySelector('[name="' + healthType + 'Value"]').value;
    if (value == 0) {
        alert("Invalid value");
        return;
    }
    const comment = document.querySelector('[name="' + healthType + 'Comment"]').value;
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

}