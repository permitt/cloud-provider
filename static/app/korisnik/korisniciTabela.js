Vue.component("korisnici-tabela", {
    data: function () {
        return {
            currentUser: null,
            users: null
        }
    },
    template: ` 
<div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3 style="text-align:center">Pregled korisnika</h3>
	<table class="table table-dark">
	<tr bgcolor="">
		<th>Email</th>
        <th>Ime</th>
        <th>Prezime</th>
		<th>&nbsp;</th>
	</tr>
		
	<tr v-for="u in users">
		<td>{{u.email}}</td>
        <td>{{u.ime}}</td>
        <td>{{u.prezime}}</td>
		<td>
			<input type="hidden" name="itemId" v-model="u.email"> 
			<button class="btn btn-success" v-on:click="edit(u)">Izmjena</button>
		</td>
	</tr>
</table>
	<p>
		<a class="btn btn-outline-primary" href="#/korisnici/novi">Dodaj korisnika</a>
    </p>
    </div>
</div>		  
`
    ,
    methods: {
        edit(user) {
            router.replace("/korisnici/" + user.email);
        }

    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data))
            .catch(e => console.log(e.response));
        axios
            .get('rest/users/all')
            .then(response => {
                this.users = response.data;
            })
            .catch(e => console.log(e.response));
    },
});