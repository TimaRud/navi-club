import { createRouter, createWebHistory } from 'vue-router'

import U_LoginPage from './components/views/U_LoginPage.vue';
import U_RegistrationPage from './components/views/U_RegistrationPage.vue';
import U_HomePage from './components/views/U_HomePage.vue';
import U_GamingEquipmentPage from './components/views/U_GamingEquipmentPage.vue';
import U_NewsPage from './components/views/U_NewsPage.vue';
import U_AboutUs from './components/views/U_AboutUs.vue';



export default createRouter({
    // История переходов сохраняется 
    history: createWebHistory(),
    
    // Роуты и компоненты
    routes: [
        {
            name: 'home',
            path: '/',
            component: U_HomePage
        },
        {
            name: 'gaiming_equipment',
            path: '/gaiming_equipment',
            component: U_GamingEquipmentPage
        },
        {
            name: 'news',
            path: '/news',
            component: U_NewsPage
        },
        {
            name: 'about',
            path: '/about',
            component: U_AboutUs
        },
        {
            name: 'login',
            path: '/login',
            component: U_LoginPage
        },
        {
            name: 'registration',
            path: '/registration',
            component: U_RegistrationPage
        },

    ]
});