<template>
  <div class="app-affair-container">
    <div class="header">
      <div class="left-container">
        <div @click="goAppList" class="back-container">
          <i class="fa fa-angle-left" style="font-size: 20px;"></i>
        </div>
        <div class="menu-shrink" @click="showMenu">
          <i class="fa fa-bars"></i>
        </div>
      </div>
      <div class="center-container"></div>
      <div class="right-container">
        <!--<personal></personal>-->
      </div>
    </div>
    <div class="main-container">
      <todo-list
        ref="todoList"
        :appId="$route.params.appId"
        :currentIndex="$route.params.status"
        @onStatusChange="onStatusChange">
      </todo-list>
    </div>
  </div>
</template>

<script>
  import TodoList from "../../components/todo-list/todo-list"
  import Personal from "../account/personal";

  export default {
    name: "AppAffair",
    components: {
      Personal,
      TodoList
    },
    methods: {
      goAppList(){
        this.$router.push({name: 'app-list'});
      },
      // 菜单切换事件
      onStatusChange(data){
        this.$router.replace({name: 'app-affair', params: {appId: this.$route.params.appId, status: data}})
      },
      // 显示菜单
      showMenu(){
        this.$refs.todoList.showMenu();
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-affair-container {
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
      .left-container {
        width: 160px;
        display: flex;
        align-items: center;
        .back-container {
          height: 45px;
          line-height: 45px;
          padding: 0 10px;
          cursor: pointer;
        }
        .menu-shrink {
          width: 45px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          font-size: 16px;
          cursor: pointer;
          display: none;
        }
        @media screen and(max-width: 768px) {
          .menu-shrink {
            display: block;
          }
        }
      }
      .center-container {
        flex: 1;
      }
      .right-container {
        width: 160px;
      }
    }
    .main-container {
      flex: 1;
      overflow: auto;
    }
  }
</style>
