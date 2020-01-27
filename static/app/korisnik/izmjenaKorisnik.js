Vue.component('korisnik-edit', {
    data: function () {
        return {
            currentUser: null,
            userToEdit: $route.params.email
        };
    },
    template: `
    
    
    
    
    
    `,
    methods: {


    },
    mounted() {
        axios.get('rest/users/current')
            .then(response => (this.currentUser = response.data));

    }
});