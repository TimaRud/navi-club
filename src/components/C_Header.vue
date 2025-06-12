<script>

export default {
  components: {},
  props: ['user'],
  data() {
    return {

    };
  },
  methods: {
    initTilt() {
      // Используем nextTick для гарантии рендеринга DOM
      this.$nextTick(() => {
        
        // Инициализация для всех элементов с классом tilt-element
        const elements = document.querySelectorAll(".tilt-element");
        if (elements.length > 0) {
          VanillaTilt.init(elements, {
            reverse: true,
            max: 10,
            perspective: 2000,
            speed: 2000,
            transition: true,
            scale: 1.05,
            glare: false,
            "max-glare": 0.10,
          });
        }
        // Инициализация для всех обратных элементов с классом tilt-element-reversed
        const elements_reversed = document.querySelectorAll(".tilt-element-reversed");
        if (elements_reversed.length > 0) {
          VanillaTilt.init(elements_reversed, {
            reverse: false,
            max: 10,
            perspective: 2500,
            speed: 2000,
            transition: true,
            scale: 1.05,
            glare: false,
            "max-glare": 0.10,
          });
        }
      });
    },
    GoToHome() {
      this.$router.push('/')
    },
    GoToGaimingEquipment() {
      this.$router.push('/gaiming_equipment')
    },
    GoToNews() {
      this.$router.push('/news')
    },
    GoToAbout() {
      this.$router.push('/about')
    },
    GoToLogin() {
      this.$router.push('/login')
    },
    GoToRegistration() {
      this.$router.push('/registration')
    },
    LogoutRequest() {
      this.$emit('LogoutRequest');
    }
  }
}

</script>

<template>
  <header class="flex-row">
    

    <nav class="flex-row">
      <div class="img-container">
        <img
          class="logo" alt="Логотип"
          src="https://upload.wikimedia.org/wikipedia/ru/thumb/5/5f/NAVI_Logo.svg/1024px-NAVI_Logo.svg.png?20210801201705"
          @click="GoToHome()"
        />
      </div>
      

      <a class="button flex-row" :class="{'selected': $route.name == 'home'}" @click="GoToHome()">
        <i class="icon-home icon"></i>
        <p class="button_text">Главная</p>
      </a>

      <a class="button  flex-row " :class="{'selected': $route.name == 'gaiming_equipment'}" @click="GoToGaimingEquipment()">
        <i class="icon-computer icon"></i>
        <p class="button_text">Бронирование</p>
      </a>

      <a class="button  flex-row " :class="{'selected': $route.name == 'news'}" @click="GoToNews()">
        <i class="icon-news icon"></i>
        <p class="button_text">Новости</p>
      </a>

      <a class="button flex-row" :class="{'selected': $route.name == 'about'}"  @click="GoToAbout()">
        <i class="icon-info icon"></i>
        <p class="button_text">О нас</p>
      </a>

      <a v-if="user" class="button outlined flex-row" @click="LogoutRequest">
        <i class="icon-user icon"></i>
        <p class="button_text">{{ user.Name }} {{ user.Surname }}</p>
      </a>

      <a v-if="!user" class="button flex-row" :class="{'selected': $route.name == 'login'}"  
      @click="GoToLogin()">
        <i class="icon-entrance icon"></i>
        <p class="button_text">Вход</p>
      </a>

      <a v-if="!user" class="button flex-row" :class="{'selected': $route.name == 'registration'}"  @click="GoToRegistration()">
        <i class="icon-user_add icon"></i>
        <p class="button_text">Регистрация</p>
      </a>
      
    </nav>
  </header>
</template>

<style scoped>
/* ========================= HEADER ========================= */

header {
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 1;

  justify-items: center;
  align-items: center;
  justify-content: space-between;

  width: auto;
  height: var(--header-height);

  padding: 0px 120px;

  background-color: rgb(0,0,0, 0.7);
  backdrop-filter: blur(0.5rem);
  /* filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.2)); */
}



/* ------------- Nav ------------- */
nav {
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  /* gap: 0.5rem; */
}


.img-container {
  margin-right: auto;

  height: 100%;
}

.logo {
  cursor: pointer;

  height: 110%;

  filter: saturate(0%);
  rotate: 19.5deg;
}

a:nth-child(6) {
  margin-left: auto;
}

.button_text {
  padding-top: 0.3rem;

  font-size: 1.3rem;
  letter-spacing: 0.1rem;
}

</style>