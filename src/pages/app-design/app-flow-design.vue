<template>
  <add-flow :applicationId="$route.params.appId"></add-flow>
</template>

<script>
  import AddFlow from "../../components/add-flow/add-flow"
  export default{
    components: {AddFlow},
    name: 'AppFlowDesign'
  }
</script>

<style scoped></style>
