Vue.component("vm-tabela", {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            VMs: null,
            coreFilter: { min: 0, max: 99 },
            ramFilter: { min: 0, max: 99 },
            gpuFilter: { min: 0, max: 99 },
            searchText: "",
        }
    },
    template: `
    <div class="container">
    <div class="col-lg-8 mx-auto" style="margin-top:30px">

    
    <h4>Pretraga</h4>


    <form>
    <div class="form-group row">
    <label class="col-lg-3" for="coreNum">Broj jezgara: &nbsp;</label>
    <input @change="filter()" v-model="coreFilter.min"  style="width:50px" type="number" min="0"/>-<input @change="filter()" v-model="coreFilter.max" style="width:50px"  type="number" min="0"/>
    </div>

    
    <div class="form-group row">
    <label class="col-lg-3" for="ramNum">RAM: &nbsp;</label>
    <input v-model="ramFilter.min" @change="filter()" id="ramNum" style="width:50px" type="number" min="0"/>-<input @change="filter()" v-model="ramFilter.max" style="width:50px"  type="number" min="0"/>
    </div>

    <div class="form-group row">
    <label class="col-lg-3" for="gpuNum">Broj GPU jezgara: &nbsp;</label>
    <input v-model="gpuFilter.min" @change="filter()" id="gpuNum" style="width:50px" type="number" min="0"/>-<input @change="filter()" v-model="gpuFilter.max" style="width:50px"  type="number" min="0"/>
    </div>
    
    <div class="form-group row">
    <label class="col-lg-3" for="searchtxt">Naziv VM &nbsp;</label>
    <input v-model="searchText" @input="filter()" id="searchtxt" style="margin-right:10px" type="text" /> <button v-on:click="filter()" class="btn btn-primary" type="button" value="Filter">Filter</button>
    </div>
    

    </form>

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
	<tr v-bind:id="vm.ime" v-for="vm in VMs" v-on:click="detaljiVM(vm.ime)">
		<td>{{vm.ime}}</td>
		<td>{{vm.brojJezgara}}</td>
		<td>{{vm.RAM}}</td>
		<td>{{vm.GPU}}</td>
		<td>{{vm.organizacija.ime}}</td>
	</tr>
	</tbody>
</table>
	<p>
		<a v-if="currentUser.uloga != 'korisnik'" class="btn btn-outline-primary" href="#/dodajVM">Dodaj VM</a>
    </p>
    </div>
</div>		  	  
`
    ,
    methods: {
        detaljiVM: function (ime) {
            router.replace("/vm/" + ime);
        },
        filter() {
            this.VMs.map(vm => {
                let element = document.querySelector("#" + vm.ime);
                let hide = false;

                if (vm.brojJezgara < this.coreFilter.min || vm.brojJezgara > this.coreFilter.max)
                    hide = true;

                if (vm.RAM < this.ramFilter.min || vm.RAM > this.ramFilter.max)
                    hide = true;

                if (vm.GPU < this.gpuFilter.min || vm.GPU > this.gpuFilter.max)
                    hide = true;

                if (vm.ime.toLowerCase().search(this.searchText.toLowerCase()) == -1)
                    hide = true;

                element.style.display = hide == true ? 'none' : 'table-row';

            });
        }

    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
            })
        axios
            .get('rest/vm/all')
            .then(response => { this.VMs = response.data; });
    },
});

