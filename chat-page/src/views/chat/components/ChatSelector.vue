<template>
  <div id="chatSelector" :class="{ isshow: showChoose }">
    <div class="choose-title">Contact</div>

    <div class="choose-group">
      <div class="group-title">G</div>

      <div class="group-list">
        <div class="group-item" 
          v-for="(room,index) in rooms" 
          :key="index"
          @click="chooseUser(room)">
          <div class="group-avatar">
            <img :src="room.avatar" alt="">
            <div class="msg-tips" v-show="unreadUsers.indexOf(room.id) !== -1"></div>
          </div>

          <div class="group-name">{{room.name}}</div>
        </div>

      </div>
    </div>

    <div class="choose-group">
      <div class="group-title">F</div>

      <div class="group-list">
        <div class="group-item" 
          v-for="(user) in selectorUsers" 
          :key="user.id"
          @click="chooseUser(user)">

          <div class="group-avatar">
            <img :src="user.avatar" alt="user head image" :class="{outline: !user.isOnline}">
            <div class="msg-tips" v-show="unreadUsers.indexOf(user.id) !== -1"></div>
          </div>

          <div class="group-name">{{user.name}}</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';

@Component({name: 'ChatSelector'})
export default class extends Vue {
  @Prop(Array) userList!: Object[];
  @Prop(Array) unreadUsers!: number[];
  @Prop(Function) chooseUser!: Function;
  @Prop(Boolean) showChoose!: boolean;

  get selectorUsers(): Object[] {
    if (!UserModule.user) {
      return [];
    }

    let myId = UserModule.user.id;
    let users = this.userList.filter((user: any) => {
      return user.id !== myId && !user.isRoom;
    });
    return users;
  }

  get rooms(): Object[] {
    return this.userList.filter((user: any) => {
      return user.isRoom;
    });
  }

}

</script>

<style lang="scss">
#chatSelector {
  width: 0;
  height: 100%;
  overflow: hidden;
  transition: all 0.8s;
  background: #f8fbfb;
  font-size: 34px;
  @include scroll-bar();

  .choose-title {
    width: 100%;
    margin-left: 30px;
    font-size: 40px;
    font-weight: 600;
    color: #0b0e0e;
    text-shadow: 1px 1px 4px #b7bfca;
  }
  .choose-group {
    width: 100%;
    padding-left: 12%;
    padding-right: 10px;
    margin-bottom: 35px;

    .group-title {
      font-size: 4.1vmin;
      height: 7vmin;
      color: #1f6ef7;
      font-weight: bolder;
      text-shadow: 0 0 3px #b7bfca;
    }

    .group-list {
      margin-left: 4vmin;
      .group-item {
        display: flex;
        height: 13vmin;
        width: 38vw;
        line-height: 13vmin;
        align-items: center;
        transition: all .4s;
        
        &:nth-child(n) {
          border-top: 3px solid #e9e6e6;
        }

        &:last-child {
          border-bottom: 3px solid #e9e6e6;
        }

        &:hover {
          background: #f2f4f8;
          box-shadow: 0 0 12px #abc5ec;
          cursor: pointer;
        }

        .group-avatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #ccc;
          position: relative;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 5px #b7bfca;
            transition: filter .4s;

            &.outline {
              filter: grayscale(0.8);
            }
          }

          .msg-tips {
            width: 10px;
            height: 10px;
            position: absolute;
            background: #e75a5a;
            right: 0;
            bottom: 0;
            border-radius: 50%;
          }
        }

        .group-name {
          padding-left: 10px;
          font-size: 30px;
          color: #2f2f30;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-shadow: 0 0 3px #b7bfca;
        }
      }
    }
  }  
}

#chatSelector.isshow {
  width: 100%;
}
</style>
