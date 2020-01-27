Vue.component('nav-bar', {
    data: function () {
        return {
            currentUser: null,
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
        <a class="nav-item nav-link active" href="#">VM <span class="sr-only">(current)</span></a>
        <a class="nav-item nav-link" href="#/korisnici">Korisnici</a>
        <a class="nav-item nav-link" href="#/diskovi">Diskovi</a>
        <a class="nav-item nav-link" href="#/kategorije">Kategorije</a>
    </div>    

    <div class="navbar-nav ml-auto">
        <a href="#/login" v-if="currentUser == null" class="pull-right btn btn-outline-success my-2 my-sm-0" type="submit">Log in</a>
        <a href="rest/users/logout" v-else class="float-right btn btn-outline-danger my-2 my-sm-0" type="submit">Log out</a>
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
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data))
    },
});

