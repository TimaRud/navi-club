<script>
import C_IsNotAuth from '../C_IsNotAuth.vue';

import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000"

export default {
  components: {
    C_IsNotAuth,
  },
  inject: ['setUser', 'checkAuth'],
  data() {
    return {
      ShowPassword: false,

      EmailIsValid: false,
      PasswordIsValid: false,

      Auth: {
        isChecked: false, // Добавляем начальное значение
        user: null
      },

      ErrorCode: null,
      ErrorMessage: '',
    }
  },
  methods: {
    ToCatalog() {
      this.$router.push({ name: "catalog" });
    },
    Input_InputEvent(event) {
      // Регистрация поля ввода
      const Input = event.target;

      const Label = Input.labels[0];
      const LabelContainer = Label.closest('.label-container');

      console.log("Полученный элемент:"); console.log(Input);


      // Проверка на пустоту 
      if (Input.value == "" || Input.value == null) {
        Input.classList.remove('invalid');
        Input.classList.remove('valid');

        LabelContainer.classList.add('hidden');

        console.log("Поле ввода пусто > Стили убраны.");

        return
      }


      // Определения типа поля ввода 
      // EMAIL
      if (Input.id == "Input_Email") {
        const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const hasRussianLetters = /[а-яёА-ЯЁ]/.test(Input.value); // улучшенное регулярное выражение
        const hasWhitespace = /\s/.test(Input.value);
        const hasDoubleDots = /\.{2,}/.test(Input.value);
        const domainValid = /\.[a-zA-Z]{2,}$/.test(Input.value);

        if (hasRussianLetters) {
          Label.innerHTML = "Допустимо содержание только латинских символов"
        } else if (hasWhitespace) {
          Label.innerHTML = "Уберите пробелы в email";
        } else if (hasDoubleDots) {
          Label.innerHTML = "Недопустим двойной символ точки";
        } else if (!Input.value.includes('@')) {
          Label.innerHTML = "Добавьте @ в email адрес";
        } else if (!domainValid) {
          Label.innerHTML = "Некорректный домен (пример: .com .ru)";
        }

        this.EmailIsValid = this.InputValidation(Input, Regex, LabelContainer);

      }
      else if (Input.id == "Input_Password") {
        const Regex = /^[A-Za-z0-9!@#$%^&*_=+-]{8,20}$/;

        const hasRussianLetters = /[а-яёА-ЯЁ]/.test(Input.value); // улучшенное регулярное выражение
        
        if (hasRussianLetters) {
          Label.innerHTML = "Допустимо содержание только латинских символов"
        } else if (Input.value.length < 8) {
          Label.innerHTML = "Минимум 8 символов";
        } else if (Input.value.length > 20) {
          Label.innerHTML = "Максимум 20 символов";
        }

        this.PasswordIsValid = this.InputValidation(Input, Regex, LabelContainer);
      }

      console.log("Валидация поля вызвана.");

    },
    InputValidation(Input, Regex, LabelContainer) {
      console.log("Валидация поля начата.");

      const isValid = Regex.test(Input.value)

      if (isValid) {
        Input.classList.remove('invalid');
        Input.classList.add('valid');

        LabelContainer.classList.add('hidden');

        return true;
      }
      else if (!isValid) {
        Input.classList.remove('valid');
        Input.classList.add('invalid');

        LabelContainer.classList.remove('hidden');
        
        return false;
      }

    },
    async InputFinalValidation() {
      if (this.EmailIsValid && this.PasswordIsValid) {

        alert('Запрос на авторизацию отправлен')

        try {
          let response = await axios.post('/login', {
            Email: document.getElementById('Input_Email').value,
            Password: document.getElementById('Input_Password').value,
          }, 
          {
              withCredentials: true // Разрешаем передачу cookie 
          })

          if (response.status === 200) {
            alert('Авторизация успешна!');
            await this.checkAuth(); // Обновляем данные пользователя
            this.$router.push('/')
            
            // Успешный ответ (2xx)
            console.log('Статус:', response.status);
            console.log('Сообщение:', response.data.message);
          }

          console.log(response.data)

        } catch (error) {
          // Ошибка (4xx/5xx)
          if (error.response) {
            console.log('Статус ошибки:', error.response.status);
            console.log('Сообщение об ошибке:', error.response.data.message);

            if (error.response.status === 400 || error.response.status === 500) {
              alert(`Ошибка: ${error.response.data.message}`);
            }
            
          } else {
            console.error('Ошибка сети:', error.message);
          }
        }   
      }
    },
    GoToRegistration() {
      event.preventDefault();
      this.$router.push('/registration');
    },
    async CheckUserAuth() {
      try {
        const res = await axios.get('/api/me', { withCredentials: true });

        this.Auth = {
          isChecked: true,
          user: res.data.user
        };

        this.ErrorCode = 200;
        this.ErrorMessage = 'Вы уже авторизованы';
        
      } catch (error) {
        console.error('Ошибка авторизации:', error);

        this.Auth = { 
          isChecked: true, 
          user: null 
        };
      
        // Исправленная проверка ошибок
        if (error.response) {
          // Сервер ответил с 4xx/5xx статусом
          this.ErrorCode = error.response.status;
          this.ErrorMessage = error.response.data?.message || 'Ошибка сервера';

        } else if (error.request) {
          // Запрос был отправлен, но ответа нет
          this.ErrorCode = 503;
          this.ErrorMessage = 'Не удалось подключиться к серверу';

        } else {
          // Ошибка в настройке запроса
          this.ErrorCode = 500;
          this.ErrorMessage = 'Ошибка при отправке запроса';
        }
      
        console.log('Установлены коды ошибок:', this.ErrorCode, this.ErrorMessage);
      }
    }
  },
  mounted() {
    this.CheckUserAuth();
  }
}
</script>

<template>
<main v-if="!Auth.user" class="flex-col ">
  
  <form class="container flex-col blured-bg" novalidate autocomplete="off" @submit.prevent="InputFinalValidation">

    <h1 class="text-center">Вход</h1>

    <!-- Почта -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Email" class="fs-1-2rem"></label>
      </div>

      <input id="Input_Email" type="email" required placeholder="Почта" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
    </div>

    <!-- Пароль -->
    <div class="input-container">
      <div class="label-container flex-row hidden" >
        <i class="icon-eye_alert icon"></i>
        <label for="Input_Password" class="fs-1-2rem" >  </label>
      </div>

      <input id="Input_Password" type="password" required placeholder="Пароль" spellcheck="false" data-lpignore="true" 
      title="" @input="Input_InputEvent" >
      <!-- <i class="icon-eye icon"></i> -->
    </div>
    

    <button type="submit" class="button filled-white flex-row">
      <i class="icon-entrance icon"></i>
      <p class="button_text">Войти</p>
    </button>
    
    <div class="registration_route flex-row" >
      <p>Нет аккаунта?</p> 
      <a href="" class="fs-1-5rem" @click="GoToRegistration" >Регистрация</a>
    </div>
  </form>
</main>

<C_IsNotAuth v-else :ErrorCode="ErrorCode" :ErrorMessage="ErrorMessage" />
</template>

<style scoped>

main {
  height: calc(100dvh - 70px);

  justify-content: center;
  align-items: center;

  gap: 2rem;

  /* * {
    font-family: 'inherit';
  } */
}

h1 {
  font-size: 3rem;

  /* font-family: 'Marvin'; */
}

form {
  display: flex;
  width: 40dvw;

  gap: 2.5rem;

  padding: 5rem;

  border-radius: 2rem;
}

.input-container {
  position: relative;
}

/* INPUT STYLES */

input {
  --height: 3rem;
  

  width: 100%;
  height: var(--height);

  padding: 1.5rem 1.5rem 1.5rem 1.7rem;

  outline: none;

  color: var(--gray);
  background-color: var(--input-background-gray);
  border: var(--border-width) solid var(--gray);
  border-radius: 10rem;

  font-family: 'Cygre';
  font-size: 1.7rem;

  transition: border-color, color;
  transition-duration: 0.2s;

  &::selection {
    color: white;
    background-color: var(--gray);
    transition-duration: inherit;
  }

  &::placeholder {
    margin: 0;
    padding: 0;
    color: var(--gray);
    transition-duration: inherit;
  }

}


input.default {
  border-color: var(--gray);
  color: var(--gray);

  &::placeholder {
    color: var(--gray);
  }

  &::selection {
    background-color: var(--gray);
  }
}


input.valid {
  border-color: var(--valid);
  color: var(--valid);

  &::placeholder {
    color: var(--valid);
  }

  &::selection {
    color: black;
    background-color: var(--valid);
  }
}

input.invalid {
  border-color: var(--invalid);
  border-top-left-radius: 0px;
  color: var(--invalid);

  &::placeholder {
    color: var(--invalid);
  }

  &::selection {
    color: black;
    background-color: var(--invalid);
  }
}


input[type="password"]::-ms-reveal {
  display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-contacts-auto-fill-button {
  display: none !important;
}


.label-container {
  position: absolute;

  align-items: center;
  z-index: 2;
  top: 0;
  left: 0;
  translate: 0% -100%;
  width: 100%;

  gap: 0.5rem;

  color: var(--invalid);
  text-wrap: pretty;

}

.label-container, .label-contain i {
  opacity: 100;
  transition: opacity 0.2s;
}

.label-container.hidden, .label-container i.hidden {
  opacity: 0;
}

.registration_route.flex-row {
  gap: 1rem;
  justify-content: center;
}

.registration_route a:hover {
  transform: scale(1.1);
}

</style>