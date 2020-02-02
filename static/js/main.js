const navBar = { template: '<nav-bar></nav-bar>' };
const logIn = { template: '<log-in></log-in>' };
const VMTabela = { template: '<vm-tabela></vm-tabela>' };
const VMizmjena = { template: '<vm-izmjena></vm-izmjena>' }
const novaVM = {teplate : '<nova-vm></nova-vm>'};
const korisniciTabela = { template: '<korisnici-tabela></korisnici-tabela>' };
const korisniciIzmjena = { template: '<korisnici-izmjena></korisnici-izmjena>' };
const noviKorisnik = { template: '<novi-korisnik></novi-korisnik>' };
const profil = { template: '<profil></profil>' };
const diskoviTabela = { template: '<diskovi-tabela></diskovi-tabela>' };
const diskoviIzmjena = { template: '<diskovi-izmjena></diskovi-izmjena>' };
const noviDisk = { template: '<novi-disk></novi-disk>' };
const kategorijeTabela = {template:'<kategorija-tabela></kategorija-tabela>'};
const kategorijeIzmena= {template:'<kategorija-izmena></kategorija-izmena>'};
const novaKategorija = {template:'<nova-kategorija></nova-kategorija>'};
const organizacijeTabela = {template:'<organizacija-tabela></organizacija-tabela>'};
const organizacijeIzmena= {template:'<organizacija-izmena></organizacija-izmena>'};
const novaOrganizacija = {template:'<nova-organizacija></nova-organizacija>'};

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: VMTabela },
        {path : '/vm/nova',component: novaVM},
        { path: '/vm/:ime', component: VMizmjena },
        { path: '/korisnici', component: korisniciTabela },
        { path: '/korisnici/novi', component: noviKorisnik },
        { path: '/korisnici/:email', component: korisniciIzmjena },
        { path: '/diskovi', component: diskoviTabela },
        { path: '/diskovi/novi', component: noviDisk },
        { path: '/diskovi/:ime', component: diskoviIzmjena },
        { path: '/kategorije', component: kategorijeTabela },
        { path: '/kategorije/nova', component: novaKategorija },
        { path: '/kategorije/:ime', component: kategorijeIzmena},
        { path: '/organizacije', component: organizacijeTabela },
        { path: '/organizacije/nova', component: novaOrganizacija },
        { path: '/organizacije/:ime', component: organizacijeIzmena},
        { path: '/profil', component: profil },
        { path: '/login', component: logIn }
    ]
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

router.beforeEach((to, from, next) => {
    if (app.$data.currentUser == null && to.path != "/login") {
        next('/login');
    }
    else
        next();
});


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