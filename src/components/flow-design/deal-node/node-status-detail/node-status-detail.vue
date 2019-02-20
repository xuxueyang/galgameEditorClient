<template>
  <div class="node-status-detail-container">
    <el-popover
      ref="popover1"
      placement="bottom-start"
      popper-class="node-status-popover"
      :visible-arrow="false"
      width="250"
      trigger="click">
      <span v-if="canEditList&&canEditList.length>0" @click.stop="$refs.popover1.doShow()" slot="reference"
            class="status-container">
        <i class="fa fa-pencil"></i>
        <span>{{canEditList.length}}</span>
      </span>
      <div class="status-detail-wrapper">
        <div class="detail-header">
          <i class="fa fa-pencil"></i>
          <span>该节点可编辑以下<span class="number">{{canEditList.length}}</span>个字段</span>
          <i class="fa fa-close" @click.stop="$refs.popover1.doClose()"></i>
        </div>
        <div class="detail-content">
          <div class="status-element" v-for="item in canEditList" :key="item.queId">{{item.queTitle}}</div>
        </div>
      </div>
    </el-popover>
    <el-popover
      ref="popover2"
      placement="bottom-start"
      popper-class="node-status-popover"
      :visible-arrow="false"
      width="250"
      trigger="click">
      <span v-if="hideList&&hideList.length>0" @click.stop="$refs.popover2.doShow()" slot="reference"
            class="status-container">
        <i class="fa fa-eye-slash"></i>
        <span>{{hideList.length}}</span>
      </span>
      <div class="status-detail-wrapper">
        <div class="detail-header">
          <i class="fa fa-eye-slash"></i>
          <span>对该节点隐藏了以下<span class="number">{{hideList.length}}</span>个字段</span>
          <i class="fa fa-close" @click.stop="$refs.popover2.doClose()"></i>
        </div>
        <div class="detail-content">
          <div class="status-element" v-for="item in hideList" :key="item.queId">{{item.queTitle}}</div>
        </div>
      </div>
    </el-popover>

    <el-popover
      ref="popover3"
      placement="bottom-start"
      popper-class="node-status-popover"
      :visible-arrow="false"
      width="250"
      trigger="click">
      <span v-if="readonlyList&&readonlyList.length>0" @click.stop="$refs.popover3.doShow()" slot="reference"
            class="status-container">
        <i class="fa fa-eye"></i>
        <span>{{readonlyList.length}}</span>
      </span>
      <div class="status-detail-wrapper">
        <div class="detail-header">
          <i class="fa fa-eye"></i>
          <span>对该节点可见<span class="number">{{readonlyList.length}}</span>个字段(无法编辑)</span>
          <i class="fa fa-close" @click.stop="$refs.popover3.doClose()"></i>
        </div>
        <div class="detail-content">
          <div class="status-element" v-for="item in readonlyList" :key="item.queId">{{item.queTitle}}</div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export default{
    name: 'NodeStatusDetail',
    props: {
      node: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        canEditList: [],
        hideList: [],
        readonlyList: []
      }
    },
    watch: {
      'node.auditEdits': function (newValue, oldValue) {
        this.setStatusList();
      },
      'node.auditHides': function (newValue, oldValue) {
        this.setStatusList();
      }
    },
    methods: {
      // 设置各种状态的表单元素列表
      setStatusList(){
        const formConfigs = this.$store.state.flow.formConfigs;
        const auditEdits = this.node.auditEdits;
        const hides = this.node.auditHides;
        const canEditList = [];
        const hideList = [];
        const readonlyList = [];

        if (hides && hides.length > 0 && hides.filter((hide) => hide.queId === '1').length > 0) {
          hideList.push({
            queId: '1',
            queTitle: '编号'
          })
        } else {
          readonlyList.push({
            queId: '1',
            queTitle: '编号'
          })
        }
        if (hides && hides.length > 0 && hides.filter((hide) => hide.queId === '2').length > 0) {
          hideList.push({
            queId: '2',
            queTitle: '申请人'
          })
        } else {
          readonlyList.push({
            queId: '2',
            queTitle: '申请人'
          })
        }
        if (hides && hides.length > 0 && hides.filter((hide) => hide.queId === '3').length > 0) {
          hideList.push({
            queId: '3',
            queTitle: '申请时间'
          })
        } else {
          readonlyList.push({
            queId: '3',
            queTitle: '申请时间'
          })
        }
        if (hides && hides.length > 0 && hides.filter((hide) => hide.queId === '4').length > 0) {
          hideList.push({
            queId: '4',
            queTitle: '更新时间'
          })
        } else {
          readonlyList.push({
            queId: '4',
            queTitle: '更新时间'
          })
        }
        for (let i = 0; i < formConfigs.length; i++) {
          const row = formConfigs[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (auditEdits && auditEdits.length > 0 && auditEdits.filter((edit) => edit.queId === item.queId).length > 0) {
              canEditList.push({
                queId: item.queId,
                queTitle: item.title
              });
            } else if (hides && hides.length > 0 && hides.filter((hide) => hide.queId === item.queId).length > 0) {
              hideList.push({
                queId: item.queId,
                queTitle: item.title
              });
            } else {
              readonlyList.push({
                queId: item.queId,
                queTitle: item.title
              });
            }
          }
        }
        this.canEditList = canEditList;
        this.hideList = hideList;
        this.readonlyList = readonlyList;
      }
    },
    mounted(){
      this.setStatusList();
    }
  }
</script>

<style lang="scss">
  @import './node-status-detail.scss';
</style>
