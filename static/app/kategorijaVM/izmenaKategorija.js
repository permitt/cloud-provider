Vue.component('kategorija-izmena', {
    data: function () {
        return {
        	currentUser: {uloga:"superadmin"},
        	ime: this.$route.params.ime,
            katToEdit:{
            	ime:"",
            	brojJezgara:"",
            	RAM:"",
            	GPU:"",
            },
            imeUnikatError: false,
            imeError:false,
            brJezgaraManji:false,
            ramManji:false,
            gpuManji:false,
        }
    },
    template:`
    	<div class="container">
    	<div class="col-lg-8 mx-auto" style="margin:30px 0;">
	    <h3>Kategorija : {{this.katToEdit.ime}} </h3>
	    <form>
	
	    <div class="form-group">
	    <label for="ime">Ime</label>
	    <input type="text" class="form-control" id="ime" v-model="katToEdit.ime" required>
	    <small style="color:red" v-if="imeError">Morate unijeti ime!</small>
	    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Kategorija sa tim imenom vec postoji!</small>
	    </div>
	
	    <div class="form-group">
	    <label for="brJez">Broj jezgara</label>
	    <input type="text" class="form-control" id="brJez" v-model="katToEdit.brojJezgara" required>
	    <small style="color:red" v-if="brJezgaraManji">Broj jezgara ne sme biti manji od 0!</small>
	    </div>
	    <div class="form-group">
	    <label for="ram">RAM</label>
	    <input type="text" class="form-control" id="ram" v-model="katToEdit.RAM" required>
	   <small style="color:red" v-if="ramManji">RAM ne sme biti manji od 0!</small>
	    </div>
	    <div class="form-group">
	    <label for="gpu">GPU</label>
	    <input type="text" class="form-control" id="gpu" v-model="katToEdit.GPU" required>
	    <small style="color:red" v-if="gpuManji">GPU ne sme biti manji od 0!</small>
	    </div>
	    <button v-if="currentUser.uloga != 'korisnik'" type="button" class="btn btn-primary" v-on:click="sacuvaj()">Sacuvaj</button>
	    <button v-if="currentUser.uloga != 'korisnik'" v-on:click="izbrisi()" type="button" class="btn btn-danger">Obrisi</button>
	    </form>

	</div>
	</div>
	`
	    ,
    methods: {
    	formValid() {
    		let valid = true;
            this.imeError = false;
            this.imeUnikatError = false;
            if (this.katToEdit.ime == "") {
                this.imeError = true;
                return false;
            }
            if(parseInt(this.katToEdit.brojJezgara,10)<0){
            	this.brJezgaraManji = true;
            	valid = false;
            }
            if(parseInt(this.katToEdit.RAM,10)<0){
            	this.ramManji = true;
            	valid = false;
            }
            if(parseInt(this.katToEdit.GPU,10)<0){
            	this.gpuManji = true;
            	valid = false;
            }
            return valid;
        },
        sacuvaj() {

            if (!this.formValid())
                return;
            console.log(JSON.stringify(this.katToEdit));
            axios
                .put("/rest/kategorije/" + this.ime, JSON.stringify(this.katToEdit))
                .then(response => {
                    if (response.data == "OK"){
                    	
                        router.replace("/kategorije");
                        }
                }).catch(e => {
                    if (e.response.status == 400)
                        this.imeUnikatError = true;
                });
        },
            izbrisi() {
                axios
                    .delete("/rest/kategorije/" + this.ime)
                    .then((response) => {
                        if (response.data == "OK")
                            router.replace("/kategorije");
                    })
                    .catch(e => {
                        if (e.response.status == 400)
                            alert('Nije moguce obrisati kategoriju jer je dodeljena nekim virtuelnim masinama.');
                    });

            }


    },
 mounted() {
    	axios.get('rest/users/current')
        .then(response => (this.currentUser = response.data));
    	axios.get('rest/kategorije/' + this.ime)
        .then((response) => {

            this.katToEdit = response.data;
        })
        .catch((error) => {
            if (error.response.status == 400)
                alert("Kategorija s tim imenom ne postoji." + this.ime);
        });
        
    },
});