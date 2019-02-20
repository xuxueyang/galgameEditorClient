<template>
  <div>
    <div class="application-item-container" @click.stop="onToDo">
      <div class="item-name">{{data.name}}</div>
      <div class="item-footer">
        <div class="app-status" v-if="appStatus">{{appStatus}}</div>
        <div class="action-container">
          <el-tooltip class="item" effect="dark" content="发起申请" placement="bottom">
            <i @click.stop="onApply" class="fa fa-edit"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑应用" placement="bottom">
            <i @click.stop="onEditApplication" class="fa fa-gear"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除应用" placement="bottom">
            <el-popover
              ref="actionPopover"
              popper-class="operate-custom"
              width="150">
              <i slot="reference" class="fa fa-bars" @click.stop="preventDefault"></i>
              <ul class="app-operate">
                <li @click.stop="copyApplication">
                  <i class="fa fa-copy"></i>
                  <span>复制应用</span>
                </li>
                <li @click.stop="clickDelete">
                  <i class="fa fa-trash-o"></i>
                  <span>删除应用</span>
                </li>
              </ul>
            </el-popover>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>确定删除该应用吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false;cancelDelete()">取 消</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false;onDeleteApplication()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    name: 'ApplicationItem',
    props: {
      data: {
        type: Object,
        default: () => {
        }
      },
    },
    computed: {
      appStatus(){
        let status = '';
        switch (this.data.status) {
          case 'UP':
            status = '应用未发布';
            break;
          case 'SP':
            status = '有未发布更改';
            break;
          default:
            break;
        }
        return status;
      }
    },
    data(){
      return {
        deleteDialogVisible: false
      }
    },
    methods: {
      // 编辑应用
      onEditApplication(){
        this.$emit('onEditApplication', this.data);
      },
      // 发起申请
      onApply(){
        this.$emit('onApply', this.data);
      },
      onToDo() {
        this.$emit('onToDo', this.data);
      },
      // 取消删除
      cancelDelete(){

      },
      // 删除应用
      onDeleteApplication(){
        this.$emit('onDeleteApplication', {id: this.data.id});
      },
      // 阻止冒泡
      preventDefault(){

      },
      // 点击删除应用
      clickDelete(){
        this.deleteDialogVisible = true;
      },
      // 复制应用
      copyApplication(){
        this.$emit('onCopyApplication', {id: this.data.id});
        this.$refs.actionPopover.doClose();
      }
    }
  }
</script>

<style lang="scss">
  @import "./application-item.scss";
</style>
