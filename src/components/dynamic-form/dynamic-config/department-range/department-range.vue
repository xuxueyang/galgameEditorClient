<template>
  <div class="department-range-container">
    <div class="hint">可选范围</div>
    <select-department
      :checkedDepartments="config.optionalDepartments"
      @checkedDepartmentChange="onCheckedDepartmentChange"
      @deleteDepartment="onDeleteDepartment">
    </select-department>
  </div>
</template>

<script>
  import SelectDepartment from "../../../select-department/select-department";
  export default{
    components: {SelectDepartment},
    name: 'DepartmentRange',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    methods: {
      // 属性变更
      onPropertyChange(key, value){
        this.$store.dispatch('setFormItemValue', {
          index: this.config.index,
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex,
          key: key,
          value: value
        });
      },
      // 选择的部门发生变更
      onCheckedDepartmentChange(data){
        this.onPropertyChange('optionalDepartments', data);
      },
      // 某个部门被删除
      onDeleteDepartment(data){
        this.$store.dispatch('deleteOptionalDepartmentById', {
          index: this.config.index,
          rowIndex: this.config.rowIndex,
          colIndex: this.config.colIndex,
          id: data
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './department-range.scss';
</style>
