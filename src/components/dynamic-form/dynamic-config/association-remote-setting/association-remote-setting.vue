<template>
  <div>
    <el-select
      @change="onTableChange"
      v-model="config.associatedTableId"
      :clearable="true"
      style="width: 100%;margin-bottom: 10px;">
      <el-option
        v-for="table in tables"
        :key="table.id"
        :label="table.name"
        :value="table.id">
      </el-option>
    </el-select>
    <el-select
      @change="onFieldChange"
      v-model="config.associatedFieldId"
      :clearable="true"
      style="width: 100%;">
      <el-option
        v-for="field in fields"
        :key="field.id"
        :label="field.name"
        :value="field.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import services from '../../../../service/back.service'
  export default{
    name: 'AssociationRemoteSetting',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        tables: [],
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
      // 更新关联配置
      updateAssociatedInfo(){
        this.getTables();
        if (this.config.associatedTableId) {
          this.getFields(this.config.associatedTableId);
        }
      },
      // 查询所有应用
      async getTables(){
        const res = await services.getRemoteTables()
        if (res.returnCode.startsWith('200')) {
          this.tables = res.data || [];
        }
      },
      // 查询应用下的所有表单元素
      async getFields(id){
        const res = await services.getRemoteFields(id);
        if (res.returnCode.startsWith('200')) {
          this.fields = res.data || [];
        }
      },
      // 所选应用变更
      onTableChange(data){
        this.onPropertyChange('associatedTableId', data);
        this.onPropertyChange('associatedFieldId', null);
        this.getFields(data);
      },
      // 所选的表单元素变更
      onFieldChange(data){
        this.onPropertyChange('associatedFieldId', data);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'association-remote-setting';
</style>
