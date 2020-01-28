Vue.component("vm-tabela", {
    data: function () {
        return {
            currentUser: null,
            VMs: null
        }
    },
    template: `
    <div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">
    <table class="table">
	<tr bgcolor="lightgrey">
		<th>Naziv</th>
		<th>Cena</th>
		<th>&nbsp;</th>
	</tr>
		
	<tr v-for="p in VMs">
		<td>{{p.name }}</td>
		<td>{{p.price}}</td>
		<td>
			<input type="number" style="width:40px" size="3" v-model="p.count" name="itemCount"> 
			<input type="hidden" name="itemId" v-model="p.id"> 
			<button v-on:click="addToCart(p)">Dodaj</button>
		</td>
	</tr>
</table>
	<p>
		<a class="btn btn-outline-primary" href="#/dodajVM">Dodaj VM</a>
    </p>
    </div>
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
            .then(response => {
                this.currentUser = response.data;
            })
        axios
            .get('rest/vm/all')
            .then(response => { this.VMs = response.data; console.log(response.data) });
    },
});

