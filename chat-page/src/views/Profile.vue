<template>
  <div id="profile">
    <div class="profile-board">
      <!-- sidebar start -->
      <div class="side-bar">
        <slide-bar activeName="Profile"></slide-bar>
      </div>
      <!-- sidebar end -->

      <!-- content start -->
      <div class="profile-content">
        <div class="profile-title">
          Your score
        </div>

        <div class="profile-info">
          <div class="score" ref="echart"></div>
        </div>
      </div>
      <!-- content end -->
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import SlideBar from '@/components/SideBar.vue';
import { UserModule } from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';
import * as echarts from 'echarts/core';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import {
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
);

type ECOption = echarts.ComposeOption<
  BarSeriesOption | 
  TitleComponentOption | 
  TooltipComponentOption | 
  GridComponentOption
>;

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
);

@Component({name: 'Profile', components: {SlideBar}})
export default class extends Vue {

  mounted() {
    // let user = this.$store.state.me;

    var barChart = echarts.init(this.$refs.echart as HTMLElement);
    const option: ECOption = {
        title: {
            text: 'Game Score'
        },
        tooltip: {},
        legend: {
            data:['score']
        },
        xAxis: {
            data: ["escape","flappyBird"]
        },
        yAxis: {},
        series: [{
            name: 'score',
            type: 'bar',
            // user score
            data: [1222, 2333]
        }]
    }
    barChart.setOption(option);
  }

  get user() {
    return UserModule?.user || {};
  }
}
</script>

<style lang="scss" scoped>
#profile {
  @include abs-center();
  @include limit-size(870px, 1127px, 545px, 706px);
  width: 75vw;
  height: 47vw;
  background: #f5f8fa;
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0px 0px 20px #e1e0e4;

  .profile-board {
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

    .profile-content {
      width: 71%;
      height: 100%;
      z-index: 5;
      background: #f9f9fa;
      @include abs-right();

      .profile-title {
        font-size: 35px;
        font-weight: 600;
        text-align: left;
        padding: 20px;
        padding-left: 50px;
        height: 15%;
      }

      .profile-info {
        width: 100%;
        height: 85%;
        overflow: hidden;

        .score {
          height: 36vw;
          width: 40vw;
          @include abs-bottom()
        }
      }

    }
  }
}
</style>
