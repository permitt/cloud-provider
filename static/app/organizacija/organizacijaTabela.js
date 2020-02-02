Vue.component("organizacija-tabela", {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            organizacije : []
        }
    },
    template: ` 
<div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3 style="text-align:center">Pregled organizacija</h3>
    <table class="table table-hover">
	<thead>
	<tr bgcolor="lightgrey">
		<th>Ime</th>
		<th>Opis</th>
		<th>Logo</th>
	</tr>
	</thead>
	<tbody>	
	<tr v-bind:id="o.ime" v-for="o in organizacije" v-on:click="edit(o.ime)">
		<td>{{o.ime}}</td>
		<td>{{o.opis}}</td>
		<td><img v-bind:src="o.logo" class="rounded-circle user-image" style="width: 45px; height: 45px;"></td>
	</tr>
	</tbody>
	
    </table>
    <p>
		<a class="btn btn-outline-primary" href="#/organizacije/nova">Dodaj organizaciju</a>
    </p>
	</div>	
    </div>
</div>		  
`
    ,
    methods: {
        edit(org) {
            router.replace("/organizacije/" + org);
        }

    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data))
            .catch(e => console.log(e.response));
        axios
            .get('rest/organizacija/all')
            .then(response => {
                this.organizacije = response.data;
            })
            .catch(e => console.log(e.response));
    },
});