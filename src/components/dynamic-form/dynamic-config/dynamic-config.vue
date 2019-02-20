<template>
  <div class="edit-area">
    <div class="edit-area-header" v-if="!childType">
      <i :class="config.icon"></i>
      <span class="type-name">
        {{config.cname}}
          <el-tooltip class="item" effect="dark" :content="showTooltip(config.type)" placement="bottom">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>
      </span>
    </div>
    <div class="edit-area-header" v-if="childType">
      <i class="fa fa-angle-left" @click="backToTable"></i>
      <span class="type-name">
        表格 · {{defaultConfig[childType].cname}}
      </span>
    </div>
    <div class="edit-share-area" v-if="config.displayOption.show_shared">
      <!-- 标题 -->
      <template v-if="config.displayOption.show_title">
        <div class="edit-title">
          <span>标题</span>
          <el-tooltip class="item" effect="dark" content="标题用于告诉填写者应该在该字段中输入什么样的内容。通常是一个词语或词组，也可以是一个问题。" placement="bottom">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>
        </div>
        <el-input v-model="config.title" placeholder="请输入标题" @input="onTitleChange" size="medium"></el-input>
      </template>
      <!-- 提示 -->
      <template v-if="config.displayOption.show_hint">
        <div class="edit-title">
          <span>提示</span>
          <el-tooltip class="item" effect="dark" content="提示属性用于指定对该模块进行一些附加说明，一般用来指导填写者输入。" placement="bottom">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>
        </div>
        <el-input v-model="config.hint" placeholder="请输入提示" @input="onHintChange" size="medium"></el-input>
      </template>
      <!-- 默认内容 -->
      <template v-if="config.displayOption.show_default">
        <div class="edit-title">
          <span>默认内容</span>
          <el-tooltip class="item" effect="dark" content="设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交。" placement="bottom">
            <i class="fa fa-question-circle"></i>
          </el-tooltip>
        </div>
        <default-content :config="config"></default-content>
      </template>
    </div>
    <!--成员选择范围-->
    <div class="edit-wrapper" v-if="config.displayOption.show_member_range">
      <member-range :config="config"></member-range>
    </div>
    <!--成员默认内容-->
    <div class="edit-wrapper" v-if="config.displayOption.show_member_default&&config.default_type!=='relate'">
      <member-default :config="config"></member-default>
    </div>
    <!--部门选择范围-->
    <div class="edit-wrapper" v-if="config.displayOption.show_department_range">
      <department-range :config="config"></department-range>
    </div>
    <!--部门默认内容-->
    <div class="edit-wrapper" v-if="config.displayOption.show_department_default">
      <department-default :config="config"></department-default>
    </div>
    <!-- 描述文字内容 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_content">
      <div class="edit-title">
        <span>内容</span>
        <el-tooltip class="item" effect="dark" content="可采用富文本编辑，填写者看到的内容将与您编辑的内容一致" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <!--<mf-editor @input="onEditorChange" v-model="config.value"></mf-editor>-->
      <quill-editor
        v-model="config.value"
        @input="onEditorChange"
        :options="editorOption">
      </quill-editor>
    </div>
    <!-- 选项内容 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_options">
      <div class="edit-title">
        <span>选项内容</span>
        <el-tooltip class="item" effect="dark" content="为选择组件提供具体内容，可以自定义编辑、增删" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <option-content
        ref="optionContent"
        :config="config">
      </option-content>
    </div>
    <!-- 选择角色 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_choose_role">
      <div class="edit-title">
        <span>选择角色</span>
        <el-tooltip class="item" effect="dark" content="通过选择的角色选择角色下的成员" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <choose-role ref="chooseRole" :config="config"></choose-role>
    </div>
    <!-- 排布方式 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_direction">
      <div class="edit-title">
        <span>排布方式</span>
        <el-tooltip class="item" effect="dark" content="排布方式用于横向或纵向排布选项" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <el-radio-group size="medium" v-model="config.direction" @change="onDirectionChange">
        <el-radio-button label="horizontal">横向排布</el-radio-button>
        <el-radio-button label="vertical">纵向排布</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 关联设置 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_associate">
      <div class="edit-title">
        <span>关联设置 %</span>
        <el-tooltip class="item" effect="dark" content="配置关联设置" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <association-setting
        :config="config"
        ref="associationSetting">
      </association-setting>
    </div>
    <!-- 关联设置(外部) -->
    <div class="edit-wrapper" v-if="config.displayOption.show_remote_associate">
      <div class="edit-title">
        <span>关联设置 %</span>
        <el-tooltip class="item" effect="dark" content="配置关联设置" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <association-remote-setting
        :config="config"
        ref="associationRemoteSetting">
      </association-remote-setting>
    </div>
    <!-- 字段占比 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_width">
      <div class="edit-title">
        <span>字段占比 %</span>
        <el-tooltip class="item" effect="dark" content="配置表单布局，可以单行多字段排布" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <el-radio-group size="medium" v-model="config.width" @change="onWidthChange">
        <el-radio-button :key="'width_percent_'+percent" :label="percent"
                         v-for="percent in widthPercents"></el-radio-button>
      </el-radio-group>
    </div>
    <!-- 是否多选 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_choose_type">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onMultipleChange" v-model="config.multiple">是否多选</el-checkbox>
        <el-tooltip class="item" effect="dark" content="配置是否可以选择多个" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 是否必填 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_required">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onRequiredChange" v-model="config.required">这是个必填项</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择必填后，填写者不填写将无法提交表单" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 是否允许重复 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_repeat">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onRepeatChange" v-model="config.norepeat">不允许重复值</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，填写者提交重复数据时会提示重复，无法提交。" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 时间重叠 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_date_repeat">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onDateRepeatChange" v-model="config.date_norepeat">不允许时间重叠</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，填写者提交重复的时间或时间段时提示重复，无法提交。多用于“场地预定”等特殊应用场景。" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 允许小数 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_decimal">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onDecimalChange" v-model="config.decimal">允许小数</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，填写者填写时可以输入带有小数点的数字，否则只能输入整数。" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 限制字数 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_limit_word">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onLimitNumberChange" v-model="config.limit_word">限制字数</el-checkbox>
        <el-tooltip class="item" effect="dark" content="限制字数：控制填写人选择时最少选几项，最多选几项。" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <template v-if="config.limit_word">
          <el-input-number @input="onMinWordChange" size="small" :style="{width:'53px',marginLeft:'15px'}"
                           v-model="config.min_word" :controls="false" :min="0"></el-input-number>
          ~
          <el-input-number @input="onMaxWordChange" size="small" :style="{width:'53px'}"
                           v-model="config.max_word" :controls="false" :min="0"></el-input-number>
        </template>
      </div>
    </div>
    <!-- 限制选项 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_limit_options">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onLimitOptionsChange" v-model="config.limit_options">限制选项</el-checkbox>
        <el-tooltip class="item" effect="dark" content="限制字数：控制填写人选择时最少选几项，最多选几项。" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <el-input-number @input="onMinOptionsChange" size="small" :style="{width:'53px',marginLeft:'15px'}"
                         v-model="config.min_options" :controls="false" :min="0"></el-input-number>
        ~
        <el-input-number @input="onMaxOptionsChange" size="small" :style="{width:'53px'}"
                         v-model="config.max_options" :controls="false" :min="0"></el-input-number>
      </div>
    </div>
    <!-- 配置选项份额 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_options_share">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onOptionsShareChange" v-model="config.set_options_share">配置选项份额</el-checkbox>
        <el-tooltip class="item" effect="dark" content="我是提示文字" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <option-share
          v-if="config.set_options_share"
          style="float: right"
          :config="config"
          ref="optionShare">
        </option-share>
      </div>
    </div>
    <!-- 精确到时分秒 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_exact_time">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onExactTimeChange" v-model="config.exact_time">精确到时/分/秒</el-checkbox>
        <el-tooltip class="item" effect="dark" content="日期模块是否精确到时／分／秒" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- 是否限制文件类型 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_limit_file_type">
      <div class="edit-checkbox-wrapper" style="margin-bottom: 5px;">
        <el-checkbox @change="onLimitFileTypeChange" v-model="config.limit_file_type">限制文件类型</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，可以设定文件类型范围，填写者上传除规定类型外的文件时会提示文件类型错误，无法上传" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <file-type
        v-if="config.limit_file_type"
        :config="config">
      </file-type>
    </div>
    <!-- 是否限制上传文件数量 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_limit_file_count">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onLimitFileCountChange" v-model="config.limit_file_count">限制文件数量</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，可以设定上传文件数量，填写者上传超过规定数量的文件时会提示数量超过限制，无法上传" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <span v-if="config.limit_file_count" class="extra-config">
          最多
          <el-input-number
            @input="onMaxFileCountChange"
            size="small"
            :style="{width:'42px',marginLeft:'5px',marginRight:'5px'}"
            v-model="config.max_file_count"
            :controls="false"
            :min="1">
          </el-input-number>
          个</span>
      </div>
    </div>
    <!-- 是否限制文件大小 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_limit_file_size">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onLimitFileSizeChange" v-model="config.limit_file_size">限制文件大小</el-checkbox>
        <el-tooltip class="item" effect="dark" content="选择后，可以设定文件大小范围，填写者上传超过规定大小的文件时会提示文件大小超过限制，无法上传" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
        <span v-if="config.limit_file_size" class="extra-config">
          最大
          <el-input-number
            @input="onMaxFileSizeChange"
            size="small"
            :style="{width:'42px',marginLeft:'5px',marginRight:'5px'}"
            v-model="config.max_file_size"
            :controls="false"
            :min="0">
          </el-input-number>
          MB</span>
      </div>
    </div>
    <!-- 筛选数据 -->
    <div class="edit-wrapper" v-if="config.displayOption.show_filter">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onFilterDataChange" v-model="config.filter">筛选数据</el-checkbox>
        <el-tooltip class="item" effect="dark" content="筛选匹配条件的数据" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <filter-data v-if="config.filter" ref="filterData" :config="config"></filter-data>
    </div>
    <!-- 筛选数据(外部) -->
    <div class="edit-wrapper" v-if="config.displayOption.show_remote_filter">
      <div class="edit-checkbox-wrapper">
        <el-checkbox @change="onFilterRemoteDataChange" v-model="config.filter">筛选数据</el-checkbox>
        <el-tooltip class="item" effect="dark" content="筛选匹配条件的数据" placement="bottom">
          <i class="fa fa-question-circle"></i>
        </el-tooltip>
      </div>
      <filter-remote-data
        v-if="config.filter"
        ref="filterRemoteData"
        :config="config"></filter-remote-data>
    </div>
    <!--表格字段配置-->
    <div class="edit-wrapper" v-if="config.displayOption.show_table_config">
      <div class="edit-title">
        <span>表格字段</span>
        <span class="desc">点击字段进行编辑</span>
      </div>
      <table-config :config="config"></table-config>
    </div>
  </div>
</template>

<script>
  import {FORM_ITEM_WIDTH_DIVIDE_PART} from '../dynamic-form.config';
  import OptionContent from './option-content/option-content.vue';
  import DefaultContent from './default-content/default-content.vue';
  import OptionShare from './option-share/option-share.vue';
  import FileType from './file-type/file-type.vue';
  import AssociationSetting from './association-setting/association-setting.vue';
  import FilterData from './filter-data/filter-data.vue';
  import MemberRange from './member-range/member-range.vue';
  import MemberDefault from './member-default/member-default.vue';
  import TableConfig from "./table-config/table-config";
  import {FORM_ITEM_CONFIG} from '../dynamic-form.config';
  import DepartmentRange from "./department-range/department-range";
  import DepartmentDefault from "./department-default/department-default";
  import ChooseRole from "./choose-role/choose-role";
  import AssociationRemoteSetting from "./association-remote-setting/association-remote-setting";
  import FilterRemoteData from "./filter-remote-data/filter-remote-data";
  export default{
    components: {
      FilterRemoteData,
      AssociationRemoteSetting,
      ChooseRole,
      DepartmentDefault,
      DepartmentRange,
      TableConfig,
      OptionContent,
      DefaultContent,
      OptionShare,
      FileType,
      AssociationSetting,
      FilterData,
      MemberRange,
      MemberDefault
    },
    name: 'CubeDynamicConfig',
    computed: {
      config(){
        return this.childType ? this.$store.state.dynamicForm.currentFormItem.children[this.childIndex] : this.$store.state.dynamicForm.currentFormItem;
      },
      widthPercents(){
        const per = parseInt(100 / FORM_ITEM_WIDTH_DIVIDE_PART, 10);
        let array = [];
        for (let i = 0; i < FORM_ITEM_WIDTH_DIVIDE_PART; i++) {
          if (i !== 0) {
            array.push(per * i);
          }
          if (i === FORM_ITEM_WIDTH_DIVIDE_PART - 1) {
            array.push(100);
          }
        }
        return array
      },
      // 子元素类型
      childType(){
        return this.$store.state.dynamicForm.childType;
      },
      // 子元素位置
      childIndex(){
        return this.$store.state.dynamicForm.childIndex;
      },
      // 默认的表单属性
      defaultConfig(){
        return FORM_ITEM_CONFIG;
      }
    },
    data(){
      return {
        editorOption: {
          placeholder: '请输入描述文字',
          theme: 'snow'
        },
        tooltipConfig: {
          'description': '描述文字可以为表单添加段落说明信息，字体样式可以自定义设置。',
          'input': '单行文本输入框，需要填写者在输入框内根据标题填写相应的内容。',
          'textarea': '多行文本输入框，需要填写者在输入框内根据标题填写相应的内容。',
          'date': '时间选择组件，需要填写者选择具体日期时间。',
          'email': '单行文本输入框，规定填写者输入内容为邮箱，带有字段校验',
          'phone': '单行文本输入框，规定填写者输入内容为手机，带有字段校验',
          'number': '单行文本输入框，规定填写者输入内容为数字，带有字段校验',
          'url': '单行文本输入框，规定填写者输入内容为链接，带有字段校验',
          'radio': '选择组件，可以自定义编辑和增删选项，填写者需要进行单项选择。',
          'select': '选择组件，可以自定义编辑和增删选项，填写者通过下拉框进行单项选择。',
          'checkbox': '选择组件，可以自定义编辑和增删选项',
          'upload': '上传文件组件，可以自定义上传说明，指导填写者上传文件、图片等，可添加多个附件。',
          'start_stop_time': '时间选择组件，需要填写者选择起止日期与时刻。',
          'data_association': '通过关联设置可以提供其他应用的值给当前应用选择。',
          'member': '通过设定可选成员的最大范围，提供成员的选择。结合“动态负责人”，可用于“指派任务”等场景。',
          'department': '通过设定可选部门的最大范围，提供成员的选择。',
          'role_member': '通过设定角色，提供角色相关成员的选择。',
          'editor': '升级版的文本输入框，拥有格式设置，比如字体和段落设置、页面设置等，使得文本输入更加个性化。',
          'table': '创建自定义列字段，支持其他字段的嵌入，填写者可通过添加行添加多条数据。',
          'remote_association': '通过关联设置可以提供外部接口提供的数据给当前应用选择。',
        }
      }
    },
    watch: {
      // 当前配置的表单元素变更
      'config.index': {
        handler(newValue, oldValue){
          // 如果选中的表单元素变更
          if (newValue !== oldValue) {
            this.getRemoteData();
          }
        },
        deep: true
      }
    },
    methods: {
      // 显示当前元素的tooltip提示
      showTooltip(type){
        return this.tooltipConfig[type] || ''
      },
      // 查询一些接口数据
      getRemoteData(){
        // 如果当前选中的元素是数据关联则查询应用列表
        if (this.config.type === 'data_association') {
          const me = this;
          // 由于切换之前可能选项内容组件还没有挂载，所以需要加一个nextTick
          this.$nextTick(function () {
            me.$refs.associationSetting.updateAssociatedInfo();
          })
        }
        // 如果当前选中的元素是数据关联(外部)则查询外部数据
        if (this.config.type === 'remote_association') {
          const me = this;
          // 由于切换之前可能选项内容组件还没有挂载，所以需要加一个nextTick
          this.$nextTick(function () {
            me.$refs.associationRemoteSetting.updateAssociatedInfo();
          })
        }
        // 如果当前选中的元素是角色成员则查询角色列表
        if (this.config.type === 'role_member') {
          const me = this;
          // 由于切换之前可能选项内容组件还没有挂载，所以需要加一个nextTick
          this.$nextTick(function () {
            me.$refs.chooseRole.getAllRoles();
          })
        }
      },
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
      // 标题变更
      onTitleChange(data){
        this.onPropertyChange('title', data);
      },
      // 提示变更
      onHintChange(data){
        this.onPropertyChange('hint', data);
      },
      // 排布方式变更
      onDirectionChange(data){
        this.onPropertyChange('direction', data);
      },
      // 字段占比变更
      onWidthChange(data){
        this.onPropertyChange('width', data);
      },
      // 是否多选
      onMultipleChange(data){
        this.onPropertyChange('multiple', data);
        if (data) {
          this.onPropertyChange('value', []);
        } else {
          this.onPropertyChange('value', null);
        }
      },
      // 是否必填变更
      onRequiredChange(data){
        this.onPropertyChange('required', data);
      },
      // 是否允许重复值变更
      onRepeatChange(data){
        this.onPropertyChange('norepeat', data);
      },
      // 是否允许时间重叠变更
      onDateRepeatChange(data){
        this.onPropertyChange('date_norepeat', data);
      },
      // 是否允许小数变更
      onDecimalChange(data){
        this.onPropertyChange('decimal', data);
      },
      // 是否限制字数变更
      onLimitNumberChange(data){
        this.onPropertyChange('min_word', 0);
        this.onPropertyChange('max_word', 0);
        this.onPropertyChange('limit_word', data);
      },
      // 最小字数变更
      onMinWordChange(data){
        this.onPropertyChange('min_word', data);
      },
      // 最大字数变更
      onMaxWordChange(data){
        this.onPropertyChange('max_word', data);
      },
      // 是否限制选项变更
      onLimitOptionsChange(data){
        this.onPropertyChange('limit_options', data);
      },
      // 最小选项变更
      onMinOptionsChange(data){
        this.onPropertyChange('min_options', data);
      },
      // 最大选项变更
      onMaxOptionsChange(data){
        this.onPropertyChange('max_options', data);
      },
      // 是否配置选项份额变更
      onOptionsShareChange(data){
        this.onPropertyChange('set_options_share', data);
        if (data) {
          const me = this;
          this.$nextTick(function () {
            me.$refs.optionShare.openDialog();
          })
        }
      },
      // 是否精确到时分秒变更
      onExactTimeChange(data){
        this.onPropertyChange('exact_time', data);
      },
      // 描述文字内容变更
      onContentChange(data){
        this.onPropertyChange('value', data);
      },
      // 是否限制文件类型变更
      onLimitFileTypeChange(data){
        this.onPropertyChange('limit_file_type', data);
      },
      // 是否限制上传文件数量
      onLimitFileCountChange(data){
        this.onPropertyChange('limit_file_count', data);
      },
      // 是否限制文件大小变更
      onLimitFileSizeChange(data){
        this.onPropertyChange('limit_file_size', data);
      },
      // 最大上传附件数量变更
      onMaxFileCountChange(data){
        this.onPropertyChange('max_file_count', data);
      },
      // 上传文件大小变更
      onMaxFileSizeChange(data){
        this.onPropertyChange('max_file_size', data);
      },
      // 是否筛选数据变更
      onFilterDataChange(data){
        this.onPropertyChange('filter', data);
        if (data) {
          const me = this;
          this.$nextTick(function () {
            me.$refs.filterData.openDialog();
          })
        }
      },
      // 是否筛选数据变更(外部)
      onFilterRemoteDataChange(data){
        this.onPropertyChange('filter', data);
        if (data) {
          const me = this;
          this.$nextTick(function () {
            me.$refs.filterRemoteData.openDialog();
          })
        }
      },
      // 描述文字富文本内容变更
      onEditorChange(data){
        this.onPropertyChange('value', data);
      },
      // 返回表格设置
      backToTable(){
        this.$store.dispatch('setChildType', null);
        this.$store.dispatch('setChildIndex', null);
      }
    },
    mounted(){
      this.getRemoteData();
    }
  }
</script>

<style scoped lang="scss">
  @import "./dynamic-config.scss";
</style>
