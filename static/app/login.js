Vue.component('log-in', {
    data: function () {
        return {
            currentUser: null,
        }
    },
    template: ` 
<div>
<h2>Prijava</h2>
<table>
    <form id="loginForm">
        <tr>
            <td>Korisničko ime</td>
            <td><input required id="username" type="text" name="txt_username"></td>
        </tr>
        <tr>
            <td>Lozinka</td>
            <td><input required id="pw" type="password" name="txt_password"></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" name="btn_login" value="Prijava" onclick="login()" id="dugme"></td>
        </tr>
    </form>
</table>

	
</div>`
    ,
    methods: {
        init: function () {
            this.currentUser = null;

        },
        // clearSc: function () {
        //     if (confirm('Da li ste sigurni?') == true) {
        //         axios
        //             .post('rest/proizvodi/clearSc')
        //             .then(response => (this.init()))
        //     }
        // }
    },
    mounted() {
        axios
            .get('rest/users/current')
            .then(response => (this.currentUser = response.data));

    }
});