<script>

export default {
  props: {
    ErrorCode: {
      type: Number, // было Type: Number
      default: 0
    },
    ErrorMessage: {
      type: String, // было Type: String
      default: "Неизвестная ошибка"
    }
  },
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
<main class="flex-col">

  <div class="error flex-col">

    <!-- Код ошибки -->
    <p class="error-status-code text-center">{{ ErrorCode }}</p>
    <!-- Текст ошибки -->
    <p class="error-text text-center">{{ ErrorMessage }}</p>


    <!-- Кнопки -->
    <div class="flex-row" >

      <a  v-if="ErrorCode !== 500 && ErrorCode !== 503 && ErrorCode == 200" class="button outlined flex-row w100" @click="this.$router.push('/')">
        <i class="icon-home icon"></i>
        <p class="button_text">На главную</p>
      </a>
      
      <a v-if="ErrorCode == 401" class="button outlined flex-row w100" @click="this.$router.push('/login')">
        <i class="icon-entrance icon"></i>
        <p class="button_text">Войти</p>
      </a>

    </div>
    
  </div>
</main>
</template>

<style scoped>
main {
  height: calc(100dvh - var(--header-height));

  justify-content: center;
  align-items: center;
}



.error {
  

  width: fit-content;

  gap: 2rem;

  /* justify-content: center;
  align-items: center; */
}

.error-status-code {
  position: relative;
  
  color: rgb(228, 228, 228, 0.2);

  margin-bottom: -0.7rem;

  font-size: 15rem;
}

.error-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  
  font-size: 2rem;
  text-wrap: balance;
}

div.flex-row {
  gap: 3rem;
}
</style>