
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
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then(response => {
        window.location.reload();
    })
}
function updatePatientDetails() {
    //console.log(data)

    const givenName = document.querySelector('[name="givenName"]').value;
    const familyName = document.querySelector('[name="familyName"]').value;
    const screenName = document.querySelector('[name="screenName"]').value;
    const yearOfBirth = document.querySelector('[name="yearOfBirth"]').value;
    const bio = document.querySelector('[name="bio"]').value;

    const body = {
        givenName: givenName,
        familyName: familyName,
        screenName: screenName,
        yearOfBirth: yearOfBirth,
        bio: bio,
    }
    console.log(body)
    console.log("...loding")
    fetch(`/auth/updatePatientDetails`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then(jsonData => {
        console.log(jsonData);
        var slideout;
        if (jsonData.result) {
            slideout = document.getElementById('notification_clinician');
        } else {
            slideout = document.getElementById('notification_clinician_warning');
        }
        slideout.innerHTML = jsonData.msg;
        slideout.classList.toggle('visible');

        setTimeout(function () {
            slideout.classList.toggle('visible');
        }, 4000);
    })
}
function updatePassword() {
    //console.log(data)

    const oldPassword = document.querySelector('[name="oldPassword"]').value;
    const newPassword = document.querySelector('[name="newPassword"]').value;
    if (oldPassword == "" || newPassword == "") {
        alert("Please complete old and new password");
        return;
    }
    const body = {
        oldPassword: oldPassword,
        newPassword: newPassword
    }
    console.log(body)
    console.log("...loding")
    fetch(`/auth/updatePassword`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then(jsonData => {
        console.log(jsonData);
        var slideout;
        if (jsonData.result) {
            slideout = document.getElementById('notification_clinician');
        } else {
            slideout = document.getElementById('notification_clinician_warning');
        }
        slideout.innerHTML = jsonData.msg;
        slideout.classList.toggle('visible');

        setTimeout(function () {
            slideout.classList.toggle('visible');
        }, 4000);
    })
}

function updateTheme() {
    //console.log(data)

    var e = document.getElementById("themeSelector");
    var selectedTheme = e.value;
    let backgroundColor = "";
    let primaryColor = "";
    switch (selectedTheme) {
        case "default":
            backgroundColor = "#13678A";
            primaryColor = "#4AA68B";
            break;
        case "summer":
            backgroundColor = "#003a91";
            primaryColor = "#db5f00";
            break;

        case "winter":
            backgroundColor = "#5a8996";
            primaryColor = "#087fce";
            break;

    }
    console.log(backgroundColor, primaryColor);

    const body = {
        themeName: selectedTheme,
        backgroundColor: backgroundColor,
        primaryColor: primaryColor
    }
    console.log(body)
    console.log("...loding")
    fetch(`/auth/updateTheme`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then(jsonData => {
        console.log(jsonData);
        var slideout;
        if (jsonData.result) {
            slideout = document.getElementById('notification_clinician');
        } else {
            slideout = document.getElementById('notification_clinician_warning');
        }
        slideout.innerHTML = jsonData.msg;
        slideout.classList.toggle('visible');

        setTimeout(function () {
            slideout.classList.toggle('visible');
        }, 4000);
    })
}