<template>
  <div class="app-design-container">
    <div class="header">
      <div class="left-container">
        <div @click="goAppList" class="back-container">
          <i class="fa fa-angle-left" style="font-size: 20px;"></i>
        </div>
      </div>
      <div class="nav-container">
        <ul class="nav-bar">
          <li @click="formDesign" :class="{'active':$route.name==='app-form-design'}">表单设计</li>
          <li @click="addFlow" :class="{'active':$route.name==='app-flow-design'}">添加流程</li>
          <!--<li @click="overallConfig" :class="{'active':$route.name==='app-overall-config'}">全局设置</li>-->
          <li @click="appPublish" :class="{'active':$route.name==='app-publish'}">应用发布</li>
        </ul>
      </div>
      <div class="right-container">
        <div class="save-container" v-if="$route.name==='app-form-design'" @click="saveFormDesign">
          <i class="fa fa-save"></i>
          <span>保存</span>
        </div>
        <div v-else></div>
        <!--<personal></personal>-->
      </div>
      <div style="clear: both;"></div>
    </div>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import {eventHub} from '../../event/eventHub';
  import Personal from "../account/personal";
  export default{
    components: {Personal},
    name: 'AppDesign',
    data(){
      return {
        eventHub: null
      }
    },
    methods: {
      // 表单设计
      formDesign(){
        this.$router.push({name: 'app-form-design', params: {appId: this.$route.params.appId}})
      },
      // 添加流程
      addFlow(){
        this.$router.push({name: 'app-flow-design', params: {appId: this.$route.params.appId}})
      },
      // 全局设置
      overallConfig(){
        this.$router.push({name: 'app-overall-config', params: {appId: this.$route.params.appId}})
      },
      // 应用发布
      appPublish(){
        this.$router.push({name: 'app-publish', params: {appId: this.$route.params.appId}})
      },
      // 返回应用列表
      goAppList(){
        this.$router.push({name: 'app-list'})
      },
      // 保存表单设计
      saveFormDesign(){
        eventHub.$emit('saveForm');
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-design-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .header {
      width: 100%;
      height: 45px;
      z-index: 100;
      color: #fff;
      font-size: 13px;
      background-image: linear-gradient(54deg, #2b3341, #566276);
      background: #2b3441;
      display: flex;
      align-items: stretch;
      .left-container{
        width: 250px;
        .back-container {
          height: 45px;
          line-height: 45px;
          padding: 0 10px;
          cursor: pointer;
        }
      }
      .nav-container {
        flex: 1;
        .nav-bar {
          margin: 0 auto;
          width: 320px;
          list-style: none;
          height: 45px;
          line-height: 45px;
          li {
            float: left;
            width: 80px;
            text-align: center;
            cursor: pointer;
            &:hover {
              background: #1d2531;
            }
            &.active {
              background: #1d2531;
            }
          }
        }
      }
      .right-container {
        width: 250px;
        display: flex;
        justify-content: space-between;
        .save-container {
          cursor: pointer;
          float: right;
          height: 45px;
          line-height: 45px;
          padding: 0 10px;
          &:hover {
            background: #1d2531;
          }
        }
      }
    }
    .main-container {
      flex: 1;
      overflow: auto;
    }
  }
</style>
