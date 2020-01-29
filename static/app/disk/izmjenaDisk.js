Vue.component('diskovi-izmjena', {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            ime: this.$route.params.ime,
            VMs: [],
            diskToEdit: {
                ime: "",
                tip: "",
                kapacitet: 0,
                vm: { ime: "" },
                organizacija: { ime: "" }
            },
            imeUnikatError: false,
            imeError: false,

        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin-top:30px">
    <h3>Disk : {{this.diskToEdit.ime}} </h3>
    <form >

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="diskToEdit.ime" required>
    <small style="color:red" v-if="imeError">Morate unijeti ime!</small>
    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Disk s tim imenom vec postoji!</small>
    </div>

    <div class="form-group">
    <label for="org">Organizacija</label>
    <input type="text" class="form-control" id="org" v-model="diskToEdit.organizacija.ime" readonly>
    </div>


    <div class="form-group">
    <label for="tip">Tip</label>

    <select v-model="diskToEdit.tip" class="form-control" id="tip" required>
        <option>HDD</option>
        <option>SDD</option>
    </select>
    
    </div>

    <div class="form-group">
        <label for="ime">Kapacitet:</label> <template v-model="diskToEdit.kapacitet">{{diskToEdit.kapacitet}}GB</template>
        <input v-model="diskToEdit.kapacitet" type="range" class="custom-range" min="0" max="1000" step="1" id="customRange3" required >
    </div>
   
    <div class="form-group">
    <label for="vm">VM</label>
    <select v-model="diskToEdit.vm.ime" class="form-control" required>
        <option v-for="v in VMs" v-bind="v.ime">{{v.ime}}</option>
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
            this.imeError = false;
            this.imeUnikatError = false;
            if (this.diskToEdit.ime == "") {
                this.imeError = true;
                return false;
            }

            return true;
        },
        sacuvaj() {

            if (!this.formValid())
                return;

            this.VMs.map(vm => {
                if (vm.ime == this.diskToEdit.vm.ime)
                    this.diskToEdit.vm = vm;
            });

            console.log(JSON.stringify(this.diskToEdit));
            axios
                .put("/rest/diskovi/" + this.ime, JSON.stringify(this.diskToEdit))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/diskovi");
                }).catch(e => {
                    if (e.response.status == 400)
                        this.imeUnikatError = true;
                });
        },
        izbrisi() {
            axios
                .delete("/rest/diskovi/" + this.ime)
                .then((response) => {
                    if (response.data == "OK")
                        router.replace("/diskovi");
                })
                .catch(e => {
                    if (e.response.status == 400)
                        alert("Disk nije moguce obrisati.");
                });

        }

    },
    mounted() {

        axios.get('rest/users/current')
            .then(response => (this.currentUser = response.data));
        axios.get('rest/diskovi/' + this.ime)
            .then((response) => {
                this.diskToEdit = response.data;
            })
            .catch((error) => {
                if (error.response.status == 400)
                    alert("Nije nadjen disk s imenom: " + this.email);
            });
        axios.get("rest/vm/all")
            .then(response => {
                console.log(response.data);
                this.VMs = [...response.data];
            })
            .catch(e => {
                console.log(e.response);
            });
    }
});