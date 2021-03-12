<template>
  <div id="chatWindow" :class="{ isshow: !showChoose }">
    <!-- user start -->
    <div class="chat-user">
      <img
        class="user-avatar"
        :src="chatUser.avatar"
        alt=""
        :class="{ outline: !chatUser.isOnline }"
      />
      <div class="user-name">{{ chatUser.name }}</div>
    </div>
    <!-- user end -->

    <!-- content start -->
    <div class="chat-w-content">
      <div class="msg-list" ref="chatbox">
        <div
          class="msg-item"
          v-for="(msg, index) in messageList"
          :key="index"
          :class="{ 'self-msg': user.id === msg.sender.id }"
        >
          <div class="msg-content">{{ msg.message }}</div>
        </div>
      </div>

      <div class="input-container">
        <input
          type="text"
          v-model="inputMessage"
          @keydown.enter.exact="sendMsg"
        />
        <div @click="sendMsg">S</div>
      </div>
    </div>
    <!-- content end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { ChatModule } from '@/store/modules/chat';

@Component({ name: 'ChatWindow' })
export default class extends Vue {
  @Prop(Object) chatUser!: any;
  @Prop(Object) newMessage!: any;
  @Prop(Boolean) showChoose!: boolean;
  private inputMessage: string = '';
  private messageList: any[] = [];

  created() {
    this.loadStorage();
  }

  mounted() {
    this.scrollBottom();
  }

  updated() {
    this.scrollBottom();
  }

  get user(): any {
    return UserModule.user || {};
  }

  saveStorage(): void {
    let key = 'chatuser-' + UserModule.user.id + '-' + this.chatUser.id;
    localStorage[key] = JSON.stringify(this.messageList);
  }

  loadStorage(): void {
    let key = 'chatuser-' + UserModule.user.id + '-' + this.chatUser.id;
    if (localStorage[key] !== undefined) {
      this.messageList = JSON.parse(localStorage[key]) || [];
    }
  }

  scrollBottom(): void {
    let chatbox: any = this.$refs.chatbox;
    if (chatbox !== undefined) {
      chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
    }
  }

  sendMsg(): void {
    if (this.inputMessage === 'sh:clear') {
      this.messageList = [];
      this.inputMessage = '';
      this.saveStorage();
      return;
    }

    let msg = {
      sender: UserModule.user,
      receiver: this.chatUser,
      message: this.inputMessage,
      time: new Date().getTime(),
    };
    this.messageList.push(msg);
    ChatModule.emit({ eventName: 'message', data: msg });
    this.inputMessage = '';
    this.saveStorage();
  }

  @Watch('newMessage')
  onNewMessageUpdate(newValue: any, oldValue: any) {
    // private message
    if (newValue.receiver.id == UserModule.user.id) {
      this.messageList.push(newValue);
      // group message
    } else if (
      this.chatUser.isRoom &&
      newValue.receiver.id == this.chatUser.id
    ) {
      if (newValue.sender.id != UserModule.user.id) {
        this.messageList.push(newValue);
      }
    }
  }

  @Watch('chatUser')
  onChatUserUpdate() {
    this.messageList = [];
    this.loadStorage();
  }
}
</script>

<style lang="scss">
#chatWindow {
  width: 0;
  height: 100%;
  overflow: hidden;
  transition: all 0.8s;
  background: #f3f7fd;
  font-size: 33px;

  .chat-user {
    width: 100%;
    height: 20%;
    @include flex-center();

    .user-avatar {
      width: 7vw;
      height: 7vw;
      @include limit-size(60px, 80px, 60px, 80px);
      border-radius: 50%;
      margin-right: 30px;
      box-shadow: 0 0 8px #b7bfca;

      &.outline {
        filter: grayscale(0.8);
      }
    }

    .user-name {
      font-weight: 600;
      text-shadow: 0 0 3px #b7bfca;
      width: 10em;
      text-overflow: ellipsis;
    }
  }

  .chat-w-content {
    width: 100%;
    height: 80%;
    background: #fff;
    border-top-left-radius: 6vmin;
    border-top-right-radius: 6vmin;
    box-shadow: 0 0 8px #ebeef3;
    display: block;

    .msg-list {
      width: 85%;
      height: 80%;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      @include scroll-bar();

      .msg-item {
        width: 98%;
        margin: 0 auto;
        .msg-content {
          max-width: 80%;
          width: fit-content;
          font-size: 2vh;
          margin-top: 1vmin;
          color: #adacb2;
          background: #f8fbfb;
          padding: 1vmin 2vmin 1vmin 2vmin;
          border-radius: 2vmin;
          word-wrap: break-word;
          word-break: normal;
          float: left;
        }
      }

      .msg-item.self-msg .msg-content {
        color: #dbe8ff;
        background: #4b87fa;
        float: right;
      }
    }

    .input-container {
      width: 85%;
      height: 7vh;
      display: flex;
      margin: 10px auto;
      position: relative;

      input {
        width: 100%;
        height: 7vh;
        border-radius: 7vh;
        outline: none;
        border: none;
        box-shadow: 0 0 5px #d7dde7;
        color: #c2c2c2;
        font-size: 2vh;
        text-indent: 4vmin;
      }

      div {
        position: absolute;
        right: 1vw;
        width: 6vh;
        height: 6vh;
        background: #edf3fc;
        text-align: center;
        line-height: 6vh;
        font-size: 3.3vh;
        color: #5080f9;
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 0 0 15px #f6fafe;
        transition: all 0.5s;

        &:hover {
          cursor: pointer;
          background: #7aabf5;
          color: #f9fafc;
        }
      }
    }
  }
}

#chatWindow.isshow {
  width: 100%;
}
</style>
