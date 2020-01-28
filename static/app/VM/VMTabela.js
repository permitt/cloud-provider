Vue.component("vm-tabela", {
    data: function () {
        return {
            currentUser: null,
            VMs: null
        }
    },
    template: `
    <div>
    <table class="table">
	<tr bgcolor="lightgrey">
		<th>Ime</th>
		<th>Broj jezgara</th>
		<th>RAM</th>
		<th>GPU</th>
		<th>Organizacija</th>
	</tr>
		
	<tr v-for="vm in VMs">
		<td>{{vm.ime}}</td>
		<td>{{vm.brojJezgara}}</td>
	</tr>
</table>
	<p>
		<a class="btn btn-outline-primary" href="#/dodajVM">Dodaj VM</a>
	</p>
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
            .get('rest/vm/getVMs')
            .then(response => { this.VMs = response.data; console.log(response.data) });
    },
});

