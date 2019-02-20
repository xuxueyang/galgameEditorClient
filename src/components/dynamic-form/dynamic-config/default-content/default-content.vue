<template>
  <div class="relate-data-wrapper">
    <el-select
      v-if="!config.displayOption.hide_default_type_select"
      size="medium"
      @change="onDefaultTypeChange"
      :style="{width:'100%'}" v-model="config.default_type"
      placeholder="请选择">
      <el-option
        key="default_type_custom"
        label="自定义"
        value="custom">
      </el-option>
      <el-option
        v-if="relateTypes.indexOf(config.type)!==-1"
        key="default_type_remote"
        label="关联已有数据"
        value="relate">
      </el-option>
      <el-option
        v-if="remoteTypes.indexOf(config.type)!==-1"
        key="default_type_relate"
        label="关联外部数据"
        value="remote">
      </el-option>
      <el-option
        v-if="calculateTypes.indexOf(config.type)!==-1"
        key="default_type_calculate"
        label="公式计算"
        value="calculate">
      </el-option>
    </el-select>
    <div style="margin-top: 10px;" v-if="config.default_type==='custom'">
      <el-input
        v-model="config.value"
        size="medium"
        v-if="config.default_item==='input'"
        :placeholder="defaultPlaceholder"
        @input="onDefaultChange">
      </el-input>
      <el-input
        v-model="config.value"
        size="medium" type="textarea"
        :rows="2"
        v-if="config.default_item==='textarea'"
        :placeholder="defaultPlaceholder"
        @input="onDefaultChange">
      </el-input>
      <el-date-picker
        v-model="config.displayValue"
        size="medium"
        :style="{width:'100%'}"
        v-if="config.default_item==='date'"
        :type="config.exact_time?'datetime':'date'"
        placeholder="选择日期"
        @input="onDateDefaultChange">
      </el-date-picker>
      <el-date-picker
        @input="onDateDefaultChange"
        v-if="config.default_item==='daterange'"
        size="medium"
        :style="{width:'100%',marginTop:0}"
        v-model="config.displayValue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始时间"
        end-placeholder="结束时间">
      </el-date-picker>
    </div>
    <!-- 数据关联设置 -->
    <div v-if="config.default_type==='relate'" class="set-relate-data" @click="showRelateData">
      <span class="notify" v-if="!config.default_applicationName">设置关联已有数据</span>
      <template v-if="config.default_applicationName">
        <span style="float: left;">{{config.default_applicationName}}·{{config.default_show_elementTitle}}</span>
        <span class="notify" style="float: right;">修改设置</span>
      </template>
    </div>

    <!-- 公式计算设置 -->
    <div v-if="config.default_type==='calculate'" class="set-relate-data" @click="showCalculateSetting">
      <span class="notify">设置通过公式计算</span>
    </div>

    <!-- 关联外部数据设置 -->
    <div v-if="config.default_type==='remote'" class="set-relate-data" @click="showRemoteSetting">
      <span class="notify" v-if="!config.default_applicationName">设置关联外部数据</span>
      <template v-if="config.default_applicationName">
        <span style="float: left;">{{config.default_applicationName}}·{{config.default_show_elementTitle}}</span>
        <span class="notify" style="float: right;">修改设置</span>
      </template>
    </div>

    <!-- 关联已有数据弹框 -->
    <el-dialog @open="onDialogOpen" title="关联已有数据" width="450px" :visible.sync="relateDataVisible">
      <div class="relate-data-header">
        <span>通过关联已有数据可以直接调用其他应用已经录入的数据</span>
      </div>
      <div class="relate-data-body">
        <div class="setting-title">关联应用</div>
        <el-select
          :clearable="true"
          size="medium"
          @change="onApplicationChange"
          :style="{width:'100%',marginBottom:'12px'}"
          v-model="config.default_applicationId"
          placeholder="选择应用">
          <el-option
            v-for="application in applications"
            :label="application.name"
            :value="application.id"
            :key="application.id">
          </el-option>
        </el-select>
        <div class="setting-title">关联设置</div>
        <div class="setting-row">
          <div class="setting-item">
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px'}"
              v-model="config.default_current_elementId"
              placeholder="当前应用字段">
              <el-option
                v-for="cElement in currentElements"
                v-if="canRelatedElements.indexOf(cElement.type)!==-1&&cElement.tempQueId!==config.tempQueId"
                :label="cElement.title"
                :value="cElement.tempQueId"
                :key="cElement.tempQueId">
              </el-option>
            </el-select>
            <span>的值等于</span>
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px',marginLeft:'10px'}"
              v-model="config.default_associated_elementId"
              placeholder="关联应用字段">
              <el-option
                v-for="element in elements"
                v-if="canRelatedElements.indexOf(element.type)!==-1"
                :label="element.title"
                :value="element.queId"
                :key="element.queId">
              </el-option>
            </el-select>
            <span>的值时</span>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-item">
            <el-input size="medium" :style="{width:'140px'}" v-model="config.title" :disabled="true">
            </el-input>
            <span>联动显示</span>
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px',marginLeft:'10px'}"
              v-model="config.default_show_elementId"
              placeholder="关联应用字段">
              <el-option
                v-for="element in elements"
                v-if="(config.type==='input'&&canRelatedElements.indexOf(element.type)!==-1)||(config.type!=='input'&&config.type===element.type)"
                :label="element.title"
                :value="element.queId"
                :key="element.queId">
              </el-option>
            </el-select>
            <span>的值</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancelClick">取消</el-button>
        <el-button type="primary" @click="onConfirmClick">完成</el-button>
      </div>
    </el-dialog>

    <!-- 公式计算弹框 -->
    <el-dialog @open="onCalculateDialogOpen" title="通过公式计算" width="1000px" :visible.sync="calculateVisible">
      <div class="calculate-body">
        <div class="left-container">
          <div class="tab-bar">
            <div class="tab" @click="calculateTabIndex=1;">公式</div>
            <div class="tab" @click="calculateTabIndex=2;">字段</div>
            <div class="active-cursor"
                 :style="{'transform':calculateTabIndex===1?'translate3d(46px, 0px, 0px)':'translate3d(160px, 0px, 0px)'}"></div>
          </div>
          <div class="calculate-list-container" v-if="calculateTabIndex===1">
            <div class="select-item" @click="chooseFormula(formula.en)" v-for="formula in formulas" :key="formula.en">
              <span>{{formula.en}}</span>
              <span>{{formula.cn}}</span>
            </div>
          </div>
          <div class="calculate-list-container" v-if="calculateTabIndex===2">
            <template v-for="element in savedElements">
              <div @click="chooseElement(element)" v-if="element.type!=='table'&&element.tempQueId!==config.tempQueId"
                   class="select-item"
                   :key="'savedEle_'+element.queId">
                <span>{{element.title}}</span>
                <span class="type-name">{{element.cname}}</span>
              </div>
              <!--<div v-else class="select-item-table" :key="'savedEle_'+element.queId">-->
              <!--<div class="select-item" @click.stop="expandShrink(element)">-->
              <!--<span>{{element.title}}</span>-->
              <!--<span class="type-name">{{element.cname}}<i-->
              <!--:style="{'transform':element.expand?'rotate(180deg)':'rotate(0deg)'}" class="fa fa-angle-down"></i></span>-->
              <!--</div>-->
              <!--<ul class="table-child-list" v-if="element.expand">-->
              <!--<li @click="chooseElement(child)" class="select-item" v-for="child in element.children"-->
              <!--:key="'table_'+element.queId+'_'+child.queId">-->
              <!--<span>{{child.title}}</span>-->
              <!--<span class="type-name">{{child.cname}}</span>-->
              <!--</li>-->
              <!--</ul>-->
              <!--</div>-->
            </template>
          </div>
        </div>
        <div class="right-container">
          <div class="edit-area">
            <div class="edit-header">
              <span>{{config.title}}</span>
              <span class="equal">=</span>
            </div>
            <textarea v-show="showEditor" ref="mirror"></textarea>
          </div>
          <div class="edit-footer">
            <div class="button-wrapper">
              <el-button @click="calculateCancel">取消</el-button>
              <el-button type="primary" @click="calculateConfirm">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 关联外部数据弹框 -->
    <el-dialog @open="onRemoteDialogOpen" title="关联外部数据" width="450px" :visible.sync="remoteDataVisible">
      <div class="relate-data-header">
        <span>通过关联外部数据可以直接调用外部的数据</span>
      </div>
      <div class="relate-data-body">
        <div class="setting-title">关联外部</div>
        <el-select
          :clearable="true"
          size="medium"
          @change="onRemoteTypeChange"
          :style="{width:'100%',marginBottom:'12px'}"
          v-model="config.default_remote_tableId"
          placeholder="选择外部数据">
          <el-option
            v-for="list in remoteLists"
            :label="list.name"
            :value="list.id"
            :key="list.id">
          </el-option>
        </el-select>
        <div class="setting-title">关联设置</div>
        <div class="setting-row">
          <div class="setting-item">
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px'}"
              v-model="config.default_remote_elementId"
              placeholder="当前应用字段">
              <el-option
                v-for="cElement in currentElements"
                :label="cElement.title"
                :value="cElement.tempQueId"
                :key="cElement.tempQueId">
              </el-option>
            </el-select>
            <span>的值等于</span>
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px',marginLeft:'10px'}"
              v-model="config.default_remote_fieldId"
              placeholder="关联应用字段">
              <el-option
                v-for="field in remoteFields"
                :label="field.name"
                :value="field.id"
                :key="field.id">
              </el-option>
            </el-select>
            <span>的值时</span>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-item">
            <el-input size="medium" :style="{width:'140px'}" v-model="config.title" :disabled="true">
            </el-input>
            <span>联动显示</span>
            <el-select
              :clearable="true"
              size="medium"
              :style="{width:'140px',marginLeft:'10px'}"
              v-model="config.default_remote_show_fieldId"
              placeholder="关联应用字段">
              <el-option
                v-for="field in remoteFields"
                :label="field.name"
                :value="field.id"
                :key="field.id">
              </el-option>
            </el-select>
            <span>的值</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remoteCancel">取消</el-button>
        <el-button type="primary" @click="remoteConfirm">完成</el-button>
      </div>
    </el-dialog>

    <span ref="cmTag" class="cm-field" style="display: none;"></span>
  </div>
</template>

<script>
  import services from '../../../../service/back.service'
  import {calculateFunction} from '../../../../util/util'
  export default{
    name: 'DefaultContent',
    components: {
      // codemirror
    },
    props: {
      config: {
        type: Object,
        default: () => {
        }
      }
    },
    data(){
      return {
        defaultPlaceholder: '请输入默认内容',
        // 数据关联弹出框是否显示
        relateDataVisible: false,
        // 默认内容中可以选数据关联的表单元素
        relateTypes: ['input', 'date', 'email', 'phone', 'number', 'url', 'member'],
        // 默认内容中可以选公式计算的表单元素
        calculateTypes: ['input', 'number'],
        // 默认内容中可以选关联外部数据的
        remoteTypes: ['input', 'date', 'email', 'phone', 'number', 'url'],
        // 应用列表
        applications: [],
        // 关联应用的表单元素列表
        elements: [],
        // 当前表单元素
        currentElements: [],
        // 可以被关联的表单元素
        canRelatedElements: ['input', 'date', 'email', 'phone', 'number', 'url', 'radio', 'select'],
        // 公式计算弹出框是否显示
        calculateVisible: false,
        // 公式计算中tab的索引，默认为1公式
        calculateTabIndex: 1,
        // 已经保存的表单元素的列表
        savedElements: [],
        editor: null,
        showEditor: false,
        formulas: [
          {en: 'SUM', cn: '求和'},
          {en: 'AVERAGE', cn: '平均值'},
          {en: 'MAX', cn: '最大值'},
          {en: 'MIN', cn: '最小值'},
          {en: 'NTC', cn: '金额转大写'},
        ],
        // 数据外部数据弹出框是否显示
        remoteDataVisible: false,
        remoteLists: [],
        remoteFields: []
      }
    },
    computed: {
      isChild(){
        return this.$store.state.dynamicForm.childType ? true : false;
      }
    },
    methods: {
      // 属性变更
      onPropertyChange(key, value){
        this.$store.dispatch('setFormItemValue', {
          index: this.$store.state.dynamicForm.currentFormItem.index,
          rowIndex: this.$store.state.dynamicForm.currentFormItem.rowIndex,
          colIndex: this.$store.state.dynamicForm.currentFormItem.colIndex,
          key: key,
          value: value
        });
      },
      // 默认内容类型变更
      onDefaultTypeChange(data){
        this.onPropertyChange('default_type', data);
        if (data === 'relate') {
          this.openDialog();
        } else if (data === 'calculate') {
          this.showCalculateSetting();
        } else if (data === 'remote') {
          this.showRemoteSetting()
        }
      },
      // 默认内容发生变更
      onDefaultChange(data){
        this.onPropertyChange('value', data);
      },
      // 日期相关默认发生变更特殊处理
      onDateDefaultChange(data){
        this.onPropertyChange('displayValue', data);
        this.onPropertyChange('value', data ? Number((new Date(data)).getTime()) : null);
      },
      // 设置关联已有数据
      showRelateData(){
        this.relateDataVisible = true;
      },
      // 打开弹出框
      openDialog(){
        this.relateDataVisible = true;
      },
      // 点击取消
      onCancelClick(){
        this.relateDataVisible = false;
        this.config.default_applicationId = null;
        this.config.default_current_elementId = null;
        this.config.default_associated_elementId = null;
        this.config.default_show_elementId = null;
      },
      // 点击完成
      onConfirmClick(){
        if (!this.config.default_applicationId || !this.config.default_current_elementId || !this.config.default_associated_elementId || !this.config.default_show_elementId) {
          this.$message.error('关联已有数据未设置完成');
          return;
        }
        this.$store.dispatch('defaultRelatedData', {
          rowIndex: this.$store.state.dynamicForm.currentFormItem.rowIndex,
          colIndex: this.$store.state.dynamicForm.currentFormItem.colIndex,
          applicationId: this.config.default_applicationId,
          applicationName: this.getApplicationName(this.config.default_applicationId),
          currentElementId: this.config.default_current_elementId,
          associatedElementId: this.config.default_associated_elementId,
          showElementId: this.config.default_show_elementId,
          showElementTitle: this.getElementTitle(this.config.default_show_elementId),
        })
        this.relateDataVisible = false;
      },// 查询所有应用
      async getApplications(){
        const res = await services.getApplications({status: 'P,SP'});
        if (res.returnCode.startsWith('200')) {
          this.applications = res.data;
        }
      },
      // 查询应用下的所有表单元素
      async getElements(id){
        const res = await services.getFormElements({isPublish: true, appId: id});
        if (res.returnCode.startsWith('200')) {
          this.elements = res.data || [];
        }
      },
      // 获取当前应用的所有表单元素
      getCurrentElements(){
        const array = [];
        if (!this.isChild) {
          for (let i = 0; i < this.$store.state.dynamicForm.formConfigs.length; i++) {
            const row = this.$store.state.dynamicForm.formConfigs[i];
            for (let j = 0; j < row.length; j++) {
              const item = row[j];
              array.push(item);
            }
          }
        } else {
          for (let i = 0; i < this.$store.state.dynamicForm.currentFormItem.children.length; i++) {
            array.push(this.$store.state.dynamicForm.currentFormItem.children[i]);
          }
        }
        this.currentElements = Object.assign([], array);
      },
      // 所选应用变更
      onApplicationChange(data){
        this.config.default_associated_elementId = null;
        this.config.default_show_elementId = null;
        if (data) {
          this.getElements(data);
        } else {
          this.elements = [];
        }
      },
      // 根据应用id返回应用名称
      getApplicationName(id){
        let applicationName = null;
        const array = this.applications.filter((application) => application.id === id);
        if (array && array.length > 0) {
          applicationName = array[0].name;
        }
        return applicationName;
      },
      // 根据元素id返回元素title
      getElementTitle(queId){
        let title = null;
        const array = this.elements.filter((element) => element.queId === queId);
        if (array && array.length > 0) {
          title = array[0].title;
        }
        return title;
      },
      // 数据关联弹出框弹出事件
      onDialogOpen(){
        this.getCurrentElements();
        this.getApplications();
        if (this.config.default_applicationId) {
          this.getElements(this.config.default_applicationId);
        }
      },
      // 关联外部数据弹出框弹出事件
      onRemoteDialogOpen(){
        this.getRemoteTables()
        this.getCurrentElements()
        if (this.config.default_remote_tableId) {
          this.getRemoteFields(this.config.default_remote_tableId)
        }
      },
      // 获取外部的表
      getRemoteTables(){
        services.getRemoteTables().then((res) => {
          if (res.returnCode.startsWith('200')) {
            // this.remoteLists = res.data || []
            this.remoteLists = [
              {id: 'CUSTOMER', name: '客户信息'}
            ]
          }
        })
      },
      // 外部数据弹框确认
      remoteConfirm(){
        if (!this.config.default_remote_tableId || !this.config.default_remote_elementId || !this.config.default_remote_fieldId || !this.config.default_remote_show_fieldId) {
          this.$message.error('关联外部数据未设置完成')
          return
        }
        this.onPropertyChange('default_remote_tableId', this.config.default_remote_tableId)
        this.onPropertyChange('default_remote_elementId', this.config.default_remote_elementId)
        this.onPropertyChange('default_remote_fieldId', this.config.default_remote_fieldId)
        this.onPropertyChange('default_remote_show_fieldId', this.config.default_remote_show_fieldId)
        this.remoteDataVisible = false
      },
      // 外部数据弹框取消
      remoteCancel(){
        this.remoteDataVisible = false
      },
      // 打开关联外部数据弹出框
      showRemoteSetting(){
        this.remoteDataVisible = true
      },
      // 显示公式计算弹出框
      showCalculateSetting(){
        this.calculateVisible = true;
      },
      // 隐藏公式计算弹出框
      hideCalculateSetting(){
        this.calculateVisible = false;
      },
      // 获取当前应用已经保存了的字段
      async getFormElements(){
        const res = await services.getFormElements({appId: this.$store.state.app.appId, isPublish: false});
        this.savedElements = res.data || [];
      },
      // 公式计算弹出框弹出事件
      async onCalculateDialogOpen(){
        // 获取表单元素
        await this.getFormElements();
        this.showEditor = true;
        const me = this;
        this.$nextTick(function () {
          if (me.$refs.mirror) {
            if (!me.editor) {
              me.editor = CodeMirror.fromTextArea(me.$refs.mirror, {
                extraKeys: {"Ctrl": "autocomplete"},
                mode: 'text/workflow',
                hintOptions: {
                  completeSingle: false,
                }
              })
              me.editor.on('keyup', function (cm, event) {
                if (!cm.state.completionActive && event.keyCode !== 8 && event.keyCode !== 32) {
                  me.editor.showHint()
                }
                if (event.keyCode === 8) {

                }
              })
              me.editor.on('change', function (cm, changes) {
                me.tagElement();
              })
            }
            if (me.config.default_calculate) {
              me.editor.setValue(me.config.default_calculate);
              me.tagElement();
            } else {
              me.editor.setValue('');
            }
          }
        })
      },
      // 重置公式计算内容，将元素打上标签
      tagElement(){
        let tag = null;
        const reg = /\$queId_temp\d{13}\$/g
        let temp = null;
        const currentValue = this.editor.getValue();
        while ((temp = reg.exec(currentValue)) !== null) {
          const element = this.getElementByTempQueId(temp[0])
          if (element) {
            tag = this.$refs.cmTag.cloneNode(true);
            tag.style.display = 'inline-block';
            tag.innerHTML = element.title;
            this.editor.markText(
              {line: 0, ch: reg.lastIndex - temp[0].length},
              {line: 0, ch: reg.lastIndex},
              {replacedWith: tag, handleMouseEvents: true}
            )
          }
        }
      },
      // 根据tempQueId获取元素
      getElementByTempQueId(temp){
        temp = temp.replace(/\queId_/g, '').replace(/\$/g, '');
        for (let i = 0; i < this.savedElements.length; i++) {
          const element = this.savedElements[i];
          if (element.tempQueId === temp) {
            return element;
          }
          if (element.children) {
            for (let j = 0; j < element.children.length; j++) {
              const child = element.children[j];
              if (child.tempQueId === temp) {
                return child;
              }
            }
          }
        }
        return null;
      },
      // 展开收缩表格字段
      expandShrink(element){
        this.$set(element, 'expand', !element.expand);
      },
      // 点击选择公式
      chooseFormula(formual){
        let tag = this.$refs.cmTag.cloneNode(true);
        tag.style.display = 'inline-block';
        tag.innerHTML = formual;
        const currentPos = this.editor.getCursor()
        this.editor.replaceRange(formual, {line: currentPos.line, ch: currentPos.ch}, {
          line: currentPos.line,
          ch: currentPos.ch
        })
      },
      // 点击选择表单元素
      chooseElement(element){
        let tag = this.$refs.cmTag.cloneNode(true);
        tag.style.display = 'inline-block';
        tag.innerHTML = element.title;
        const currentPos = this.editor.getCursor()
        this.editor.replaceRange(`$queId_${element.tempQueId}$`, {line: currentPos.line, ch: currentPos.ch}, {
          line: currentPos.line,
          ch: currentPos.ch
        })
        this.editor.markText(
          {line: currentPos.line, ch: currentPos.ch},
          {line: currentPos.line, ch: currentPos.ch + 25},
          {replacedWith: tag, handleMouseEvents: true}
        )
      },
      // 公式计算点击取消
      calculateCancel(){
        this.hideCalculateSetting();
      },
      // 公式计算点击确定
      calculateConfirm(){
        if (this.isCorrect()) {
          this.onPropertyChange('default_calculate', this.editor.getValue());
          this.hideCalculateSetting();
        } else {
          this.$message.error('公式中存在错误');
        }
      },
      // 判断公式是否正确
      isCorrect(){
        // 目前的公式内容必须为数字，所以检查所有的元素是否为数字框
        if (!this.checkIsAllNumber()) {
          return false;
        }
        // 暂时通过try catch判断公式是否存在错误
        try {
          let value = this.editor.getValue();
          value = value.replace(/\$queId_temp\d{13}\$/g, 2);
          const calFunction = calculateFunction;
          const formulaArray = Object.keys(calculateFunction);
          const formulaReg = new RegExp('(' + formulaArray.join('|') + ')', 'g');
          value = value.replace(formulaReg, 'calFunction.$1')
          eval(value);
        } catch (e) {
          return false;
        }
        return true;
      },
      // 检查公式中的内容是否全部为数字
      checkIsAllNumber(){
        let value = this.editor.getValue();
        if (value) {
          const reg = /\$queId_temp\d{13}\$/g
          let temp = null;
          while ((temp = reg.exec(value)) !== null) {
            if (!this.checkNumberByTempQueId(temp[0])) {
              return false;
            }
          }
        }
        return true;
      },
      // 根据tempQueId判断该元素是否为数字
      checkNumberByTempQueId(str){
        const element = this.getElementByTempQueId(str);
        if (element && element.type === 'number') {
          return true;
        }
        return false;
      },
      // 获取外部数据表的字段
      getRemoteFields(type){
        services.getRemoteFields(type).then((res) => {
          if (res.returnCode.startsWith('200')) {
            this.remoteFields = res.data || []
          }
        })
      },
      // 选择的外部数据类型变更
      onRemoteTypeChange(data){
        if (data) {
          this.getRemoteFields(data)
        } else {
          this.remoteFields = []
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './default-content.scss';
</style>
