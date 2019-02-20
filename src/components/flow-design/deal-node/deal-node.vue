<template>
  <div>
    <div class="deal-node">
      <div class="deal-node-box" @click="modalVisible=true;">
        <el-popover
          v-if="node.type!==0"
          ref="deletePopover"
          width="220">
          <div class="delete-wrapper" slot="reference" @click.stop="clickDelete">
            <i class="fa fa-times" @click.stop="clickDelete"></i>
          </div>
          <p>确认删除该节点吗</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="cancelDelete">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDelete">确定</el-button>
          </div>
        </el-popover>
        <div class="head-row" :class="node_head_class">
          <span class="user-name">{{node.auditNodeName}}</span>
        </div>
        <div class="foot-row">
          <div class="write-range">
            <span v-if="node.type===0&&node.applyConfig.applyType===1">工作区可填</span>
            <template v-if="(node.type===0&&node.applyConfig.applyType===2)||node.type!==0">
              <div v-if="node.auditUserInfos&&node.auditUserInfos.length>0">
                <el-tooltip
                  placement="top"
                  :content="showTooltip(member)"
                  v-for="(member,index) in node.auditUserInfos"
                  :key="member.id"
                  v-if="index<7">
                  <div class="member-item" v-if="member.email"></div>
                  <div class="member-item applyer" v-if="member.needApplyUser">
                    <i class="fa fa-paper-plane"></i>
                  </div>
                  <div class="member-item leader" v-if="member.createIdForLeader">
                    <i class="fa fa-thumb-tack"></i>
                  </div>
                  <div class="member-item superior" v-if="member.groupSuperior">
                    <i class="fa fa-rocket"></i>
                  </div>
                  <div class="member-item form-member" v-if="member.memQueId">
                    <i class="fa fa-grav"></i>
                  </div>
                </el-tooltip>
                <span class="over-number" v-if="node.auditUserInfos.length>7">&nbsp;.&nbsp;{{node.auditUserInfos.length}}</span>
              </div>
              <span v-else>{{node.type === 0 ? '未指定申请人' : '未设置负责人'}}</span>
            </template>
            <span v-if="node.type===0&&node.applyConfig.applyType===3">所有人可填</span>
          </div>
        </div>
        <div class="foot-note">
          <node-status-detail :node="node"></node-status-detail>
        </div>
      </div>
      <div class="line-in-middle">
        <add-node :node="node" :rootIndex="rootIndex"></add-node>
      </div>

      <el-dialog
        :visible.sync="modalVisible"
        @open="onDialogOpen"
        width="735px"
        custom-class="modal-wrapper"
        :show-close="false">
        <div slot="title" class="header" :class="node_head_class">
          <div class="node-name" @click="editNodeName" v-if="!onEditNodeName">
            <span>{{node.auditNodeName}}</span>
            <i class="fa fa-edit"></i>
          </div>
          <div class="node-name" v-if="onEditNodeName">
            <el-input v-model="node.auditNodeName" ref="node_name_input" @blur="onNodeNameBlur"></el-input>
          </div>
        </div>
        <div class="node-body">
          <div class="node-base-info">
            <!--申请节点-->
            <div class="select-user-container" v-if="node.type===0">
              <div class="applyer">申请人</div>
              <div class="set-user">
                <el-select style="width: 165px;" @change="applyRangeChange" v-model="node.applyConfig.applyType"
                           placeholder="请选择"
                           size="medium">
                  <el-option label="工作区可填" :value="1">
                  </el-option>
                  <el-option label="指定用户可填" :value="2">
                  </el-option>
                  <el-option label="所有人可填" :value="3">
                  </el-option>
                </el-select>
                <template v-if="node.applyConfig.applyType===2">
                  <div class="divider"></div>
                  <select-user
                    :checkedUsers="node.auditUserInfos"
                    @onCheckedUsersChange="onCheckedUsersChange"
                    @deleteUser="deleteUser"
                    style="display: inline-block;vertical-align: middle;width: 486px;"></select-user>
                </template>
              </div>
            </div>
            <!--审批节点,填写节点-->
            <div class="select-user-container" v-else>
              <div class="applyer" v-if="node.type===1||node.type===2||node.type===5||node.type===6||node.type===8">
                负责人
              </div>
              <div class="applyer" v-if="node.type===3">抄送至</div>
              <select-user
                :showDynamic="true"
                :checkedUsers="node.auditUserInfos"
                @onCheckedUsersChange="onCheckedUsersChange"
                @deleteUser="deleteUser"
                @deleteDynamic="deleteDynamic"
                :showFormMember="node.type===1||node.type===8"
                :formMembers="formMembers"
                :showSuperior="node.type!==8"
                style="margin-top: 15px;"></select-user>
            </div>
            <!--申请节点-->
            <div class="special-setting-container" v-if="node.type===0">
              <div class="checkbox-container">
                <el-checkbox v-model="applyPass" @change="applyPassCheckboxChange">设置填写密码
                </el-checkbox>
                <el-input v-if="applyPass" @blur="applyPassBlur" v-model="node.applyConfig.applyPass" size="medium"
                          style="width: 120px;margin-left: 40px;"></el-input>
              </div>
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.applyConfig.canApplyRevert">允许申请人撤回申请</el-checkbox>
              </div>
              <div class="checkbox-container" v-if="node.applyConfig.applyType!==3">
                <el-checkbox v-model="applyNum" @change="applyNumCheckboxChange">限制申请次数</el-checkbox>
                <span class="checkbox-detail" v-if="applyNum">
                  <span>每人最多申请</span>
                  <el-input-number @blur="applyNumBlur" :min="0" :controls="false"
                                   v-model="node.applyConfig.canApplyNum" size="medium"
                                   style="width: 120px;margin: 0 10px;"></el-input-number>
                  <span>次</span>
                </span>
              </div>
            </div>
            <!--审批节点-->
            <div class="special-setting-container" v-if="node.type===1">
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.auditFeedback">允许负责人填写处理反馈</el-checkbox>
              </div>
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.revert">允许回退操作</el-checkbox>
                <el-tooltip class="item" effect="dark" content="负责人可以将数据回退到任意节点" placement="bottom">
                  <i class="fa fa-question-circle"></i>
                </el-tooltip>
              </div>
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.transfer">允许转交数据至其他成员</el-checkbox>
                <el-tooltip class="item" effect="dark" content="负责人可以将数据的处理权限转交给其他成员" placement="bottom">
                  <i class="fa fa-question-circle"></i>
                </el-tooltip>
              </div>
              <div style="margin-bottom: 10px;">
                <span>会签设置</span>
                <el-select v-model="node.countersign" size="medium" @change="updateNode"
                           style="margin-left: 10px;width: 165px;">
                  <el-option label="一人审批" :value="1"></el-option>
                  <el-option label="少数服务从多数" :value="2"></el-option>
                  <el-option label="全部通过" :value="3"></el-option>
                </el-select>
              </div>
            </div>

            <!--填写节点-->
            <div class="special-setting-container" v-if="node.type===2">
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.auditFeedback">允许负责人填写处理反馈</el-checkbox>
              </div>
              <div class="checkbox-container">
                <el-checkbox @change="updateNode" v-model="node.transfer">允许转交数据至其他成员</el-checkbox>
                <el-tooltip class="item" effect="dark" content="负责人可以将数据的处理权限转交给其他成员" placement="bottom">
                  <i class="fa fa-question-circle"></i>
                </el-tooltip>
              </div>
            </div>

            <!--逐级审批节点-->
            <div style="margin-bottom: 10px;" class="special-setting-container" v-if="node.type===8">
              <span>逐级审批层级</span>
              <el-input-number :min="1" @change="updateNode" style="margin-left: 40px;" v-model="node.multiAudit"
                               size="medium"></el-input-number>
              <div class="checkbox-container">
                <el-checkbox v-model="node.needMergeMultiAudit" @change="updateNode">合并审批
                </el-checkbox>
              </div>
              <div class="checkbox-container">
                <el-checkbox v-model="node.canAgentAudit" @change="updateNode">允许代理人审批
                </el-checkbox>
              </div>
            </div>
          </div>
          <!--表单配置-->
          <div class="node-question-setting" v-if="node.type!==5&&node.type!==6">
            <div class="question-setting-header">
              <span>表单字段权限<span class="desc">将鼠标移动到字段上进行配置</span></span>
              <div class="overall-config-container">
                <span class="overall-config">全局配置</span>
                <el-button-group style="margin-left: 10px;">
                  <el-button size="small" @click="overallEdit">可编辑</el-button>
                  <el-button size="small" @click="overallReadonly">仅可见</el-button>
                  <el-button size="small" @click="overallHide">隐藏</el-button>
                </el-button-group>
              </div>
            </div>
            <el-row class="base-que-setting">
              <el-col :span="6" class="base-que">
                <i class="fa fa-list"></i>
                <span>编号</span>
                <div class="auth-edit-action">
                  <el-radio-group size="mini" v-model="numberStatus"
                                  @change="onDefaultContentStatusChange">
                    <el-radio-button label="readonly">可见</el-radio-button>
                    <el-radio-button label="hide">隐藏</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="6" class="base-que">
                <i class="fa fa-user-circle"></i>
                <span>申请人</span>
                <div class="auth-edit-action">
                  <el-radio-group size="mini" v-model="applyerStatus"
                                  @change="onDefaultContentStatusChange">
                    <el-radio-button label="readonly">可见</el-radio-button>
                    <el-radio-button label="hide">隐藏</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="6" class="base-que">
                <i class="fa fa-clock-o"></i>
                <span>申请时间</span>
                <div class="auth-edit-action">
                  <el-radio-group size="mini" v-model="applyTimeStatus"
                                  @change="onDefaultContentStatusChange">
                    <el-radio-button label="readonly">可见</el-radio-button>
                    <el-radio-button label="hide">隐藏</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
              <el-col :span="6" class="base-que">
                <i class="fa fa-refresh"></i>
                <span>更新时间</span>
                <div class="auth-edit-action">
                  <el-radio-group size="mini" v-model="updateTimeStatus"
                                  @change="onDefaultContentStatusChange">
                    <el-radio-button label="readonly">可见</el-radio-button>
                    <el-radio-button label="hide">隐藏</el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
            <div class="form-setting">
              <cube-dynamic-form :config="formConfigs" :authable="true"
                                 @onStatusChange="onElementsStatusChange"></cube-dynamic-form>
            </div>
          </div>
          <!--qrobot配置-->
          <qrobot-relation ref="qrobotRelation" :node="node" v-if="node.type===5||node.type===6"></qrobot-relation>
        </div>
      </el-dialog>
    </div>
    <deal-node :rootIndex="rootIndex" v-if="node.nextAuditNode&&node.nextAuditNode.type!==4"
               :node="node.nextAuditNode"></deal-node>
    <branch :rootIndex="rootIndex" v-if="node.nextAuditNode&&node.nextAuditNode.type===4"
            :node="node.nextAuditNode"></branch>
  </div>
</template>

<script>
  import AddNode from '../add-node/add-node.vue';
  import DynamicForm from '../../dynamic-form';
  import NodeStatusDetail from './node-status-detail/node-status-detail.vue';
  import CubeDynamicForm from "../../dynamic-form/dynamic-form";
  import services from '../../../service/back.service';
  import SelectUser from '../../select-user/select-user.vue';
  import QrobotRelation from "./qrobot-relation/qrobot-relation";
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
    name: 'DealNode',
    components: {
      QrobotRelation,
      CubeDynamicForm,
      AddNode,
      NodeStatusDetail,
      SelectUser
    },
    data(){
      return {
        modalVisible: false,
        onEditNodeName: false,
        // 是否选中设置填写密码
        applyPass: false,
        // 是否限制次数
        applyNum: false,
        // 编号状态
        numberStatus: 'readonly',
        // 申请人状态
        applyerStatus: 'readonly',
        // 申请时间状态
        applyTimeStatus: 'readonly',
        // 更新时间状态
        updateTimeStatus: 'readonly',
      }
    },
    props: {
      // 节点信息
      node: {
        type: Object,
        default: () => {
        }
      },
      // 根节点的序号
      rootIndex: {
        type: Number,
        default: null
      }
    },
    computed: {
      node_head_class(){
        return {
          'node_bg_review': this.node.type === WORKFLOW_TYPE_APPROVAL || this.node.type === WORKFLOW_TYPE_MULTI_AUDIT,
          'node_bg_write': this.node.type === WORKFLOW_TYPE_APPLY || this.node.type === WORKFLOW_TYPE_FILL_IN,
          'node_bg_copy': this.node.type === WORKFLOW_TYPE_CARBON_COPY,
          'node_bg_robot': this.node.type === WORKFLOW_TYPE_QROBOT_ADD || this.node.type === WORKFLOW_TYPE_QROBOT_UPDATE
        }
      },
      // 表单配置
      formConfigs(){
        return this.$store.state.flow.formConfigs;
      },
      // 表单元素中的成员组件列表
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
      // 编辑节点名
      editNodeName(){
        this.onEditNodeName = true;
        this.$nextTick(function () {
          this.$refs.node_name_input.focus();
        })
      },
      // 节点名输入框失去焦点
      onNodeNameBlur(){
        this.onEditNodeName = false;
        this.updateNode();
      },
      // 点击删除
      clickDelete(){
        this.$refs.deletePopover.doShow();
      },
      // 取消删除
      cancelDelete(){
        this.$refs.deletePopover.doClose();
      },
      // 确认删除
      async confirmDelete(){
        this.$refs.deletePopover.doClose();
        const res = await services.deleteNode(this.node.auditNodeId, this.$store.state.app.appId);
        if (res.returnCode.startsWith('200')) {
          this.$store.dispatch('deleteNode', {rootIndex: this.rootIndex, currentNode: this.node});
          this.$message.success('删除节点成功');
        }
      },
      async updateNode(){
        this.node.auditNodeName = this.node.auditNodeName ? this.node.auditNodeName : '未命名节点';
        const res = await services.updateNode(this.node);
      },
      // 申请范围变更
      applyRangeChange(data){
        // 切换到非指定用户，将指定用户清空
        if (data !== 2) {
          this.node.auditUserInfos = null;
        }
        this.updateNode();
      },
      // 设置填写密码checkbox状态变更
      applyPassCheckboxChange(data){
        if (!data) {
          this.node.applyConfig.applyPass = '';
        }
        this.updateNode();
      },
      // 填写密码输入框失去焦点
      applyPassBlur(){
        if (this.applyPass) {
          this.updateNode();
        }
      },
      // 限制申请次数checkbox状态变更
      applyNumCheckboxChange(data){
        if (!data) {
          this.node.applyConfig.canApplyNum = 0;
        }
        this.updateNode();
      },
      // 申请次数输入框失去焦点
      applyNumBlur(){
        if (this.applyNum) {
          this.updateNode();
        }
      },
      // 全局设置可编辑
      overallEdit(){
        // 将默认字段设置为可见
        this.setDefaultContentStatus('readonly');
        // 设置表单元素的状态
        this.$store.dispatch('overallSetFormElementsStatus', 'canEdit');
        this.setNodeElementsStatus();
        this.updateNode();
      },
      // 全局设置仅可见
      overallReadonly(){
        // 将默认字段设置为可见
        this.setDefaultContentStatus('readonly');
        // 设置表单元素的状态
        this.$store.dispatch('overallSetFormElementsStatus', 'readonly');
        this.setNodeElementsStatus();
        this.updateNode();
      },
      // 全局设置隐藏
      overallHide(){
        // 将默认字段设置为可见
        this.setDefaultContentStatus('hide');
        // 设置表单元素的状态
        this.$store.dispatch('overallSetFormElementsStatus', 'hide');
        this.setNodeElementsStatus();
        this.updateNode();
      },
      /**
       * 初始化默认字段的可见隐藏状态
       * 编号的queId为1 String类型
       * 申请人的queId为2 String类型
       * 申请时间的queId为3 String类型
       * 更新时间的queId为4 String类型
       */
      initDefaultContentStatus(){
        // 初始化编号状态
        if (this.node.auditHides && this.node.auditHides.length > 0 && this.node.auditHides.filter((hide) => hide.queId === '1').length > 0) {
          this.numberStatus = 'hide';
        } else {
          this.numberStatus = 'readonly';
        }
        // 初始化申请人状态
        if (this.node.auditHides && this.node.auditHides.length > 0 && this.node.auditHides.filter((hide) => hide.queId === '2').length > 0) {
          this.applyerStatus = 'hide';
        } else {
          this.applyerStatus = 'readonly';
        }
        // 初始化申请时间状态
        if (this.node.auditHides && this.node.auditHides.length > 0 && this.node.auditHides.filter((hide) => hide.queId === '3').length > 0) {
          this.applyTimeStatus = 'hide';
        } else {
          this.applyTimeStatus = 'readonly';
        }
        // 初始化更新时间状态
        if (this.node.auditHides && this.node.auditHides.length > 0 && this.node.auditHides.filter((hide) => hide.queId === '4').length > 0) {
          this.updateTimeStatus = 'hide';
        } else {
          this.updateTimeStatus = 'readonly';
        }
      },
      // 设置节点表单元素的状态
      setNodeElementsStatus(){
        this.node.auditEdits = this.getFormElementsByStatus('canEdit');
        this.node.auditHides = this.getFormElementsByStatus('hide');
      },
      // 全局设置默认字段的可见隐藏状态
      setDefaultContentStatus(status){
        this.numberStatus = this.applyerStatus = this.applyTimeStatus = this.updateTimeStatus = status;
      },
      // 获取所有某个状态下的表单元素组成的一维数组
      getFormElementsByStatus(status){
        const array = [];
        // 因为默认字段只有可见和隐藏两种状态
        if (status !== 'canEdit') {
          // 编号
          if (this.numberStatus === status) {
            array.push({queId: '1', queTitle: '编号'});
          }
          // 申请人
          if (this.applyerStatus === status) {
            array.push({queId: '2', queTitle: '申请人'});
          }
          // 申请时间
          if (this.applyTimeStatus === status) {
            array.push({queId: '3', queTitle: '申请时间'});
          }
          // 更新时间
          if (this.updateTimeStatus === status) {
            array.push({queId: '4', queTitle: '更新时间'});
          }
        }
        for (let i = 0; i < this.formConfigs.length; i++) {
          const row = this.formConfigs[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (item.status === status) {
              array.push({queId: item.queId, queTitle: item.title});
            }
          }
        }
        return array.length > 0 ? array : null;
      },
      // 节点配置弹框弹出事件
      async onDialogOpen(){
        // 如果是申请节点
        if (this.node.type === WORKFLOW_TYPE_APPLY) {
          if (this.node.applyConfig) {
            this.applyPass = this.node.applyConfig.applyPass ? true : false;
            this.applyNum = !this.node.applyConfig.canApplyNum ? false : true;
          }
        }
        // 如果是qrobot节点则查询所有已经发布的应用
        if (this.node.type === WORKFLOW_TYPE_QROBOT_ADD || this.node.type === WORKFLOW_TYPE_QROBOT_UPDATE) {
          // 查询所有已经发布的应用
          const me = this;
          this.$nextTick(function () {
            me.$refs.qrobotRelation.getPublishedApplications();
            // 如果存在关联的目标应用则查询目标应用的表单元素
            if (me.node.qRobotConfig && me.node.qRobotConfig.relatedAppId) {
              me.$refs.qrobotRelation.getFormElementsByAppId(me.node.qRobotConfig.relatedAppId);
            }
            // 根据formConfigs生成当前应用的表单元素列表
            me.$refs.qrobotRelation.getCurrentFormElements();
            // 初始化关联关系
            me.$refs.qrobotRelation.initRelation();
          })
        } else {
          // 初始化默认字段的可见隐藏状态
          this.initDefaultContentStatus();
          // 初始化表单元素的可见编辑隐藏状态
          this.$store.dispatch('initFormElementsStatus', this.node);
        }
      },
      // 表单元素状态变更
      onElementsStatusChange(data){
        this.$store.dispatch('setFormElementStatus', data);
        this.setNodeElementsStatus();
        this.updateNode();
      },
      // 默认内容状态变更
      onDefaultContentStatusChange(){
        this.setNodeElementsStatus();
        this.updateNode();
      },
      // 选择的用户变更
      onCheckedUsersChange(data){
        this.node.auditUserInfos = data && data.length > 0 ? data : null;
        this.updateNode();
      },
      // 删除用户
      deleteUser(id){
        const users = this.node.auditUserInfos.filter((user) => user.id !== id);
        this.node.auditUserInfos = users && users.length > 0 ? users : null;
        this.updateNode();
      },
      // 删除动态负责人
      deleteDynamic(type){
        let users = [];
        if (type === 'applyer') {
          users = this.node.auditUserInfos.filter((user) => !user.needApplyUser);
        } else if (type === 'leader') {
          users = this.node.auditUserInfos.filter((user) => !user.createIdForLeader);
        } else if (type === 'formMember') {
          users = this.node.auditUserInfos.filter((user) => !user.memQueId);
        } else if (type === 'superior') {
          users = this.node.auditUserInfos.filter((user) => !user.groupSuperior);
        }
        this.node.auditUserInfos = users && users.length > 0 ? users : null;
        this.updateNode();
      },
      // 根据queId返回表单成员组件的title
      showMemberTitile(queId){
        let title = null
        const configs = this.$store.state.flow.formConfigs
        if (configs && configs.length > 0) {
          for (let i in configs) {
            const row = configs[i]
            for (let j in row) {
              const item = row[j]
              if (item.queId === queId) {
                title = item.title
                break
              }
            }
          }
        }
        return title
      },
      // 显示提示内容
      showTooltip(member){
        if (member.needApplyUser) {
          return '申请人'
        }
        if (member.createIdForLeader) {
          return '部门负责人'
        }
        if (member.groupSuperior) {
          return '上级领导'
        }
        if (member.memQueId) {
          return this.showMemberTitile(member.memQueId)
        }
        return member.email
      }
    },
    async mounted(){

    },
    beforeCreate() {
      this.$options.components.Branch = require('../branch/branch.vue').default
    }
  }
</script>

<style scoped lang="scss">
  @import './deal-node.scss';
</style>
