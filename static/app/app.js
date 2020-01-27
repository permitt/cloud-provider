const navBar = { template: '<nav-bar></nav-bar>' };
const login = { template: '<login></login>' };

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: korisnici },
        { path: '/login', component: login }
    ]
})

var app = new Vue({
    router,
    navBar,
    login,
    el: '#MainApp'
})