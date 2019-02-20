<template>
  <div class="form-design-container">
    <div class="left">
      <cube-dynamic-form-element></cube-dynamic-form-element>
    </div>
    <div class="center">
      <div class="form-content"
           :style="{paddingLeft:currentConfig.type?'0':'100px'}">
        <div class="dynamic-form">
          <div class="dynamic-form-header">
            <div class="form-header-main">
              <div class="form-header-title-area">
                <div v-if="!onEditName" @click="onNameClick" class="form-header-title">
                  <span>{{applicationName}}</span>
                </div>
                <el-input
                  ref="name_input"
                  v-if="onEditName"
                  @blur="onNameInputBlur"
                  v-model="applicationName"></el-input>
              </div>
            </div>
            <div class="form-header-attach">
              <div class="form-attach-row">
                <div :style="{height:applicationDescription?'auto':'32px'}" class="form-attach-inner"
                     @click="onDescriptionClick" v-show="!onEditDescription">
                  <i class="fa fa-commenting-o" v-if="!applicationDescription"></i>
                  <span v-html="applicationDescription||'添加应用描述'"></span>
                </div>
                <div class="ueditor-container" v-show="onEditDescription">
                  <quill-editor
                    v-model="applicationDescription"
                    :options="editorOption">
                  </quill-editor>
                  <!--<mf-editor v-model="applicationDescription"></mf-editor>-->
                  <el-button @click.native="onEditDescComplete" type="primary" size="medium" class="complete-button">完成
                  </el-button>
                </div>
              </div>
              <div class="form-attach-row">
                <el-upload
                  :file-list="attachments"
                  :on-success="onUplaodSuccess"
                  :on-error="onUploadError"
                  :on-remove="onRemoveFile"
                  :action="uploadUrl"
                  :headers="uploadHeaders">
                  <div class="form-attach-inner"
                       v-if="!attachments||attachments.length===0">
                    <i class="fa fa-upload"></i>
                    添加附件
                  </div>
                  <div class="form-upload-inner"
                       v-if="attachments&&attachments.length>0">
                    <i class="fa fa-plus"></i>
                    <span>上传附件</span>
                  </div>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="dynamic-form-body">
            <cube-dynamic-form :config="formConfigs" :configable="true"></cube-dynamic-form>
            <div class="dynamic-empty-container" v-if="!formConfigs||formConfigs.length===0">
              <div class="wrapper">
                <div class="empty-image"></div>
                <div class="empty-hint">点击左侧表单模块创建表单</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right" v-if="currentConfig.type">
      <cube-dynamic-config></cube-dynamic-config>
    </div>
  </div>
</template>

<script>
  import {CubeDynamicForm, CubeDynamicConfig, CubeDynamicFormElement}  from '../dynamic-form';
  import services from '../../service/back.service';
  import {eventHub} from '../../event/eventHub';
  export default{
    components: {
      CubeDynamicForm,
      CubeDynamicConfig,
      CubeDynamicFormElement
    },
    name: 'FormDesign',
    props: {
      applicationId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        onEditName: false,
        onEditDescription: false,
        uploadUrl: process.env.httpBaseUri + 'upload/api/file',
        uploadHeaders: {
          spaceUri: process.env.spaceUri,
          Authorization: 'Bearer ' + localStorage.getItem(`cube-${process.env.tenantCode}-access-token`),
        },
        editorOption: {
          placeholder: '请输入应用描述',
          theme: 'snow'
        },
        // 应用信息
        application: {},
        // 应用名
        applicationName: '',
        // 应用描述
        applicationDescription: '',
        // 应用附件
        attachments: [],
        // 提示框是否显示
        dialogVisible: false
      }
    },
    computed: {
      currentConfig(){
        return this.$store.state.dynamicForm.currentFormItem;
      },
      formConfigs(){
        return this.$store.state.dynamicForm.formConfigs;
      }
    },
    methods: {
      // 点击加入表单元素
      chooseFormElement(type){
        // 添加元素
        this.$store.dispatch('addFormItem', {type: type})
      },
      preview(){
        this.$emit('preview');
      },
      async save(){
        const res = await services.saveForm({
          attachment: this.attachments || [],
          description: this.applicationDescription,
          formData: JSON.stringify(this.$store.state.dynamicForm.formConfigs),
          id: this.application.id,
          name: this.applicationName
        });
        if (res.returnCode.startsWith('200')) {
          this.$message.success('保存成功');
          this.$store.dispatch('setFormChanged', false);
          return true;
        } else {
          return false;
        }
      },
      addFlow(){
        this.$emit('addFlow');
      },
      overallConfig(){
        this.$emit('overallConfig');
      },
      publishApplication(){
        this.$emit('applicationPublish', {id: this.application.id});
      },
      // 点击应用名
      onNameClick(){
        this.onEditName = true;
        const me = this;
        this.$nextTick(function () {
          me.$refs.name_input.focus();
        })
        // 标记表单被修改过了
        this.$store.dispatch('setFormChanged', true);
      },
      // 应用名输入框失去焦点
      onNameInputBlur(){
        this.onEditName = false;
      },
      // 点击应用描述
      onDescriptionClick(){
        this.onEditDescription = true;
        // 标记表单被修改过了
        this.$store.dispatch('setFormChanged', true);
      },
      // 应用描述修改完成
      onEditDescComplete(){
        this.onEditDescription = false;
      },
      // 上传附件成功
      onUplaodSuccess(res, file, fileList){
        if (res.returnCode.startsWith('200')) {
          if (res.data && res.data.length > 0) {
            const fileInfo = res.data[0];
            this.attachments.push(Object.assign(file, {url: fileInfo.url}));
          }
        }
        // 标记表单被修改过了
        this.$store.dispatch('setFormChanged', true);
      },
      // 上传失败
      onUploadError(err, file, fileList){
        if (err.status === 401) {
          this.$emit('Unauthorized');
        }
      },
      // 删除附件
      onRemoveFile(file, fileList){
        this.attachments = fileList;
        // 标记表单被修改过了
        this.$store.dispatch('setFormChanged', true);
      },
      // 离开时弹出保存提示
      openDialog(){
        this.dialogVisible = true;
      }
    },
    async mounted(){
      eventHub.$on('saveForm', this.save);
      if (this.applicationId) {
        this.$store.dispatch('setAppId', this.applicationId);
        const res = await  services.getApplicationInfo(this.applicationId);
        if (res.returnCode.startsWith('200')) {
          this.application = res.data;
          this.applicationName = res.data.cacheAppDto.name;
          this.applicationDescription = res.data.cacheAppDto.description;
          this.attachments = Object.assign([], res.data.cacheAppDto.attachment || []);
          // 将表单配置加入store
          // this.$store.dispatch('setFormConfigs', res.data.formData || []);
          const array = [];
          if (res.data.formData && res.data.formData.length > 0) {
            for (let i = 0; i < res.data.formData.length; i++) {
              const item = res.data.formData[i];
              if (!array[item.rowIndex]) {
                array[item.rowIndex] = [];
              }
              array[item.rowIndex][item.colIndex] = item;
            }
          }
          this.$store.dispatch('setFormConfigs', array);
        }
//        const res = await  services.getForm();
//        this.$store.dispatch('setFormConfigs', res)
      }
    },
    beforeDestroy(){
      eventHub.$off('saveForm', this.save);
    },
    destroyed(){
      this.$store.dispatch('setCurrentFormItem', {});
    }
  }
</script>

<style scoped lang="scss">
  @import "./form-design.scss";
</style>
