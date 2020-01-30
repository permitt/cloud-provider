Vue.component('vm-izmjena', {
    data: function () {
        return {
            currentUser: { uloga: "korisnik" },
            ime: this.$route.params.ime,
            diskoviSvi: [],
            diskoviVM: [],
            diskoviDostupni: [],
            diskUkloni: "",
            diskDodaj: "",
            kategorije: [],
            aktivnosti: [],
            aktivnostUkloni: "",
            upaljena: false,
            vmToEdit: {
                ime: "",
                tip: "",
                organizacija: { ime: "" },
                kategorija: { ime: "" },
                listaAktivnosti: [{ upaljena: "", ugasena: "" }]
            },
            imeUnikatError: false,
            imeError: false,

        };
    },
    template: `
        
<div class="container">
<div class="col-lg-8 mx-auto" style="margin:30px 0;">
    <h3>Virtuelna masina : {{this.vmToEdit.ime}} </h3>
    <form >

    <div class="form-group">
    <label for="ime">Ime</label>
    <input type="text" class="form-control" id="ime" v-model="vmToEdit.ime" required>
    <small style="color:red" v-if="imeError">Morate unijeti ime!</small>
    <small style="color:red;fontSize:15px" v-if="imeUnikatError">Virtuelna masina s tim imenom vec postoji!</small>
    </div>

    <div class="form-group">
    <label for="org">Organizacija</label>
    <input type="text" class="form-control" id="org" v-model="vmToEdit.organizacija.ime" readonly>
    </div>



    <div class="form-group">
    <label for="tip">Lista Aktivnosti</label>
    <div class="input-group">
    <select v-model="aktivnostUkloni" class="form-control" id="listaAktivnosti" required>
        <option v-for="a in aktivnosti" v-bind:id="a">{{a.upaljena}} - {{a.ugasena}}</option>
    </select>
    <button style="margin-left:5px" v-if="currentUser.uloga == 'superadmin'" type="button" class="btn btn-outline-danger" v-on:click="ukloniAktivnost()">Ukloni</button>
    </div>
    
    </div>

    <div class="form-group">
    <label for="kat">Kategorija</label>
    <select id="kat" v-model="vmToEdit.kategorija.ime" class="form-control" required>
        <option v-for="k in kategorije" v-bind:id="k.ime">{{k.ime}}</option>
    </select>
    
    </div>
    

    <div class="form-group">
    <label for="vmDiskovi">Diskovi u VM</label>
    <div class="input-group">
    <select id="vmDiskovi" v-model="diskUkloni" class="form-control" required>
        <option v-for="d in diskoviVM" v-bind:id="d">{{d.ime}}</option>
    </select>
    <button style="margin-left:5px" v-if="currentUser.uloga != 'korisnik'" type="button" class="btn btn-outline-danger" v-on:click="ukloniDisk()">Ukloni</button>
    </div>
    </div>


    <div class="form-group">
    <label for="diskoviDostupniSelect">Diskovi dostupni</label>
    <div class="input-group">
    <select id="diskoviDostupniSelect" v-model="diskDodaj" class="form-control" required>
        <option v-for="d in diskoviDostupni" v-bind:id="d">{{d.ime}}</option>
    </select>
    
    <button style="margin-left:5px;" v-if="currentUser.uloga != 'korisnik'" type="button" class="btn btn-outline-success" v-on:click="dodajDisk()">Dodaj</button>
    
    </div>
    </div>

    
    <button v-if="currentUser.uloga != 'korisnik'" type="button" class="btn btn-primary" v-on:click="sacuvaj()">Sacuvaj</button>
    <button v-if="currentUser.uloga != 'korisnik'" v-on:click="izbrisi()" type="button" class="btn btn-danger">Obrisi</button>
    <button v-if="currentUser.uloga != 'korisnik' && !upaljena" v-on:click="upali()" type="button" class="btn btn-success">Upali</button>
    <button v-if="currentUser.uloga != 'korisnik' && upaljena" v-on:click="ugasi()" type="button" class="btn btn-danger">Ugasi</button>
    </form>





</div>
</div>
`
    ,
    methods: {
        formValid() {
            this.imeError = false;
            this.imeUnikatError = false;
            if (this.vmToEdit.ime == "") {
                this.imeError = true;
                return false;
            }

            return true;
        },
        sacuvaj() {

            if (!this.formValid())
                return;



            this.vmToEdit.diskovi = [...this.diskoviVM];
            console.log(JSON.stringify(this.vmToEdit));

            axios
                .put("/rest/vm/" + this.ime, JSON.stringify(this.vmToEdit))
                .then(response => {
                    if (response.data == "OK")
                        router.replace("/");
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
        ,
        dodajDisk() {
            if (this.diskoviDostupni.length < 1) {
                alert("Nema vise dostupnih diskova!");
                return;
            }
            this.diskoviVM.push(this.diskoviSvi.filter(el => el.ime === this.diskDodaj).pop());
            this.diskoviDostupni = this.diskoviDostupni.filter(el => el.ime != this.diskDodaj);
        },
        ukloniDisk() {
            if (this.diskoviVM.length < 1) {
                alert("Nema vise diskova u VM!");
                return;
            }
            this.diskoviDostupni.push(this.diskoviSvi.filter(el => el.ime === this.diskUkloni).pop());
            this.diskoviVM = this.diskoviVM.filter(el => el.ime !== this.diskUkloni);
        },
        ukloniAktivnost() {

            if (this.vmToEdit.listaAktivnosti.length == 0) {
                alert("Nema vise aktivnosti!");
                return;
            }
            if (this.aktivnostUkloni.length < 27) {
                this.ugasi();
            }

            this.vmToEdit.listaAktivnosti = this.vmToEdit.listaAktivnosti.filter(akt => {
                return this.aktivnostUkloni.search(akt.upaljena) != 0;
            });
            this.aktivnosti = this.aktivnosti.filter(akt => {
                return this.aktivnostUkloni.search(akt.upaljena) != 0;
            });


        },
        upali() {
            let d = new Date().toString().split("GMT")[0]
            let aktivnost = { upaljena: d };
            this.aktivnosti.push(aktivnost);
            this.vmToEdit.listaAktivnosti.push(aktivnost);
            this.upaljena = true;

        },
        ugasi() {
            let d = new Date().toString().split("GMT")[0]
            let n = this.vmToEdit.listaAktivnosti.length;
            this.vmToEdit.listaAktivnosti[n - 1].ugasena = d;
            this.aktivnosti[n - 1].ugasena = d;

            this.upaljena = false;

        }

    },
    async mounted() {

        axios.get('rest/users/current')
            .then(response => {
                this.currentUser = response.data;
                if (this.currentUser.uloga == "korisnik") {
                    document.querySelector("#ime").setAttribute("readonly", "true");
                    document.querySelector("#customRange3").setAttribute("readonly", "true");
                    document.querySelector("#tip").setAttribute("readonly", "true");
                    document.querySelector("#vmForm").setAttribute("readonly", "true");
                }
            });
        axios.get('rest/vm/' + this.ime)
            .then((response) => {
                this.vmToEdit = response.data;
                this.aktivnosti = [...response.data.listaAktivnosti];

                if (response.data.listaAktivnosti[response.data.listaAktivnosti.length - 1].ugasena == undefined)
                    this.upaljena = true;
                else
                    this.upaljena = false;
            })
            .catch((error) => {
                if (error.response.status == 400)
                    alert("Nije nadjena virtuelna masina s imenom: " + this.ime);
            });

        axios.get('rest/kategorija/all')
            .then(response => {
                this.kategorije = response.data;
            })
            .catch(e => console.log(e));

        const diskoviVM = await axios.get("rest/vm/" + this.ime + "/diskovi");
        const diskoviSvi = await axios.get("rest/diskovi/all/list");
        this.diskoviVM = diskoviVM.data;
        this.diskoviSvi = diskoviSvi.data;

        this.diskoviDostupni = diskoviSvi.data.filter(el => {
            var valid = false;
            this.diskoviVM.forEach(v => {
                if (v.ime === el.ime) {
                    valid = false;
                    return valid;
                }
                else {
                    valid = true;
                    return valid;
                }
            });
            return valid;
        });


    }
});