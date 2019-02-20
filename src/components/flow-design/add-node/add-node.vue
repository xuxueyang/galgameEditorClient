<template>
  <div class="add-node-wrapper">
    <el-popover
      v-if="!onQuickAdd"
      ref="popover"
      placement="bottom-start"
      width="160"
      popper-class="node-action-list"
      @show="onPopoverShow"
      trigger="click">
      <button slot="reference" class="add-button"><i class="fa fa-plus"></i></button>
      <ul class="dynamic-form-node-action-list" :class="{hidden:showSub}">
        <li @click="addReviewNode">
          <i class="fa fa-cog"></i>
          <span>审批节点</span>
        </li>
        <li @click="addOrderReviewNode">
          <i class="fa fa-cog"></i>
          <span>逐级审批节点</span>
        </li>
        <li @click="addWriteNode">
          <i class="fa fa-cog"></i>
          <span>填写节点</span>
        </li>
        <li @click="addCopyNode">
          <i class="fa fa-cog"></i>
          <span>抄送节点</span>
        </li>
        <li @click="addRobotNode">
          <i class="fa fa-cog"></i>
          <span>添加Q-Robot</span>
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="addBranchNode">
          <i class="fa fa-cog"></i>
          <span>添加子分支</span>
        </li>
      </ul>
      <ul class="dynamic-form-node-action-list-sub" :class="{show:showSub}">
        <li @click="backToMain">
          <i class="fa fa-angle-left"></i>
          <span>Q-Robot</span>
        </li>
        <li @click="addRobotAdd">添加数据</li>
        <li @click="addRobotUpdate">更新数据</li>
      </ul>
    </el-popover>
    <quick-add-node
      v-if="onQuickAdd"
      :node-type="nodeType"
      @onCreate="onCreateNode">
    </quick-add-node>
  </div>
</template>

<script>
  import QuickAddNode from './quick-add-node/quick-add-node.vue';
  import services from '../../../service/back.service';
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
    name: 'AddNode',
    components: {
      QuickAddNode
    },
    props: {
      // 节点类型
      node: {
        type: Object,
        default: () => {
        }
      },
      // 根节点序号
      rootIndex: {
        type: Number,
        default: null
      }
    },
    data(){
      return {
        showSub: false,
        onQuickAdd: false,
        nodeType: null
      }
    },
    methods: {
      // popover显示时触发事件
      onPopoverShow(){
        this.showSub = false;
      },
      // 关闭popover
      closePopover(){
        this.$refs.popover.doClose();
      },
      // 添加审批节点
      addReviewNode(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_APPROVAL;
        this.onQuickAdd = true;
      },
      // 添加逐级审批节点
      addOrderReviewNode(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_MULTI_AUDIT;
        this.onQuickAdd = true;
      },
      // 添加填写节点
      addWriteNode(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_FILL_IN;
        this.onQuickAdd = true;
      },
      // 添加抄送节点
      addCopyNode(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_CARBON_COPY;
        this.onQuickAdd = true;
      },
      // 添加QRobot
      addRobotNode(){
        this.showSub = true;
      },
      // 添加添加数据QRobot
      addRobotAdd(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_QROBOT_ADD;
        this.onQuickAdd = true;
      },
      // 添加更新数据QRobot
      addRobotUpdate(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_QROBOT_UPDATE;
        this.onQuickAdd = true;
      },
      // 添加子分支
      addBranchNode(){
        this.closePopover();
        this.nodeType = WORKFLOW_TYPE_BRANCH_NODE;
        this.onCreateNode();
      },
      // 返回
      backToMain(){
        this.showSub = false;
      },
      // 点击创建节点
      async onCreateNode(data = {}){
        const res = await services.createNode({
          appId: this.$store.state.app.appId,
          auditNodeName: data.nodeName ? data.nodeName : '未命名节点',
          auditUserInfos: data.auditUserInfos,
          preNodeId: this.node.auditNodeId,
          root: this.node.root,
          type: this.nodeType
        });
        if (res.returnCode.startsWith('200')) {
          this.$store.dispatch('createNode', {preNode: this.node, currentNode: res.data, preRootIndex: this.rootIndex});
          this.$message.success(`添加${this.nodeType === 4 ? '分支' : '节点'}成功`);
        }
        this.onQuickAdd = false;
      }
    }
  }
</script>

<style lang="scss">
  @import './add-node.scss';
</style>
