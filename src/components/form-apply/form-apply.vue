<template>
  <div class="form-container">
    <!--有权限申请-->
    <div class="full-form" v-if="formAvailable">
      <div class="form-header">
        <div class="title-bar"></div>
        <div class="header-content">
          <div class="header-title">{{application.name}}</div>
          <div class="header-description" v-if="application.description" v-html="application.description"></div>
          <div class="form-attach" v-for="(attach,index) in application.attachment" :key="'attach_'+index"
               @click="downloadFile(attach)">
            <div class="file-name">{{attach.name}}</div>
            <div class="download-wrapper">
              <i class="fa fa-download"></i>
              <span>下载附件</span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <cube-dynamic-form @Unauthorized="onUnauthorized" :config="formConfigs" :isApply="true"
                           ref="dynamicForm"></cube-dynamic-form>
      </div>
      <div class="form-footer">
        <el-button @click="submitDraft">暂存</el-button>
        <el-button @click="submitForm" type="primary">提交</el-button>
      </div>
    </div>
    <!--无权限提示-->
    <div class="error-container" v-if="noPermission">
      <div class="content">
        <div class="header">
          <i class="fa fa-power-off"></i>
          <div class="title">您没有权限访问该应用</div>
        </div>
        <div class="footer">
          <el-button @click="onKnownClick" type="primary" style="width: 140px;">我知道了</el-button>
        </div>
      </div>
    </div>
    <!--应用未发布提示-->
    <div class="error-container" v-if="notPublished">
      <div class="content">
        <div class="header">
          <i class="fa fa-power-off"></i>
          <div class="title">该应用未发布</div>
        </div>
        <div class="desc">
          该应用未发布，如有需要，请联系应用创建人
        </div>
        <div class="footer">
          <el-button @click="onKnownClick" type="primary" style="width: 140px;">我知道了</el-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {CubeDynamicForm} from '../dynamic-form';
  import services from '../../service/back.service';
  export default{
    name: 'FormApply',
    components: {
      CubeDynamicForm,
    },
    props: {
      applicationId: {
        type: String,
        default: null
      }
    },
    data(){
      return {
        application: {},
        formConfigs: [],
        formAvailable: false,
        // 没权限
        noPermission: false,
        // 应用未发布
        notPublished: false
      }
    },
    methods: {
      submitForm(){
        this.$refs.dynamicForm.checkValidate(async (res) => {
          if (res) {
            const response = await services.submitApply(this.applicationId, {
              formdataJson: JSON.stringify(res),
              status: 'P'
            });
            if (response.returnCode.startsWith('200')) {
              this.$message.success('申请成功');
              this.$emit('submitSuccess');
            }
          }
        });
      },
      submitDraft(){
        this.$refs.dynamicForm.checkValidate(async (res) => {
          if (res) {
            const response = await services.submitApply(this.applicationId, {
              formdataJson: JSON.stringify(res),
              status: 'D'
            });
            if (response.returnCode.startsWith('200')) {
              this.$message.success('保存草稿成功');
              this.$emit('submitSuccess');
            }
          }
        });
      },
      // 下载附件
      async downloadFile(attach){
        window.open(attach.url);
      },
      // 点击我知道了
      onKnownClick(){
        this.$emit('onKnownClick');
      },
      // 获取应用表单
      async getFormData(){
        const res = await services.getFormElementsByNode(this.applicationId);
        if (res.returnCode.startsWith('200')) {
          this.application = res.data.app;
          const array = [];
          if (res.data.formData && res.data.formData.length > 0) {
            for (let i = 0; i < res.data.formData.length; i++) {
              const formItem = res.data.formData[i];
              if (array.length <= formItem.rowIndex) {
                array.push([]);
              }
              array[formItem.rowIndex].push(formItem);
            }
          }
          this.formConfigs = array;
        }
      },
      // 上传附件401
      onUnauthorized(){
        this.$emit('Unauthorized');
      }
    },
    async mounted(){
      // 先判断当前用户是否有权限
      const permissionRes = await services.hasPermissionApply(this.applicationId);
      if (permissionRes.returnCode.startsWith('200')) {
        // 没权限申请
        if (!permissionRes.data) {
          this.noPermission = true;
        } else {
          // TODO 验证是否需要密码
          this.getFormData();
          this.formAvailable = true;
        }
      } else if (permissionRes.returnCode === '6072') {
        this.notPublished = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'form-apply';
</style>
