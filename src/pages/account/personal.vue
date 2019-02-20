<template>
  <div class="fy-personal-wrapper" v-if="nickName">
    <el-popover
      ref="personalPopover"
      placement="bottom-start"
      width="200"
      :visible-arrow="false"
      popper-class="personal-popover"
      trigger="click">
      <div slot="reference" class="personal-content">
        欢迎您，{{nickName}}
      </div>
      <div class="list-wrapper">
        <div class="item" @click="logout">
          <i class="fa fa-power-off"></i>
          <span>退出登录</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export default{
    name: 'Personal',
    computed: {
      nickName(){
        const userInfo = localStorage.getItem(`cube-${process.env.tenantCode}-user-info`);
        return userInfo ? JSON.parse(userInfo).nickName : null;
      }
    },
    methods: {
      logout(){
//        localStorage.removeItem(`cube-${process.env.tenantCode}-access-token`);
//        localStorage.removeItem(`cube-${process.env.tenantCode}-refresh-token`);
//        localStorage.removeItem(`cube-${process.env.tenantCode}-user-info`);
//        localStorage.removeItem(`cube-${process.env.tenantCode}-group-info`);
//        this.$refs.personalPopover.doClose();
//        this.$router.push({name: 'login'})
      }
    }
  }
</script>

<style lang="scss">
  .personal-popover {
    padding: 0;
    border: none;
    margin-top: 0 !important;
    .list-wrapper {
      background-color: #323b49;
      color: #fff;
      .item {
        padding: 0 15px;
        height: 45px;
        line-height: 45px;
        cursor: pointer;
      }
    }
  }

  .fy-personal-wrapper {
    height: 45px;
    line-height: 45px;
    .personal-content {
      float: right;
      padding: 0 20px;
      cursor: pointer;
      outline: none;
      &:hover {
        background: #1d2531;
      }
    }
  }


</style>
