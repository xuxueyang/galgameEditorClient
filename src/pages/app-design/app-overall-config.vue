<template>
  <overall-config @applicationId="$route.params.appId"></overall-config>
</template>

<script>
  import OverallConfig from "../../components/overall-config/overall-config"
    export default{
      components: {OverallConfig},
      name:'AppOverallConfig'
    }
</script>

<style scoped></style>
