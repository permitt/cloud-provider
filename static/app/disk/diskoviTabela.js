Vue.component("diskovi-tabela", {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            diskovi: null
        }
    },
    template: ` 
<div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3 style="text-align:center">Pregled diskova</h3>
	<table class="table table-dark">
	<tr bgcolor="">
		<th>Ime</th>
        <th>Kapacitet</th>
        <th>Tip</th>
        <th>VM</th>
		<th>&nbsp;</th>
	</tr>
		
	<tr v-for="d in diskovi" >
		<td>{{d.ime}}</td>
        <td>{{d.kapacitet}}</td>
        <td>{{d.tip}}</td>
        <td>{{d.vm}}</td>
		<td>
			<input type="hidden" name="itemId" v-model="d.ime"> 
			<button class="btn btn-success" v-on:click="edit(d)">Izmjena</button>
		</td>
	</tr>
</table>
	<p>
		<a v-if="currentUser.uloga != 'korisnik'" class="btn btn-outline-primary" href="#/diskovi/novi">Dodaj disk</a>
    </p>
    </div>
</div>		  
`
    ,
    methods: {
        edit(disk) {
            router.replace("/diskovi/" + disk.ime);
        }

    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data))
            .catch(e => console.log(e.response));
        axios
            .get('rest/diskovi/all')
            .then(response => {
                this.diskovi = response.data;
            })
            .catch(e => console.log(e.response));
    },
});