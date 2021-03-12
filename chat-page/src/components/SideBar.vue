<template>
  <div id="sidebar">
    <div class="title">{{ activeName }}</div>
    <div class="choose">
      <router-link to="/home" :class="{ 'link': true, 'active': activeName.toLowerCase() === 'home' }">
        Home
      </router-link>

      <router-link to="/profile" :class="{ 'link': true, 'active': activeName.toLowerCase() === 'profile' }">
        Profile
      </router-link>

      <router-link to="/chat" :class="{ 'link': true, 'active': activeName.toLowerCase() === 'chat' }">
        Chat
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({ name: 'SideBar' })
export default class extends Vue {
  @Prop({ default: '' }) private activeName!: string;
}
</script>

<style lang="scss" scoped>
#sidebar {
  width: 100%;
  height: 100%;
  position: relative;
  @include flex-center(column);

  .title {
    @include abs-top();
    width: 100%;
    font-size: 33px;
    font-weight: 600;
    padding-top: 30px;
    padding-left: 30px;
  }

  .choose {
    width: 100%;
    height: 50%;
    margin: 0 auto;
    text-align: center;
    @include flex-layout(space-between, center, column);

    .link {
      display: block;
      width: 60%;
      padding: 15px;
      color: #a9a4be;
      background: #f4f3fa;
      font-size: 23px;
      transition: all .5s;

      &.active, &:hover {
        background-color: #f2f0fa;
        color: #847ba3;
        box-shadow: inset 0 0 8px #dddce0;
      }
    }
  }
}

</style>
