const { createApp } = Vue;
import pagination from "./pagination.js";

let productModal = null;
let delProductModal = null;
const app = createApp({
    data() {
        return {
            products: [],
            isNew: true,
            tempProduct: {
                imagesUrl: [],
            },
            page: {}
        }
    },

    methods: {
        checkAdmin() {
            axios.post(`${url}/api/user/check`)
                .then(() => {
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message)
                    window.location = './index.html';
                })
        },
        openModal(isNew, item) {
            if (isNew === "new") {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === "edit") {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        getData(page = 1) { //預設參數
            axios.get(`https://vue3-course-api.hexschool.io/v2/api/${path}/admin/products/?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.page = res.data.pagination;
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },
        updateProduct() {
            let http = "post";
            let api = `${url}/api/${path}/admin/product`

            if (!this.isNew) {
                http = "put";
                api = `${url}/api/${path}/admin/product/${this.tempProduct.id}`
            }
            axios[http](api, {
                data: this.tempProduct
            }).then((response) => {
                alert(response.data.message);
                productModal.hide();
                this.getData();
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },
        delProduct() {
            axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
                .then((res) => {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                })
        },

        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },

    components: {
        pagination
    },

    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexSchool\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();

    }
})

app.component('product-modal',{
    props:['tempProduct','products','isNew','updateProduct'],
    template:'#product-modal-template',
})

app.mount('#app');

