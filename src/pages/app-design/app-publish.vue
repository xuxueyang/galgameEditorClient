<template>
  <application-publish
    :applicationId="$route.params.appId"
    @applicationPublishSuccess="applicationPublishSuccess">
  </application-publish>
</template>

<script>
  import ApplicationPublish from "../../components/application-publish/application-publish"
  export default{
    components: {ApplicationPublish},
    name: 'AppPublish',
    methods: {
      applicationPublishSuccess(){
        this.$router.push({name: 'app-list'})
      }
    }
  }
</script>

<style scoped></style>
