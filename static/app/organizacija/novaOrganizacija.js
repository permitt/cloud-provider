Vue.component('nova-organizacija', {
    data: function () {
        return {
        	currentUser: {uloga:"superadmin"},
            ime:"",
            opis:"",
            i_file:"",
            imeUnikatError: false,
            imeError:false,
         
        }
    },
    template:`
    	<div class="container">
    	<div class="col-lg-8 mx-auto" style="margin:30px 0;">
	    <h3>Nova organizacijja</h3>
	    <form method="POST" ref="dodaj" v-on:submit="dodaj">
	
	    <div class="form-group">
	    <label for="ime">Ime</label>
	    <input type="text" class="form-control" name="ime" id="ime" v-model="ime" required>
	    <small style="color:red" v-if="imeError">Morate uneti ime!</small>
	    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Organizacija sa tim imenom vec postoji!</small>
	    </div>
	
	    <div class="form-group">
	    <label for="opis">Opis</label>
	    <input type="text" class="form-control" id="opis" name="opis" v-model="opis" required>
	    
	    </div>
	    <div class="form-group">
	    <label>Logo</label>
    	<div class="input-group mb-3">
        	<div class="custom-file">
        		<input type="file" accept="image/*" class="custom-file-input" name="i_file" id="i_file" onchange="document.getElementById('lab').innerHTML='Selected'">
        		<label class="custom-file-label" for="i_file" id="lab" >Choose</label>
        	</div>
    	</div>
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
            
            if (this.ime == "") {
                this.imeError = true;
                return false;
            }
            
            return valid;
        },
        dodaj() {

            if (!this.formValid())
                return;
            let formData = new FormData(this.$refs.dodaj);
          //  console.log(this.i_file);
            axios
                .post("/rest/organizacije/dodaj", formData)
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/organizacije");
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