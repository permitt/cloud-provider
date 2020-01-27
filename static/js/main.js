const navBar = { template: '<nav-bar></nav-bar>' };
const logIn = { template: '<log-in></log-in>' };

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: navBar },
        { path: '/login', component: logIn }
    ]
});

let app = new Vue({
    router,
    el: '#app',
    components: {
        'navbar': navBar,
        'login': logIn
    },

})


function loginUser() {

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