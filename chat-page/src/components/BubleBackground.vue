<template>
    <!-- background start -->
    <div class="background">
      <!-- big circle start -->
      <div class="left-circle"></div>
      <div class="right-circle">
        <div class="pink-cicle"></div>
      </div>
      <!-- big circle  end -->

      <!-- Bubble start -->
      <div class="white-circle">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <!-- Bubble end -->
    </div>
    <!-- background end -->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({name: 'BubleBackground'})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@mixin circle($color: #c6eff9, $size: 33vh) {
  border-radius: 50%;
  background: $color;
  width: $size;
  height: $size;
  z-index: -1;
}

.background {
  width: 100vw;
  height: 100vh;

  .left-circle {
    @include circle(#c6eff9, 90vh);
    @include abs-layout(0, 0);
    transform: translate(-47%, -30%);
    box-shadow: 1px 1px 10px #ebeaf0;
  }

  .right-circle {
    @include abs-layout(default, default, 0, 0);
    width: 70vh;
    height: 60vh;
    overflow: hidden;

    .pink-cicle {
      position: absolute;
      transform: translate(30%, 5%);
      @include circle(#f1dbe5, 75vh);
      box-shadow: 1px 1px 10px #ebeaf0;
    }
  }

  .white-circle {
    div {
      box-shadow: 1px 1px 10px #ebeaf0;
    }

    div:nth-child(1) {
      @include circle(#ffffff, 2vh);
      @include abs-layout(20%, 5%);
    }

    div:nth-child(2) {
      @include circle(#ffffff, 5vh);
      @include abs-layout(43%, 2%);
    }

    div:nth-child(3) {
      @include circle(#ffffff, 3vh);
      @include abs-layout(default, default, 40%, 5%);
    }

    div:nth-child(4) {
      @include circle(#ffffff, 3.5vh);
      @include abs-layout(default, default, 2%, 45%);
    }

    div:nth-child(5) {
      @include circle(#ffffff, 2vh);
      @include abs-layout(8%, default, default, 5%);
    }
  }
}
</style>