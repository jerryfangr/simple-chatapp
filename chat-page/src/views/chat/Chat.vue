<template>
  <div id="chat">
    <div class="chat-board">
      <!-- sidebar start -->
      <div class="side-bar">
        <slide-bar activeName="Chat"></slide-bar>
      </div>
      <!-- sidebar end -->
      
      <!-- content start -->
      <div class="chat-content">
        <div class="chat-info" v-if="status!=='chat'">
          <div :class="{'chat-circle': true, 'connect': isConnecting}">
            <div class="chat-rect"></div>
            <div class="chat-rect"></div>
            <div class="chat-rect"></div>
            <div class="text-wrapper" @click="joinChat"> 
              <span>{{status}}</span>
            </div>
          </div>
        </div>
        
        <router-view/>
      </div>
      <!-- content end -->
    </div>
  </div>
</template>

<script lang="ts">
import SlideBar from '@/components/SideBar.vue'
import { Component, Vue } from 'vue-property-decorator';
import { ChatModule } from '@/store/modules/chat';
import { UserModule } from '@/store/modules/user';
import { Socket } from 'socket.io-client'
import API from '@/assets/API';

@Component({name: 'Chat', components: {SlideBar}})
export default class extends Vue {
  private status: string = 'Join';
  private connectCount: number = 0;
  private isConnecting: boolean = false;

  public joinChat(): void {
    // open animation
    this.isConnecting = true;

    // check connectCount
    if (this.connectCount === 0) {
      this.status ='connect..';
    } else {
      this.status ='reconnect..';
    }

    // check socket
    if (ChatModule.isConnected) {
      this.$router.push({ path: '/chat/chatapp'});
      return;
    }

    // try connect
    if (this.connectCount < 9) {
      this.connectCount++;

      // create connect socket
      ChatModule.connect({
        url: API.base, 
        config: {
          withCredentials: API.cross
        }
      })
      .then((socket) => {
        let user = UserModule.user;
        user.socketId = (socket as Socket).id;
        user.isOnline = true;
        UserModule.SET_USER(user);
        
        ChatModule.on({
          eventName: 'join-chat', 
          callback: (data: any) => {
            this.$router.push({ path: '/chat/chatapp'});
            this.connectCount = 0;
          }
        });

        ChatModule.emit({eventName: 'join-chat'});
        }, error => {
          setTimeout(() => {
            this.joinChat();
          }, 600);
      })
    } else {
      this.isConnecting = false;
      this.status ='failed';
      this.connectCount = 0;
    }
  }
}

</script>

<style lang="scss">
@keyframes rotate360-0
{
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
@keyframes rotate360-120
{
  0% {transform: rotate(120deg);}
  100% {transform: rotate(480deg);}
}
@keyframes rotate360-240
{
  0% {transform: rotate(240deg);}
  100% {transform: rotate(600deg);}
}

@mixin rotate-animation($animation:rotate360-0, $duration: 2s, $delay: 0s) {
  animation:$animation $duration infinite linear;
  animation-delay: $delay;
}

#chat {
  @include abs-center();
  @include limit-size(870px, 1127px, 545px, 706px);
  width: 75vw;
  height: 47vw;
  background: #f5f8fa;
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0px 0px 20px #e1e0e4;

  .chat-board {
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

    .chat-content {
      width: 71%;
      height: 100%;
      z-index: 5;
      background: #f9f9fa;
      @include abs-right();

      .chat-info {
        width: 100%;
        height: 100%;
        overflow: hidden;
        @include flex-center();
      }

      .chat-circle {
        width: 30vw;
        height: 30vw;
        @include limit-size(344px, 458px, 344px, 458px);
        box-shadow: inset 0 0 10px 0 #d3d0e4;
        border-radius: 50%;
        position: relative;
        margin: 3vw auto;
        background: #f1f0f6;
        background: linear-gradient(#f1f0f6, #e9e6f0);
        overflow: hidden;

        &.connect {
          .chat-rect:nth-child(1) {
            @include rotate-animation();
          }

          .chat-rect:nth-child(2) {
            @include rotate-animation(rotate360-120);
          }

          .chat-rect:nth-child(3) {
            @include rotate-animation(rotate360-240);
          }
        }

        .chat-rect {
          width: 50%;
          height: 14%;
          background: #d7d3e4;
          @include abs-layout(0, 0, default, 0);
          transform-origin: right center;
        }

        .chat-rect:nth-child(1) {
          transform: rotate(0);
        }

        .chat-rect:nth-child(2) {
          transform: rotate(120deg);
        }

        .chat-rect:nth-child(3) {
          transform: rotate(240deg);
        }

        .text-wrapper {
          display: block;
          @include abs-center();
          width: 75%;
          height: 75%;
          box-shadow: inset 0 0 3px 0 #b4aed6;

          text-align: center;
          border-radius: 50%;
          background: #fff;
          color: #3c3463;

          &:hover {
            cursor: pointer;
          }

          &.connect {
            animation: scale 1s linear infinite alternate-reverse;
          }

          span {
            display: block;
            font-size: 36px;
            height: 49px;
            font-weight: 600;
            @include abs-center();
          }
        }
      }
    }
  }
}
</style>
