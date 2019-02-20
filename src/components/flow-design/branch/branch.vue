<template>
  <div class="branch-container">
    <div class="branch-box">
      <div class="add-branch">
        <i @click="createBranch" class="fa fa-plus"></i>
      </div>
      <div class="col-box" v-for="(child,index) in node.branches" :key="'col-box'+index">
        <div class="cover-line top-left-line" v-if="index===0"></div>
        <div class="cover-line top-right-line" v-if="index===node.branches.length-1"></div>
        <condition-node :node="child" @onNodeDelete="onConditionNodeDelete(index,node)"></condition-node>
        <deal-node :rootIndex="rootIndex" v-if="child.nextAuditNode&&child.nextAuditNode.type!==4"
                   :node="child.nextAuditNode"></deal-node>
        <branch :rootIndex="rootIndex" v-if="child.nextAuditNode&&child.nextAuditNode.type===4"
                :node="child.nextAuditNode"></branch>
        <div class="cover-line bottom-left-line" v-if="index===0"></div>
        <div class="cover-line bottom-right-line" v-if="index===node.branches.length-1"></div>
      </div>
    </div>
    <div class="line-in-middle">
      <add-node :node="node" :rootIndex="rootIndex"></add-node>
    </div>
    <deal-node :rootIndex="rootIndex" v-if="node.nextAuditNode&&node.nextAuditNode.type!==4"
               :node="node.nextAuditNode"></deal-node>
    <branch :rootIndex="rootIndex" v-if="node.nextAuditNode&&node.nextAuditNode.type===4"
            :node="node.nextAuditNode"></branch>
  </div>
</template>

<script>
  import ConditionNode from '../condition-node/condition-node.vue';
  import AddNode from "../add-node/add-node.vue";
  import DealNode from "../deal-node/deal-node";
  import services from '../../../service/back.service';
  export default{
    name: 'Branch',
    components: {
      DealNode,
      AddNode,
      ConditionNode
    },
    props: {
      // 节点信息
      node: {
        type: Object,
        default: () => []
      },
      // 根节点序号
      rootIndex: {
        type: Number,
        default: null
      }
    },
    methods: {
      // 创建分支
      async createBranch(){
        const res = await services.createChildBranch({
          appId: this.$store.state.app.appId,
          auditNodeId: this.node.auditNodeId
        });
        if (res.returnCode.startsWith('200')) {
          this.$store.dispatch('createChildBranch', {parentBranch: this.node, currentBranch: res.data})
          this.$message.success('创建子分支成功');
        }
      },
      // 删除分支
      async onConditionNodeDelete(index, node){
        // 如果当前子分支的数量大于两个则删除该子分支，否则删除整个分支节点
        if (node.branches && node.branches.length > 2) {
          const res = await services.deleteChildBranch(node.branches[index].auditNodeId, this.$store.state.app.appId);
          if (res.returnCode.startsWith('200')) {
            this.$store.dispatch('deleteChildBranch', {branch: node.branches, index: index});
            this.$message.success('删除子分支成功');
          }
        } else {
          const res = await services.deleteNode(node.auditNodeId, this.$store.state.app.appId);
          if (res.returnCode.startsWith('200')) {
            this.$store.dispatch('deleteNode', {rootIndex: this.rootIndex, currentNode: node});
            this.$message.success('删除子分支成功');
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './branch.scss';
</style>
