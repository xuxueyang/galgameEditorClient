// 表单元素配置
export const FORM_ITEM_CONFIG = {
  'description': {
    displayOption: {
      show_content: true,
      show_width: true
    },
    type: 'description',
    icon: 'fa fa-commenting-o',
    title: '描述文字',
    cname: '描述文字',
    value: '',
    width: 100,
    status: 'canEdit',
    error: ''
  },
  'input': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_repeat: true,
      show_limit_word: true
    },
    type: 'input',
    icon: 'fa fa-font',
    title: '单行文字',
    cname: '单行文字',
    hint: '',
    value: '',
    default_type: 'custom',
    default_item: 'input',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_calculate: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    norepeat: false,
    limit_word: false,
    min_word: 0,
    max_word: 0,
    status: 'canEdit',
    error: ''
  },
  'textarea': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_width: true,
      show_required: true,
      show_repeat: true,
      show_limit_word: true,
      hide_default_type_select: true
    },
    type: 'textarea',
    icon: 'fa fa-file-text-o',
    title: '多行文字',
    cname: '多行文字',
    hint: '',
    value: '',
    default_type: 'custom',
    default_item: 'textarea',
    width: 100,
    required: false,
    norepeat: false,
    limit_word: false,
    min_word: 0,
    max_word: 0,
    status: 'canEdit',
    error: ''
  },
  'date': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_date_repeat: true,
      show_exact_time: true
    },
    type: 'date',
    icon: 'fa fa-clock-o',
    title: '日期',
    cname: '日期',
    hint: '',
    value: null,
    displayValue: null,
    default_type: 'custom',
    default_item: 'date',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    date_norepeat: false,
    exact_time: false,
    status: 'canEdit',
    error: ''
  },
  'email': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_repeat: true
    },
    type: 'email',
    icon: 'fa fa-envelope-o',
    title: '邮箱',
    cname: '邮箱',
    hint: '',
    value: '',
    default_type: 'custom',
    default_item: 'input',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'phone': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_repeat: true
    },
    type: 'phone',
    icon: 'fa fa-mobile',
    title: '手机',
    cname: '手机',
    hint: '',
    value: '',
    default_type: 'custom',
    default_item: 'input',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'number': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_repeat: true,
      show_decimal: true
    },
    type: 'number',
    icon: 'fa fa-superscript',
    title: '数字',
    cname: '数字',
    hint: '',
    value: null,
    default_type: 'custom',
    default_item: 'input',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_calculate: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    norepeat: false,
    decimal: true,
    status: 'canEdit',
    error: ''
  },
  'url': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_default_type: true,
      show_width: true,
      show_required: true,
      show_repeat: true
    },
    type: 'url',
    icon: 'fa fa-link',
    title: '链接',
    cname: '链接',
    hint: '',
    value: '',
    default_type: 'custom',
    default_item: 'input',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    default_remote_elementId: null,
    default_remote_tableId: null,
    default_remote_fieldId: null,
    default_remote_show_fieldId: null,
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'radio': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_options: true,
      show_direction: true,
      show_width: true,
      show_required: true,
      show_options_share: false
    },
    type: 'radio',
    icon: 'fa fa-dot-circle-o',
    title: '单项选择',
    cname: '单项选择',
    hint: '',
    options: [
      {label: '未命名', value: 'option1'},
      {label: '未命名', value: 'option2'},
      {label: '未命名', value: 'option3'}
    ],
    value: null,
    direction: 'horizontal',
    width: 100,
    required: false,
    set_options_share: false,
    options_share: null,
    status: 'canEdit',
    error: ''
  },
  'select': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_options: true,
      show_width: true,
      show_required: true,
      show_options_share: false
    },
    type: 'select',
    icon: 'fa fa-caret-square-o-down',
    title: '下拉选择',
    cname: '下拉选择',
    hint: '',
    options: [
      {label: '未命名', value: 'option1'},
      {label: '未命名', value: 'option2'},
      {label: '未命名', value: 'option3'}
    ],
    value: null,
    width: 100,
    required: false,
    set_options_share: false,
    options_share: null,
    status: 'canEdit',
    error: ''
  },
  'checkbox': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_options: true,
      show_direction: true,
      show_width: true,
      show_required: true,
      show_limit_options: true,
      show_options_share: false
    },
    type: 'checkbox',
    icon: 'fa fa-check-square',
    title: '多项选择',
    cname: '多项选择',
    hint: '',
    options: [
      {label: '未命名', value: 'option1'},
      {label: '未命名', value: 'option2'},
      {label: '未命名', value: 'option3'}
    ],
    value: [],
    direction: 'horizontal',
    width: 100,
    required: false,
    limit_options: false,
    min_options: 0,
    max_options: 0,
    set_options_share: false,
    options_share: null,
    status: 'canEdit',
    error: ''
  },
  'upload': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_width: true,
      show_required: true,
      show_limit_file_type: true,
      show_limit_file_count: true,
      show_limit_file_size: true
    },
    type: 'upload',
    icon: 'fa fa-upload',
    title: '附件上传',
    cname: '附件上传',
    hint: '',
    value: [],
    width: 100,
    required: false,
    limit_file_type: false,
    file_type: [],
    file_real_type: [],
    custom_file_type: null,
    limit_file_count: false,
    max_file_count: 1,
    limit_file_size: true,
    max_file_size: 20,
    status: 'canEdit',
    error: ''
  },
  'start_stop_time': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      show_width: true,
      show_required: true,
      show_date_repeat: true,
      hide_default_type_select: true
    },
    type: 'start_stop_time',
    icon: 'fa fa-calendar',
    title: '起止时间',
    cname: '起止时间',
    hint: '',
    value: null,
    displayValue: null,
    default_type: 'custom',
    default_item: 'daterange',
    width: 100,
    required: false,
    date_norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'data_association': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_associate: true,
      show_width: true,
      show_required: true,
      show_filter: true
    },
    type: 'data_association',
    icon: 'fa fa-random',
    title: '数据关联',
    cname: '数据关联',
    hint: '',
    value: null,
    associatedAppliationId: null,
    associatedElementId: null,
    associatedFilter: [],
    association_options: [],
    width: 100,
    required: false,
    filter: false,
    status: 'canEdit',
    error: ''
  },
  'member': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      hide_calculate: true,
      show_member_range: true,
      show_member_default: true,
      show_width: true,
      show_required: true,
      show_repeat: true
    },
    type: 'member',
    icon: 'fa fa-user-o',
    title: '成员字段',
    cname: '成员',
    hint: '',
    value: [],
    default_type: 'custom',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    optionalUsers: [],
    optionalCurrentUser: false,
    defaultUsers: [],
    defaultCurrentUser: false,
    users: [],
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'department': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_default: true,
      hide_calculate: true,
      show_department_range: true,
      show_department_default: true,
      show_width: true,
      show_required: true,
      show_repeat: true
    },
    type: 'department',
    icon: 'fa fa-group',
    title: '部门字段',
    cname: '部门',
    hint: '',
    value: [],
    default_type: 'custom',
    default_applicationId: null,
    default_current_elementId: null,
    default_associated_elementId: null,
    default_show_elementId: null,
    default_applicationName: null,
    default_show_elementTitle: null,
    optionalDepartments: [],
    defaultDepartments: [],
    departments: [],
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'role_member': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_width: true,
      show_choose_role: true,
      show_choose_type: true,
      show_required: true,
      show_repeat: true
    },
    type: 'role_member',
    icon: 'fa fa-address-book',
    title: '角色成员',
    cname: '角色成员',
    hint: '',
    value: null,
    roleId: null,
    options: [],
    multiple: false,
    width: 100,
    required: false,
    norepeat: false,
    status: 'canEdit',
    error: ''
  },
  'editor': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_width: true,
      show_required: true
    },
    type: 'editor',
    icon: 'fa fa-list-alt',
    title: '富文本',
    cname: '富文本',
    hint: '',
    value: null,
    width: 100,
    status: 'canEdit',
    error: ''
  },
  'table': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_table_config: true
    },
    type: 'table',
    icon: 'fa fa-table',
    title: '表格',
    cname: '表格',
    hint: '',
    value: [[{queId: null, value: null, displayValue: null}, {queId: null, value: null, displayValue: null}]],
    width: 100,
    required: false,
    children: [
      {
        displayOption: {
          show_shared: true,
          show_title: true,
          show_hint: true,
          show_default: true,
          show_default_type: true,
          show_width: true,
          show_required: true,
          show_repeat: true,
          show_limit_word: true
        },
        type: 'input',
        icon: 'fa fa-font',
        title: '单行文字',
        cname: '单行文字',
        hint: '',
        value: '',
        default_type: 'custom',
        default_item: 'input',
        default_applicationId: null,
        default_current_elementId: null,
        default_associated_elementId: null,
        default_show_elementId: null,
        default_applicationName: null,
        default_show_elementTitle: null,
        default_calculate: null,
        default_remote_elementId: null,
        default_remote_tableId: null,
        default_remote_fieldId: null,
        default_remote_show_fieldId: null,
        width: 100,
        required: false,
        norepeat: false,
        limit_word: false,
        min_word: 0,
        max_word: 0,
        tempQueId: 'tempQueId0_' + (new Date()).getTime(),
        status: 'canEdit',
        error: ''
      },
      {
        displayOption: {
          show_shared: true,
          show_title: true,
          show_hint: true,
          show_default: true,
          show_default_type: true,
          show_width: true,
          show_required: true,
          show_repeat: true,
          show_limit_word: true
        },
        type: 'input',
        icon: 'fa fa-font',
        title: '单行文字',
        cname: '单行文字',
        hint: '',
        value: '',
        default_type: 'custom',
        default_item: 'input',
        default_applicationId: null,
        default_current_elementId: null,
        default_associated_elementId: null,
        default_show_elementId: null,
        default_applicationName: null,
        default_show_elementTitle: null,
        default_calculate: null,
        default_remote_elementId: null,
        default_remote_tableId: null,
        default_remote_fieldId: null,
        default_remote_show_fieldId: null,
        width: 100,
        required: false,
        norepeat: false,
        limit_word: false,
        min_word: 0,
        max_word: 0,
        tempQueId: 'tempQueId1_' + (new Date()).getTime(),
        status: 'canEdit',
        error: ''
      }
    ],
    status: 'canEdit',
    error: ''
  },
  'remote_association': {
    displayOption: {
      show_shared: true,
      show_title: true,
      show_hint: true,
      show_remote_associate: true,
      show_width: true,
      show_required: true,
      show_remote_filter: true
    },
    type: 'remote_association',
    icon: 'fa fa-random',
    title: '数据关联(外部)',
    cname: '数据关联(外部)',
    hint: '',
    value: null,
    associatedTableId: null,
    associatedFieldId: null,
    associatedFilter: [],
    association_options: [],
    width: 100,
    required: false,
    filter: false,
    status: 'canEdit',
    error: ''
  }
}

// 宽度占比等分份数
export const FORM_ITEM_WIDTH_DIVIDE_PART = 4
