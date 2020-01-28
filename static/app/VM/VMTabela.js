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
    <table class="table table-hover">
	<thead>
	<tr bgcolor="lightgrey">
		<th>Ime</th>
		<th>Broj jezgara</th>
		<th>RAM</th>
		<th>GPU</th>
		<th>Organizacija</th>
	</tr>
	</thead>
	<tbody>	
	<tr v-for="vm in VMs" v-on:click="detaljiVM(vm.ime)">
		<td>{{vm.ime}}</td>
		<td>{{vm.brojJezgara}}</td>
		<td>{{vm.RAM}}</td>
		<td>{{vm.GPU}}</td>
		<td>{{vm.organizacija.ime}}</td>
	</tr>
	</tbody>
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
    	detaljiVM: function(ime) {
    		 router.replace("/detaljiVM/" + ime);
		}

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

