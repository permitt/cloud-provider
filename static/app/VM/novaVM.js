Vue.component('nova-vm', {
    data: function () {
        return {
            currentUser: "",
            vmToAdd: {
                ime: "",
                kategorija: { ime: "" },
                diskovi: [],
                organizacija: ""
            },
            imeUnikatError: false,
            orgError: false,
            imeError: false,
            kategorijaError: false,
            sviDiskovi: [],
            slobodniDiskovi: [],
            kategorije: [],
            organizacije: [],
            ulogovanSuperadmin: false,


        };
    },
    template:
        `
		<div class="container">
				
			<div class="col-lg-8 mx-auto" style="margin:30px 0;">
				    <h3>Nova virtuelna masina</h3>
				<form>
					<div class="form-group" v-if="ulogovanSuperadmin">
						<label for="organizacija">Odaberi organizaciju</label>
						<select  v-model="vmToAdd.organizacija" class="form-control" @change="azurirajDiskove()">
							<option v-for="o in organizacije" v-bind:id="o" >{{o.ime}}</option>
                        </select>
                        <small v-if="orgError" style="color:red;">Morate odabrati organizaciju!</small>
					</div>
					<div class="form-group">
					    <label for="ime">Ime</label>
					    <input type="text" class="form-control" id="ime" v-model="vmToAdd.ime" required>
					    <small style="color:red" v-if="imeError">Morate unijeti ime!</small>
					    <small style="color:red;fontSize:15px" v-if="imeUnikatError">VM s tim imenom vec postoji!</small>
					</div>   
					 <div class="form-group">
					    <label for="kategorija">Kategorija</label>
					     <select id="kat" v-model="vmToAdd.kategorija" class="form-control" >
					        <option v-for="k in kategorije" v-bind:id="k">{{k.ime}}</option>
					    </select>
					    <small style="color:red" v-if="kategorijaError">Morate odabrati kategoriju!</small>
					    
					</div>
					<div class="form-group">
					 <label for="diskovi">Zakaci diskove:</label>
					   <select  multiple v-model="vmToAdd.diskovi" class="form-control" id="diskovi">
				        <option :value="d" v-for="d in slobodniDiskovi" >{{d.ime}}</option>
				    </select>
				    </div>
				    <span></span>
					<button type="button" class="btn btn-primary" v-on:click="dodaj()">Dodaj</button>
			</form>
			</div>
		</div>
	`
    ,
    methods: {
        azurirajDiskove() {
            this.slobodniDiskovi = [];

            this.sviDiskovi.map(el => {
                if (this.vmToAdd.organizacija == el.organizacija)
                    this.slobodniDiskovi.push(el);
            });
        },


        formValid() {
            let valid = true;

            this.imeError = false;
            this.imeUnikatError = false;
            this.kategorijaError = false;
            this.orgError = false;

            if (this.vmToAdd.ime == "") {
                this.imeError = true;
                valid = false;
            }
            if (this.vmToAdd.organizacija == "") {
                this.orgError = true;
                valid = false;
            }
            console.log(this.vmToAdd);
            //var e = document.getElementById("kat");
            //var selektovan = e.options[e.selectedIndex].text
            if (this.vmToAdd.kategorija.ime == "") {
                this.kategorijaError = true;
                valid = false;
            }




            return valid;
        },
        dodaj() {

            if (!this.formValid())
                return;

            this.kategorije.map(k => {
                if (k.ime == this.vmToAdd.kategorija.ime)
                    this.vmToAdd.kategroija = k;
            });



            axios
                .post("/rest/vm", JSON.stringify(this.vmToAdd))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/");
                }).catch(e => {
                    if (e.response.status == 400)
                        this.imeUnikatError = true;
                });
        },

    },
    mounted() {
        axios.get('rest/users/current')
            .then(response => {
                this.currentUser = response.data.uloga;
                if (this.currentUser == "superadmin") {
                    this.ulogovanSuperadmin = true;
                }

            });
        axios.get('rest/diskovi/all')
            .then(response => (this.sviDiskovi = response.data));
        axios.get('/rest/kategorija/all')
            .then(response => (this.kategorije = response.data));
        axios.get('/rest/organizacija/all')
            .then(response => (this.organizacije = response.data));



    }
});