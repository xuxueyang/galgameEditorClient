<template>
  <div class="condition-node">
    <div class="condition-node-box" @click.stop.prevent="openDialog">
      <el-popover
        ref="deletePopover"
        width="220">
        <div class="delete-wrapper" slot="reference" @click.stop="clickDelete">
          <i class="fa fa-times" @click.stop="clickDelete"></i>
        </div>
        <p>确认删除该分支吗</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="cancelDelete">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmDelete">确定</el-button>
        </div>
      </el-popover>
      <div class="head-row">
        <template v-if="node.autoJudges&&node.autoJudges.length>0">
          <div class="condition-row" v-for="(row,index) in node.autoJudges" :key="'condition_row_'+index">
            <div class="condition-item-wrapper">
              <div class="condition-item" v-for="(condition,m) in row" :key="'condition_'+index+'_'+m">
                <span class="condition-name">{{condition.queTitle}}</span>
                <span class="condition-type">{{reflectJudgeTypeValue(condition.judgeType)}}</span>
                <span
                  class="condition-value">{{reflectJudgeValue(condition.judgeValue, condition.queType, condition.queId)}}</span>
              </div>
            </div>
            <div class="or-divider" v-if="index!==node.autoJudges.length-1">或</div>
          </div>
        </template>
        <template v-else>
          <div class="empty-title">所有数据可进入该分支</div>
        </template>
      </div>
      <div class="foot-row">
        <a>筛选数据</a>
      </div>
    </div>
    <add-node :node="node"></add-node>
    <el-dialog
      @open="onDialogOpen"
      :visible.sync="modalVisible"
      title="筛选数据"
      width="600px">
      <div class="dialog-body">
        <div class="desc">设置筛选条件后，满足条件的数据才能进入该分支</div>
        <div class="condition-container">
          <template v-if="autoJudges&&autoJudges.length>0">
            <div class="condition-row" v-for="(autoJudge,i) in autoJudges" :key="'or_'+i">
              <div class="condition-item-container">
                <div class="condition-item" v-for="(condition,j) in autoJudge" :key="'and_'+j">
                  <div class="and-divider" :class="{inactive:j===0}">且</div>
                  <div class="condition-setting">
                    <!--queId-->
                    <el-select v-model="condition.queId" style="width: 150px;" size="medium"
                               placeholder="请选择"
                               @change="onElementChange($event,i,j)"
                               :clearable="true">
                      <el-option
                        v-for="element in elements"
                        :key="element.queId"
                        :label="element.title"
                        :value="element.queId">
                      </el-option>
                    </el-select>
                    <!--judgeType-->
                    <el-select v-model="condition.judgeType" placeholder="请选择" style="width: 100px;" size="medium">
                      <el-option
                        v-for="judgeType in judgeTypes"
                        v-if="condition.queType?elementRelations[condition.queType].judgeType.indexOf(judgeType.id)!==-1:false"
                        :key="judgeType.id"
                        :label="judgeType.name"
                        :value="judgeType.id">
                      </el-option>
                    </el-select>
                    <!--queValue-->
                    <el-select
                      v-if="condition.queType?elementRelations[condition.queType].valueType==='select':false"
                      v-model="condition.judgeValue"
                      style="width: 230px;"
                      size="medium"
                      placeholder="请选择"
                      :clearable="true">
                      <el-option v-for="option in condition.judgeOptions"
                                 :key="option.value"
                                 :label="option.label"
                                 :value="option.value">
                      </el-option>
                    </el-select>
                    <el-input
                      v-if="condition.queType?elementRelations[condition.queType].valueType==='input':true"
                      v-model="condition.judgeValue"
                      style="width: 230px;"
                      size="medium">
                    </el-input>
                    <el-date-picker
                      v-if="condition.queType?elementRelations[condition.queType].valueType==='date':false"
                      v-model="condition.judgeShowValue"
                      type="date"
                      size="medium"
                      style="width: 230px;"
                      placeholder="日期">
                    </el-date-picker>
                  </div>
                  <div class="action-container">
                    <div class="action-btn" @click="addAndCondition(i,j)">
                      <i class="fa fa-plus"></i>
                    </div>
                    <div class="action-btn" @click="deleteAndCondition(i,j)">
                      <i class="fa fa-minus"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="or-divider" v-if="i!==autoJudges.length-1">或</div>
            </div>
            <div class="add-container">
              <el-button @click="addOrCondition">添加"或"条件</el-button>
            </div>
          </template>
          <div v-else class="empty-add-container" @click="addCondition">
            <i class="fa fa-plus"></i>
            <span class="title">添加筛选条件</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AddNode from '../add-node/add-node.vue';
  import DealNode from "../deal-node/deal-node.vue";
  import servcices from '../../../service/back.service';
  import Immutable from 'immutable'
  const WORKFLOW_JUDGETYPE_EQ = 0;//等于
  const WORKFLOW_JUDGETYPE_NQ = 1;//不等于
  const WORKFLOW_JUDGETYPE_IN = 2;//包含
  const WORKFLOW_JUDGETYPE_EX = 3;//不包含
  const WORKFLOW_JUDGETYPE_LT = 4;//小于
  const WORKFLOW_JUDGETYPE_LTE = 5;//小于等于
  const WORKFLOW_JUDGETYPE_GT = 6;//大于
  const WORKFLOW_JUDGETYPE_GTE = 7;//大于等于
  export default{
    name: 'ConditionNode',
    components: {
      DealNode,
      AddNode
    },
    props: {
      node: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        modalVisible: false,
        // 当前应用的表单元素
        elements: [],
        // 筛选条件
        autoJudges: [],
        initJudge: {
          queId: null,
          queTitle: null,
          queType: null,
          judgeType: null,
          judgeValue: null
        },
        emptyArr: [{label: '空', value: ''}], // 若表单内容不必填
        judgeTypes: [
          {id: WORKFLOW_JUDGETYPE_EQ, name: '等于'},
          {id: WORKFLOW_JUDGETYPE_NQ, name: '不等于'},
          {id: WORKFLOW_JUDGETYPE_IN, name: '包含'},
          {id: WORKFLOW_JUDGETYPE_EX, name: '不包含'},
          {id: WORKFLOW_JUDGETYPE_LT, name: '小于'},
          {id: WORKFLOW_JUDGETYPE_LTE, name: '小于等于'},
          {id: WORKFLOW_JUDGETYPE_GT, name: '大于'},
          {id: WORKFLOW_JUDGETYPE_GTE, name: '大于等于'},
        ],
        elementRelations: {
          'input': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'input'
          },
          'textarea': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'input'
          },
          'date': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX, WORKFLOW_JUDGETYPE_LT, WORKFLOW_JUDGETYPE_LTE, WORKFLOW_JUDGETYPE_GT, WORKFLOW_JUDGETYPE_GTE],
            'valueType': 'date'
          },
          'email': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'input'
          },
          'phone': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'input'
          },
          'number': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX, WORKFLOW_JUDGETYPE_LT, WORKFLOW_JUDGETYPE_LTE, WORKFLOW_JUDGETYPE_GT, WORKFLOW_JUDGETYPE_GTE],
            'valueType': 'input'
          },
          'url': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'input'
          },
          'radio': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'select': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'checkbox': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'start_stop_time': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX, WORKFLOW_JUDGETYPE_LT, WORKFLOW_JUDGETYPE_LTE, WORKFLOW_JUDGETYPE_GT, WORKFLOW_JUDGETYPE_GTE],
            'valueType': 'date'
          },
          'member': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'department': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'role_member': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ, WORKFLOW_JUDGETYPE_IN, WORKFLOW_JUDGETYPE_EX],
            'valueType': 'select'
          },
          'remote_association': {
            'judgeType': [WORKFLOW_JUDGETYPE_EQ, WORKFLOW_JUDGETYPE_NQ],
            'valueType': 'select'
          }
        },
        roleUsers: {}
      }
    },
    methods: {
      openDialog(){
        this.modalVisible = true;
      },
      closeDialog(){
        this.modalVisible = false;
      },
      // 点击取消按钮
      onCancelClick(){
        this.closeDialog();
      },
      // 点击完成按钮
      onConfirmClick(){
        if (!this.isComplete()) {
          this.$message.error('分支判定条件不能为空');
          return;
        }
        this.updateConditionNode();
      },
      // 判断当前填写的是否完整
      isComplete(){
        for (let i = 0; i < this.autoJudges.length; i++) {
          const row = this.autoJudges[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            // 如果类型为日期
            if (this.elementRelations[item.queType] && this.elementRelations[item.queType].valueType === 'date') {
              if (item.judgeShowValue) {
                item.judgeValue = Number(new Date(item.judgeShowValue));
              }
            }
            if (!item.queId || (!item.judgeType && item.judgeType !== 0) || (!item.judgeValue && item.judgeValue !== 0 && item.judgeValue !== '')) {
              return false;
            }
          }
        }
        return true;
      },
      // 更新分支节点
      async updateConditionNode(){
        const res = await servcices.updateChildBranch({
          appId: this.node.appId,
          auditNodeId: this.node.auditNodeId,
          autoJudges: this.autoJudges && this.autoJudges.length > 0 ? this.autoJudges : null
        })
        if (res.returnCode.startsWith('200')) {
          this.node.autoJudges = this.autoJudges && this.autoJudges.length > 0 ? Object.assign([], this.autoJudges) : null;
          this.closeDialog();
        }
      },
      // 点击删除
      clickDelete(){
        this.$refs.deletePopover.doShow();
      },
      // 取消删除
      cancelDelete(){
        this.$refs.deletePopover.doClose();
      },
      // 确认删除
      confirmDelete(){
        this.$refs.deletePopover.doClose();
        this.$emit('onNodeDelete');
      },
      // 添加and条件
      addAndCondition(i, j){
        this.autoJudges[i].splice(j + 1, 0, Object.assign({}, this.initJudge));
      },
      // 删除and条件
      deleteAndCondition(i, j){
        if (this.autoJudges[i].length === 1) {
          this.autoJudges.splice(i, 1);
        } else {
          this.autoJudges[i].splice(j, 1);
        }
      },
      // 添加or条件
      addOrCondition(){
        this.autoJudges.push([Object.assign({}, this.initJudge)])
      },
      // 当筛选条件为空时添加筛选条件
      addCondition(){
        this.autoJudges.push([Object.assign({}, this.initJudge)])
      },
      // 初始化表单元素
      initFormElements(){
        const array = [];
        const formElements = this.$store.state.flow.formConfigs;
        for (let i = 0; i < formElements.length; i++) {
          const row = formElements[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (this.elementRelations[item.type]) {
              array.push(item);
            }
          }
        }
        this.elements = array;
      },
      // 根据queId取这个表单元素的类型
      getElementByQueId(queId){
        let ele = {};
        if (!this.elements || this.elements.length === 0) {
          this.initFormElements();
        }
        const array = this.elements.filter((element) => element.queId === queId);
        if (array.length > 0) {
          ele = array[0];
        }
        return ele;
      },
      // 选择的表单元素变更
      async onElementChange(data, i, j){
        const element = this.getElementByQueId(data);
        this.$set(this.autoJudges[i][j], 'queType', element.type);
        this.$set(this.autoJudges[i][j], 'queTitle', element.title);
        this.$set(this.autoJudges[i][j], 'judgeType', null);
        this.$set(this.autoJudges[i][j], 'judgeValue', null);
        if (this.elementRelations[element.type] && this.elementRelations[element.type].valueType === 'select') {
          if (element.type === 'member') {
            this.resetKeyValue(element.optionalUsers);
            if (!element.required) {
              // 非必填
              this.$set(this.autoJudges[i][j], 'judgeOptions', [...this.emptyArr, ...element.optionalUsers] || []);
            } else {
              this.$set(this.autoJudges[i][j], 'judgeOptions', element.optionalUsers || []);
            }
          } else if (element.type === 'department') {
            element.optionalDepartments = element.optionalDepartments || [];
            const array = element.optionalDepartments.filter((department) => department.id);
            this.resetKeyValue(array);
            if (!element.required) {
              // 非必填
              this.$set(this.autoJudges[i][j], 'judgeOptions', [...this.emptyArr, ...array] || []);
            } else {
              this.$set(this.autoJudges[i][j], 'judgeOptions', array || []);
            }
          } else if (element.type === 'role_member') {
            if (element.roleId) {
              const users = await this.getRoleMember(element.roleId);
              if (!element.required) {
                // 非必填
                this.$set(this.autoJudges[i][j], 'judgeOptions', [...this.emptyArr, ...users] || []);
              } else {
                this.$set(this.autoJudges[i][j], 'judgeOptions', users || []);
              }
            }
          } else if (element.type === 'remote_association') {
            // 外部关联
            const remote = await this.getRemoteAssociation(element);
            if (!element.required) {
              // 非必填
              this.$set(this.autoJudges[i][j], 'judgeOptions', [...this.emptyArr, ...remote] || []);
            } else {
              this.$set(this.autoJudges[i][j], 'judgeOptions', remote || []);
            }
          } else {
            if (!element.required) {
              // 非必填
              this.$set(this.autoJudges[i][j], 'judgeOptions', [...this.emptyArr, ...element.options] || []);
            } else {
              this.$set(this.autoJudges[i][j], 'judgeOptions', element.options || []);
            }
          }
        } else if (this.elementRelations[element.type] && this.elementRelations[element.type].valueType === 'date') {
          this.$set(this.autoJudges[i][j], 'judgeShowValue', null);
        }

      },
      resetKeyValue(array, label = 'name', value = 'id'){
        if (array && array.length > 0) {
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            item.label = item[label];
            item.value = item[value];
          }
        }
      },
      // 获取角色下的成员
      async getRoleMember(roleId){
        const res = await servcices.getRoleMembers(roleId);
        const users = res.data.users || [];
        this.resetKeyValue(users, 'email');
        this.roleUsers[roleId] = users;
        return users;
      },
      // 获取外部关联
      async getRemoteAssociation(element){
        const parameter = {
          relateAppId: element.associatedTableId,
          relateQueId: element.associatedFieldId,
          conditions: null
        };
        const res = await servcices.getRemoteData(parameter);
        const remote = res.data || [];
        this.resetKeyValue(remote, 'name');
        return remote;
      },
      // 弹出框打开事件
      async onDialogOpen(){
        // 初始化表单元素
        this.initFormElements();
        const autoJudges = Immutable.fromJS(this.node.autoJudges || []);
        const autoJudgesArray = autoJudges.toJS();
        // 初始化筛选条件
        if (autoJudgesArray && autoJudgesArray.length > 0) {
          // 如果judgeValue涉及到下拉框则初始化下拉框的内容
          for (let i = 0; i < autoJudgesArray.length; i++) {
            const row = autoJudgesArray[i];
            for (let j = 0; j < row.length; j++) {
              const item = row[j];
              if (this.elementRelations[item.queType] && this.elementRelations[item.queType].valueType === 'select') {
                const element = this.getElementByQueId(item.queId);
                if (element.type === 'member') {
                  this.resetKeyValue(element.optionalUsers);
                  if (!element.required) {
                    // 非必填
                    item.judgeOptions = [...this.emptyArr, ...element.optionalUsers] || [];
                  } else {
                    item.judgeOptions = element.optionalUsers || [];
                  }
                } else if (element.type === 'department') {
                  element.optionalDepartments = element.optionalDepartments || [];
                  const array = element.optionalDepartments.filter((department) => department.id);
                  this.resetKeyValue(array);
                  if (!element.required) {
                    // 非必填
                    item.judgeOptions = [...this.emptyArr, ...array] || [];
                  } else {
                    item.judgeOptions = array || [];
                  }
                } else if (element.type === 'role_member') {
                  const users = await this.getRoleMember(element.roleId);
                  if (!element.required) {
                    // 非必填
                    item.judgeOptions = [...this.emptyArr, ...users] || [];
                  } else {
                    item.judgeOptions = users || [];
                  }
                } else if (element.type === 'remote_association') {
                  // 外部关联
                  const remote = await this.getRemoteAssociation(element);
                  if (!element.required) {
                    // 非必填
                    item.judgeOptions = [...this.emptyArr, ...remote] || [];
                  } else {
                    item.judgeOptions = remote || [];
                  }
                } else {
                  if (!element.required) {
                    // 非必填
                    item.judgeOptions = [...this.emptyArr, ...element.options] || [];
                  } else {
                    item.judgeOptions = element.options || [];
                  }
                }
              } else if (this.elementRelations[item.queType] && this.elementRelations[item.queType].valueType === 'date') {
                let newDate = new Date();
                newDate.setTime(item.judgeValue);
                item.judgeShowValue = newDate;
              }
            }
          }
          this.autoJudges = autoJudgesArray;
        } else {
          this.autoJudges = [];
        }
      },
      // 返回judgeType的中文值
      reflectJudgeTypeValue(value){
        let name = '';
        switch (value) {
          case WORKFLOW_JUDGETYPE_EQ:
            name = '等于';
            break;
          case WORKFLOW_JUDGETYPE_NQ:
            name = '不等于';
            break;
          case WORKFLOW_JUDGETYPE_IN:
            name = '包含';
            break;
          case WORKFLOW_JUDGETYPE_EX:
            name = '不包含';
            break;
          case WORKFLOW_JUDGETYPE_LT:
            name = '小于';
            break;
          case WORKFLOW_JUDGETYPE_LTE:
            name = '小于等于';
            break;
          case WORKFLOW_JUDGETYPE_GT:
            name = '大于';
            break;
          case WORKFLOW_JUDGETYPE_GTE:
            name = '大于等于';
            break;
          default:
            name = '等于';
            break;
        }
        return name;
      },
      // 返回judgeValue的值
      reflectJudgeValue(value, type, queId){
        if (this.elementRelations[type] && this.elementRelations[type].valueType === 'select') {
          const element = this.getElementByQueId(queId);
          let options = []
          if (type === 'member') {
            options = element.optionalUsers;
            this.resetKeyValue(options);
          } else if (element.type === 'department') {
            options = element.optionalDepartments;
            this.resetKeyValue(options);
          } else if (element.type === 'role_member') {
            return '点击查看';
          } else if (element.type === 'remote_association') {
            return '点击查看';
          } else {
            options = element.options || [];
          }
          const optionArray = options.filter((option) => option.value && (option.value === value));
          if (optionArray.length > 0) {
            return optionArray[0].label;
          } else {
            return '空';
          }
        } else if (this.elementRelations[type] && this.elementRelations[type].valueType === 'date') {
          const d = new Date();
          d.setTime(value);
          const year = d.getFullYear();
          const month = d.getMonth() + 1 < 10 ? '0' + parseInt(d.getMonth() + 1) : d.getMonth() + 1;
          const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
          return `${year}-${month}-${day}`;
        } else {
          return value;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './condition-node.scss';
</style>
