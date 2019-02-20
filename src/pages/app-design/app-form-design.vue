<template>
  <div class="app-form-design-container">
    <form-design
      ref="formDesign"
      :applicationId="$route.params.appId"
      @Unauthorized="onUnauthorized">
    </form-design>
    <el-dialog
      custom-class="confirm-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="350px">
      <div class="confirm-content">
        <div class="confirm-header">
          <i class="fa fa-save"></i>
          <div class="title">离开表单设计前，是否需要保存？</div>
        </div>
        <div class="confirm-body">
          <el-button @click="save" type="primary" style="width: 90%;margin-bottom: 10px;">保存并离开</el-button>
          <el-button @click="notSave" style="width: 90%;margin-bottom: 10px;">不保存</el-button>
          <el-button @click="cancel" class="cancel-button" style="width: 90%;margin-bottom: 10px;">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import FormDesign from "../../components/form-design/form-design"
  import {casLogin} from '../../util/util'
  export default{
    name: 'AppFormDesign',
    components: {FormDesign},
    data(){
      return {
        dialogVisible: false,
        next: null
      }
    },
    methods: {
      // 上传附件401
      onUnauthorized(){
        casLogin();
      },
      // 保存并离开
      save(){
        const res = this.$refs.formDesign.save();
        if (res) {
          this.$store.dispatch('setFormChanged', false);
          this.next();
        }
      },
      // 不保存
      notSave(){
        this.$store.dispatch('setFormChanged', false);
        this.next();
      },
      // 取消
      cancel(){
        this.dialogVisible = false;
      }
    },
    beforeRouteLeave(to, from, next){
      // 如果表单被修改过则提示保存
      if (this.$store.state.dynamicForm.formChanged) {
        if (to.name === 'login') {
          this.$store.dispatch('setFormChanged', false);
          next();
        } else {
          this.dialogVisible = true;
          this.next = next;
        }
      } else {
        next();
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-form-design-container {
    height: 100%;
    /deep/ .confirm-dialog .el-dialog__header {
      padding: 0;
    }

    /deep/ .confirm-dialog .el-dialog__body {
      padding: 0;
      .confirm-content {
        .confirm-header {
          padding-top: 30px;
          text-align: center;
          i {
            color: #409EFF;
            font-size: 40px;
          }
          .title {
            width: 120px;
            margin: 50px auto auto auto;
            font-size: 15px;
            line-height: 25px;
          }
        }
        .confirm-body {
          padding-top: 45px;
          text-align: center;
          /deep/ .el-button + .el-button {
            margin-left: 0;
          }
          /deep/ .cancel-button {
            border-color: transparent;
            &:hover {
              background-color: #fff;
            }
          }
        }
      }
    }
  }
</style>
