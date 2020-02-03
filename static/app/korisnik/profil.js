Vue.component('profil', {
    data: function () {
        return {
            currentUser: {
                ime: "",
                prezime: "",
                email: "",
                uloga: "",
                organizacija: "",
                password: ""
            },
            email: "",
            passwordError: false,
            emailError: false,
            firstNameError: false,
            lastNameError: false,
            passwordShortError: false,
            password2: "",

        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3>Izmjena profila</h3>
    <form class="needs-validation novalidate">
    <div class="form-group">
        <label for="exampleInputEmail1">Email adresa</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="currentUser.email" required>
        <small style="color:red" v-if="emailError">Morate unijeti validan mejl! (a@b.c) </small>

      </div>


    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="currentUser.ime" required>
    <small style="color:red" v-if="firstNameError">Morate unijeti ime!</small>
    </div>

    <div class="form-group">
    <label for="prezime">Prezime</label>
    <input type="text" class="form-control" id="prezime" v-model="currentUser.prezime" required>
    <small style="color:red" v-if="lastNameError">Morate unijeti prezime!</small>

    </div>

    <div class="form-group">
        <label for="pw">Password</label>
        <input type="password" class="form-control" id="pw" v-model="currentUser.password" required>
        <small style="color:red" v-if="passwordShortError">Lozinka ne moze biti kraca od 6 karaktera!</small>

    </div>
    <div class="form-group">
        <label for="pw2">Password ponovo</label>
        <input type="password" class="form-control" id="pw2" v-model="password2" required>
        <small style="color:red" v-if="passwordError">Lozinke se ne poklapaju!</small>
    </div>

    
    <button type="button" class="btn btn-primary" v-on:click="sacuvaj()">Sacuvaj</button>
    <button v-if="currentUser.uloga == 'admin'" type="button" class="btn btn-outline-primary" v-on:click="org()" >Organizacija</button>
    </form>





</div>
</div>
`
    ,
    methods: {
        org() {
            router.push('/organizacije/' + this.currentUser.organizacija);
        },
        validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        resetErrors() {
            this.firstNameError = false;
            this.lastNameError = false;
            this.emailError = false;
            this.passwordError = false;
            this.passwordShortError = false;

        }
        ,

        formValid() {
            this.resetErrors();
            let valid = true;

            if (this.password2 !== this.currentUser.password) {
                this.passwordError = true;
                valid = false;
            }
            if (this.currentUser.email == "" || !this.validateEmail(this.currentUser.email)) {
                this.emailError = true;
                valid = false;
            }

            if (this.currentUser.ime == "") {
                this.firstNameError = true;
                valid = false;
            }
            if (this.currentUser.prezime == "") {
                this.lastNameError = true;
                valid = false;
            }
            if (this.currentUser.password.length < 6) {
                this.passwordShortError = true;
                valid = false;
            }

            return valid;

        },
        sacuvaj() {

            if (!this.formValid())
                return;

            console.log(JSON.stringify(this.currentUser));
            axios
                .put("/rest/users/" + this.email, JSON.stringify(this.currentUser))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/korisnici");
                }).catch(e => {
                    if (e.response.status == 400)
                        alert("Korisnik s tim mejlom vec postoji.");
                });
        },
    },


    mounted() {

        axios.get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
                this.email = response.data.email;
            });
    }
});