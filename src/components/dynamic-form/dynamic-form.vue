<template>
  <form class="dynamic-form" :class="{'configable':configable}">
    <draggable class="drag-wrapper" v-model='mConfig' @start="onDragStart"
               :options="{draggable:configable?'.form-item-row':'.form-item-row-none'}">
      <el-row ref="row" type="flex" style="align-items: stretch" v-for="(c, index) in mConfig" :key="'form_row_'+index"
              class="form-item-row">
        <el-col
          ref="col"
          :key="'form_col_'+index+'_'+i"
          v-for="(child,i) in c"
          v-if="!child.canHide"
          :span="span(child.width)"
          @click.native="choose(child)"
          :class="[{'active':configable&&parseInt(activeFormItem.index)===child.index},{'is-error':child.error&&!configable&&!authable&&child.type!=='table'}]"
          class="form-item-col el-form-item">
          <div class="form-item-container" :class="{'option-vertical':child.direction&&child.direction==='vertical'}">
            <div class="form-item-title" v-if="child.title&&child.type!=='description'"><span
              class="title">{{child.title}}<span
              v-if="child.required"
              class="required-mark">*</span></span>
            </div>
            <div class="form-item-hint" v-if="child.hint">{{child.hint}}</div>
            <!-- 描述文字 -->
            <div class="dynamic-description" v-if="child.type==='description'" v-html="child.value||'描述文字内容'"></div>
            <!--单行文字-->
            <template v-if="child.type==='input'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{child.value}}</div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                placeholder="请输入内容"
                size="medium"
                v-model="child.value"></el-input>
            </template>
            <!--多行文字-->
            <template v-if="child.type==='textarea'">
              <div v-if="!child.canEdit&&!configable&&!authable" v-html="dealMultiLine(child.value)"></div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                placeholder="请输入内容"
                type="textarea" :rows="2"
                size="medium"
                v-model="child.value">
              </el-input>
            </template>
            <!--日期-->
            <template v-if="child.type==='date'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showDate(child)}}</div>
              <el-date-picker
                v-else
                @input="checkItemValidate(child);onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.displayValue"
                size="medium"
                :style="{width:'100%'}"
                :type="child.exact_time?'datetime':'date'"
                placeholder="选择日期">
              </el-date-picker>
            </template>
            <!--邮箱-->
            <template v-if="child.type==='email'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{child.value}}</div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                size="medium"
                placeholder="请输入内容"
                prefix-icon="fa fa-envelope-o">
              </el-input>
            </template>
            <!--手机-->
            <template v-if="child.type==='phone'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{child.value}}</div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                size="medium"
                placeholder="请输入内容"
                prefix-icon="fa fa-mobile">
              </el-input>
            </template>
            <!--数字-->
            <template v-if="child.type==='number'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{child.value}}</div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                size="medium"
                prefix-icon="fa fa-superscript">
              </el-input>
            </template>
            <!--链接-->
            <template v-if="child.type==='url'">
              <div class="dynamic-form-url" v-if="!child.canEdit&&!configable&&!authable">
                <a v-if="child.value" :href="child.value" target="_blank">{{child.value}}</a>
              </div>
              <el-input
                v-else
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                size="medium"
                placeholder="请输入内容">
              </el-input>
            </template>
            <!--单项选择-->
            <template v-if="child.type==='radio'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showRadio(child)}}</div>
              <el-radio-group
                v-else
                @change="checkItemValidate(child);onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value">
                <el-radio
                  :key="item.value"
                  :label="item.value"
                  v-for="item in child.options">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
            </template>
            <!--下拉选择-->
            <template v-if="child.type==='select'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showRadio(child)}}</div>
              <el-select
                v-else
                :clearable="true"
                :disabled="!child.canEdit&&!configable&&!authable"
                @change="checkItemValidate(child);onBlur(child)"
                :style="{width:'100%'}"
                placeholder="请输入内容"
                v-model="child.value">
                <el-option
                  v-for="item in child.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <!--多项选择-->
            <template v-if="child.type==='checkbox'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showCheckbox(child)}}</div>
              <el-checkbox-group
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                @change="checkItemValidate(child);onBlur(child)"
                v-model="child.value">
                <el-checkbox
                  v-for="item in child.options"
                  :key="item.value"
                  :label="item.value">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <!--附件上传-->
            <dynamic-upload
              @Unauthorized="onUnauthorized"
              v-if="child.type==='upload'"
              @change="checkItemValidate(child);onBlur(child)"
              :disabled="!child.canEdit&&!configable&&!authable"
              :config="child">
            </dynamic-upload>
            <!--起止时间-->
            <template v-if="child.type==='start_stop_time'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showStartStopTime(child)}}</div>
              <el-date-picker
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                @input="checkItemValidate(child);onBlur(child)"
                size="medium"
                :style="{width:'100%'}"
                v-model="child.displayValue"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </template>
            <!--数据关联-->
            <template v-if="child.type==='data_association'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showDataAssociation(child)}}</div>
              <el-select
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                filterable
                placeholder="输入并搜索"
                :clearable="true"
                @change="checkItemValidate(child);onBlur(child)"
                :style="{width:'100%'}"
                v-model="child.value">
                <el-option
                  v-for="(item,index) in child.association_options"
                  :key="item+'_'+index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </template>
            <!--数据关联外部-->
            <template v-if="child.type==='remote_association'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showDataRemote(child)}}</div>
              <el-select
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                filterable
                placeholder="输入并搜索"
                :clearable="true"
                @change="checkItemValidate(child);onBlur(child)"
                :style="{width:'100%'}"
                v-model="child.value">
                <el-option
                  v-for="(item,index) in child.association_options"
                  :key="item.id+'_'+index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <!--成员-->
            <template v-if="child.type==='member'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showMember(child)}}</div>
              <dynamic-member
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                @input="checkItemValidate(child);onBlur(child)"
                :users="child.users"></dynamic-member>
            </template>
            <!--部门-->
            <template v-if="child.type==='department'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showDepartment(child)}}</div>
              <dynamic-department
                v-else
                :departments="child.departments"
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                @input="checkItemValidate(child);onBlur(child)">
              </dynamic-department>
            </template>
            <!--角色成员-->
            <template v-if="child.type==='role_member'">
              <div v-if="!child.canEdit&&!configable&&!authable">{{showRoleMember(child)}}</div>
              <dynamic-role-member
                v-else
                :options="child.options"
                v-model="child.value"
                :multiple="child.multiple"
                @input="checkItemValidate(child);onBlur(child)"
                :disabled="!child.canEdit&&!configable&&!authable">
              </dynamic-role-member>
            </template>
            <!--富文本-->
            <template v-if="child.type==='editor'">
              <div v-if="!child.canEdit&&!configable&&!authable" v-html="child.value"></div>
              <quill-editor
                v-else
                :disabled="!child.canEdit&&!configable&&!authable"
                v-model="child.value"
                @input="checkItemValidate(child)"
                @blur="onBlur(child)"
                :options="editorOption">
              </quill-editor>
            </template>
            <!--表格-->
            <dynamic-table
              :configable="configable"
              :authable="authable"
              :disabled="!child.canEdit&&!configable&&!authable"
              @input="checkItemValidate(child);onBlur(child)"
              @onBlur="onTableElementBlur"
              v-if="child.type==='table'"
              v-model="child.value"
              :config="child">
            </dynamic-table>
            <div class="form-item-error" v-if="!configable&&!authable&&child.error">{{child.error}}</div>
          </div>

          <!--配置表单时的操作按钮-->
          <div class="form-edit-action" v-if="configable">
            <a class="action-container delete" @click.stop="deleteFormItem(child)">
              <i class="fa fa-trash-o"></i>
            </a>
            <a class="action-container top" @click.stop="upFormItem(child)" v-if="showTop(child)">
              <i class="fa fa-arrow-up"></i>
            </a>
            <a class="action-container bottom" @click.stop="downFormItem(child)" v-if="showBottom(child)">
              <i class="fa fa-arrow-down"></i>
            </a>
            <a class="action-container left" @click.stop="leftFormItem(child)" v-if="showLeft(child)">
              <i class="fa fa-exchange"></i>
            </a>
            <a class="action-container right" @click.stop="rightFormItem(child)" v-if="showRight(child)">
              <i class="fa fa-exchange"></i>
            </a>
            <a class="action-container copy" @click.stop="copyFormItem(child)">
              <i class="fa fa-copy"></i>
            </a>
          </div>

          <!--配置流程时的操作按钮-->
          <div class="auth-action-container" v-if="authable">
            <el-radio-group @change="onStatusChange($event,index,i)" size="mini" style="margin-left: 10px;"
                            v-model="child.status">
              <el-radio-button label="canEdit">可编辑</el-radio-button>
              <el-radio-button label="readonly">仅可见</el-radio-button>
              <el-radio-button label="hide">隐藏</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
    </draggable>
  </form>
</template>

<script>
  import Immutable from 'immutable'
  import draggable from 'vuedraggable';
  import DynamicUpload from './dynamic-upload/dynamic-upload.vue';
  import services from '../../service/back.service'
  import DynamicMember from './dynamic-member/dynamic-member.vue';
  import {userInfo} from '@cube-vue-pc/prod-http';
  import DynamicTable from "./dynamic-table/dynamic-table";
  import {dealFormData, calculateFunction} from '../../util/util';
  import DynamicDepartment from "./dynamic-department/dynamic-department";
  import DynamicRoleMember from "./dynamic-role-member/dynamic-role-member";
  export default{
    name: 'CubeDynamicForm',
    components: {
      DynamicRoleMember,
      DynamicDepartment,
      DynamicTable,
      draggable,
      DynamicUpload,
      DynamicMember
    },
    props: {
      config: {
        type: Array,
        default: () => []
      },
      configable: {
        type: Boolean,
        default: false
      },
      authable: {
        type: Boolean,
        default: false
      },
      // 是否是初次申请，关联的默认值只有在初次申请时才带出
      isApply: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      activeFormItem(){
        return this.$store.state.dynamicForm.currentFormItem;
      },
      mConfig: {
        get(){
          return this.config;
        },
        set(value){
          if (this.configable) {
            this.$store.dispatch('drag', {data: value});
          }
        }
      }
    },
    data(){
      return {
        editorOption: {
          placeholder: '请输入...',
          theme: 'snow'
        },
        memberUsers: [], // 成员数组
        // 数据关联信息，key为关联时数据筛选时涉及的元素的tempQueId，用于关联的字段变更时更新数据关联的内容
        relateInfo: {},
        // 数据关联字段数组，用于初始化数据关联
        relatedElements: [],
        // 默认关联数据，key为关联时涉及的元素的tempQueId，用于关联的字段变更时更新内容
        defaultRelateInfo: {},
        // 默认关联字段数组，用于初始化默认关联
        defaultRelatedElements: [],
        // 默认公式计算，key为相关的元素的tempQueId，用于相关的字段变更时更新内容
        defaultCalculateInfo: {},
        // 公式计算字段数组，用于初始化公式计算的值
        defaultCalculateElements: [],
        // 数据关联(外部)信息
        remoteInfo: {},
        // 数据关联(外部)关联表单元素
        remoteElements: [],
        // 默认关联数据(外部)，key为关联时涉及的元素的tempQueId，用于关联的字段变更时更新内容
        defaultRemoteInfo: {},
        // 默认关联字段数组，用于初始化默认关联(外部)
        defaultRemoteElements: []

      }
    },
    watch: {
      mConfig(value){
        this.setFormData();
      }
    },
    methods: {
      // 处理多行文本
      dealMultiLine(value){
        if (value) {
          return value.replace(/\n/g, '<br/>');
        } else {
          return '';
        }
      },
      // 处理日期的显示
      showDate(obj){
        if (obj.value) {
          if (obj.exact_time) {
            return new Date(obj.value).toLocaleString()
          } else {
            return new Date(obj.value).toLocaleString().split(' ')[0]
          }
        }
        return null
      },
      // 处理单选的显示
      showRadio(obj){
        if (obj.value) {
          const array = obj.options.filter((item) => item.value = obj.value)
          if (array.length > 0) {
            return array[0].label
          } else {
            return null
          }
        }
      },
      // 处理多选的显示
      showCheckbox(obj){
        if (obj.value && obj.value.length > 0) {
          const array = obj.options.filter((item) => obj.value.indexOf(item.value) !== -1)
          if (array.length > 0) {
            const selected = []
            array.forEach((item) => {
              selected.push(item.label)
            })
            return selected.join('，')
          } else {
            return null
          }
        }
        return null
      },
      // 处理起止时间的显示
      showStartStopTime(obj){
        if (obj.value && obj.value.length > 0) {
          const startTime = (new Date(obj.value[0])).toLocaleString().split(' ')[0]
          const endTime = (new Date(obj.value[1])).toLocaleString().split(' ')[0]
          return `${startTime}~${endTime}`
        }
        return null
      },
      // 处理数据关联显示
      showDataAssociation(obj){
        if (obj.value) {
          const array = obj.association_options.filter((item) => item === obj.value)
          if (array.length > 0) {
            return array[0]
          } else {
            return null
          }
        }
        return null
      },
      // 处理数据关联(外部)显示
      showDataRemote(obj){
        if (obj.value) {
          const array = obj.association_options.filter((item) => item.id === obj.value)
          if (array.length > 0) {
            return array[0].name
          } else {
            return null
          }
        }
        return null
      },
      // 处理成员显示
      showMember(obj){
        if (obj.value && obj.value.length > 0) {
          const array = []
          obj.value.forEach((item) => {
            array.push(`${item.name}(${item.email})`)
          })
          return array.join('，')
        }
        return null
      },
      // 处理部门显示
      showDepartment(obj){
        if (obj.value && obj.value.length > 0) {
          const array = []
          obj.value.forEach((item) => {
            array.push(item.name)
          })
          return array.join('，')
        }
        return null
      },
      // 处理角色成员显示
      showRoleMember(obj){
        if (obj.value && obj.value.length > 0) {
          // 如果是单选
          if (typeof obj.value === 'string') {
            const array = obj.options.filter((item) => item.id === obj.value)
            if (array.length > 0) {
              return array[0].nickName
            } else {
              return null
            }
          } else {
            // 如果是多选
            const array = obj.options.filter((item) => obj.value.indexOf(item.id) !== -1)
            if (array.length > 0) {
              const selected = []
              array.forEach((item) => {
                selected.push(item.nickName)
              })
              return selected.join('，')
            } else {
              return null
            }
          }
        }
      },
      // 可见隐藏可编辑状态变更
      onStatusChange(status, rowIndex, colIndex){
        this.$emit('onStatusChange', {
          status: status,
          rowIndex: rowIndex,
          colIndex: colIndex
        });
      },
      span(width){
        return parseInt(width / 100 * 24);
      },
      onDragStart(){
        // 标记当前选中元素
        this.$store.commit('markCurrentFormItem');
      },
      // 是否显示向上箭头（只有当前元素不在第一行并且上一行的元素小于4个时才显示）
      showTop(property){
        return parseInt(property.rowIndex) === 0 ? false : (this.$store.state.dynamicForm.formConfigs[property.rowIndex - 1].length >= 4 ? false : true)
      },
      // 是否显示向下箭头（只有该行的元素大于1时才显示）
      showBottom(property){
        return this.$store.state.dynamicForm.formConfigs[property.rowIndex].length > 1 ? true : false;
      },
      // 是否显示向左交换（只有当该行元素大于1并且该元素在该行不是第一个的时候才显示）
      showLeft(property){
        return this.$store.state.dynamicForm.formConfigs[property.rowIndex].length <= 1 ? false : (property.colIndex > 0 ? true : false);
      },
      // 是否显示向右交换（只有当该行元素大于1并且该元素在该行不是最后一个的时候才显示）
      showRight(property){
        const cols = this.$store.state.dynamicForm.formConfigs[property.rowIndex].length;
        return cols <= 1 ? false : (property.colIndex < cols - 1 ? true : false);
      },
      // 选中某一个表单元素
      choose(property){
        if (this.configable) {
          this.$store.dispatch('chooseFormItem', Object.assign(property));
        }
      },
      // 删除某一个表单元素
      deleteFormItem(property){
        if (this.configable) {
          this.$store.dispatch('deleteFormItem', {
            index: property.index,
            rowIndex: property.rowIndex,
            colIndex: property.colIndex
          });
        }
      },
      // 向上移动某一个表单元素
      upFormItem(property){
        if (this.configable) {
          this.$store.dispatch('moveUpFormItem', {
            index: property.index,
            rowIndex: property.rowIndex,
            colIndex: property.colIndex
          });
        }
      },
      // 向下移动某个表单元素
      downFormItem(property){
        if (this.configable) {
          this.$store.dispatch('moveDownFormItem', {
            index: property.index,
            rowIndex: property.rowIndex,
            colIndex: property.colIndex
          });
        }
      },
      // 向左交换
      leftFormItem(property){
        if (this.configable) {
          this.$store.dispatch('leftFormItem', {
            index: property.index,
            rowIndex: property.rowIndex,
            colIndex: property.colIndex
          });
        }
      },
      // 向右交换
      rightFormItem(property){
        if (this.configable) {
          this.$store.dispatch('rightFormItem', {
            index: property.index,
            rowIndex: property.rowIndex,
            colIndex: property.colIndex
          });
        }
      },
      // 复制某一个表单元素
      copyFormItem(property){
        if (this.configable) {
          this.$store.dispatch('copyFormItem', Immutable.fromJS(property));
        }
      },
      // 根据配置设置表单配置
      async setFormData(){
        // 当处于非配置状态并且非编辑状态
        if (!this.configable && !this.authable) {
          if (this.mConfig && this.mConfig.length > 0) {
            for (let i = 0; i < this.mConfig.length; i++) {
              const row = this.mConfig[i];
              for (let j = 0; j < row.length; j++) {
                const item = row[j];
                // 如果是成员组件并且有默认值则给value赋值
                if (item.type === 'member') {
                  if (this.isApply) {
                    // 初次申请时
                    item.value = item.value || [];
                    // 重置
                    item.users = [];
                    if (item.defaultUsers && item.defaultUsers.length > 0) {
                      item.value = Object.assign([], item.defaultUsers);
                    }
                    if (item.defaultCurrentUser) {
                      const info = userInfo.get(process.env.tenantCode);
                      if (info) {
                        if (item.defaultUsers.filter((member) => member.id === info.acctInfo.acctId).length === 0) {
                          // 判断数组里是否有当前用户
                          item.value.unshift({
                            id: info.acctInfo.acctId,
                            name: info.nickName,
                            email: info.acctInfo.email,
                            tel: info.acctInfo.tel
                          });
                        }
                      }
                    }
                    if (item.optionalUsers && item.optionalUsers.length > 0) {
                      item.users = Object.assign([], item.optionalUsers);
                    }
                    if (item.optionalCurrentUser) {
                      // 选中当前用户，判断是否包含当前用户
                      const info = userInfo.get(process.env.tenantCode);
                      if (item.optionalUsers.filter((member) => member.id === info.acctInfo.acctId).length === 0) {
                        // 判断数组里是否有当前用户
                        item.users.unshift({
                          id: info.acctInfo.acctId,
                          name: info.nickName,
                          email: info.acctInfo.email,
                          tel: info.acctInfo.tel
                        });
                      }
                    }
                    if (item.optionalUsers && item.optionalUsers.length === 0 && !item.optionalCurrentUser) {
                      // 未选中任何用户，带出所有
                      services.getAllGroupsAndUsers().then((res) => {
                        if (res.returnCode.startsWith('200')) {
                          const array = res.data || [];
                          this.dealUsers(array);
                          item.users = this.memberUsers;
                        }
                      })
                    }
                  }
                  // 过滤掉没有email的部门信息
                  item.users = item.users.filter((user) => user.email);
                }
                // 如果是部门组件并且有默认值则给value赋值
                if (item.type === 'department') {
                  item.value = item.value || [];
                  if (this.isApply && item.defaultDepartments && item.defaultDepartments.length > 0) {
                    let defaultArray = [];
                    for (let m = 0; m < item.defaultDepartments.length; m++) {
                      const defaultItem = item.defaultDepartments[m];
                      if (defaultItem.name) {
                        defaultArray.push(defaultItem);
                      } else if (defaultItem.type === 'currentDepartment') {
                        const groupInfo = localStorage.getItem(`cube-${process.env.tenantCode}-group-info`);
                        if (groupInfo) {
                          const groupArray = JSON.parse(groupInfo);
                          if (groupArray && groupArray.length > 0) {
                            for (let n = 0; n < groupArray.length; n++) {
                              const mGroup = groupArray[n];
                              if (item.defaultDepartments.filter((department) => department.id === mGroup.id).length === 0) {
                                defaultArray.push(mGroup);
                              }
                            }
                          }
                        }
                      }
                    }
                    item.value = Object.assign([], defaultArray);
                  }
                  if (this.isApply && item.optionalDepartments && item.optionalDepartments.length > 0) {
                    let optionalArray = [];
                    for (let m = 0; m < item.optionalDepartments.length; m++) {
                      const optionalItem = item.optionalDepartments[m];
                      if (optionalItem.name) {
                        optionalArray.push(optionalItem);
                      } else if (optionalItem.type === 'currentDepartment') {
                        const groupInfo = localStorage.getItem(`cube-${process.env.tenantCode}-group-info`);
                        if (groupInfo) {
                          const groupArray = JSON.parse(groupInfo);
                          if (groupArray && groupArray.length > 0) {
                            for (let n = 0; n < groupArray.length; n++) {
                              const mGroup = groupArray[n];
                              if (item.optionalDepartments.filter((department) => department.id === mGroup.id).length === 0) {
                                optionalArray.push(mGroup);
                              }
                            }
                          }
                        }
                      }
                    }
                    item.departments = Object.assign([], optionalArray);
                  }
                }
                // 如果是角色成员组件并且有默认值则给value赋值
                if (item.type === 'role_member') {
                  // 如果存在roleId则查询该角色下的所有成员
                  if (item.roleId) {
                    services.getRoleMembers(item.roleId).then((res) => {
                      if (res.returnCode.startsWith('200')) {
                        item.options = res.data.users || [];
                      }
                    })
                  }
                }
                // 如果是数据关联
                if (item.type === 'data_association') {
                  if (item.associatedAppliationId && item.associatedElementId) {
                    this.relatedElements.push(item);
                    // 如果需要筛选数据
                    if (item.filter && item.associatedFilter && item.associatedFilter.length > 0) {
                      for (let i = 0; i < item.associatedFilter.length; i++) {
                        const filter = item.associatedFilter[i];
                        if (!this.relateInfo[filter.tempQueId]) {
                          this.relateInfo[filter.tempQueId] = [];
                        }
                        this.relateInfo[filter.tempQueId].push(item);
                      }
                    }
                  }
                }
                // 如果是数据关联
                if (item.type === 'remote_association') {
                  if (item.associatedTableId && item.associatedFieldId) {
                    this.remoteElements.push(item);
                    // 如果需要筛选数据
                    if (item.filter && item.associatedFilter && item.associatedFilter.length > 0) {
                      for (let i = 0; i < item.associatedFilter.length; i++) {
                        const filter = item.associatedFilter[i];
                        if (!this.remoteInfo[filter.tempQueId]) {
                          this.remoteInfo[filter.tempQueId] = [];
                        }
                        this.remoteInfo[filter.tempQueId].push(item);
                      }
                    }
                  }
                }
                // 如果默认值采用数据关联
                if (item.default_type === 'relate') {
                  if (item.default_applicationId && item.default_current_elementId && item.default_associated_elementId && item.default_show_elementId) {
                    this.defaultRelatedElements.push(item);
                    if (!this.defaultRelateInfo[item.default_current_elementId]) {
                      this.defaultRelateInfo[item.default_current_elementId] = [];
                    }
                    this.defaultRelateInfo[item.default_current_elementId].push(item);
                  }
                }
                // 如果默认值采用数据关联(外部)
                if (item.default_type === 'remote') {
                  if (item.default_remote_tableId && item.default_remote_elementId && item.default_remote_fieldId && item.default_remote_show_fieldId) {
                    this.defaultRemoteElements.push(item);
                    if (!this.defaultRemoteInfo[item.default_remote_elementId]) {
                      this.defaultRemoteInfo[item.default_remote_elementId] = [];
                    }
                    this.defaultRemoteInfo[item.default_remote_elementId].push(item);
                  }
                }
                // 如果默认值采用公式计算
                if (item.default_type === 'calculate') {
                  if (item.default_calculate) {
                    this.defaultCalculateElements.push(item);
                  }
                  // 获取公式计算涉及的元素列表
                  const calRelatedEles = this.getCalculateRelatedEle(item.default_calculate);
                  for (let i in calRelatedEles) {
                    const calRelatedEle = calRelatedEles[i];
                    if (!this.defaultCalculateInfo[calRelatedEle]) {
                      this.defaultCalculateInfo[calRelatedEle] = [];
                    }
                    this.defaultCalculateInfo[calRelatedEle].push(item);
                  }
                }
                // 如果是表格
                if (item.type === 'table') {
                  if (item.children && item.children.length > 0) {
                    for (let i = 0; i < item.children.length; i++) {
                      const child = item.children[i];
                      // 如果是数据关联
                      if (child.type === 'data_association') {
                        if (child.associatedAppliationId && child.associatedElementId) {
                          this.relatedElements.push(Object.assign({}, child, {
                            parentTempQueId: item.tempQueId,
                            childColIndex: i
                          }));
                          // 如果需要筛选数据
                          if (child.filter && child.associatedFilter && child.associatedFilter.length > 0) {
                            for (let i = 0; i < child.associatedFilter.length; i++) {
                              const filter = child.associatedFilter[i];
                              if (!this.relateInfo[filter.tempQueId]) {
                                this.relateInfo[filter.tempQueId] = [];
                              }
                              this.relateInfo[filter.tempQueId].push(Object.assign({}, child, {
                                parentTempQueId: item.tempQueId,
                                childColIndex: i
                              }));
                            }
                          }
                        }
                      }
                      // 如果默认值采用数据关联
                      if (child.default_type === 'relate') {
                        if (child.default_applicationId && child.default_current_elementId && child.default_associated_elementId && child.default_show_elementId) {
                          this.defaultRelatedElements.push(Object.assign({}, child, {
                            parentTempQueId: item.tempQueId,
                            childColIndex: i,
                            childRowIndex: 0
                          }));
                          if (!this.defaultRelateInfo[child.default_current_elementId]) {
                            this.defaultRelateInfo[child.default_current_elementId] = [];
                          }
                          this.defaultRelateInfo[child.default_current_elementId].push(Object.assign({}, child, {
                            parentTempQueId: item.tempQueId,
                            childColIndex: i,
                            childRowIndex: 0
                          }));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // 设置数据关联的内容
        for (let i = 0; i < this.relatedElements.length; i++) {
          const element = this.relatedElements[i];
          this.setRelatedData(element);
        }
        // 设置数据关联(外部)的内容
        for (let i = 0; i < this.remoteElements.length; i++) {
          const element = this.remoteElements[i];
          this.setRemoteData(element, true);
        }
        // 默认值只在申请的时候带出
        if (this.isApply) {
          // 设置默认值为数据关联的内容
          for (let i = 0; i < this.defaultRelatedElements.length; i++) {
            const defaultEle = this.defaultRelatedElements[i];
            this.setDefaultRelatedData(defaultEle);
          }
          // 设置默认值为数据关联(外部)的内容
          for (let i = 0; i < this.defaultRemoteElements.length; i++) {
            const defaultEle = this.defaultRemoteElements[i];
            this.setDefaultRemoteData(defaultEle);
          }
          // 设置公式计算的默认内容
          for (let i = 0; i < this.defaultCalculateElements.length; i++) {
            const calEle = this.defaultCalculateElements[i];
            this.setDefaultCalculateData(calEle);
          }
        }
      },
      // 递归处理后台返回的树结构，将users中的内容加入children中并且增加树结构需要的相应的key
      dealUsers(array){
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          if (item.users && item.users.length > 0) {
            if (!item.children) {
              item.children = [];
            }
            for (let j = 0; j < item.users.length; j++) {
              const user = item.users[j];
              user.id = user.acctId;
              user.name = user.fullName;
              item.children.unshift(user);
              // this.allUsers[0].children.push(user);
              // 用户筛选时显示的列表
              this.memberUsers.push(user)
            }
          }
          if (item.children && item.children.length > 0) {
            // 删除叶子节点下没有人的部门
            for (let m = 0; m < item.children.length; m++) {
              const child = item.children[m];
              if ((!child.children || child.children.length === 0) && (!child.users || child.users.length === 0) && !child.email) {
                item.children.splice(m, 1);
              }
            }
            this.dealUsers(item.children);
          }
        }
      },
      calculateFormulaValue(element){
        let calValue = element.default_calculate;
        const array = [];
        const reg = /\$queId_temp\d{13}\$/g
        let temp = null;
        while ((temp = reg.exec(calValue)) !== null) {
          array.push(temp[0]);
        }
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          const ele = this.getElementByTempQueId(item.replace(/queId_/g, '').replace(/\$/g, ''))
          if (ele) {
            const replaceReg = new RegExp(item.replace(/\$/g, '\\$'));
            calValue = calValue.replace(replaceReg, ele.value || 0);
          }
        }
        let calFunction = calculateFunction;
        const formulaArray = Object.keys(calculateFunction);
        const formulaReg = new RegExp('(' + formulaArray.join('|') + ')', 'g');
        calValue = calValue.replace(formulaReg, 'calFunction.$1')
        return eval(calValue);
      },
      // 根据tempQueId获取对应表单元素
      getElementByTempQueId(tempQueId){
        for (let i = 0; i < this.mConfig.length; i++) {
          const row = this.mConfig[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            if (item.tempQueId === tempQueId) {
              return item;
            }
            if (item.children && item.children.length > 0) {
              for (let m = 0; m < item.children.length; m++) {
                const child = item.children[m];
                if (child.tempQueId === tempQueId) {
                  return child;
                }
              }
            }
          }
        }
        return null;
      },
      // 根据tempQueId获取表格子元素的index
      getChildIndexByTempQueId(element, tempQueId){
        if (element.children && element.children.length > 0) {
          for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            if (child.tempQueId === tempQueId) {
              return i;
            }
          }
        }
        return null;
      },
      // 设置关联数据
      setRelatedData(element){
        if (element) {
          const conditions = [];
          if (element.associatedFilter && element.associatedFilter.length > 0) {
            for (let i = 0; i < element.associatedFilter.length; i++) {
              const filter = element.associatedFilter[i];
              const item = this.getElementByTempQueId(filter.tempQueId);
              if (item && item.value && item.value.length > 0) {
                conditions.push({
                  queValue: typeof item.value === 'object' ? JSON.stringify(item.value) : item.value,
                  relatedQueId: filter.relatedQueId
                })
              }
            }
          }
          services.getRelatedData({
            relateAppId: element.associatedAppliationId,
            relateQueId: element.associatedElementId,
            conditions: conditions.length > 0 ? conditions : null
          }).then((res) => {
            if (res.returnCode.startsWith('200')) {
              // 如果不存在parentTempQueId，即不是表格中的元素
              if (!element.parentTempQueId) {
                element.association_options = res.data || [];
              } else {
                const parent = this.getElementByTempQueId(element.parentTempQueId);
                if (parent) {
                  parent.children[element.childColIndex].association_options = res.data || [];
                }
              }
            }
          })
        }
      },
      // 设置关联数据(外部)
      setRemoteData(element, init){
        if (element) {
          const conditions = [];
          if (element.associatedFilter && element.associatedFilter.length > 0) {
            for (let i = 0; i < element.associatedFilter.length; i++) {
              const filter = element.associatedFilter[i];
              const item = this.getElementByTempQueId(filter.tempQueId);
              let value = null
              if (item.type === 'member' || item.type === 'department') {
                value = item.value && item.value.length > 0 ? item.value[0].id : null
              } else {
                value = item.value
              }
              if (value && value.length > 0) {
                conditions.push({
                  queValue: typeof value === 'object' ? JSON.stringify(value) : value,
                  relatedQueId: filter.relatedField
                })
              }
            }
          }
          services.getRemoteData({
            relateAppId: element.associatedTableId,
            relateQueId: element.associatedFieldId,
            conditions: conditions.length > 0 ? conditions : null
          }).then((res) => {
            if (res.returnCode.startsWith('200')) {
              element.association_options = res.data || [];
              if (!init) {
                element.value = null
              }
            }
          })
        }
      },
      // 设置默认值为数据关联的值
      setDefaultRelatedData(element){
        if (element) {
          // 如果不存在parentTempQueId，即不是表格中的元素
          if (!element.parentTempQueId) {
            const item = this.getElementByTempQueId(element.default_current_elementId);
            // 如果关联的当前应用的元素有值则查询对应应该显示的值
            if (item && item.value && item.value.length > 0) {
              services.getRelatedData({
                relateAppId: element.default_applicationId,
                relateQueId: element.default_show_elementId,
                conditions: [
                  {
                    queValue: typeof item.value === 'object' ? JSON.stringify(item.value) : item.value,
                    relatedQueId: element.default_associated_elementId
                  }
                ]
              }).then((res) => {
                if (res.returnCode.startsWith('200')) {
                  const relatedArray = res.data || [];
                  element.value = relatedArray.length > 0 ? relatedArray[0] : null;
                }
              })
            }

          } else {
            const parent = this.getElementByTempQueId(element.parentTempQueId);
            if (parent.value && parent.value.length > 0) {
              const currentIndex = this.getChildIndexByTempQueId(parent, element.default_current_elementId);
              const row = parent.value[element.childRowIndex];
              if (row[currentIndex] && row[currentIndex].value) {
                services.getRelatedData({
                  relateAppId: element.default_applicationId,
                  relateQueId: element.default_show_elementId,
                  conditions: [
                    {
                      queValue: typeof row[currentIndex].value === 'object' ? JSON.stringify(row[currentIndex].value) : row[currentIndex].value,
                      relatedQueId: element.default_associated_elementId
                    }
                  ]
                }).then((res) => {
                  if (res.returnCode.startsWith('200')) {
                    const relatedArray = res.data || [];
                    row[element.childColIndex].value = relatedArray.length > 0 ? relatedArray[0] : null;
                  }
                })
              }
            }
          }
        }
      },
      // 设置默认值为数据关联(外部)的值
      setDefaultRemoteData(element){
        if (element) {
          const item = this.getElementByTempQueId(element.default_remote_elementId);
          let value = null
          if (item.type === 'member' || item.type === 'department') {
            value = item.value && item.value.length > 0 ? item.value[0].id : null
          } else {
            value = item.value
          }
          // 如果关联的当前应用的元素有值则查询对应应该显示的值
          if (value && value.length > 0) {
            services.getRemoteData({
              relateAppId: element.default_remote_tableId,
              relateQueId: element.default_remote_show_fieldId,
              conditions: [
                {
                  queValue: typeof value === 'object' ? JSON.stringify(value) : value,
                  relatedQueId: element.default_remote_fieldId
                }
              ]
            }).then((res) => {
              if (res.returnCode.startsWith('200')) {
                const relatedArray = res.data || [];
                element.value = relatedArray.length > 0 ? relatedArray[0].name : null;
              }
            })
          }
        }
      },
      // 设置公式计算默认值
      setDefaultCalculateData(element){
        let calculateValue = element.default_calculate;
        // 去空格
        calculateValue = calculateValue.replace(/\s/g, '');
        const relatedEles = this.getCalculateRelatedEle(calculateValue);
        if (this.isCalRelatedEleHasValue(relatedEles)) {
          element.value = this.calculateFormulaValue(element);
        } else {
          element.value = null;
        }
      },
      // 根据公式获取该公式涉及的表单元素
      getCalculateRelatedEle(content){
        const array = [];
        const reg = /\$queId_temp\d{13}\$/g
        let temp = null;
        while ((temp = reg.exec(content)) !== null) {
          if (array.indexOf(temp[0]) === -1) {
            array.push(temp[0].replace(/queId_/g, '').replace(/\$/g, ''));
          }
        }
        return array;
      },
      // 判断公式计算涉及的表单元素是否至少有一个元素有值
      isCalRelatedEleHasValue(array){
        for (let i = 0; i < array.length; i++) {
          const tempQueId = array[i];
          const element = this.getElementByTempQueId(tempQueId);
          if (element && element.value !== null && element.value !== '') {
            return true;
          }
        }
        return false;
      },
      // 检查整个表单的有效性
      async checkValidate(callback){
        let count = 0;
        for (let i = 0; i < this.mConfig.length; i++) {
          const row = this.mConfig[i];
          for (let j = 0; j < row.length; j++) {
            const item = row[j];
            // 后端需要删除下面两个属性
            if (item._id) {
              delete item._id;
            }
            if (item._class) {
              delete item._class;
            }
            // 处理特殊的表单元素
            dealFormData(item);
            if (!this.checkItemValidate(item)) {
              count++;
            }
            // 重复验证
            if (item.norepeat) {
              await this.repeatCheck(item);
              if (item.norepeat_error) {
                count++;
              }
            }
          }
        }
        // 如果全部检查通过才提交表单
        if (count === 0) {
          callback(this.mConfig);
        } else {
          callback(false);
        }
      },
      // 检查单行文字有效性
      checkInput(data){
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.limit_word && data.value.length < data.min_word) {
          this.$set(data, 'error', `至少需填${data.min_word}字符`);
        } else if (data.limit_word && data.value.length > data.max_word) {
          this.$set(data, 'error', `最多可填${data.max_word}字符`);
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查多行文字有效性
      checkTextarea(data){
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.limit_word && data.value.length < data.min_word) {
          this.$set(data, 'error', `至少需填${data.min_word}字符`);
        } else if (data.limit_word && data.value.length > data.max_word) {
          this.$set(data, 'error', `最多可填${data.max_word}字符`);
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查日期的有效性
      checkDate(data){
        if (data.displayValue) {
          data.value = Number(new Date(data.displayValue));
        } else {
          data.value = null;
        }
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查邮箱有效性
      checkEmail(data){
        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.value && !reg.test(data.value)) {
          this.$set(data, 'error', '邮箱格式不正确');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查手机有效性
      checkPhone(data){
        const reg = /^1(3|4|5|7|8)\d{9}$/;
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.value && !reg.test(data.value)) {
          this.$set(data, 'error', '手机格式不正确');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查数字有效性
      checkNumber(data){
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.value && isNaN(data.value)) {
          this.$set(data, 'error', '必须为数字');
        } else if (data.value && !data.decimal && data.value % 1 > 0) {
          this.$set(data, 'error', '不能为小数');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查链接有效性
      checkUrl(data){
        const reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else if (data.value && !reg.test(data.value)) {
          this.$set(data, 'error', '链接格式不正确');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查单选有效性
      checkRadio(data){
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查下拉选择有效性
      checkSelect(data){
        if (data.required && !data.value) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查多项选择有效性
      checkCheckbox(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else if (data.limit_options && data.min_options && data.value.length < data.min_options) {
          this.$set(data, 'error', `至少选择${data.min_options}项`);
        } else if (data.limit_options && data.max_options && data.value.length > data.max_options) {
          this.$set(data, 'error', `最多选择${data.max_options}项`);
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查上传附件的有效性
      checkUpload(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证起止时间的有效性
      checkStartStopTime(data){
        if (data.displayValue && data.displayValue.length > 0) {
          const array = [];
          for (let i = 0; i < data.displayValue.length; i++) {
            const date = data.displayValue[i];
            array.push(Number(new Date(date)));
          }
          data.value = array;
        } else {
          data.value = null;
        }
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证数据关联的有效性
      checkAssociation(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证成员的有效性
      checkMember(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证部门的有效性
      checkDepartment(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证角色成员的有效性
      checkRoleMember(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 验证富文本框的有效性
      checkEditor(data){
        if (data.required && (!data.value || data.value.length === 0)) {
          this.$set(data, 'error', '必填项');
        } else {
          this.$set(data, 'error', '');
        }
        return data.error ? false : true;
      },
      // 检查表格的有效性
      checkTable(data){
        let count = 0;
        if (data.value && data.value.length > 0) {
          for (let i = 0; i < data.value.length; i++) {
            const row = data.value[i];
            for (let j = 0; j < row.length; j++) {
              const col = row[j];
              const item = Object.assign(data.children[j], {value: col.value || null});
              const res = this.checkItemValidate(item);
              col.error = item.error;
              if (!res) {
                count++;
              }
            }
          }
        }
        data.error = count > 0 ? '表格中字段存在错误' : '';
        return data.error ? false : true;
      },
      // 检查某一项的有效性
      checkItemValidate(data){
        let res = true;
        switch (data.type) {
          case 'input':
            res = this.checkInput(data);
            break;
          case 'textarea':
            res = this.checkTextarea(data);
            break;
          case 'date':
            res = this.checkDate(data);
            break;
          case 'email':
            res = this.checkEmail(data);
            break;
          case 'phone':
            res = this.checkPhone(data);
            break;
          case 'number':
            res = this.checkNumber(data);
            break;
          case 'url':
            res = this.checkUrl(data);
            break;
          case 'radio':
            res = this.checkRadio(data);
            break;
          case 'select':
            res = this.checkSelect(data);
            break;
          case 'checkbox':
            res = this.checkCheckbox(data);
            break;
          case 'upload':
            res = this.checkUpload(data);
            break;
          case 'start_stop_time':
            res = this.checkStartStopTime(data);
            break;
          case 'data_association':
            res = this.checkAssociation(data);
            break;
          case 'remote_association':
            res = this.checkAssociation(data);
            break;
          case 'member':
            res = this.checkMember(data);
            break;
          case 'department':
            res = this.checkDepartment(data);
            break;
          case 'role_member':
            res = this.checkRoleMember(data);
            break;
          case 'editor':
            res = this.checkEditor(data);
            break;
          case 'table':
            res = this.checkTable(data);
            break;
          default:
            res = true;
        }
        return res;
      },
      // 表格元素失去焦点
      onTableElementBlur(element){
        this.onBlur(element);
      },
      onBlur(data){
        // 数据关联查询
        if (this.relateInfo[data.tempQueId] && this.relateInfo[data.tempQueId].length > 0) {
          for (let i = 0; i < this.relateInfo[data.tempQueId].length; i++) {
            const item = this.relateInfo[data.tempQueId][i];
            this.setRelatedData(this.getElementByTempQueId(item.tempQueId));
          }
        }
        // 数据关联(外部)查询
        if (this.remoteInfo[data.tempQueId] && this.remoteInfo[data.tempQueId].length > 0) {
          for (let i = 0; i < this.remoteInfo[data.tempQueId].length; i++) {
            const item = this.remoteInfo[data.tempQueId][i];
            this.setRemoteData(this.getElementByTempQueId(item.tempQueId), false);
          }
        }
        // 默认数据关联查询
        if (this.defaultRelateInfo[data.tempQueId] && this.defaultRelateInfo[data.tempQueId].length > 0) {
          for (let i = 0; i < this.defaultRelateInfo[data.tempQueId].length; i++) {
            const item = this.defaultRelateInfo[data.tempQueId][i];
            if (!data.parentTempQueId) {
              this.setDefaultRelatedData(this.getElementByTempQueId(item.tempQueId));
            } else {
              const parent = this.getElementByTempQueId(data.parentTempQueId);
              const childColIndex = this.getChildIndexByTempQueId(parent, item.tempQueId);
              this.setDefaultRelatedData(Object.assign({}, this.getElementByTempQueId(item.tempQueId), {
                parentTempQueId: data.parentTempQueId,
                childColIndex: childColIndex,
                childRowIndex: data.childRowIndex
              }));
            }
          }
        }
        // 默认数据关联(外部)查询
        if (this.defaultRemoteInfo[data.tempQueId] && this.defaultRemoteInfo[data.tempQueId].length > 0) {
          for (let i = 0; i < this.defaultRemoteInfo[data.tempQueId].length; i++) {
            const item = this.defaultRemoteInfo[data.tempQueId][i];
            this.setDefaultRemoteData(this.getElementByTempQueId(item.tempQueId));
          }
        }
        // 公式计算
        if (this.defaultCalculateInfo[data.tempQueId] && this.defaultCalculateInfo[data.tempQueId].length > 0) {
          for (let i = 0; i < this.defaultCalculateInfo[data.tempQueId].length; i++) {
            const item = this.defaultCalculateInfo[data.tempQueId][i];
            this.setDefaultCalculateData(item);
          }
        }
        // 该元素不允许重复值
        if (data.norepeat) {
          this.repeatCheck(data);
        }
      },
      // 检查字段是否重复
      async repeatCheck(data){
        const res = await services.repeateCheck({
          appId: data.appId,
          queId: data.queId,
          value: data.value
        })
        if (res.returnCode === '6011') {
          this.$set(data, 'norepeat_error', true);
          this.$set(data, 'error', '该值已存在');
        } else {
          this.$set(data, 'norepeat_error', false);
        }
      },
      // 上传附件401
      onUnauthorized(){
        this.$emit('Unauthorized');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "./dynamic-form.scss";
</style>
