<template>
  <!--qrobot配置-->
  <div class="qrobot-relation-container">
    <p class="config-title">目标应用</p>
    <p class="config-title-hint">当数据到达该节点时，将自动在所选目标应用内容添加数据</p>
    <el-select v-model="relatedAppId"
               size="medium"
               :clearable="true"
               style="width: 280px;">
      <el-option v-for="application in applications"
                 :key="application.id"
                 :label="application.name"
                 :value="application.id"></el-option>
    </el-select>
    <template v-if="node.type===6">
      <p class="config-title">筛选条件</p>
      <el-alert
        title="将更新满足筛选条件的数据，若不设置则会更新全部数据，请谨慎设置"
        type="error">
      </el-alert>
      <div class="rule-row" v-for="(filter,index) in filterCondition" :key="'filter_'+index+'_'+node.type">
        <span>当</span>
        <el-select v-model="filter.queId" placeholder="当前应用的字段" size="medium" clearable="true"
                   style="width: 270px;margin: 0 10px;" @change="onCurrentElementChange($event,index,'filter')">
          <el-option v-for="cElement in currentElements"
                     :key="cElement.queId"
                     :value="cElement.queId"
                     :label="cElement.title">
          </el-option>
        </el-select>
        <span>的值等于</span>
        <el-select v-model="filter.relatedQueId" placeholder="目标应用的字段" size="medium"
                   :clearable="true"
                   no-match-text="仅显示字段类型相同的字段"
                   style="width: 270px;margin: 0 10px;" @change="onRelatedElementChange">
          <el-option v-for="element in elements"
                     v-if="filter.type?elementsRelation[filter.type].indexOf(element.type)!==-1:false"
                     :key="element.queId"
                     :value="element.queId"
                     :label="element.title">
          </el-option>
        </el-select>
        <div class="delete-container" @click="deleteFilter">
          <i class="fa fa-trash"></i>
        </div>
      </div>
      <div class="add-rule-container" @click="addFilter">
        <i class="fa fa-plus-circle"></i>
        <span>添加筛选条件</span>
      </div>
    </template>

    <template>
      <p class="config-title">{{node.type === 5 ? '创建规则' : '更新规则'}}</p>
      <div class="rule-row" v-for="(relation,index) in queRelation" :key="'relation_'+index+'_'+node.type">
        <span>将</span>
        <el-select v-model="relation.queId" placeholder="当前应用的字段" size="medium"
                   :clearable="true"
                   style="width: 270px;margin: 0 10px;" @change="onCurrentElementChange($event,index,'relation')">
          <el-option v-for="cElement in currentElements"
                     :key="cElement.queId"
                     :value="cElement.queId"
                     :label="cElement.title">
          </el-option>
        </el-select>
        <span>{{node.type === 5 ? '的值填入' : '的值覆盖'}}</span>
        <el-select v-model="relation.relatedQueId" placeholder="目标应用的字段" size="medium"
                   :clearable="true"
                   style="width: 270px;margin: 0 10px;" @change="onRelatedElementChange">
          <el-option v-for="element in elements"
                     v-if="relation.type?elementsRelation[relation.type].indexOf(element.type)!==-1:false"
                     :key="element.queId"
                     :value="element.queId"
                     :label="element.title">
          </el-option>
        </el-select>
        <div class="delete-container" @click="deleteRelation(index)">
          <i class="fa fa-trash"></i>
        </div>
      </div>
      <div class="add-rule-container" @click="addRelation">
        <i class="fa fa-plus-circle"></i>
        <span>添加规则</span>
      </div>
    </template>
  </div>
</template>

<script>
  import services from '../../../../service/back.service';
  export default{
    name: 'QrobotRelation',
    props: {
      node: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        // 目标应用列表
        applications: [],
        // 目标应用的表单元素
        elements: [],
        // 当前应用的表单元素
        currentElements: [],
        queRelation: [],
        filterCondition: [],
        elementsRelation: {
          'description': ['description'],
          'input': ['input'],
          'textarea': ['textarea'],
          'date': ['date'],
          'email': ['email', 'input'],
          'phone': ['phone', 'input'],
          'number': ['number', 'input'],
          'url': ['url', 'input'],
          'radio': ['radio'],
          'select': ['select'],
          'checkbox': ['checkbox'],
          'upload': ['upload'],
          'start_stop_time': ['start_stop_time'],
          'editor': ['editor'],
          'member': ['member'],
          'data_association': ['data_association']
        }
      }
    },
    computed: {
      // 表单配置
      formConfigs(){
        return this.$store.state.flow.formConfigs;
      },
      // qrobot节点关联的目标应用id
      relatedAppId: {
        get(){
          return this.node.qRobotConfig ? this.node.qRobotConfig.relatedAppId : null;
        },
        set(data){
          if (!this.node.qRobotConfig) {
            this.node.qRobotConfig = {};
          }
          this.node.qRobotConfig.relatedAppId = data;
          // 修改关联应用后删除所有关联关系
          this.deleteRelationsFilters();
          this.dealRelation();
          this.getFormElementsByAppId(data);
        }
      }
    },
    methods: {
      // 更新节点
      async updateNode(){
        this.node.auditNodeName = this.node.auditNodeName ? this.node.auditNodeName : '未命名节点';
        const res = await services.updateNode(this.node);
      },
      // 查询已经发布的所有应用
      async getPublishedApplications(){
        const res = await services.getApplications({status: 'P,SP'});
        if (res.returnCode.startsWith('200')) {
          this.applications = res.data || [];
        }
      },
      // 根据应用id查询该应用下的表单元素
      async getFormElementsByAppId(id){
        const res = await services.getFormElements({isPublish: true, appId: id});
        if (res.returnCode.startsWith('200')) {
          this.elements = res.data || [];
        }
      },
      // 查询当前表单元素
      getCurrentFormElements(){
        const array = [];
        if (this.formConfigs && this.formConfigs.length > 0) {
          for (let i = 0; i < this.formConfigs.length; i++) {
            const row = this.formConfigs[i];
            for (let j = 0; j < row.length; j++) {
              array.push(row[j]);
            }
          }
        }
        this.currentElements = array;
      },
      // 初始化关联关系
      initRelation(){
        if (!this.node.qRobotConfig || !this.node.qRobotConfig.queRelation || this.node.qRobotConfig.queRelation.length === 0) {
          this.queRelation = [{relatedQueId: null, queId: null, type: null}]
        } else {
          this.queRelation = this.node.qRobotConfig.queRelation;
        }
        // 如果是qrobot更新则还要初始化筛选条件
        if (this.node.type === 6) {
          if (!this.node.qRobotConfig || !this.node.qRobotConfig.filterCondition || this.node.qRobotConfig.filterCondition.length === 0) {
            this.filterCondition = [{relatedQueId: null, queId: null, type: null}]
          } else {
            this.filterCondition = this.node.qRobotConfig.filterCondition;
          }
        }
      },
      // 当前应用选择的字段变更
      onCurrentElementChange(data, index, relationType){
        const type = this.getTypeByQueId(data);
        if (relationType === 'relation') {
          this.$set(this.queRelation[index], 'type', type);
          this.$set(this.queRelation[index], 'relatedQueId', null);
        } else if (relationType === 'filter') {
          this.$set(this.filterCondition[index], 'type', type);
          this.$set(this.filterCondition[index], 'relatedQueId', null);
        }
      },
      // 目标应用选择的字段变更
      onRelatedElementChange(data){
        if (data) {
          this.dealRelation();
        }
      },
      // 根据当前queId查询该字段类型
      getTypeByQueId(queId){
        let type = null;
        if (this.currentElements && this.currentElements.length > 0) {
          const array = this.currentElements.filter((element) => element.queId === queId);
          if (array && array.length > 0) {
            type = array[0].type;
          }
        }
        return type;
      },
      // 处理关联关系去除无效的关联关系
      dealRelation(){
        const array = [];
        for (let i = 0; i < this.queRelation.length; i++) {
          const relation = this.queRelation[i];
          if (relation.queId && relation.relatedQueId) {
            array.push(relation);
          }
        }
        if (!this.node.qRobotConfig) {
          this.node.qRobotConfig = {};
        }
        this.node.qRobotConfig.queRelation = array && array.length > 0 ? array : null;
        // 如果是qrobot更新，还要处理筛选条件，去除无效的关联关系
        if (this.node.type === 6) {
          const filters = [];
          for (let i = 0; i < this.filterCondition.length; i++) {
            const filter = this.filterCondition[i];
            if (filter.queId && filter.relatedQueId) {
              filters.push(filter);
            }
          }
          this.node.qRobotConfig.filterCondition = filters && filters.length > 0 ? filters : null;
        }
        this.updateNode();
      },
      // 添加规则
      addRelation(){
        this.queRelation.push({
          relatedQueId: null, queId: null, type: null
        })
      },
      // 添加筛选条件
      addFilter(){
        this.filterCondition.push({
          relatedQueId: null, queId: null, type: null
        })
      },
      // 删除某个规则
      deleteRelation(index){
        this.queRelation.splice(index, 1);
        this.dealRelation();
      },
      // 删除某个筛选条件
      deleteFilter(index){
        this.filterCondition.splice(index, 1);
        this.dealRelation();
      },
      // 删除所有的关联关系
      deleteRelationsFilters(){
        this.queRelation = [];
        this.filterCondition = [];
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./qrobot-relation.scss";
</style>
