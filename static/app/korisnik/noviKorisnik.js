Vue.component('novi-korisnik', {
    data: function () {
        return {
            currentUser: null,
            userToAdd: {
                ime: "",
                prezime: "",
                email: "",
                uloga: "",
                organizacija: { ime: "" },
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
            organizacije: [],
        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3>Unos novog korisnika</h3>


    <form class="needs-validation novalidate" @onSubmit="dodaj"> 
    <div class="form-group">
        <label for="exampleInputEmail1">Email adresa</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="userToAdd.email" required>
        <small style="color:red" v-if="emailError">Morate unijeti validan mejl! (a@b.c) </small>

      </div>

    <div class="form-group">
    <label for="organizacija">Organizacija</label>
    <select v-model="userToAdd.organizacija" class="form-control" required>
        <option v-for="o in organizacije" v-bind:id="o.ime">{{o.ime}}</option>
    </select>
    <small style="color:red" v-if="orgError">Morate odabrati organizaciju!</small>
        
    </div>

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="userToAdd.ime" required>
    <small style="color:red" v-if="firstNameError">Morate unijeti ime!</small>
    </div>

    <div class="form-group">
    <label for="prezime">Prezime</label>
    <input type="text" class="form-control" id="prezime" v-model="userToAdd.prezime" required>
    <small style="color:red" v-if="lastNameError">Morate unijeti prezime!</small>

    </div>

    <div class="form-group">
        <label for="pw">Password</label>
        <input type="password" class="form-control" id="pw" v-model="userToAdd.password" required>
        <small style="color:red" v-if="passwordShortError">Lozinka ne moze biti kraca od 6 karaktera!</small>

    </div>
    <div class="form-group">
        <label for="pw2">Password ponovo</label>
        <input type="password" class="form-control" id="pw2" v-model="password2" required>
        <small style="color:red" v-if="passwordError">Lozinke se ne poklapaju!</small>
    </div>
    <div class="form-group">
    <label for="uloga">Uloga</label>
    
    <select v-model="userToAdd.uloga" class="form-control" required>
        <option>admin</option>
        <option>korisnik</option>
    </select>
    <small style="color:red" v-if="roleError">Morate odabrati ulogu!</small>
    </div>
    

    <button class="btn btn-primary" v-on:click="dodaj()" type="button">Dodaj</button>
    </form>





</div>
</div>
`
    ,
    methods: {
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
            this.roleError = false;
            this.orgError = false;

        }
        ,

        formValid() {
            this.resetErrors();
            let valid = true;

            if (this.password2 !== this.userToAdd.password) {
                this.passwordError = true;
                valid = false;
            }
            if (this.userToAdd.email == "" || !this.validateEmail(this.userToAdd.email)) {
                this.emailError = true;
                valid = false;
            }

            if (this.userToAdd.ime == "") {
                this.firstNameError = true;
                valid = false;
            }
            if (this.userToAdd.prezime == "") {
                this.lastNameError = true;
                valid = false;
            }
            if (this.userToAdd.uloga == "") {
                this.roleError = true;
                valid = false;
            }
            if (this.userToAdd.organizacija.ime == "") {
                this.orgError = true;
                valid = false;
            }
            if (this.userToAdd.password.length < 6) {
                this.passwordShortError = true;
                valid = false;
            }

            return valid;

        },
        dodaj() {


            if (!this.formValid())
                return;

            this.organizacije.map(el => {
                if (el.ime == this.userToAdd.organizacija)
                    this.userToAdd.organizacija = el;
            })

            axios
                .post("/rest/users", JSON.stringify(this.userToAdd))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/korisnici");
                }).catch(e => {
                    console.log(e.response);
                });
        },

    },
    mounted() {

        axios.get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
            });
        axios.get('rest/organizacija/all')
            .then((response) => {
                if (Array.isArray(response.data.length))
                    this.organizacije = response.data;
                else
                    this.organizacije = [...this.organizacije, response.data];
                console.log(this.organizacije);
            })
            .catch((error) => {
                if (error.response.status == 400)
                    alert("Nemate privilegije za to.");
            });
    }
});