<template>
  <div class="app-management-container">
    <div class="header">
      <div class="left-wrapper"></div>
      <div class="center-wrapper">
        <!--<ul class="nav-bar">-->
        <!--<li>应用</li>-->
        <!--<li>数据</li>-->
        <!--<li>管理</li>-->
        <!--</ul>-->
      </div>
      <div class="right-wrapper">
        <!--<personal></personal>-->
      </div>
    </div>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import Personal from "../account/personal";
  export default{
    components: {Personal},
    name: 'AppManagement'
  }
</script>

<style scoped lang="scss">
  .app-management-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    .header {
      width: 100%;
      height: 45px;
      z-index: 100;
      color: #fff;
      font-size: 13px;
      background-image: linear-gradient(54deg, #2b3341, #566276);
      background: #2b3441;
      display: flex;
      .left-wrapper {
        width: 160px;
      }
      .center-wrapper {
        flex: 1;
        .nav-bar {
          margin: 0 auto;
          width: 240px;
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
          }
        }
      }
      .right-wrapper {
        width: 160px;
        height: 45px;
        line-height: 45px;
      }
    }
    .main-container {
      flex: 1;
      overflow: auto;
    }
  }
</style>
