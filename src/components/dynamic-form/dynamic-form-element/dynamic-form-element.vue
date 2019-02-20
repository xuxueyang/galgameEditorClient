<template>
  <div class="dynamic-form-elements">
    <div class="header">
      表单模块
    </div>
    <div class="content">
      <el-row>
        <el-col :span="8" v-for="(element,index) in formElements" :key="'formElements_'+index"
                @click.native="chooseFormElement(element.type)">
          <div class="box"><i :class="element.icon"></i>{{element.name}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {FORM_ITEM_CONFIG} from '../dynamic-form.config';
  export default{
    name: 'CubeDynamicFormElement',
    data() {
      return {
        formElements: [
          {type: 'description', name: '描述文字', icon: FORM_ITEM_CONFIG['description']['icon']},
          {type: 'input', name: '单行文字', icon: FORM_ITEM_CONFIG['input']['icon']},
          {type: 'textarea', name: '多行文字', icon: FORM_ITEM_CONFIG['textarea']['icon']},
          {type: 'date', name: '日期', icon: FORM_ITEM_CONFIG['date']['icon']},
          {type: 'email', name: '邮箱', icon: FORM_ITEM_CONFIG['email']['icon']},
          {type: 'phone', name: '手机', icon: FORM_ITEM_CONFIG['phone']['icon']},
          {type: 'number', name: '数字', icon: FORM_ITEM_CONFIG['number']['icon']},
          {type: 'url', name: '链接', icon: FORM_ITEM_CONFIG['url']['icon']},
          {type: 'radio', name: '单项选择', icon: FORM_ITEM_CONFIG['radio']['icon']},
          {type: 'select', name: '下拉选择', icon: FORM_ITEM_CONFIG['select']['icon']},
          {type: 'checkbox', name: '多项选择', icon: FORM_ITEM_CONFIG['checkbox']['icon']},
          {type: 'upload', name: '附件上传', icon: FORM_ITEM_CONFIG['upload']['icon']},
          {type: 'start_stop_time', name: '起止时间', icon: FORM_ITEM_CONFIG['start_stop_time']['icon']},
          {type: 'data_association', name: '数据关联', icon: FORM_ITEM_CONFIG['data_association']['icon']},
          {type: 'remote_association', name: '数据关联(外部)', icon: FORM_ITEM_CONFIG['remote_association']['icon']},
          {type: 'member', name: '成员', icon: FORM_ITEM_CONFIG['member']['icon']},
          {type: 'department', name: '部门', icon: FORM_ITEM_CONFIG['department']['icon']},
          {type: 'role_member', name: '角色成员', icon: FORM_ITEM_CONFIG['role_member']['icon']},
          {type: 'editor', name: '富文本', icon: FORM_ITEM_CONFIG['editor']['icon']},
          {type: 'table', name: '表格', icon: FORM_ITEM_CONFIG['table']['icon']}
        ]
      }
    },
    methods: {
      // 点击加入表单元素
      chooseFormElement(type){
        // 添加元素
        this.$store.dispatch('addFormItem', {type: type})
      },
    }
  }
</script>

<style scoped lang="scss">
  @import './dynamic-form-element.scss';
</style>
