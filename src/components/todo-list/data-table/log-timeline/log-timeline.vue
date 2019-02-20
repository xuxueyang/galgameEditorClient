<template>
  <ul class="time-line-container">
    <li class="time-line-item" v-for="(log,index) in dataSource" :key="index">
      <div class="time-line-item-tail"></div>
      <div class="time-line-item-head">
        <div class="node-circle"></div>
      </div>
      <div class="time-line-item-content">
        <div class="flow-record-content">
          <div class="flow-record-header">
            <div>
              <span class="node-name">{{log.auditNodeName}}</span>
              <span class="flow-status">{{log.operationResult}}</span>
            </div>
            <!--<el-tooltip-->
              <!--placement="bottom"-->
              <!--content="22222">-->
              <!--<div class="action-user"></div>-->
            <!--</el-tooltip>-->
          </div>
          <ul class="flow-record-body">
            <li>
              <i class="fa fa-clock-o"></i>
              <span>{{dealDate(log.approvalDate)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
  export default{
    name: 'LogTimeline',
    props: {
      dataSource: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      dealDate(value){
        if (value) {
          return (new Date(value.replace(/\[.*?\]/g, ''))).toLocaleString()
        } else {
          return null;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import './log-timeline.scss';
</style>
