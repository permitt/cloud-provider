Vue.component('novi-disk', {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            ime: this.$route.params.ime,
            VMs: [],
            diskToAdd: {
                ime: "",
                tip: "HDD",
                kapacitet: 1,
                vm: "",
                organizacija: { ime: "" }
            },
            imeUnikatError: false,
            imeError: false,
            vmError: false,

        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin:30px 0;">
    <h3>Novi disk</h3>
    <form>

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="diskToAdd.ime" required>
    <small style="color:red" v-if="imeError">Morate unijeti ime!</small>
    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Disk s tim imenom vec postoji!</small>
    </div>    


    <div class="form-group">
    <label for="tip">Tip</label>

    <select v-model="diskToAdd.tip" class="form-control" id="tip" required>
        <option>HDD</option>
        <option>SDD</option>
    </select>
    
    </div>

    <div class="form-group">
        <label for="ime">Kapacitet:</label> <template v-model="diskToAdd.kapacitet">{{diskToAdd.kapacitet}}GB</template>
        <input v-model="diskToAdd.kapacitet" type="range" class="custom-range" min="1" max="2000" step="1" id="customRange3" required >
    </div>
   
    <div class="form-group">
    <label for="vm">VM</label>
    <select v-model="diskToAdd.vm" class="form-control" required>
        <option v-for="v in VMs" v-bind:id="v.ime">{{v.ime}}</option>
    </select>
    <small v-if="vmError" style="color:red">Morate odabrati virtuelnu masinu!</small>
    </div>

    <button type="button" class="btn btn-primary" v-on:click="dodaj()">Dodaj</button>
    
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
            this.vmError = false;

            if (this.diskToAdd.ime == "") {
                this.imeError = true;
                valid = false;
            }

            if (this.diskToAdd.vm.ime == "") {
                this.vmError = true;
                valid = false;
            }

            return valid;
        },
        dodaj() {

            if (!this.formValid())
                return;


            this.diskToAdd.organizacija = this.diskToAdd.vm.organizacija;


            axios
                .post("/rest/diskovi", JSON.stringify(this.diskToAdd))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/diskovi");
                }).catch(e => {
                    if (e.response.status == 400)
                        this.imeUnikatError = true;
                });
        },

    },
    mounted() {

        axios.get('rest/users/current')
            .then(response => (this.currentUser = response.data));
        axios.get("rest/vm/all")
            .then(response => {
                console.log(response.data);
                this.VMs = response.data;
            })
            .catch(e => {
                console.log(e.response);
            });
    }
});