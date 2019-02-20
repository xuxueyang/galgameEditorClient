<template>
  <div class="flow-design-wrapper">
    <flow-design :applicationId="applicationId"></flow-design>
  </div>
</template>

<script>
  import FlowDesign from '../flow-design/flow-design.vue';
  export default{
    name: 'AddFlow',
    components: {
      FlowDesign
    },
    props: {
      applicationId: {
        type: String,
        default: null
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './add-flow.scss';
</style>
