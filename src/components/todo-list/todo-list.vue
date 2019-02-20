<template>
  <div class="todo-container" :class="{'showMenu':menuVisible}">
    <div class="sm-overlay" v-if="menuVisible" @click="menuVisible=false;"></div>
    <div class="left-menu">
      <el-menu
        :default-active="currentIndex"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="select">
        <el-menu-item index="9" @click="collapse" class="shrink-menu">
          <i class="fa fa-bars" :style="{'transform':isCollapse?'rotate(0)':'rotate(90deg)'}"></i>
        </el-menu-item>
        <el-menu-item index="1">
          <i class="fa fa-clock-o"></i>
          <template slot="title">
            <span>{{menuItem[0]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="fa fa-check-square"></i>
          <template slot="title">
            <span>{{menuItem[1]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="fa fa-send"></i>
          <template slot="title">
            <span>{{menuItem[2]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="fa fa-file-text-o"></i>
          <template slot="title">
            <span>{{menuItem[3]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="fa fa-calendar-check-o"></i>
          <template slot="title">
            <span>{{menuItem[4]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="fa fa-pencil-square-o"></i>
          <template slot="title">
            <span>{{menuItem[5]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="fa fa-check"></i>
          <template slot="title">
            <span>{{menuItem[6]}}</span>
          </template>
        </el-menu-item>
        <el-menu-item index="8">
          <i class="fa fa-close"></i>
          <template slot="title">
            <span>{{menuItem[7]}}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-contain">
      <data-table
        @getList="getList"
        style="margin-top: 10px;"
        v-if="dataSource&&dataSource.length > 0"
        :type="currentIndex"
        :dataSource="dataSource">
      </data-table>
      <div v-else class="empty-container">
        <div class="empty-img"></div>
        <p>当前没有事项需要处理</p>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/back.service'
  import DataTable from './data-table/data-table'

  export default {
    name: "todo-list",
    components: {DataTable},
    props: {
      appId: {
        type: String,
        default: null
      },
      currentIndex: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {
        menuItem: ['待办事项', '已办事项', '抄送事项', '草稿', '流程中', '待完善', '已通过', '已拒绝'],
        text: '待办事项',
        dataSource: [],
        isCollapse: false,
        // 小屏时是否显示菜单
        menuVisible: false
      }
    },
    watch: {
      currentIndex(){
        this.dataSource = [];
        this.getList();
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      // 获取列表数据
      getList(){
        if (this.currentIndex === '1') {
          this.getMyTask(this.appId);
        } else if (this.currentIndex === '2') {
          this.getFinishedTask(this.appId);
        } else if (this.currentIndex === '3') {
          this.getCarbonTask(this.appId);
        } else if (this.currentIndex === '4') {
          this.getDraft(this.appId);
        } else if (this.currentIndex === '5') {
          this.getResolvingTask(this.appId);
        } else if (this.currentIndex === '6') {
          this.getUnPerfectTask(this.appId);
        } else if (this.currentIndex === '7') {
          this.getPassedTask(this.appId);
        } else if (this.currentIndex === '8') {
          this.getRejectedTask(this.appId);
        }
      },
      // 获取待办事项
      async getMyTask(appId){
        const res = await service.getMyTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取抄送事项
      async getCarbonTask(appId){
        const res = await service.getCarbonTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取已办事项
      async getFinishedTask(appId){
        const res = await service.getFinishedTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取草稿
      async getDraft(appId){
        const res = await service.getTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取流程中事项
      async getResolvingTask(appId){
        const res = await service.getResolvingTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取待完善事项
      async getUnPerfectTask(appId){
        const res = await service.getUnPerfectTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取已通过事项
      async getPassedTask(appId){
        const res = await service.getPassedTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      // 获取已拒绝事项
      async getRejectedTask(appId){
        const res = await service.getRejectedTask(appId);
        if (res.returnCode.startsWith('200')) {
          this.dataSource = res.data ? res.data.reverse() : [];
        }
      },
      collapse(index) {
        this.isCollapse = !this.isCollapse;
      },
      select(event) {
        if (event !== '9') {
          this.text = this.menuItem[event - 1];
          this.$emit('onStatusChange', event);
        }
      },
      // 用于小屏显示菜单
      showMenu(){
        this.menuVisible = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    height: 45px;
    z-index: 100;
    color: #fff;
    font-size: 13px;
    background-image: linear-gradient(54deg, #2b3341, #566276);
    background: #2b3441;
  }

  .todo-container {
    display: flex;
    height: 100%;
    .left-menu {
      overflow: hidden;
      .el-menu {
        border: unset;
      }
      .spe-span {
        display: inline-block;
      }
      /deep/ .el-menu {
        height: 100%;
      }
      /deep/ .shrink-menu {
        text-align: center;
        i {
          transition: all .3s;
        }
      }
      /deep/ .el-menu--collapse {
        .el-menu-item {
          text-align: center;
        }
      }
    }
    @media screen and(max-width: 768px) {
      .left-menu {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        height: 100%;
        display: none;
      }
    }
    &.showMenu .left-menu {
      display: block;
    }
    .right-contain {
      flex: 1;
      padding: 10px 10px 10px 20px;
      overflow: auto;
      .top-menu {
        overflow: hidden;
      }
      .empty-container {
        text-align: center;
        margin-top: 120px;
        .empty-img {
          background-image: url('./assets/emptyData.png');
          background-size: contain;
          width: 100px;
          display: inline-block;
          height: 100px;
          background-repeat: no-repeat;
        }
      }
    }
    .sm-overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 998;
      display: none;
    }
    @media screen and(max-width: 768px) {
      .sm-overlay {
        display: block;
      }
    }
  }

  .el-menu-item {
    height: 45px;
    line-height: 45px;
  }
</style>
