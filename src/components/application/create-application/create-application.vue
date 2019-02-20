<template>
  <div>
    <div class="create-application-container" @click="createApplication">
      <i class="fa fa-plus-circle"></i>
      <div class="add-text">创建新应用</div>
    </div>
    <el-dialog
      title="创建一个新的应用"
      :visible.sync="dialogVisible"
      width="30%">
      <el-input v-model="name" placeholder="请输入应用名" size="medium"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取 消</el-button>
        <el-button type="primary" @click="onConfirmClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    name: 'CreateApplication',
    data(){
      return {
        dialogVisible: false,
        name: ''
      }
    },
    methods: {
      createApplication(){
        this.dialogVisible = true;
      },
      // 点击确认
      onConfirmClick(){
        this.dialogVisible = false;
        this.$emit('onApplicationCreate', this.name);
      },
      // 点击取消
      onCancelClick(){
        this.dialogVisible = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './create-application.scss';
</style>
