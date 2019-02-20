<template>
  <div class="department-default-container">
    <div class="hint">默认内容</div>
    <select-department
      :is-tree="false"
      :departmentList="config.optionalDepartments"
      :checkedDepartments="config.defaultDepartments"
      @checkedDepartmentChange="onCheckedDepartmentChange"
      @deleteDepartment="onDeleteDepartment">
    </select-department>
  </div>
</template>

<script>
  import SelectDepartment from "../../../select-department/select-department";
  export default{
    components: {SelectDepartment},
    name: 'DepartmentDefault',
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
        this.onPropertyChange('defaultDepartments', data);
      },
      // 某个部门被删除
      onDeleteDepartment(data){
        this.$store.dispatch('deleteDefaultDepartmentById', {
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
  @import 'department-default.scss';
</style>
