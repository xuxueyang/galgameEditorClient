import axios from 'axios';
import router from '../router';
import {Loading, Message} from 'element-ui';
import {casLogin} from '../util/util'
let CancelToken = axios.CancelToken;
let cancel = null;
let loadingInstance = null;
// 是否正在刷新token
let refreshing = false;
// 请求队列
let requestQue = [];

const returnCase = {
  // 权限验证错误 3XXX
  '3000': '账号不存在',
  '3001': '未在系统里匹配到该用户(快速登录未匹配手机号码)',
  '3002': '没有权限删除资源',
  '3003': '默认身份下没有角色',
  '3004': '账号未激活',
  '3005': '账号下未找到有效身份',
  '3006': '账号密码不正确',
  '3007': '无效的Authorization',
  '3008': '用户已经登出',
  '3009': '没有权限进行操作',
  '3010': '没有权限操作系统角色',
  '3011': '没有权限操作owner角色',
  '3012': '没有权限操作member角色',
  '3013': '没有权限操作owner用户',
  '3014': '用户缺失系统角色',
  '3015': '没有权限编辑资源',
  // -----------------------对应的返回请求上的httpStatus 为401-------------------------------
  '3016': 'token无效',
  '3017': '未知的appId',
  '3018': 'header里没有找到参数appId',
  '3019': 'token里的tenantCode与 spaceUri里的tenantCode不一致',
  '3020': '当前spaceUri下无法找到有效身份（切换身份时）',
  '3021': '根据spaceUri未匹配到InstanceCode、TenantCode、SpaceCode',
  '3022': 'header里没有找到参数spaceUri',
  // -----------------------对应的返回请求上的httpStatus 为401-------------------------------
  '3030': '账号需要审核',

  // 异常错误  4XXX
  '4000': '查询失败',
  '4001': '创建失败',
  '4002': '更新失败',
  '4003': '删除失败',
  '4004': '短信发送失败',
  '4005': '文件上传失败',
  '4999': '包含以上异常',

  // 非逻辑验证错误 50XX：字段   51XX：资源
  '5001': '字段不能为空',
  '5002': '字段格式不正确',
  '5003': '图形验证码不正确',
  '5004': '手机验证码不正确',
  '5005': '附件URL为空',
  '5006': '链接不正确',
  '5007': '链接过期',
  '5008': '字段必须为空',
  '5009': '字段的长度不符合',
  '5010': '验证码不正确',
  '5011': '字段不能更改',
  '5012': '配置异常',
  '5013': '字段的值不在规定范围内',

  // 逻辑验证错误 6XXX
  '6000': '账号不存在',
  '6001': '字段已经存在',
  '6003': '删除的资源不存在',
  '6004': '资源不存在',
  '6005': '资源有子元素，无法删除',
  '6006': '资源已被使用，无法删除',
  '6007': '当前用户不存在（token中未取到userId）',
  '6010': '资源不允许被修改',
  '6012': '资源数目上限',
  // '6013': '用户未被邀请',
  '6013': '用户身份(user)不存在',
  '6014': '权限不存在',
  '6015': '角色不存在',
  '6016': '角色下有用户，不允许删除角色',
  '6017': '系统角色，不允许删除或更新',
  '6018': '记录不是待审批状态，无法进行审批',
  '6019': '空间不是激活状态',
  '6020': '租户下不存在空间',
  '6021': '账号名与账号ID不匹配',
  '6022': '账号名与用户ID不匹配',
  '6023': '数据存在子节点',
  '6024': '企业空间已经被注册',
  '6025': '根据spaceUri未匹配到InstanceCode、TenantCode、SpaceCode',
  '6026': 'header里没有找到参数spaceUri',
  '6030': '不支持EMAIL登录注册',
  '6031': '不支持手机登录注册',
  '6032': '不支持快速登录',
  '6033': '只支持管理员邀请',
  '6034': '邀请用户的身份只能是会员(member)',
  '6035': '不支持邀请',
  '6036': '不支持邮箱方式邀请',
  '6037': '不支持手机方式邀请',
  '6038': '不支持注册审核',
  '6039': '确认密码与密码值不相等',
  '6040': '不支持用户名登录',
  '6041': '父节点不存在',
  '6042': '邀请ID不存在',
  '6043': '邀请失效',
  '6044': '超级管理员已存在',
  '6045': '不是超级管理员',
  '6046': '不能对超级管理员进行操作',
  '6047': '当前的角色不能进行启用禁用操作',
  '6048': '用户邮箱已认证',
  '6049': '不允许由发布状态修改为草稿状态',
  '6050': ' 用户已分配组织架构',
  '6051': ' 发布失败、资源上传中',
  '6052': '用户邮箱未认证',
  '6053': '开始时间大于结束时间',
  '6073': '无法发布，节点配置有误',
  '6999': '应用不存在'
}
export async function httpService(method, url, request) {
  // request拦截
  axios.interceptors.request.use(function (config) {
      // loadingInstance = Loading.service({
    //   lock: true,
    //   text: '加载中',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    return config;
  }, function (error) {
    if (loadingInstance) {
      loadingInstance.close();
    }
    Message.error('请求超时');
    return Promise.reject(error);
  });
  // response拦截
  axios.interceptors.response.use(function (response) {
    if (loadingInstance) {
      loadingInstance.close();
    }
    return response;
  }, function (error) {
    if (loadingInstance) {
      loadingInstance.close();
    }
    return Promise.reject(error);
  });
  const token = localStorage.getItem('cube-' + process.env.tenantCode + '-access-token')
  const resp = await http({
    method,
    url,
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    }),
    data: request ? request.data : null,
    params: request ? request.params : null,
    baseURL: process.env.httpBaseUri,
    timeout: 120000,
    headers: {
      'spaceUri': process.env.spaceUri,
      'Authorization': `Bearer ${token}`
    },
    validateStatus: (status) => {
      return true
    }
  })
  return resp;
}

async function http(config) {
  const resp = await axios(config)
  const {status, data} = resp
  if (status.toString().startsWith('20')) {
    if (data.returnCode.startsWith('2')) {
      return {
        status: 1,
        ...data
      }
    } else {
      if (data.returnCode !== '3016' && returnCase[data.returnCode]) {
        Message.error(returnCase[data.returnCode]);
      }
      return {
        status: 2,
        ...data
      }
    }
  } else {
    if (data.returnCode === '3016') {
      // 如果3016直接到认证页面
      casLogin()
    } else {
      if (status === 500) {
        Message.error('服务器错误');
      }
      return {
        status: 3,
        returnCode: '0'
      }
    }
  }
}




