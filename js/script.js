// Подключаем плагины для валидации, роутинга и работы с сервером

Vue.use(window.vuelidate.default);
Vue.use(VueRouter);
Vue.use(VueResource);

const {
    required,
    minLength
} = window.validators;

// шаг 1
const step1 = {
    data: function () {
        return {
            typeActive: 'ИП',
            typeList: ['ООО', 'ИП'],
            nameOrg: '',
            inn: '',
            ogrnip: '',
            ogrn: '',
            kpp: '',
        }
    },
    template: `
    <form action="" class="mb-5">
        <h2 class="mb-5">Шаг 1. Плательщик</h2>
        <div class="form-group">
            <label for="typeStep1" ref="inputnumber">Тип</label>
            <select class="form-control" id="typeStep1" v-model="typeActive">
                <option v-for="type in typeList">{{type}}</option>
            </select>
        </div>
        <input-text v-model="nameOrg" :error="$v.nameOrg.$invalid" name="Наименование" idinput="nameOrg"></input-text>
        <input-number v-model="inn" :error="$v.inn.$invalid" name="ИНН" idinput="inn" minlen="12"></input-number>
        <input-number v-model="ogrnip" :error="$v.ogrnip.$invalid" name="ОГРНИП" idinput="ogrnip" minlen="15" v-if="typeActive === 'ИП'"></input-number>
        <input-number v-model="ogrn" :error="$v.ogrn.$invalid" name="ОГРН" idinput="ogrn" minlen="13" v-if="typeActive === 'ООО'"></input-number>
        <input-number v-model="kpp" :error="$v.kpp.$invalid" name="КПП" idinput="kpp" minlen="9" v-if="typeActive === 'ООО'"></input-number>
        <button class="btn btn-lg btn-success mt-3" type="submit" @click.prevent="nextStep">Следующий шаг</button>
    </form>
    `,
    methods: {
        nextStep: function () {
            $('.input-number').focus().blur();
            $('.input-text').focus().blur();

            if (this.$v.$invalid) {
                return false;
            }
            
            this.$router.push('/step2');
            mainapp.step2lock = false;
        },
        loadStep1: function () {
            this.$http.get('/db/step.json')
                .then(response => {
                    return response.json()
                })
                .then(form => {
                    this.nameOrg = form.step1.nameOrg;
                    this.inn = form.step1.inn;
                    this.ogrnip = form.step1.ogrnip;
                    this.ogrn = form.step1.ogrn;
                    this.kpp = form.step1.kpp;
                })
        }
    },
    created: function () {
        this.loadStep1();
    },
    validations: function () {
        return {
            nameOrg: {
                required
            },
            inn: {
                required,
                minLength: minLength(12)
            },
            ogrnip: {
                required,
                minLength: minLength(15)
            },
            ogrn: {
                required,
                minLength: minLength(13)
            },
            kpp: {
                required,
                minLength: minLength(9)
            },
        }
    }
};


// шаг 2
const step2 = {
    data: function () {
        return {
            typeActive: 'ИП',
            typeList: ['ООО', 'ИП'],
            buyernameOrg: '',
            innbuyer: '',
            phone: '',
        }
    },
    template: `
    <form action="" class="mb-5">
        <h2 class="mb-5">Шаг 2. Покупатель</h2>
        <div class="form-group">
            <label for="typeStep2" ref="inputnumber">Тип</label>
            <select class="form-control" id="typeStep2" v-model="typeActive">
                <option v-for="type in typeList">{{type}}</option>
            </select>
        </div>
        <input-text v-model="buyernameOrg" :error="$v.buyernameOrg.$invalid" name="Наименование" idinput="buyernameOrg"></input-text>
        <input-number v-model="innbuyer" :error="$v.innbuyer.$invalid" name="ИНН" idinput="innbuyer" minlen="12"></input-number>
        <input-text v-model="phone" :error="$v.phone.$invalid" name="Телефон" idinput="phone"></input-text>
        <button class="btn btn-lg btn-success mt-2" type="submit" @click.prevent="nextStep">Следующий шаг</button>
    </form>
    `,
    methods: {
        nextStep: function () {
            $('.input-number').focus().blur();
            $('.input-text').focus().blur();

            if (this.$v.$invalid) {
                return false;
            }
            
            this.$router.push('/step3');
            mainapp.step3lock = false;
        },
        loadStep2: function () {
            console.log('mask');
            this.$http.get('/db/step.json')
                .then(response => {
                    return response.json()
                })
                .then(cars => {
                    this.buyernameOrg = cars.step2.buyernameOrg;
                    this.innbuyer = cars.step2.innbuyer;
                    this.phone = cars.step2.phone;
                })
                .then(response => {
                    $("#phone").mask('+7 (000) 000 - 00 - 00');
                })
        }
    },
    created: function () {
        this.loadStep2();
    },
    validations: function () {
        return {
            buyernameOrg: {
                required
            },
            innbuyer: {
                required,
                minLength: minLength(12)
            },
            phone: {
                required,
            }
        }
    }
};



// шаг 3
const step3 = {
    template: `
    <div class="text-center">
        <h2 class="mt-5 mb-5">Шаг 3. Документ</h2>
        <button class="btn btn-success btn-lg">Сформировать документ !</button>
    </div>
    `
}


// роутинг
const routes = [{
        path: '/',
        component: step1
    },
    {
        path: '/step2',
        component: step2
    },
    {
        path: '/step3',
        component: step3
    }
]


const router = new VueRouter({
    routes, // сокращённая запись для `routes: routes`
    mode: 'history'
})


// компонент числового инпута
Vue.component('input-number', {
    template: `
    <div class="form-group">
        <label :for="idinput">{{ name }}</label>
        <input :id="idinput" type="number" 
        class="form-control input-number"
        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        :class="{'is-invalid': error}"
        :maxlength="minlen">
        <div class="invalid-feedback" v-if="error">
        {{ name }} должен содержать {{ minlen }} чисел. Сейчас {{ value.length }}.
        </div>
    </div>
    `,
    props: ['name', 'idinput', 'minlen', 'value', 'error']
});

// компонент текстового инпута
Vue.component('input-text', {
    template: `
    <div class="form-group">
        <label :for="idinput">{{ name }}</label>
        <input :id="idinput" type="text" 
        class="form-control input-text"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
        :class="{'is-invalid': error}">
        <div class="invalid-feedback" v-if="error">
        Поле "{{ name }}" должно быть заполнено.
        </div>
    </div>
    `,
    props: ['name', 'idinput', 'value', 'error']
});


// инициализация основного приложения
var mainapp = new Vue({
    el: '#app',
    router,
    data: {
        step2lock: true,
        step3lock: true,
    }
});