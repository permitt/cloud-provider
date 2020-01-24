const axios = require('axios');




function login() {

    let user = $("#username").val();
    let pw = $("#pw").val();
    if (user == "" || pw == "") {
        alert("Field can't be empty!");
        return;
    }



    $.ajax({
        url: "rest/login",
        type: "POST",
        data: JSON.stringify({
            "username": user,
            "password": pw
        }),
        contentType: "application/json",
        dataType: "json",
        complete: function (data) {
            console.log(data);
            if (data.responseText == "OK") {
                window.location.replace(data.getResponseHeader("Location"));
            } else {
                alert("Wrong username/password combo!");
            }
        }
    });
}