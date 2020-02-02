Vue.component('nova-kategorija', {
    data: function () {
        return {
        	currentUser: {uloga:"superadmin"},
            katToAdd:{
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
	    <h3>Nova kategorija</h3>
	    <form>
	
	    <div class="form-group">
	    <label for="ime">Ime</label>
	    <input type="text" class="form-control" id="ime" v-model="katToAdd.ime" required>
	    <small style="color:red" v-if="imeError">Morate uneti ime!</small>
	    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Kategorija sa tim imenom vec postoji!</small>
	    </div>
	
	    <div class="form-group">
	    <label for="brJez">Broj jezgara</label>
	    <input type="text" class="form-control" id="brJez" v-model="katToAdd.brojJezgara" required>
	    <small style="color:red" v-if="brJezgaraManji">Broj jezgara ne sme biti manji od 0!</small>
	    </div>
	    <div class="form-group">
	    <label for="ram">RAM</label>
	    <input type="text" class="form-control" id="ram" v-model="katToAdd.RAM" required>
	   <small style="color:red" v-if="ramManji">RAM ne sme biti manji od 0!</small>
	    </div>
	    <div class="form-group">
	    <label for="gpu">GPU</label>
	    <input type="text" class="form-control" id="gpu" v-model="katToAdd.GPU" required>
	    <small style="color:red" v-if="gpuManji">GPU ne sme biti manji od 0!</small>
	    </div>
	    <button v-if="currentUser.uloga != 'korisnik'" type="button" class="btn btn-primary" v-on:click="dodaj()">Dodaj</button>
	   
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
            this.brJezgaraManji = false;
            this.ramManji = false;
            this.gpuManji = false;
            if (this.katToAdd.ime == "") {
                this.imeError = true;
                return false;
            }
            if(parseInt(this.katToAdd.brojJezgara,10)<0){
            	this.brJezgaraManji = true;
            	valid = false;
            }
            if(parseInt(this.katToAdd.RAM,10)<0){
            	this.ramManji = true;
            	valid = false;
            }
            if(parseInt(this.katToAdd.GPU,10)<0){
            	this.gpuManji = true;
            	valid = false;
            }
            return valid;
        },
        dodaj() {

            if (!this.formValid())
                return;

            axios
                .post("/rest/kategorije", JSON.stringify(this.katToAdd))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/kategorije");
                }).catch(e => {
                    if (e.response.status == 400)
                        this.imeUnikatError = true;
                });
        },
    },
 mounted() {
    	axios.get('rest/users/current')
        .then(response => (this.currentUser = response.data));
    	
        
    },
});