Vue.component("kategorija-tabela", {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            kategorije: null
        }
    },
    template: ` 
<div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3 style="text-align:center">Pregled kategorija</h3>
    <table class="table table-hover">
	<thead>
	<tr bgcolor="lightgrey">
		<th>Ime</th>
		<th>Broj jezgara</th>
		<th>RAM</th>
		<th>GPU</th>
	</tr>
	</thead>
	<tbody>	
	<tr v-bind:id="k.ime" v-for="k in kategorije" v-on:click="edit(k.ime)">
		<td>{{k.ime}}</td>
		<td>{{k.brojJezgara}}</td>
		<td>{{k.RAM}}</td>
		<td>{{k.GPU}}</td>
	</tr>
	</tbody>
	<p>
		<a class="btn btn-outline-primary" href="#/kategorije/nova">Dodaj kategoriju</a>
    </p>
    </table>
	</div>	
    </div>
</div>		  
`
    ,
    methods: {
        edit(kat) {
            router.replace("/kategorije/" + kat);
        }

    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data))
            .catch(e => console.log(e.response));
        axios
            .get('rest/kategorija/all')
            .then(response => {
                this.kategorije = response.data;
            })
            .catch(e => console.log(e.response));
    },
});