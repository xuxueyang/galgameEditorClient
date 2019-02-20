<template>
  <div class="application-publish-container">
    <div class="publish-container" v-if="application.status&&(application.status==='P'||application.status==='SP')">
      <div class="top-container">
        <div class="process"></div>
        <div class="right-content">
          <div class="title">应用已开启，数据飞速流转中...</div>
          <div class="last-publish">最近发布：{{application.lastPublishDate | date}}</div>
          <el-button v-if="application.status==='SP'" type="primary" class="publish-button"
                     @click="dialogVisible=true;">重新发布 有新内容
          </el-button>
          <el-button v-if="application.status==='P'" :disabled="true" type="primary" class="publish-button">重新发布
          </el-button>
          <el-button v-if="false" class="publish-button" style="margin-top: 10px;">放弃所有更改</el-button>
          <div class="sub-title">当应用内容有修改或增减时需要重新发布</div>
        </div>
        <div style="clear: both;"></div>
      </div>
    </div>

    <div class="publish-container" v-if="application.status&&application.status==='UP'">
      <div class="top-container">
        <div class="process"></div>
        <div class="right-content">
          <div class="title">应用准备就绪，立刻发布！</div>
          <el-button type="primary" class="publish-button" @click="dialogVisible=true;">发布应用</el-button>
          <el-button v-if="false" class="publish-button" style="margin-top: 10px;">放弃所有更改</el-button>
          <div class="sub-title">当应用内容有修改或增减时需要重新发布</div>
        </div>
        <div style="clear: both;"></div>
      </div>
    </div>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>应用重新发布后，将覆盖现有版本</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="publishApplication">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import services from '../../service/back.service'
  export default{
    name: 'ApplicationPublish',
    props: {
      applicationId: {
        type: String,
        default: null
      }
    },
    data(){
      return {
        dialogVisible: false,
        application: {}
      }
    },
    filters: {
      date(value){
        if (value) {
          return (new Date(value)).toLocaleString()
        } else {
          return null
        }
      }
    },
    async mounted(){
      // 查询应用状态
      const res = await services.getApplicationInfo(this.applicationId);
      if (res.returnCode.startsWith('200')) {
        this.application = res.data;
      }
    },
    methods: {
      // 发布应用
      async publishApplication(){
        this.dialogVisible = false;
        const res = await services.publishApplication(this.applicationId);
        if (res.returnCode.startsWith('200')) {
          this.$message.success('发布成功');
          this.$emit('applicationPublishSuccess');
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./application-publish.scss";
</style>
