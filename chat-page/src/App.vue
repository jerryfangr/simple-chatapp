<template>
  <div id="app">
    <!-- background start -->
    <buble-background></buble-background>
    <!-- background end -->

    <!-- router view start -->
    <transition
      mode="out-in" 
      enter-active-class="animate__animated animate__fadeInUp animate__fast"
      leave-active-class="animate__animated animate__fadeOutUp animate__fast">
    >
      <router-view />
    </transition>
    <!-- router view end -->
  </div>
</template>

<script lang="ts">
import 'animate.css';
import BubleBackground from '@/components/BubleBackground.vue';
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';

@Component({name: "App", components: {BubleBackground}})
export default class extends Vue {
  beforeCreate() {
    !UserModule.user && UserModule.login()
  }
}
  
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  z-index: -2;
  position: relative;
  background: #f4f3f9;
}

#app {
}
</style>
