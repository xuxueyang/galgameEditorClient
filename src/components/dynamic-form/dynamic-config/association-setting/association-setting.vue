<template>
  <div>
    <el-select
      @change="onApplicationChange"
      v-model="config.associatedAppliationId"
      :clearable="true"
      style="width: 100%;margin-bottom: 10px;">
      <el-option
        v-for="application in applications"
        :key="application.id"
        :label="application.name"
        :value="application.id">
      </el-option>
    </el-select>
    <el-select
      @change="onElementChange"
      v-model="config.associatedElementId"
      :clearable="true"
      style="width: 100%;">
      <el-option
        v-for="element in elements"
        :key="element.queId"
        :label="element.title"
        :value="element.queId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import services from '../../../../service/back.service'
  export default{
    name: 'AssociationSetting',
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        applications: [],
        elements: []
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
        this.getApplications();
        if (this.config.associatedAppliationId) {
          this.getElements(this.config.associatedAppliationId);
        }
      },
      // 查询所有应用
      async getApplications(){
        const res = await services.getApplications({status: 'P,SP'});
        if (res.returnCode.startsWith('200')) {
          this.applications = res.data;
        }
      },
      // 查询应用下的所有表单元素
      async getElements(id){
        const res = await services.getFormElements({isPublish: true, appId: id});
        if (res.returnCode.startsWith('200')) {
          this.elements = res.data || [];
        }
      },
      // 所选应用变更
      onApplicationChange(data){
        this.onPropertyChange('associatedAppliationId', data);
        this.onPropertyChange('associatedElementId', null);
        this.getElements(data);
      },
      // 所选的表单元素变更
      onElementChange(data){
        this.onPropertyChange('associatedElementId', data);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './association-setting.scss';
</style>
