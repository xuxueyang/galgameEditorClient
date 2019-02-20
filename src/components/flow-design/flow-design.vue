<template>
  <div class="flow-wrapper">
    <template v-if="workflowData&&workflowData.length>0">
      <template v-for="(flow,index) in workflowData">
        <deal-node
          :key="'root_deal'+index"
          :rootIndex="index"
          v-if="flow.type!==4"
          :node="flow">
        </deal-node>
        <branch :key="'root_branch'+index" :rootIndex="index" v-if="flow.type===4" :node="flow"></branch>
      </template>
      <end-node></end-node>
    </template>
  </div>
</template>

<script>
  import DealNode from './deal-node/deal-node.vue';
  import ConditionNode from './condition-node/condition-node.vue';
  import Branch from './branch/branch.vue';
  import services from '../../service/back.service';
  import EndNode from './end-node/end-node.vue';
  export default{
    name: 'FlowDesign',
    components: {
      DealNode,
      ConditionNode,
      Branch,
      EndNode
    },
    props: {
      applicationId: {
        type: String,
        default: null
      }
    },
    computed: {
      workflowData(){
        return this.$store.state.flow.workflowData;
      }
    },
    created(){
      this.$store.dispatch('setAppId', this.applicationId);
    },
    async mounted(){
      // 查询表单配置
      const res = await services.getApplicationInfo(this.applicationId);
      if (res.returnCode.startsWith('200')) {
        // 将流程配置放入store中
        this.$store.dispatch('setWorkflowData', res.data.workflowData)
        const array = [];
        // 解析表单配置并放入store
        if (res.data.formData && res.data.formData.length > 0) {
          for (let i = 0; i < res.data.formData.length; i++) {
            const item = res.data.formData[i];
            if (!array[item.rowIndex]) {
              array[item.rowIndex] = [];
            }
            array[item.rowIndex][item.colIndex] = item;
          }
        }
        this.$store.dispatch('setNodeFormConfigs', array || []);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './flow-design.scss';
</style>
