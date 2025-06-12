<script>
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000"

import C_Header from './components/C_Header.vue'
import U_HomePage from './components/views/U_HomePage.vue'
import U_LoginPage from './components/views/U_LoginPage.vue'

import { RouterView } from 'vue-router'

export default {
  components: {
    C_Header, U_LoginPage , RouterView
  },
  data() {
    return {
      user: null // Cостояние пользователя
    } 
  },
  methods: {
    // Метод для обновления данных пользователя
    setUser(userData) {
      this.user = userData;
    },
    
    // Метод для проверки авторизации
    async checkAuth() {
      try {
        const response = await axios.get('/api/me', {withCredentials: true});

        if (response.data.user) {
          this.user = response.data.user; // Если сервер возвращает массив
        }

      } catch (error) {
        this.user = null;
      }
    },
    async Logout() {
      const modal = document.querySelector('.modal')
      modal.close()

      const response = await axios.post('/logout');

      if (response.status === 200) {
        this.$router.push('/');
        this.checkAuth()
      }
      
      
    },
    OpenModal() {
      const modal = document.querySelector('.modal')
      modal.showModal()
    },
    CloseModal() {
      const modal = document.querySelector('.modal')
      modal.close()
    }
  },
  provide() {
    return {
      setUser: this.setUser, // Пробрасываем метод вниз
      checkAuth: this.checkAuth
    }
  },
  async mounted() {
    await this.checkAuth(); // Проверяем авторизацию при загрузке приложения
  }
}
</script>

<template>

  <C_Header :user="user" @LogoutRequest="OpenModal"/>

  <!-- <U_LoginPage /> -->

  <RouterView  />

  <dialog class="modal blured-bg" >
    <div class="modal-inner flex-col ">
      <!-- Текст -->
      <div class="flex-col">
        <p class="text-center">Вы авторизованы как:</p>
        <p class="username text-center" v-if="user">{{ user.Name }} {{ user.Surname }}</p>
      </div>
      
      <!-- Кнопки -->
      <div class="flex-row">
        <button type="submit" class="button outlined flex-row w100" @click="Logout" >
          <i class="icon-sign_out icon"></i>
          <p class="button_text">Выйти</p>
        </button>
        
        <button class="button outlined flex-row w100" @click="CloseModal" >
          <i class="icon-close icon"></i>
          <p class="button_text" >Закрыть</p>
        </button>
      </div>
    </div>
  </dialog>
  
</template>

<style >



/* Добавление шрифтов */
@font-face {
  font-family: "Cygre";
  src: url("./assets/fonts/Cygre-SemiBold.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "Marvin";
  src: url("./assets/fonts/MarvinVisions-Bold.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
}

/* Переменные */
:root {
  /* Числовые значения */
  --header-height: 70px;
  --FS: 1.7rem;
  --border-width: 2px;

  /* Цвета */
  --gray: rgb(90,90,90);
  --input-background-gray: rgb(100,100,100, 0.15);
  --valid: rgb(137, 184, 75);
  --invalid: rgb(250, 212, 0);
}

/* Глобальные (заранее сделанные) стили */

html::-webkit-scrollbar {
  display: none;
}

.d-none { 
  display: none !important;
}

body {
  color: #ffffff;
  /* linear-gradient(0deg, var(--background-color) 0%, var(--background-color) 100%) */
  background: url(./images/fancy-pants.jpg);
  
  background-blend-mode: darken;
  background-position: center;
  background-attachment: fixed;

  cursor: default;
  user-select: none;

  overflow-y: scroll;

  font-family: "Cygre";
}

.margin-top-bottom {
  margin-top: 60px;
  margin-bottom: 60px;
}

.wrapper {
  margin-left: 120px;
  margin-right: 120px;
}

a, p, label, li {
  font-family: 'Cygre';
  font-size: 1.6rem;
  letter-spacing: 0.1rem;
  
}

h1 {
  font-family: 'Marvin';
  font-size: 7rem;
  letter-spacing: 0.5rem;
}

h2 {
  font-family: 'Marvin';
  font-size: 3rem;
  line-height: 0.8;
  letter-spacing: 0.5rem;
}

h3 {
  font-family: 'Marvin';
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
}

h4 {
  font-family: 'Cygre';
  font-size: 1.7rem;
}


/* Быстрые фонт-сайзы */

.fs-1-2rem {
  font-size: 1rem;
}

.fs-1-5rem {
  font-size: 1.5rem;
}

.fs-2rem {
  font-size: 2rem;
}

.fs-2-5rem {
  font-size: 2.5rem;
}

.fs-3rem {
  font-size: 3rem;
}

.gap-1rem {
  gap: 1rem;
}

.gap-1-5rem {
  gap: 1.5rem;
}

.gap-2rem {
  gap: 2rem;
}

.gap-2-5rem {
  gap: 2.5rem;
}

/* КНОПКИ */

button {
  cursor: pointer;
  border: none;
  outline: none;
}

a {
  color: inherit
}

a, i, p, .button {
  transition: outline, transform, background-color, color;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.3, 0, 0.31, 0.99);
  will-change: transform; /* Оптимизация анимации */
}

/* ПУСТАЯ КНОПКА */

.button {
  justify-content: center;
  align-items: center;

  gap: 0.8rem;
  padding: 0.5rem 1.5rem;

  border-radius: 100dvw;

  background-color: rgb(255,255,255, .0);
  outline: 2px solid rgb(255, 255, 255, 0.0);
  outline-offset: -2px;
}


.button:not(.selected, .filled-dark, .filled-white, .outlined):hover {
  outline: 2px solid rgb(255, 255, 255, .2);
}

/* КНОПКА ВЫБРАНА */

.button.selected {
  color: rgb(0, 0, 0);
  background-color: rgba(255, 255, 255);
}

/* КНОПКА ЗАЛИТА ЧЕРНЫМ */

.button.filled-dark {
  border: 2px solid white;
  border-radius: 100dvw;

  color: white;
  background-color: rgb(0,0,0, 0.35);
  backdrop-filter: blur(10px);

  outline: none;
}

.button.filled-dark:hover, .button.outlined:hover {
  color: rgb(0, 0, 0);
  background-color: rgba(255, 255, 255);
}


/* КНОПКА ЗАЛИТВА БЕЛЫМ */
.button.filled-white {
  color: rgb(0, 0, 0);
  background-color: rgba(255, 255, 255);

  outline: none;
}

/* КНОПКА C ОБВОДКОЙ */
.button.outlined {
  color: rgb(255, 255, 255);
  outline: 2px solid rgb(255, 255, 255);
}

.button.filled-dark:not(.no-scale):hover, .button.outlined:not(.no-scale):hover, .button.filled-white:not(.no-scale):hover {
  transform: scale(1.1);
}

/* На случай надобности в кнопке большего размера */

.big {
  padding: 1rem;
}


.flex-col {
  display: flex !important;
  flex-flow: column nowrap;
}

.flex-row {
  display: flex !important;
  flex-flow: row nowrap;
}

.w100 {
  width: 100%;
}


.icon {
  font-size: 1.4rem;
}

.header-icon {
  font-size: 2.5rem;
}

.text-center {
  text-align: center;
}

.shadow {
  filter: drop-shadow(0 0 2rem rgb(0,0,0, 0.5));
}

.blured-bg {
  background: rgb(0,0,0, .2);
  backdrop-filter: blur(0.9rem);

  transition: background-color 0.5s;
}

.blured-bg:hover {
  background: rgb(24,24,24, .2);
  backdrop-filter: blur(0.9rem);
}

.outline-on-hover {
  outline: 3px solid rgb(255, 255, 255, 0.0);
  transition: outline 0.2s;
}

.outline-on-hover:hover {
  outline: 3px solid rgb(255, 255, 255, 0.1);
}


/* MODAL STYLE */
.modal {
  position: fixed;
  z-index: 999;

  width: 40dvw;
  
  border-radius: 1rem;
  border-style: none;
  outline: none;

  color: white;
  background-color: rgb(0,0,0, .5) !important;


  &::backdrop {
    background-color: rgba(0, 0, 0, 0.0);
    backdrop-filter: blur(10px);
  }


  .modal-inner {
    padding: 2.5rem;
    gap: 4rem;


    .username {
      font-size: 2rem;
    }

    div:last-child {
      flex-flow: row wrap;
      gap: 2rem;


      button {
        flex: 1 0 200px;
      }
    }
  }

}






/* Drop-Shadow Animtaion */

@keyframes card-float-in {
  from {
    z-index: 1;
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0));
  }
  to {
    z-index: 2;
    transform: scale(1.05);
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  }
}

@keyframes card-float-out {
  from {
    z-index: 2;
    transform: scale(1.05);
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  }
  to {
    z-index: 1;
    transform: scale(1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0));
  }
}

.dropshadow-animation {
  
  animation: card-float-out 0.15s backwards ;
  
  &:hover {
    animation: card-float-in 0.15s forwards ;
  }
}

</style>
