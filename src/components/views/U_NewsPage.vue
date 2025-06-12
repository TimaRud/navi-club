<script>
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000"

import VanillaTilt from 'vanilla-tilt';

import MasonryLayout from 'masonry-layout';

export default {
  data() {
      return {
        Categories: [
          {
            NameValue: 'Игры'
          },
          {
            NameValue: 'Киберспорт'
          },
          {
            NameValue: 'Техника'
          },
        ],
        News: [],
        SelectedCategories: ['Игры', 'Киберспорт', 'Техника']
      } 
  },
  methods: { 
    InitMasonry() {
      // this.$nextTick(() => {
      //   const container = document.querySelector('.news-container');
      //   const masonry = new MasonryLayout(container, {
      //     itemSelector: '.article-card',
      //     gutter: 30
      //   });
      // });
      
    },
    async LoadNews() {

      this.InitMasonry();

      let response = await axios.get('/news', {
        params: {
          SelectedCategories: this.SelectedCategories
        }
      });

      this.News = response.data;

      this.InitMasonry();

    }
  },
  mounted() {
    this.LoadNews();
    this.InitMasonry();
    
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
  <main class="wrapper">
    <section class="news-container flex-col margin-top-bottom" >

      <div class="article-card blured-bg" v-for="(article, index) in News">
        <div class="card-text flex-col">
          <h3>{{ article.Title }}</h3>
          <p>{{ article.Text }}</p>
        </div>
        <img :src='article.ImagePath' alt="">
      </div>

    </section>

    <section class="filter blured-bg flex-col margin-top-bottom">
      <h3>Категории</h3>

      <div class="categories flex-col">

        <label class="flex-row" v-for="(category, index) in Categories"> 
          <input class="check-box" type="checkbox" checked :value="category.NameValue" v-model="SelectedCategories" @change="LoadNews()"> {{ category.NameValue }} 
        </label>
      </div>

    </section>
  </main>
</template>

<style scoped>

h1, h2, h3, p {
  filter: drop-shadow(0 0 1rem rgb(0,0,0));
}

main {
  
  display: grid;
  grid-template-columns: auto 300px;

  gap: 2rem;
}


/* Секции */

/* Articles */

.news-container {
  width: 100%;
}

.article-card {
  display: grid;
  grid-template-columns: auto 450px;

  
  width: 100%;

  gap: 2rem;
  padding: 1.5rem;
  margin-bottom: 30px;

  border-radius: 2rem;
}

.card-text {
  gap: 2rem;
}

.article-card p {
  font-size: 1rem;
  line-height: 1.2;
  text-wrap: pretty;
  opacity: 0.85;
}

.article-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  
}

/* filter */

.filter {
  position: sticky;
  top: 140px;
  right: 0;

  padding: 2rem;
  border-radius: 1rem;

  height: fit-content;

  gap: 1.5rem;
}

/* categories */

.categories {
  gap: 0.5rem;
}

label {
  align-items: center;
  font-size: 1.5rem;
}

.check-box {
  appearance: none;

  margin-right: 0.7rem;
}

.check-box {
  position: relative;

  width: 1.5rem;
  height: 1.5rem;

  border: 3px solid white;
  border-radius: 20%;
}

.check-box::before {
  content: '';
  position: absolute;

  width: 1.5rem;
  height: 1.5rem;

  border-radius: 20%;

  background-color: transparent;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.check-box:checked::before {
  background-color: white;
}



</style>