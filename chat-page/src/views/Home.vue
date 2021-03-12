<template>
  <div id="home">
    <div class="home-board">
      <!-- sidebar start -->
      <div class="side-bar">
        <slide-bar activeName="Home"></slide-bar>
      </div>
      <!-- sidebar end -->

      <!-- content start -->
      <div class="home-content">
        <div class="home-title"> 
          <span>{{ username || 'tourists' }}</span> welcome
        </div>

        <div class="home-info">
          <div class="home-circle">
            <div class="background-wrapper"></div>

            <div class="greet-wrapper">
              <span>{{ date }}</span>
              <span>{{ greetContent }}</span>
            </div>
            
          </div>
        </div>
      </div>
      <!-- content end -->

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import SlideBar from '@/components/SideBar.vue';

@Component({name: 'Home', components: {SlideBar}})
export default class extends Vue {
  private timer: number | undefined;
  private date: string;
  private greetContent: string;

  constructor() {
    super();
    this.timer = undefined;
    this.date = '';
    this.greetContent = '';
  }
  
  mounted() {
    // Update the time every 1 second
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1 * 1000);
  }
  
  get username() {
    return UserModule.user?.name;
  }

  /**
   * * update time and greetContent
   */
  updateTime() {
    const d = new Date();
    // time ex: 15:32
    let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    this.date = hours + ' : ' + minutes + ' : ' + seconds;
    // greetContent
    if (d.getHours() < 12) {
      this.greetContent = 'Morning!';
    } else if (d.getHours() < 18) {
      this.greetContent = 'Afternoon!';
    } else {
      this.greetContent = 'Evening!';
    }
  }

  beforeRouteLeave(to: any, from: any, next: Function) {
    //  clear update timer
    this.timer && clearInterval(this.timer);
    next();
  }
}


</script>

<style lang="scss" scoped>
@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

#home {
  @include abs-center();
  @include limit-size(870px, 1127px, 545px, 706px);
  width: 75vw;
  height: 47vw;
  background: #f5f8fa;
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0px 0px 20px #e1e0e4;

  .home-board {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    z-index: 20;

    .side-bar {
      @include abs-layout(0, 0);
      width: 29%;
      height: 100%;
      z-index: 10;
      background: #fff;
    }

    .home-content {
      width: 71%;
      height: 100%;
      z-index: 5;
      background: #f9f9fa;
      @include abs-right();

      .home-title {
        font-size: 35px;
        font-weight: 600;
        text-align: left;
        padding: 20px;
        padding-left: 50px;
      }

      .home-info {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .home-circle {
          width: 30vw;
          height: 30vw;
          @include limit-size(344px, 458px, 344px, 458px);
          border-radius: 50%;
          position: relative;
          margin: 3vw auto;
          background: #f1f0f6;
          background: linear-gradient(#f1f0f6, #d9d4e4);
          overflow: hidden;

          .background-wrapper {
            width: 82%;
            height: 82%;
            border-radius: 50%;
            background: #fff;
            @include abs-center();
            box-shadow: 0 100px 100px 0 #dcd5ec,
                        0 -100px 100px 0 #dcd5ec;
            animation: rotate360 4s linear infinite;
          }

          .greet-wrapper {
            text-align: center;
            @include abs-center();
            font-size: 36px;
            height: 129px;

            span {
              display: block;
              font-weight: 600;
              color: #3c3463;
            }

            span:nth-child(2) {
              margin-top: 38px;
            }
          }
        }
      }
    }
  }
}
</style>
