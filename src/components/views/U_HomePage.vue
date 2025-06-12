<script>
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000"

import VanillaTilt from 'vanilla-tilt';

export default {
  data() {
      return {
        popular_games: [
            {
              ImageURL: 'https://www.codesproduit.fr/wp-content/uploads/2022/08/MRR-COVER.jpg',
              name: 'Metal Gear Rising: Revengence',
              FollowersCount: 2731
            },
            {
              ImageURL: 'https://avatars.mds.yandex.net/get-mpic/5319158/2a0000018e2ed1bd3714f0de4d5439dd6473/orig',
              name: 'Metro Exodus',
              FollowersCount: 21
            },
            {
              ImageURL: 'https://i.playground.ru/e/d6YI9eAiJYS99xtlH5vf1Q.jpeg',
              name: 'MiSide',
              FollowersCount: 5788
            },
            {
              ImageURL: 'https://img5.dlhas.ir/hosein/files/2024/01/marvels-spider-man-2-pc-cover-large.jpg',
              name: "Marvel's Spider-Man",
              FollowersCount: 7321
            },
            {
              ImageURL: 'https://cdn1.ozone.ru/s3/multimedia-c/6111962856.jpg',
              name: "God of War",
              FollowersCount: 1452
            },
        ],
        game_platforms: [
          {
            ImageURL: "https://avatars.dzeninfra.ru/get-zen_doc/1584893/pub_6384d8ba35577b2eb4c2224e_6384d91351523e56f3ac343a/scale_1200",
            name: "Компьютерные игры",
          },
          {
            
            ImageURL: "https://www.ixbt.com/img/n1/news/2020/10/4/%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20(2)_large.png",
            name: "Консольные игры",
          },
          {
            
            ImageURL: "https://us.v-cdn.net/6036147/uploads/UOD9M2SQ6OP7/d-14-1-1200x675.jpg",
            name: "Виртуальная реальность",
          },
        ],
        Comments: []
      } 
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
    GoToNews() {
      this.$router.push({ name: "news" })
    },
    
  },
  async mounted() {
    
    await this.LoadUserComments();
    
    this.initTilt();
  },
  // Очистка при размонтировании компонента
  beforeUnmount() {
    const elements = document.querySelectorAll(".tilt-element");
    elements.forEach(element => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    });
  }
}

</script>

<template>
  <main>
    <!-- БАННЕР -->
    <section class="banner shadow">
      

      <div class="banner-image">
        <div class="banner-content flex-col">
          <h1>Погрузись в мир побед!</h1>
          <h3>Турниры, адреналин, топовое оборудование — твоя игровая вселенная начинается здесь</h3>
          
          <a class="button filled-dark big flex-row" @click="GoToNews()">
            <i class="icon-news icon"></i>
            <p class="button_text" >Быть в курсе последних новостей</p>
          </a>
        </div>
      </div>

    </section>

    <!-- ДОБРО ПОЖАЛОВАТЬ -->
    <section class="welcome wrapper shadow margin-top-bottom">
      <div class="section-image welcome flex-col">
        <h2 class="text-center" >Добро пожаловать в NAVI Club</h2>
        <p class="text-center" >NAVI Club — это место, где встречаются страсть к играм и дух соревнования. Мы предлагаем современное оборудование, комфортные зоны для игр и регулярные турниры. Присоединяйтесь к нашему сообществу и станьте частью киберспортивной истории!</p>
      </div>
    </section>

    <!-- ПОПУЛЯРНЫЕ ИГРЫ -->
    <section class="popular-games flex-col wrapper blured-bg margin-top-bottom shadow ">
      
      <h2 class="text-center"> <i class="icon-rocket header-icon"></i> Самые популярные игры в настоящее время </h2>

      <div class="games-container gap-2-5rem flex-row" >
        <div class="game-card gap-1rem flex-col tilt-element shadow" v-for="(game, index) in popular_games">
          <img class="" :src="game.ImageURL" alt="" loading="lazy">
          <p class="text-center shadow" >{{ game.name }}</p>
        </div>
      </div>
    </section>

    <!-- ПЛАТФОРМЫ -->
    <section class="platforms flex-col wrapper blured-bg margin-top-bottom shadow ">
      
      <h2 class="text-center"> <i class="icon-computer header-icon"></i> Наши игровые платформы </h2>

      <div class="platforms-container gap-2-5rem flex-row" >
        <div class="platform-card gap-1rem flex-col tilt-element shadow" v-for="(platform, index) in game_platforms">
          <img class="" :src="platform.ImageURL" alt="" loading="lazy">
          <p class="text-center shadow"> {{ platform.name }} </p>
        </div>
      </div>
    </section>

    <!-- ПРИСОЕДИНЯЙТЕСЬ К НАШЕМУ СООБЩЕСТВУ -->
    <section class="join_to_community wrapper shadow margin-top-bottom">
      <div class="section-image join_to_community flex-col">
        <h2 class="text-center" >Присоединяйтесь к нашему сообществу</h2>
        <p class="text-center" >Своременные игровые компьютеры, комфортные зоны для командных игр, проведение киберспортивных турниров, приходите и почвствуйте настоящий дух киберспорта.</p>
      </div>
    </section>


  </main>
</template>

<style scoped>

h1, h2, h3, p {
  filter: drop-shadow(0 0 1rem rgb(0,0,0));
}

/* Секции */

.banner-image {
  width: 100%;
  height: 100dvh;
  margin-top: -70px;

  background: 
    linear-gradient(90deg, rgb(0,0,0) 0%, rgb(0,0,0, 0.0) 70%),
    url(https://imagesbase.ru/uploads/posts/2017-10/1508650219_imagesbase.ru.jpg);
  background-size: cover;
  background-position: center center;
}

.banner-content {
  justify-content: center;

  gap: 4rem;

  height: 100%;
  width: 50dvw;

  padding: calc(5rem + 70px) 5rem 5rem 5rem;


  .button {
    justify-content: center;
    align-items: center;


    .icon-news {
      font-size: 1.5rem;
    }
  }
}



/* Изображение внутри секции */
.section-image {
  border-radius: 2rem;

  justify-content: end;

  width: 100%;
  height: 700px;

  padding: 6rem;
  gap: 3rem;
}

.section-image.welcome {
  background: 
    linear-gradient(0deg, rgb(0,0,0) 0%, rgb(0,0,0, 0.0) 70%),
    url(https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/12/marvels-spider-man-2-god-of-war-ragnarok-fall-2023-release-date.jpg);
  background-size: cover;
  background-position: center center;
}

.section-image.join_to_community {
  justify-content: start;

  background: 
    linear-gradient(180deg, rgb(0,0,0) 0%, rgb(0,0,0, 0.0) 70%),
    url(https://avatars.mds.yandex.net/get-altay/1132477/2a000001872f3462027513a5009540f477c1/orig);
  background-size: cover;
  background-position: center center;
}

.section-image p {
  line-height: 1.2;
  text-wrap: balance;
}

/* Секции игр, игровых платформ и комментариев */

.popular-games, .platforms, .user-comments {
  width: auto;

  padding: 3rem;
  gap: 4rem;

  border-radius: 2rem;
}
  
.game-card, .platform-card {
  width: 100%;

  border-radius: 1rem;
}

.game-card img, .platform-card img {
  width: 100%;

  object-fit: cover;

  border-radius: 1rem;
}

.game-card img {
  aspect-ratio: 1 / 1.4;
}

.platform-card img {
  aspect-ratio: 1 / 0.6;
}

.profile {
  justify-content: center;
}

.profile i {
  font-size: 4rem;
}

.profile p {
  font-size: 2rem;
}

.comment-card p {
  text-wrap: balance;
}


</style>