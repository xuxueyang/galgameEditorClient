<template>
  <div class="application-wrapper">
    <div class="application-home">
      <div class="applist-container">
        <el-row :gutter="10">
          <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <create-application @onApplicationCreate="createApplication"></create-application>
          </el-col>
          <el-col v-for="application in applications" :key="application.id" :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
            <application-item
              :data="application"
              @onApply="onApply"
              @onToDo="onToDo"
              @onEditApplication="editApplication"
              @onCopyApplication="copyApplication"
              @onDeleteApplication="deleteApplication">
            </application-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateApplication from './create-application/create-application.vue'
  import ApplicationItem from './application-item/application-item.vue'
  import services from '../../service/back.service'

  export default {
    name: 'Application',
    components: {
      CreateApplication,
      ApplicationItem
    },
    data() {
      return {
        applications: []
      }
    },
    methods: {
      // 获取应用
      async getApplications(){
        const res = await services.getApplications();
        if (res.returnCode.startsWith('200')) {
          this.applications = res.data || [];
        }
      },
      // 创建应用
      async createApplication(name) {
        const res = await services.createApplication({name: name});
        if (res.returnCode.startsWith('200')) {
          this.$emit('onCreateApplicationSuccess', {id: res.data});
        }
      },
      // 编辑应用
      editApplication(data) {
        this.$emit('onEditeApplication', data);
      },
      // 发起申请
      onApply(data) {
        this.$emit('onApply', data);
      },
      onToDo(data) {
        this.$emit('onToDo', data);
      },
      // 删除应用
      async deleteApplication(data) {
        const res = await services.deleteApplication(data.id);
        if (res.returnCode.startsWith('200')) {
          this.$message.success('删除应用成功');
          this.applications = this.applications.filter((application) => application.id !== data.id);
        }
      },
      // 复制应用
      async copyApplication(data){
        const res = await services.copyApplication(data.id);
        if (res.returnCode.startsWith('200')) {
          this.$message.success('复制应用成功');
          this.getApplications();
        } else if(res.returnCode==='6008'){
          this.$message.error('该应用未发布');
        }
      }
    },
    mounted() {
      this.getApplications();
    }
  }
</script>

<style scoped lang="scss">
  @import './application.scss';
</style>
