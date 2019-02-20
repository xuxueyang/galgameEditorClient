<template>
  <div class="table-config-container">
    <div class="config-container">
      <div class="config-row" v-for="(child,index) in config.children" :key="'config-row_'+index">
        <div class="row-left">
          <i :class="child.icon"></i>
          <span>{{child.title}}</span>
        </div>
        <div class="row-right">
          <i class="fa fa-edit" @click="editChildProperty(index,child)"></i>
          <i class="fa fa-trash" @click="deleteChildProperty(index)"></i>
        </div>
      </div>
    </div>
    <el-dropdown trigger="click" @command="addCol">
      <div class="add-container">
        <i class="fa fa-plus-circle"></i>
        <span>添加字段</span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="input">单行文字</el-dropdown-item>
        <el-dropdown-item command="date">日期</el-dropdown-item>
        <el-dropdown-item command="number">数字</el-dropdown-item>
        <el-dropdown-item command="select">下拉框</el-dropdown-item>
        <el-dropdown-item command="checkbox">多项选择</el-dropdown-item>
        <el-dropdown-item command="data_association">数据关联</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default{
    name: 'TableConfig',
//    props: {
//      config: {
//        type: Object,
//        default: () => {
//        }
//      }
//    },
    computed: {
      config(){
        return this.$store.state.dynamicForm.currentFormItem
      }
    },
    methods: {
      // 添加新字段
      addCol(type){
        this.$store.dispatch('addChildToTable', {
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex,
          type: type
        });
      },
      // 编辑子字段属性
      editChildProperty(index, config){
        this.$store.dispatch('setChildType', config.type);
        this.$store.dispatch('setChildIndex', index);
      },
      // 删除表格的某个字段
      deleteChildProperty(index){
        this.$store.dispatch('deleteChildOfTable', {
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex,
          childIndex: index
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './table-config.scss';
</style>
