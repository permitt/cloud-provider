const navBar = { template: '<nav-bar></nav-bar>' };
const logIn = { template: '<log-in></log-in>' };
const VMTabela = { template: '<vm-tabela></vm-tabela>' };
const VMdetalji = { template: '<vm-detalji></vm-detalji>'};
const korisniciTabela = { template: '<korisnici-tabela></korisnici-tabela>' };
const korisniciIzmjena = { template: '<korisnici-izmjena></korisnici-izmjena>' };


const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: VMTabela },
        { path: '/vm/:ime',component : VMdetalji},
        { path: '/korisnici', component: korisniciTabela },
        { path: '/korisnici/:email', component: korisniciIzmjena },
        { path: '/login', component: logIn }
    ]
});

router.beforeEach((to, from, next) => {
    if (!isAuthenticated() && to.path != "/login") {
        next('/login');
    }
    else
        next();
});

let app = new Vue({
    router,
    el: '#app',
    components: {
        VMTabela,
    },
    data: {
        currentUser: null,
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
                if (this.currentUser == null)
                    router.replace("/login");
            });

    }


})

function isAuthenticated() {

    if (app.$data.currentUser == null) {
        return false;
    }
    return true;


}

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