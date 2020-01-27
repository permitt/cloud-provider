Vue.component("korisnici-tabela", {
    data: function () {
        return {
            currentUser: null,
            users: null
        }
    },
    template: ` 
<div>
	
	<table class="table">
	<tr bgcolor="lightgrey">
		<th>Email</th>
        <th>Ime</th>
        <th>Prezime</th>
		<th>&nbsp;</th>
	</tr>
		
	<tr v-for="u in users">
		<td>{{u.email }}</td>
        <td>{{u.ime}}</td>
        <td>{{u.prezime}}</td>
		<td>
			<input type="hidden" name="itemId" v-model="u.email"> 
			<button v-on:click="Edit(u)">Izmjena</button>
		</td>
	</tr>
</table>
	<p>
		<a class="btn btn-outline-primary" href="#/dodajKorisnika">Dodaj korisnika</a>
	</p>
</div>		  
`
    ,
    methods: {
        addToCart: function (user) {
            axios
                .post('rest/IZMEJNAKORISNIKA/add', { "email": '' + user.Email })
                .then(response => (alert("AAAA")))
        },
        Edit: function (user) {

        }
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data));
        axios
            .get('rest/users/all')
            .then(response => {
                this.users = response.data;
            })
    },
});