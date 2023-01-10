const { createApp } = Vue;


const app = {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
        }
    },

    methods: {
        login() {
            const emailInput = document.querySelector("#username");
            const passInput = document.querySelector("#password");
            const username = emailInput.value;
            const password = passInput.value;
            const url = "https://vue3-course-api.hexschool.io/v2";
            const path = "practiceapi";
            const user = {
                username,
                password
            };
            console.log(user)
            axios.post(`${url}/admin/signin`, user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexSchool = ${token};
                    expires = ${expired}`
                    window.location = './product.html';
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    },

    mounted() {
        console.log("init");
    }
}

createApp(app)
    .mount('#app');


