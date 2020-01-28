Vue.component('korisnici-izmjena', {
    data: function () {
        return {
            currentUser: null,
            email: this.$route.params.email,
            userToEdit: null
        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3>Korisnik : {{this.userToEdit.ime}} {{this.userToEdit.prezime}} </h3>
    <form>
    <div class="form-group">
        <label for="exampleInputEmail1">Email adresa</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="this.userToEdit.email" readonly >
        
      </div>
    <div class="form-group">
      <label for="organizacija">Organizacija</label>
      <input type="text" class="form-control" id="organizacija" v-model="this.userToEdit.organizacija.ime" readonly>
    </div>

    <div class="form-group">
        <label for="ime">Ime</label>
        <input type="text" class="form-control" id="ime" v-model="this.userToEdit.ime" required>
    </div>
    <div class="form-group">
        <label for="ime">Password</label>
        <input type="password" class="form-control" id="pw" v-model="this.userToEdit.password" required>
    </div>
    <div class="form-group">
        <label for="ime">Password ponovo</label>
        <input type="password" class="form-control" id="pw2" v-model="this.userToEdit.password" required>
   
    <div class="form-group">
    <label for="uloga">Uloga</label>
    
    <select v-model="this.userToEdit.uloga" class="form-control" required>
        <option>admin</option>
        <option>korisnik</option>
    </select>
    </div>
    <button type="submit" class="btn btn-primary" v-on:click="sacuvaj()">Sacuvaj</button>
    <a href="#" type="submit" class="btn btn-danger">Obrisi</a>
    </form>





</div>
</div>
    
    `,
    methods: {
        sacuvaj() {
            axios
                .post("/rest/users", JSON.stringify(userToEdit))
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