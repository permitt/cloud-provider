Vue.component('korisnici-izmjena', {
    data: function () {
        return {
            currentUser: null,
            email: this.$route.params.email,
            userToEdit: {
                ime: "",
                prezime: "",
                email: "",
                uloga: "",
                organizacija: "",
                password: ""
            },
            passwordError: false,
            emailError: false,
            roleError: false,
            orgError: false,
            firstNameError: false,
            lastNameError: false,
            passwordShortError: false,
            password2: "",
        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin:30px 0;">
    <h3>Korisnik : {{this.userToEdit.ime}} {{this.userToEdit.prezime}} </h3>
    <form class="needs-validation novalidate" @onSubmit="sacuvaj">
    <div class="form-group">
        <label for="exampleInputEmail1">Email adresa</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="userToEdit.email" readonly >
        
      </div>
    <div class="form-group">
      <label for="organizacija">Organizacija</label>
      <input type="text" class="form-control" id="organizacija" v-model="userToEdit.organizacija" readonly/>
    </div>

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="userToEdit.ime" required>
    <small style="color:red" v-if="firstNameError">Morate unijeti ime!</small>
    </div>

    <div class="form-group">
    <label for="prezime">Prezime</label>
    <input type="text" class="form-control" id="prezime" v-model="userToEdit.prezime" required>
    <small style="color:red" v-if="lastNameError">Morate unijeti prezime!</small>
    </div>

    <div class="form-group">
        <label for="ime">Password</label>
        <input type="password" class="form-control" id="pw" v-model="userToEdit.password" required>
        <small style="color:red" v-if="passwordShortError">Lozinka ne moze biti kraca od 6 karaktera!</small>
    </div>
    <div class="form-group">
        <label for="ime">Password ponovo</label>
        <input type="password" class="form-control" id="pw2" v-model="password2" required>
        <small style="color:red" v-if="passwordError">Lozinke se ne poklapaju!</small>
    </div>
    <div class="form-group">
    <label for="uloga">Uloga</label>
    
    <select v-model="userToEdit.uloga" class="form-control" required>
        <option>admin</option>
        <option>korisnik</option>
    </select>
    </div>
    <button type="button" class="btn btn-primary" v-on:click="sacuvaj()">Sacuvaj</button>
    <button v-on:click="izbrisi()" type="button" class="btn btn-danger">Obrisi</button>
    </form>





</div>
</div>
`
    ,
    methods: {
        resetErrors() {
            this.firstNameError = false;
            this.lastNameError = false;
            this.emailError = false;
            this.passwordError = false;
            this.passwordShortError = false;
            this.roleError = false;
            this.orgError = false;

        }
        ,

        formValid() {
            this.resetErrors();
            let valid = true;

            if (this.password2 !== this.userToEdit.password) {
                this.passwordError = true;
                valid = false;
            }


            if (this.userToEdit.ime == "") {
                this.firstNameError = true;
                valid = false;
            }
            if (this.userToEdit.prezime == "") {
                this.lastNameError = true;
                valid = false;
            }
            if (this.userToEdit.uloga == "") {
                this.roleError = true;
                valid = false;
            }
            if (this.userToEdit.organizacija == "") {
                this.orgError = true;
                valid = false;
            }
            if (this.userToEdit.password.length < 6) {
                this.passwordShortError = true;
                valid = false;
            }

            return valid;

        },
        sacuvaj() {

            if (!this.formValid())
                return;

            console.log(JSON.stringify(this.userToEdit));
            axios
                .put("/rest/users/" + this.email, JSON.stringify(this.userToEdit))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/korisnici");
                }).catch(e => {
                    console.log(e.response);
                });
        },
        izbrisi() {
            axios
                .delete("/rest/users/" + this.email)
                .then((response) => {
                    if (response.data == "OK")
                        router.replace("/korisnici");


                })
                .catch(e => {
                    if (e.response.status == 400)
                        alert("Ne mozes obrisati sebe.");
                });

        }

    },
    mounted() {

        axios.get('rest/users/current')
            .then(response => (this.currentUser = response.data));
        axios.get('rest/users/' + this.email)
            .then((response) => {

                this.userToEdit = response.data;
            })
            .catch((error) => {
                if (error.response.status == 400)
                    alert("No user found with email: " + this.email);
            });
    }
});