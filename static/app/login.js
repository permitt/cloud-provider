Vue.component('log-in', {
    data: function () {
        return {
            currentUser: null,
            input: {
                email: "",
                password: ""
            }
        }
    },
    template: `
<div style="margin:150px">
<h2>Prijava</h2>

<table class="table" >
    
        <tr>
            <td>E-mail</td>
            <td><input v-model="input.email" required id="email" type="text" name="txt_email"></td>
        </tr>
        <tr>
            <td>Lozinka</td>
            <td><input v-model="input.password" required id="pw" type="password" name="txt_password"></td>
        </tr>
        <tr>
            <td></td>
            <td><button v-on:click="logIn">Prijava</button></td>
        </tr>

</table>

	
</div>`
    ,
    methods: {
        init: function () {
            this.currentUser = null;
            this.input = { email: "", password: "" };
        },
        logIn: function () {

            if (this.input.email == "" || this.input.password == "") {
                alert("Fields must not be empty!");
                return;
            }
            axios.post(
                'rest/users/login', {
                email: this.input.email,
                password: this.input.password
            }
            ).then(
                function (response) {
                    if (response.data == "OK") {
                        window.location.replace("/");
                    } else {
                        alert(response.data);
                    }
                }
            )
        }
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data));

    }
});