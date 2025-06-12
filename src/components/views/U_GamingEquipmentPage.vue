<script>
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

import VanillaTilt from "vanilla-tilt";

import MasonryLayout from "masonry-layout";

export default {
  data() {
    return {
      // Категории платформ для фильтрации
      Category_Platforms: [
        {
          NameValue: "Компьютеры",
        },
        {
          NameValue: "Консоли",
        },
        {
          NameValue: "VR",
        },
      ],
      // Категории платформ для фильтрации которые выбрал пользователь
      Selected_Category_Platforms: ["Компьютеры", "Консоли", "VR"],


      // Жанры игр для фильтрации
      Category_Genres: [
        {
          NameValue: "(Отсутствует)",
          initialValue: true
        },
        {
          NameValue: "RPG",
        },
        {
          NameValue: "Шутеры",
        },
        {
          NameValue: "Souls-like",
        },
        {
          NameValue: "Хоррор",
        },
        {
          NameValue: "Песочница",
        },
        {
          NameValue: "Приключения",
        },
        {
          NameValue: "Стратегии",
        },
        {
          NameValue: "MMO",
        },
        {
          NameValue: "Файтинги",
        },
        {
          NameValue: "Гонки",
        },
        {
          NameValue: "Экшн",
        },
        {
          NameValue: "Выживание",
        }
      ],
      // Жанры игр для фильтрации которые выбрал пользователь
      Selected_Genre: "(Отсутствует)",

      
      // Игровое оборудование получаемое с сервера
      GaimingEquipment: 
      [

      ],


      // Информация о конкретной платформе получаемая в момент нажатия по ней для бронирования
      PlatformForIroning: {
        IroningTimes: []
      },
      // Часы на которые возможно забронировать платформу
      IroningTimes: [
        {
          Time: "8:00",
          HourValue: 8,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "9:00",
          HourValue: 9,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "10:00",
          HourValue: 10,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "11:00",
          HourValue: 11,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "12:00",
          HourValue: 12,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "13:00",
          HourValue: 13,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "14:00",
          HourValue: 14,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "15:00",
          HourValue: 15,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "16:00",
          HourValue: 16,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "17:00",
          HourValue: 17,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "18:00",
          HourValue: 18,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "19:00",
          HourValue: 19,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "20:00",
          HourValue: 20,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "21:00",
          HourValue: 21,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },
        {
          Time: "22:00",
          HourValue: 22,
          disabled: false,
          isMine: false,
          isDisplayed: true,
        },

      ],

      Auth: {
        isChecked: false, // Добавляем начальное значение
        user: null
      },

      // Выбранные пользователем часы бронирования платформы
      Selected_IroningTimes: [],

      // Ironings: [
      //   {
      //     IronYear: null,
      //     IronMonth: null,
      //     IronDay: null,

      //     IroningTimes: {
      //       PlatformID: null,
      //       IronHours: []
      //     }
          
      //   }
      // ],

      SummaryIroningPrice: 0,

      AccessDenied_Text: "",
    };
  },
  methods: {
    InitMasonry() {
    },
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
    async LoadGaimingEquipment() {

      let response = await axios.get("/gaimingequipment", {
        params: {
          Selected_Category_Platforms: this.Selected_Category_Platforms,
          Selected_Genre: this.Selected_Genre

          
        }
      });

      console.log(this.Selected_Genre);

      this.GaimingEquipment = response.data;
    },
    async OpenModal(index) {
      // Получаем копию данных выбранной платформы
      this.PlatformForIroning = this.GaimingEquipment[index];

      // Получаем дату у текущего юзера что инициализировал бронирование
      let UserDate = new Date();
      // Сразу переводим Дату в Год / Месяц / День (месяца)
      let UserDateYear = UserDate.getFullYear();
      let UserDateMonth = UserDate.getMonth() + 1;
      let UserDateDate = UserDate.getDate();

      let currentHour = UserDate.getHours();
      


      // Далее проверяем есть ли у текущего "ПК" уже бронирования на текущую Дату
      // Ищем совпадения в бронированиях
      const existingBooking = this.PlatformForIroning.IroningTimes.find(booking => 
        booking.IronYear === UserDateYear && 
        booking.IronMonth === UserDateMonth && 
        booking.IronDay === UserDateDate );

      

      this.IroningTimes = this.IroningTimes.map(t => ({...t, isDisplayed: t.HourValue > currentHour }));

      // Помещаем в блок Try, т.к. у пользователя можеь вовсе не быть никаких бронирований
      try {
        // Получаем все бронирования на эту дату
        const userBooking = this.Auth.user.Ironings.find(b => 
          b.IronYear == UserDateYear &&
          b.IronMonth == UserDateMonth &&
          b.IronDay == UserDateDate
        );

        // Далее ищем среди них то, что относиться к нашей платформе
        const platformBooking = userBooking?.IroningTimes?.filter(t => t.PlatformID._id == this.PlatformForIroning._id);

        // Объединяем все часы из найденных бронирований
        const bookedHours = platformBooking.flatMap(b => b.IronHours);

        // Помечаем забронированные пользователем часы посредством смены значения на true в объекте определенного "возможного" времени бронирования
        // Помечаем часы пользователя
        this.IroningTimes.forEach(IroningTime => {
          IroningTime.isMine = bookedHours.includes(IroningTime.HourValue);
        });
      } catch {
        console.log('Нет бронирований пользователя');
      }


      this.IroningTimes.forEach(IroningTime => {
        // Помечаем занятые часы посредством смены значения на true в объекте определенного "возможного" времени бронирования
        IroningTime.disabled = existingBooking?.IronHours.includes(IroningTime.HourValue);
      });

      

      
    
      // Открытие модалки
      if (this.Auth.user) {
        const modal = document.querySelector('.modal-ironing');
        modal.showModal();
      }
      else {
        this.AccessDenied_Text = "Бронирование недоступно \n\n Необходима авторизация пользователя";

        const modal = document.querySelector('.modal-access_denied');
        modal.showModal();
      }
      
    },

    CloseModal() {

      this.Selected_IroningTimes = []

      this.PlatformForIroning = {};

      this.SummaryIroningPrice = 0;

      const modal = document.querySelector('.modal-ironing')
      modal.close()
    },

    async MakingIroning(id) {
      const modal = document.querySelector('.modal-ironing')
      modal.close()

      // Получаем дату у текущего юзера что инициализировал бронирование
      let UserDate = new Date();
      // Сразу переводим Дату в Год / Месяц / День (месяца)
      let UserDateYear = UserDate.getFullYear();
      let UserDateMonth = UserDate.getMonth() + 1;
      let UserDateDate = UserDate.getDate();
      
      // Отправка запроса об добавлении бронирования на сервер
      if (UserDate && this.Selected_IroningTimes.length > 0) {

        let response = await axios.patch('/gaiming_equipment/making_ironing', { 
          GaimingEquipment_id: id,
          Selected_IroningTimes: this.Selected_IroningTimes,
          UserDateYear: UserDateYear,
          UserDateMonth: UserDateMonth,
          UserDateDate: UserDateDate,
          User_id: this.Auth.user._id,
          SummaryIroningPrice: this.SummaryIroningPrice
        }, { withCredentials: true });

        this.LoadGaimingEquipment();

        this.CheckUserAuth();

        this.Selected_IroningTimes = [];

       

      } else if (this.Selected_IroningTimes.length == 0) {
        console.log("Выберите время для бронирования")

      }
      
    },
    ToggleTimeSelection(time) {
      if (this.Selected_IroningTimes.includes(time)) {
        this.Selected_IroningTimes = this.Selected_IroningTimes.filter(t => t !== time);
      } else {
        this.Selected_IroningTimes.push(time);
      }
    },
    OpenModal_ViewIronings() {
      // let AllUserIronings = this.Auth.user?.Ironings;

      const modal = document.querySelector('.modal-viewironing');
      modal.showModal();

    },
    CloseModal_ViewIroning() {
      const modal = document.querySelector('.modal-viewironing');
      modal.close();
    },
    CloseModal_AccessDenied() {
      const modal = document.querySelector('.modal-access_denied');
      modal.close();
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
  async mounted() {
    await this.LoadGaimingEquipment();

    await this.CheckUserAuth();

    this.InitMasonry();
  },
  computed: {
    hasAvailableHours() {
      return this.IroningTimes.some(t => t.isDisplayed);
    },
    CalculateSummaryIroningPrice() {
      switch (this.PlatformForIroning.platform) {

        case "Компьютеры":
          this.SummaryIroningPrice = this.Selected_IroningTimes.length * 150;
          break;

        case "Консоли":
          this.SummaryIroningPrice = this.Selected_IroningTimes.length * 200;
          break;

        case "VR":
          this.SummaryIroningPrice = this.Selected_IroningTimes.length * 300;
          break;
        default:
          this.SummaryIroningPrice = 0;
          break;
      }
      
    }
  },
  // Очистка при размонтировании компонента
  beforeUnmount() {
    const elements = document.querySelectorAll(".tilt-element");
    elements.forEach((element) => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    });
  },
};
</script>

<template>
  <main class="wrapper">
    <section class="platforms-container flex-col margin-top-bottom">
      <!-- Platform Card -->
      <div class="platform-card blured-bg" v-for="(Computer, index) in GaimingEquipment" @click="OpenModal(index)" >
        <div class="platform-profile flex-col">
          <h2 class="profile-order">{{ Computer.Order }}</h2>
          <h2 class="profile-model">{{ Computer.ModelName }}</h2>
          <img :src="Computer.ImagePath" alt="" />
        </div>

        <div class="platform-info flex-col">
          <div class="specifications flex-col">
            <h3>Комплектующие</h3>

            <div class="specifications-container flex-row">
              <p class="text-center" v-for="(spec, index) in Computer.Specifications"> 
                {{ spec.SpecName }} <br><br> {{ spec.SpecValue }} </p>
            </div>
          </div>

          <div class="installed-games flex-col">
            <h3>Установленные игры</h3>

            <div class="game-bullets flex-row">
              <div class="game-bullet tilt-element flex-row" 
              :class="{'filled': Selected_Genre == game.Genre}" 
              v-for="(game, index) in Computer.InstalledGames"> {{ game.Name }} </div>
            </div>
          </div>
        </div>

        <button class="ironing_button button outlined no-scale flex-row" 
        :class="{'disabled': !Auth.user}" >
          <i class="icon-booking icon"></i>
          <p class="button_text">Забронировать</p>
        </button>
      </div>


    </section>

    <section class="filters-container flex-col margin-top-bottom">

      <div class="filter-card blured-bg flex-col">
        <h3>Платформы</h3>

        <div class="content flex-col">
          <label class="flex-row" v-for="(platform, index) in Category_Platforms">
            <input class="check-box" type="checkbox" checked :value="platform.NameValue" v-model="Selected_Category_Platforms" @change="LoadGaimingEquipment()" /> {{ platform.NameValue }}
          </label>
        </div>
      </div>

      <div class="filter-card blured-bg flex-col">
        <h3>Любимый жанр</h3>

        <div class="content flex-col">
          <label class="flex-row" v-for="(Genre, index) in Category_Genres">
            <input class="radio-button" type="radio" :checked='Genre.initialValue' :value="Genre.NameValue" v-model="Selected_Genre" @change="LoadGaimingEquipment()" /> {{ Genre.NameValue }}
          </label>
        </div>
      </div>

      <a v-if="Auth.user?.Ironings" class="button filled-dark big flex-row " @click="OpenModal_ViewIronings()">
        <i class="icon-eye icon"></i> <p class="button_text">Мои бронирования</p>
      </a>
      
    </section>
  </main>



  <!-- Модальное окно бронирования -->
  <dialog class="modal-ironing blured-bg" >
    <div class="modal-inner flex-col ">

      <!-- Изображение Платформы / Текст / Кнопки -->
      <div class="platform-profile">
        <!-- Изображение Платформы -->
        <img :src="PlatformForIroning.ImagePath" alt="" />

        <!-- Текст -->
        <div class="profile-info">
          <h2 class="profile-order">{{ PlatformForIroning.Order }}</h2>
          <h2 class="profile-model">{{ PlatformForIroning.ModelName }}</h2>

          <p class="available_ironing_hours">
            Доступные часы для бронирования:
          </p>

          <!-- Кнопки -->
          <div class="ironing_time-bullets ">
            <template v-for="(IroningTime, index) in IroningTimes">
              <div 
                v-if="IroningTime.isDisplayed"
                class="ironing_time-bullet flex-row"
                :class="{ 
                  'active': Selected_IroningTimes.includes(IroningTime.HourValue),
                  'disabled': IroningTime.disabled,
                  'is_mine': IroningTime.isMine 
                }"
                @click="ToggleTimeSelection(IroningTime.HourValue); CalculateSummaryIroningPrice;"
                :key="index">

                <input type="checkbox" :value="IroningTime.HourValue" v-model="Selected_IroningTimes"  class="hidden-checkbox">
                
                {{ IroningTime.Time }}
              </div>
            </template>
          </div>
          
          <p v-if="!hasAvailableHours" class="NoAvailableIroningHours">
            Доступные часы для бронирования отсутствуют
          </p>

          <p class="SummaryIroningPrice"  :class="{'disabled': SummaryIroningPrice == 0}">
            Стоимость бронирования: {{ SummaryIroningPrice ? SummaryIroningPrice : 0 }} руб.
          </p>
          
        </div>
      </div>

      <!-- Кнопки Внизу-->
      <div class="buttons flex-row">
        <button class="button outlined flex-row w100" @click="CloseModal" >
          <i class="icon-close icon"></i>
          <p class="button_text">Закрыть</p>
        </button>
        
        <button type="submit" class="ironing_button button outlined flex-row w100" 
        :class="{'disabled': Selected_IroningTimes.length < 1}" @click="MakingIroning(PlatformForIroning._id)" >
          <i class="icon-booking icon"></i>
          <p class="button_text">Забронировать</p>
        </button>
        
      </div>
    </div>
  </dialog>



  <!-- Модальное окно пользовательских бронирований -->
  <dialog class="modal-viewironing blured-bg" >
    <div class="modal-inner flex-col ">

      <div class="user_ironings-container">

        <div class="user_ironings-by_date" v-for="(DateIroning, index) in Auth.user?.Ironings.slice().reverse()" >

          <p >
            Дата: {{DateIroning.IronDay}}/{{DateIroning.IronMonth}}/{{DateIroning.IronYear}}
          </p>

          <div class="ironing-card" v-for="(Ironing, index) in DateIroning.IroningTimes.slice().reverse()" >

            <!-- Секция Изображения Платформы -->
            <img :src="Ironing.PlatformID.ImagePath" alt="" />

            <!-- Секция Текста и Часов Бронироания -->
            <div class="profile-info">
              <h2 class="profile-order">{{ Ironing.PlatformID.Order }}</h2>
            
              <h2 class="profile-model">{{ Ironing.PlatformID.ModelName }}</h2>
            
              <div class="ironing_time-bullets">
              
                <div class="ironing_time-bullet flex-row" v-for="(IronHour, index) in Ironing.IronHours" :key="index">
                  {{ IronHour }}:00
                </div>  
              
              </div>       
            
              <p class="SummaryIroningPrice">
                Стоимость бронирования: {{ Ironing.SummaryIroningPrice }} руб.
              </p>
            
            </div>
          </div>
        </div>
      </div>


      <!-- Кнопки Внизу-->
      
      <button class="button outlined flex-row w100" @click="CloseModal_ViewIroning" >
        <i class="icon-close icon"></i>
        <p class="button_text">Закрыть</p>
      </button>
      
    </div>
  </dialog>


  <!-- Модальное окно недоступности функционала в угоду отсутствия авторизации -->
  <dialog class="modal-access_denied blured-bg" >
    <div class="modal-inner flex-col">

      
      <p style="white-space: pre-line;" class="text-center">
        {{ AccessDenied_Text }}
      </p>

      <!-- Кнопки Внизу-->
      
      <button class="button outlined flex-row w100" @click="CloseModal_AccessDenied" >
        <i class="icon-close icon"></i>
        <p class="button_text">Закрыть</p>
      </button>
      
    </div>
  </dialog>
</template>

<style scoped>
h1, h2, h3, p {
  filter: drop-shadow(0 0 1rem rgb(0, 0, 0));
}

main {
  display: grid;
  grid-template-columns: auto 400px;

  gap: 2rem;
}

/* Секции */

/* Articles */

.platforms-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
  gap: 2rem;
}

/* platform-card */

.platform-card {
  display: grid;
  grid-template-columns: minmax(200px, 400px) auto;
  height: fit-content;

  gap: 2rem;
  padding: 1.5rem;

  border-radius: 2rem;
  
  cursor: pointer;



  .ironing_button {
    grid-column: span 2;



    &.disabled {
      color: rgb(255,255,255, 0.1);
      background-color: transparent;
      outline-color: rgb(255,255,255, 0.1);
      pointer-events: none;
    }
  }
}

.platform-card p {
  font-size: 1rem;
}

/* Profile */

.platform-profile {
  gap: 1rem;
}

.platform-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.platform-card h2:not(.profile-order) {
  text-wrap: balance;

  font-size: 1.5rem;
  line-height: 1.1;
}

.profile-order {
  font-size: 1rem;

  opacity: 50%;
}

/* Specifications */

.platform-info {
  justify-content: space-between;
  gap: 2rem;
}

.specifications {
  gap: 1rem;
}

.specifications-container {
  gap: 0.5rem;
}

.specifications-container p {
  flex-grow: 1;

  padding: 1rem;

  border-radius: 1rem;
  background-color: rgb(255, 255, 255, 0.06);
}

span {
  opacity: 0.7;
}

/* Installed Games */

.installed-games {
  gap: 1rem;


  .game-bullets {
    flex-wrap: wrap;
    width: 100%;

    gap: 0.5rem;

    font-size: 0.9rem;


    .game-bullet {
      flex-grow: 1;
      justify-content: center;
      align-items: center;

      padding: 0.5rem 1rem;

      border-radius: 100dvw;
      background-color: rgb(255, 255, 255, 0.06);

      letter-spacing: 0.1rem;

      transition: background-color;
      transition-duration: 0.2s;
    }

    .game-bullet.filled {

      color: black;
      background-color: rgb(255, 255, 255, 1);
    }
  }
}

/* filter */

.filters-container {
  position: sticky;
  top: 130px;
  right: 0;

  height: fit-content;

  gap: 1rem;
}

/* filter-card */

.filter-card {
  padding: 2rem;
  border-radius: 1rem;

  height: fit-content;

  gap: 1.5rem;


  .content {
    gap: 0.5rem;


    label {
      display: flex;
      align-items: center;
      font-size: 1.3rem;


      /* check-box */

      input {
        appearance: none;
        position: relative;
        margin-right: 0.7rem;
      
        width: 1.2rem;
        height: 1.2rem;
      
        border: 3px solid white;
        border-radius: 20%;

        

        &.radio-button, &.radio-button::before {
          border-radius: 50%;
        }
      }
      
      input::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
      
        width: 1.2rem;
        height: 1.2rem;
      
        border-radius: 20%;
      
        background-color: transparent;
        transform: translate(-50%, -50%);

        
      }
      
      input:checked::before {
        background-color: white;
      }
    }

  }
}

.icon-eye {
  font-size: 1.6rem;
}


/* MODAL STYLE */
.modal-ironing {
  position: fixed;
  z-index: 999;

  width: 60dvw;
  
  border-radius: 1rem;
  border-style: none;
  outline: none;
  user-select: none;

  color: white;
  background-color: rgb(0,0,0, 0.6) !important;

  

  &::-webkit-scrollbar {
    display: none;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.0);
    backdrop-filter: blur(10px);
  }


  /* Внутрянка */
  .modal-inner {
    padding: 2.5rem;
    gap: 4rem;


    .platform-profile {
      display: grid;
      grid-template-columns: 1fr 1fr;
      /* grid-auto-rows: auto; */
      gap: 2rem;



      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 1rem;
      }

      .profile-info {
        display: grid;
        grid-template-rows: auto auto auto;

        gap: 1rem;
        


        .profile-order {
          font-size: 1.5rem;
        }

        .ironing_time-bullets {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;



          .ironing_time-bullet {
            --light-gray-transparent: rgb(255,255,255, 0.06);

            justify-content: center;
            align-items: center;

            padding: 1rem 1rem;

            border-radius: 1rem;
            background-color: var(--light-gray-transparent);

            font-size: 1.25rem;
            letter-spacing: 0.1rem;

            /* transition: background-color;
            transition-duration: 0.2s; */


            /* Спрятать чекбокс */
            .hidden-checkbox {
              position: absolute;
              opacity: 0;
              height: 0;
              width: 0;
              pointer-events: none;
            }

              /* Активное состояние */
            &.active {
              background-color: rgb(255 255 255 / 100%) !important;
              color: black;
            }

              /* Заблокированное состояние */
            &.disabled {
              color: rgb(255,255,255, 0.06);
              background-color: transparent !important;

              outline: 4px solid var(--light-gray-transparent);
              outline-offset: -4px;

              pointer-events: none;


            }

            &.is_mine {
              color: rgba(68, 255, 0, .2);
              outline-color: rgba(68, 255, 0, .2);
            }

            /* Ховер-эффект только для активных */
            &:not(.disabled, .is_mine):hover {
              background-color: rgb(255 255 255 / 15%);

              cursor: pointer;
            }

          }
          
        }

        .NoAvailableIroningHours {
          color: var(--gray);
        }

        .SummaryIroningPrice {
          font-size: 1.5rem;



          &.disabled {
            color: rgb(255, 255, 255, 0.3);
          }
        }

      }

    }


    .buttons {
      flex-flow: row wrap;
      gap: 3rem;

      .button {
        flex: 1 0 200px;
      }

      .ironing_button.disabled {
        color: rgb(255,255,255, 0.1);
        background-color: transparent;
        outline-color: rgb(255,255,255, 0.1);

        pointer-events: none;
      }
    }

  }

}



/* VIEW IRONINGS MODAL STYLE */

.modal-viewironing {
  position: fixed;
  z-index: 999;

  width: 60dvw;
  height: 90dvh;
  
  border-radius: 2rem;
  border-style: none;
  outline: none;
  user-select: none;

  color: white;
  background-color: rgb(0,0,0, 0.6) !important;

  
  &::-webkit-scrollbar {
    display: none;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.0);
    backdrop-filter: blur(10px);
  }


  /* Внутрянка */
  .modal-inner {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 2.5rem;
    padding: 0 2.5rem 2.5rem 2.5rem;
    

    width: 100%;
    height: 100%;

    

    .user_ironings-container {
      display: grid;
      grid-template-rows: auto;

      gap: 2.5rem;

      width: 100%;
      height: 100%;

      overscroll-behavior: none;

      

      &::-webkit-scrollbar {
        display: none;
      }
      overflow-y: scroll;
      
      outline: none;

      .user_ironings-by_date {
        display: grid;
        grid-template-rows: auto;
        gap: 1rem;

        &:first-of-type {
          margin-top: 2rem;
        } 




        .ironing-card {
          display: grid;
          grid-template-columns: 300px 1fr;
          /* grid-auto-rows: auto; */
          gap: 2rem;
          padding: 1rem;

          border-radius: 2rem;

          background-color: rgb(255, 255, 255, 0.04);



          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 1rem;
          }

          .profile-info {
            display: grid;
            grid-template-rows: auto;

            gap: 1rem;



            .profile-order {
              font-size: 1rem;
            }

            .profile-model {
              font-size: 1.5rem;
            }

            .ironing_time-bullets {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 0.5rem;



              .ironing_time-bullet {
                --light-gray-transparent: rgb(255,255,255, 0.06);

                justify-content: center;
                align-items: center;

                padding: 1rem 1rem;

                border-radius: 1rem;
                background-color: var(--light-gray-transparent);

                font-size: 1.25rem;
                letter-spacing: 0.1rem;

                /* transition: background-color;
                transition-duration: 0.2s; */


                /* Спрятать чекбокс */
                .hidden-checkbox {
                  position: absolute;
                  opacity: 0;
                  height: 0;
                  width: 0;
                  pointer-events: none;
                }

              }

            }

            .NoAvailableIroningHours {
              color: var(--gray);
            }

          }

        }

      }
      
    }

    
    .button {
      width: 80%;

      align-self: center;
    }

  }

}


/* MODAL 0 ACCESS DENIED */

.modal-access_denied {
  position: fixed;
  z-index: 999;

  width: fit-content;
  
  border-radius: 2rem;
  border-style: none;
  outline: none;
  user-select: none;

  color: white;
  background-color: rgb(0,0,0, 0.6) !important;

  
  &::-webkit-scrollbar {
    display: none;
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.0);
    backdrop-filter: blur(10px);
  }


  /* Внутрянка */
  .modal-inner {

    justify-content: center;
    align-items: center;

    gap: 2.5rem;
    padding: 3rem;
    
    width: 100%;
    height: 100%;

    p {
      text-wrap: balance;
    }

    .button {
      align-self: center;
      width: 80%;
    }
    

  }

}




</style>
