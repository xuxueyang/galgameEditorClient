<template>
  <div class="quick-add-node-container" @click.stop="preventClickEvent">
    <div class="header" :class="node_head_class"></div>
    <div class="node-name-wrapper">
      <div class="hint">节点名称</div>
      <el-input v-model="nodeName" size="small"></el-input>
    </div>
    <div class="select-user-wrapper">
      <div class="title" v-if="mNodeType===3">抄送至</div>
      <div class="title" v-else>负责人</div>
      <div class="audit-user-wrapper">
        <select-user
          ref="selectUser"
          :checkedUsers="auditUserInfos"
          :showDynamic="true"
          @onCheckedUsersChange="onCheckedUsersChange"
          @deleteUser="deleteUser"
          @deleteDynamic="deleteDynamic"
          :showFormMember="mNodeType===1||mNodeType===8"
          :formMembers="formMembers"
          :showSuperior="mNodeType!==8"
          style="display: inline-block;vertical-align: middle;width: 486px;"></select-user>
      </div>
    </div>
    <div class="footer">
      <el-button @click="createNode" type="primary" size="small"
                 style="float: right;background-color: #f5bc21;border-color: #f5bc21;">创建
      </el-button>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
  import SelectUser from "../../../select-user/select-user";
  const WORKFLOW_TYPE_APPLY = 0; // 申请节点
  const WORKFLOW_TYPE_APPROVAL = 1; //审批节点
  const WORKFLOW_TYPE_FILL_IN = 2; // 填写节点
  const WORKFLOW_TYPE_CARBON_COPY = 3; // 抄送节点
  const WORKFLOW_TYPE_BRANCH_NODE = 4; // 分支节点
  const WORKFLOW_TYPE_QROBOT_ADD = 5; // q-robot添加
  const WORKFLOW_TYPE_QROBOT_UPDATE = 6; // q-robot更新
  const WORKFLOW_TYPE_BRANCH = 7; // 分支信息
  const WORKFLOW_TYPE_MULTI_AUDIT = 8; // 逐级审批节点
  export default{
    components: {SelectUser},
    name: 'QuickAddNode',
    props: {
      nodeType: {
        type: Number,
        default: null
      }
    },
    data(){
      return {
        nodeName: '',
        auditUserInfos: this.nodeType === WORKFLOW_TYPE_QROBOT_ADD || this.nodeType === WORKFLOW_TYPE_QROBOT_UPDATE ? [{needApplyUser: true}] : []
      }
    },
    computed: {
      mNodeType: {
        get(){
          return this.nodeType;
        },
        set(value){

        }
      },
      node_head_class(){
        return {
          'node_bg_review': this.mNodeType === WORKFLOW_TYPE_APPROVAL || this.mNodeType === WORKFLOW_TYPE_MULTI_AUDIT,
          'node_bg_write': this.mNodeType === WORKFLOW_TYPE_APPLY || this.mNodeType === WORKFLOW_TYPE_FILL_IN,
          'node_bg_copy': this.mNodeType === WORKFLOW_TYPE_CARBON_COPY,
          'node_bg_robot': this.mNodeType === WORKFLOW_TYPE_QROBOT_ADD || this.mNodeType === WORKFLOW_TYPE_QROBOT_UPDATE
        }
      },
      formMembers(){
        const array = []
        const configs = this.$store.state.flow.formConfigs
        if (configs && configs.length > 0) {
          configs.forEach((value) => {
            value.forEach((v) => {
              if (v.type === 'member') {
                array.push(v)
              }
            })
          })
        }
        return array
      }
    },
    methods: {
      createNode(){
        this.$emit('onCreate', {nodeName: this.nodeName, auditUserInfos: this.auditUserInfos})
      },
      preventClickEvent(){
        this.$refs.selectUser.hidePopover();
      },
      onDocumentClick(){
        if (this.mNodeType) {
          this.$emit('onCreate', {nodeName: this.nodeName, auditUserInfos: this.auditUserInfos});
        }
      },
      // 选择的用户变更
      onCheckedUsersChange(data){
        const users = data && data.length > 0 ? data : null;
        this.auditUserInfos = users && users.length > 0 ? users : null;
      },
      // 删除用户
      deleteUser(id){
        const users = this.auditUserInfos.filter((user) => user.id !== id);
        this.auditUserInfos = users && users.length > 0 ? users : null;
      },
      // 删除动态负责人
      deleteDynamic(type){
        let users = [];
        if (type === 'applyer') {
          users = this.auditUserInfos.filter((user) => !user.needApplyUser);
        } else if (type === 'leader') {
          users = this.auditUserInfos.filter((user) => !user.createIdForLeader);
        } else if(type==='formMember'){
          users = this.auditUserInfos.filter((user) => !user.memQueId);
        } else if(type==='superior'){
          users = this.auditUserInfos.filter((user) => !user.groupSuperior);
        }
        this.auditUserInfos = users && users.length > 0 ? users : null;
      }
    },
    created(){
      this.nodeName = this.mNodeType === 5 ? 'Q-Robot · 自动添加数据' : (this.mNodeType === 6 ? 'Q-Robot · 自动更新数据' : '未命名节点')
      document.addEventListener('click', this.onDocumentClick)
    },
    destroyed(){
      this.mNodeType = null;
      document.removeEventListener('click', this.onDocumentClick)
    }
  }
</script>

<style scoped lang="scss">
  @import "./quick-add-node.scss";
</style>
