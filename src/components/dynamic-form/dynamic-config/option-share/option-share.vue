<template>
  <div class="option-share-wrapper">
    <span class="option-share-title" @click="openDialog">管理选项份额</span>
    <!-- 管理选项份额弹出框 -->
    <el-dialog title="配置选项份额" width="450px" :visible.sync="optionShareVisible">
      <div class="option-share-header">
        <span>份额数值表示每个选项可以被选择的次数，默认不限</span>
      </div>
      <el-table
        :data="config.options"
        border
        max-height="400"
        style="width: 100%">
        <el-table-column
          prop="label"
          label="选项内容"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="已被选择"
          width="90">
        </el-table-column>
        <el-table-column
          prop="address"
          label="剩余可选"
          width="90">
        </el-table-column>
        <el-table-column
          prop="address"
          label="份额"
          width="120">
          <template slot-scope="scope">
            <el-input-number
              size="medium"
              :style="{width:'100px'}"
              :controls="false"
              :min="0">
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    name: 'OptionShare',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        optionShareVisible: false
      }
    },
    methods: {
      // 打开弹出框
      openDialog(){
        this.optionShareVisible = true;
      },
      // 点击取消
      onCancelClick(){
        this.optionShareVisible = false;
      },
      // 点击完成
      onConfirmClick(){
        this.optionShareVisible = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './option-share.scss';
</style>
