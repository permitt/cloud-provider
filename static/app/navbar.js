Vue.component('nav-bar', {
    data: function () {
        return {
            currentUser: { uloga: "korisnik", email: "" },
        }
    },
    template: ` 
<div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Cloud Provider</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">

    <div  class="navbar-nav">
        <a class="nav-item nav-link" href="#/">VM</a>
        <a class="nav-item nav-link" href="#/korisnici" v-if="currentUser.uloga != 'korisnik'">Korisnici</a>
        <a class="nav-item nav-link" href="#/diskovi">Diskovi</a>
        <a class="nav-item nav-link" href="#/kategorije" v-if="currentUser.uloga == 'superadmin'">Kategorije</a>
    </div>    

    <div class="navbar-nav ml-auto">
        <a href="#/profil" class="btn btn-outline-primary my-2 my-sm-0" type="submit" style="margin-right:10px">Profil</a>
        <a href="#/login" v-if="currentUser.email == ''" class=" btn btn-outline-success my-2 my-sm-0" type="submit" style="margin-right:10px">Log in</a>
        <button v-on:click="logout()" v-else class="btn btn-outline-danger my-2 my-sm-0" type="submit" style="margin-right:10px">Log out</button>
    </div>
    
    
    </div>
    </nav>
</div>		  
`
    ,
    methods: {
        // addToCart: function (product) {
        //     axios
        //         .post('rest/proizvodi/add', { "id": '' + product.id, "count": parseInt(product.count) })
        //         .then(response => (toast('Product ' + product.name + " added to the Shopping Cart")))
        // }
        logout() {
            axios
                .post("/rest/users/logout")
                .then(response => {
                    if (response.data == "OK") {
                        this.currentUser = { uloga: "korisnik", email: "" };
                        this.$parent.currentUser = null;
                        router.replace("/login");
                    }
                })
        }
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
            })
    },
});

