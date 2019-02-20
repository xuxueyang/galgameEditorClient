<template>
  <div class="filter-data-container">
    <div @click="openDialog" class="set-filter-condition"><span class="notify">设置筛选条件</span></div>
    <el-dialog
      @open="onDialogOpen"
      title="设置筛选条件" width="450px"
      :visible.sync="filterDataVisible">
      <div class="filter-data-header">
        <span>数据关联将只能关联符合以下条件的数据</span>
      </div>
      <div class="filter-data-body">
        <div class="association-condition-row" v-for="(filter,index) in filters"
             :key="'association-condition-row_'+index">
          <el-select
            style="width:155px;"
            v-model="filter.tempQueId"
            placeholder="当前应用字段"
            size="medium">
            <el-option
              v-for="element in elements"
              :key="element.tempQueId"
              :label="element.title"
              :value="element.tempQueId">
            </el-option>
          </el-select>
          <span>的值等于</span>
          <el-select
            style="width:155px;"
            v-model="filter.relatedField"
            placeholder="外部表字段"
            size="medium">
            <el-option
              v-for="field in fields"
              :key="field.id"
              :label="field.name"
              :value="field.id">
            </el-option>
          </el-select>
          <div class="delete-container" @click="deleteFilter(index)">
            <i class="fa fa-trash"></i>
          </div>
        </div>
        <div class="add-container" @click="addFilter">
          <i class="fa fa-plus-circle"></i>
          <span>添加筛选条件</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import services from '../../../../service/back.service'
  export default{
    name: 'FilterRemoteData',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        filterDataVisible: false,
        // 筛选条件
        filters: [],
        // 当前应用表单元素
        elements: [],
        // 关联外部数据的字段
        fields: []
      }
    },
    methods: {
      // 属性变更
      onPropertyChange(key, value){
        this.$store.dispatch('setFormItemValue', {
          index: this.$store.state.dynamicForm.currentFormItem.index,
          rowIndex: this.$store.state.dynamicForm.currentFormItem.rowIndex,
          colIndex: this.$store.state.dynamicForm.currentFormItem.colIndex,
          key: key,
          value: value
        });
      },
      openDialog(){
        if (!this.config.associatedTableId) {
          this.$message.error('请先设置关联表');
          return;
        }
        if (!this.config.associatedFieldId) {
          this.$message.error('请先设置关联字段');
          return;
        }
        this.filterDataVisible = true;
      },
      closeDialog(){
        this.filterDataVisible = false;
      },
      onCancelClick(){
        this.closeDialog();
      },
      onConfirmClick(){
        const array = [];
        for (let i = 0; i < this.filters.length; i++) {
          const filter = this.filters[i];
          if (filter.tempQueId && filter.relatedField) {
            array.push(filter);
          }
        }
        this.onPropertyChange('associatedFilter', array);
        this.closeDialog();
      },
      // 初始化当前应用的表单元素
      initElements(){
        const array = [];
        for (let i = 0; i < this.$store.state.dynamicForm.formConfigs.length; i++) {
          const row = this.$store.state.dynamicForm.formConfigs[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            array.push(item);
          }
        }
        this.elements = array;
      },
      // 初始化关联应用表单元素
      async initRemoteFields(){
        const res = await services.getRemoteFields(this.config.associatedTableId);
        if (res.returnCode.startsWith('200')) {
          this.fields = res.data || [];
        }
      },
      // 弹出框弹出事件
      onDialogOpen(){
        // 初始化当前应用表单元素
        this.initElements();
        // 初始化关联应用表单元素
        this.initRemoteFields();
        this.filters = Object.assign([], this.config.associatedFilter);
      },
      // 新增筛选条件
      addFilter(){
        this.filters.push({tempQueId: null, relatedField: null});
      },
      // 删除筛选条件
      deleteFilter(index){
        this.filters.splice(index, 1);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "filter-remote-data";
</style>
