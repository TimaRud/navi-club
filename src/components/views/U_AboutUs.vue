<script>
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:3000"

import VanillaTilt from 'vanilla-tilt';

import MasonryLayout from 'masonry-layout';

export default {
  data() {
    return {
      
    } 
  },
  methods: {

  },
  mounted() {

  },
}

</script>

<template>
  <main class="wrapper gap-2-5rem">
    <div class="left-side flex-col margin-top-bottom" >

      <div class="history flex-col blured-bg">
        <h2>Наша история</h2>
        <p> В далёком 1998 году группа энтузиастов, вдохновлённых первыми LAN-турнирами и культовыми играми вроде Quake и StarCraft, основала в небольшом гараже на окраине города клуб «NAVI». Это было место, где гики и мечтатели собирались за гудящими мониторами, чтобы делиться эмоциями, соревноваться и создавать что-то новое. Спустя годы скромный проект превратился в полноценный игровой хаб: в 2005-м мы переехали в первое коммерческое помещение, оборудованное мощными ПК и консолями, а к 2010-му запустили регулярные турниры и тематические вечера, став точкой притяжения для геймеров региона. Сегодня «NAVI» — это не только арена для киберспорта с VR-зонами и симуляторами, но и творческая лаборатория, где разработчики инди-игр тестируют свои проекты, а стримеры находят вдохновение. Мы верим, что игры объединяют людей, и продолжаем писать историю, сохраняя дух азарта и открытости, заложенный нашими основателями. Присоединяйтесь — здесь каждый найдет свой уровень!</p>
      </div>

      <div class="contact-info flex-col blured-bg">
        <h2>Контакты</h2>
        <p> <i class="icon icon-location" ></i> Адрес: г. Амурск, ул. Ленина, д. 15
          <br><br><i class="icon icon-phone" ></i> Телефон: +8 (800) 555-35-35
          <br><br> <i class="icon icon-mail" ></i> Email: navi.simple_pricel_imba@gmail.com
          <br><br> <i class="icon icon-work_time" ></i> Часы работы: Ежедневно с 9:00 до 21:00
        </p>
      </div>  
    </div>

    <div class="right-side benefits flex-col blured-bg margin-top-bottom">
      <h2>Почему выбирают нас?</h2>
      <ul class="flex-col">
        <li>Топовое оборудование: Мощные ПК, консоли нового поколения и VR-зоны с передовыми шлемами — никаких лагов, только максимальный FPS и погружение.</li>
        <li>Каталог на любой вкус: 2000+ игр: от культовых хитов до свежих релизов и инди-проектов. Кооператив, киберспорт или релакс — выбирайте своё!</li>
        <li>Все платформы: Играйте на чём угодно: ПК (Steam, Epic), PlayStation, Xbox или в VR. Тестируйте, сравнивайте, наслаждайтесь.</li>
      </ul>
    </div>

    
  </main>
</template>

<style scoped>

main {
  height: calc(100dvh - var(--header-height));
}

h1, h2, h3, p {
  filter: drop-shadow(0 0 1rem rgb(0,0,0));
}

p, li {
  font-size: 1.3rem;
}

main {
  display: grid;
  grid-template-columns: 2fr 1fr;
}


.left-side {
  gap: 2rem;
}


.history, .contact-info, .benefits {
  padding: 2rem;
  border-radius: 2rem;

  gap: 2rem;
}

ul {
  gap: 1rem;
}

li {
  list-style-type:square;
  list-style-position: inside;
}


</style>