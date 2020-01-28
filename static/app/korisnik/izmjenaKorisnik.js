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
            password2: ""
        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3>Korisnik : {{this.userToEdit.ime}} {{this.userToEdit.prezime}} </h3>
    <form class="needs-validation novalidate" @onSubmit="sacuvaj">
    <div class="form-group">
        <label for="exampleInputEmail1">Email adresa</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="userToEdit.email" readonly >
        
      </div>
    <div class="form-group">
      <label for="organizacija">Organizacija</label>
      <input type="text" class="form-control" id="organizacija" v-model="userToEdit.organizacija.ime" readonly/>
    </div>

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="userToEdit.ime" required>
    </div>

    <div class="form-group">
    <label for="prezime">Prezime</label>
    <input type="text" class="form-control" id="prezime" v-model="userToEdit.prezime" required>
    </div>

    <div class="form-group">
        <label for="ime">Password</label>
        <input type="password" class="form-control" id="pw" v-model="userToEdit.password" required>
    </div>
    <div class="form-group">
        <label for="ime">Password ponovo</label>
        <input type="password" class="form-control" id="pw2" v-model="password2" required>
        <small v-if="passwordError">Passwords don't match!</small>
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
        formValid() {
            if (this.password2 !== this.userToEdit.password) {
                this.passwordError = true;
                return false;
            } else if (this.userToEdit.ime == "" || this.userToEdit.prezime == "" || this.password == "" || this.userToEdit.uloga == "")
                return false;
            else
                return true;
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