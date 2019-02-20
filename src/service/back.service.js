// import { httpProd } from '@cube-vue-pc/prod-http'

// const http = httpProd('CubeProdFengyunOAModule')

import {httpService} from './http'

const services = {
  getUsers: async (params) => {
    const res = await httpService('get', 'cubeuaa/api/users', {
      params
    })
    return res
  },
  // 获取所有数据字典
  getAllDictionaries: async () => {
    const res = await httpService('get', 'dict/api/111/222/dict-codes', {params: {status: 1, page: 0, size: 2000}})
    return res
  },
  // 获取某个数据字典的列表
  getDictionary: async (id) => {
    const res = await httpService('get', `dict/api/111/222/dict-code/${id}`, {params: {status: 1, page: 0, size: 2000}})
    return res
  },
  // 创建应用
  async createApplication (data) {
    const res = await httpService('post', 'workflow/api/app', {data: data})
    return res
  },
  // 复制应用
  async copyApplication(appId){
    const res = await httpService('post', `workflow/api/app/${appId}`)
    return res
  },
  // 获取应用列表
  async getApplications (data = {status: 'P,UP,SP'}) {
    const res = await httpService('get', 'workflow/api/apps', {params: data})
    return res
  },
  // 删除应用
  async deleteApplication (id) {
    const res = await httpService('delete', `workflow/api/app/${id}`)
    return res
  },
  // 获取单个应用信息
  async getApplicationInfo (id) {
    const res = await httpService('get', `workflow/api/app/${id}`)
    return res
  },
  // 保存表单设计
  async saveForm (data) {
    const res = await httpService('put', 'workflow/api/app', {data: data})
    return res
  },
  // 获取组织架构下的所有用户信息
  async getAllGroupsAndUsers () {
    const res = await httpService('get', 'cubeuaa/api/groups/all')
    return res
  },
  // 下载附件
  async downloadFile (data) {
    const res = await httpService('get', 'upload/api/file', {params: data})
    return res
  },
  // 添加节点
  async createNode (data) {
    const res = await httpService('post', 'workflow/api/workflow/node', {data: data})
    return res
  },
  // 删除节点
  async deleteNode (id, appId) {
    const res = await httpService('delete', `workflow/api/workflow/node/${id}`, {params: {appId: appId}})
    return res
  },
  // 添加子分支
  async createChildBranch (data) {
    const res = await httpService('post', 'workflow/api/workflow/branch', {data: data})
    return res
  },
  // 删除子分支
  async deleteChildBranch (id, appId) {
    const res = await httpService('delete', `workflow/api/workflow/branch/${id}`, {params: {appId: appId}})
    return res
  },
  // 修改子分支
  async updateChildBranch (data) {
    const res = await httpService('put', 'workflow/api/workflow/branch', {data: data})
    return res
  },
  // 更新节点
  async updateNode (data) {
    const res = await httpService('put', 'workflow/api/workflow/node', {data: data})
    return res
  },
  // 发布应用
  async publishApplication (id) {
    const res = await httpService('put', `workflow/api/app/publish/${id}`)
    return res
  },
  // 查询某一个应用的表单元素
  async getFormElements (data) {
    const res = await httpService('get', 'workflow/api/app/form-data', {params: data})
    return res
  },
  // 判断当前用户是否有权限申请
  async hasPermissionApply (appId) {
    const res = await httpService('get', 'workflow/api/app/check-apply-permission', {params: {appId: appId}})
    return res
  },
  // 判断应用是否需要密码
  async needPassword (appId) {
    const res = await httpService('get', 'workflow/api/app/check-apply-pwd', {params: {appId: appId}})
    return res
  },
  // 验证密码是否正确
  async passwordValidate (appId, password) {
    const res = await httpService('get', 'workflow/api/app/check-apply-pwd', {params: {appId: appId, pwd: password}})
    return res
  },
  async putSetting (data) {
    const res = await httpService('put', 'workflow/api/app/setting', {data: data})
    return res
  },
  async getSetting (data) {
    const res = await httpService('get', `workflow/api/app/setting/${data}`)
    return res
  },
  // 查询某个节点下的表单元素
  async getFormElementsByNode (appId, workflowNodeId = null) {
    const res = await httpService('get', 'workflow/api/app/publish/form-data', {
      params: {
        appId: appId,
        workflowNodeId: workflowNodeId
      }
    })
    return res
  },
  // 提交表单
  async submitApply (appId, data) {
    const res = await httpService('post', `workflow/api/app/${appId}/data`, {data: data})
    return res
  },
  // 草稿提交
  async submitDraft(appId, data){
    const res = await httpService('put', `workflow/api/app/${appId}/data`, {data: data})
    return res
  },
  // 显示抄送事项
  async getCarbonTask (appId) {
    const res = await  httpService('get', 'workflow/api/task/all-carbon', {params: {appId}})
    return res
  },
  // 获取待办事项
  async getMyTask(appId){
    const res = await  httpService('get', 'workflow/api/task/my-task', {params: {appId}})
    return res
  },
  // 获取已办事项
  async getFinishedTask (appId) {
    const res = await httpService('get', 'workflow/api/task/all-finished', {params: {appId}})
    return res

  },
  // 获取草稿
  async getTask(appId){
    const res = await httpService('get', 'workflow/api/task/draft', {params: {appId}})
    return res
  },
  // 获取流程中事项
  async getResolvingTask(appId){
    const res = await httpService('get', 'workflow/api/task/all-resolving', {params: {appId}})
    return res
  },
  // 获取待完善事项
  async getUnPerfectTask(appId){
    const res = await httpService('get', 'workflow/api/task/unperfect', {params: {appId}})
    return res
  },
  // 获取已通过事项
  async getPassedTask (appId) {
    const res = await httpService('get', 'workflow/api/task/all-pass', {params: {appId}})
    return res
  },
  // 获取未通过事项
  async getRejectedTask (appId) {
    const res = await httpService('get', 'workflow/api/task/reject', {params: {appId}})
    return res
  },
  // 获取单据数据
  async getFormData(dataId, data){
    const res = await httpService('get', `workflow/api/app/form-data/${dataId}`, {params: data})
    return res
  },
  // 通过
  async taskApprove(data){
    const res = await httpService('post', 'workflow/api/task/pass', {data: data})
    return res
  },
  // 拒绝
  async taskReject(data){
    const res = await httpService('post', 'workflow/api/task/refuse', {data: data})
    return res;
  },
  // 获取关联数据
  async getRelatedData(data){
    const res = await httpService('post', 'workflow/api/app/relate-data', {data: data})
    return res;
  },
  // 获取所有部门
  async getAllGroups(){
    const res = await httpService('get', 'cubeuaa/api/groups')
    return res;
  },
  // 获取所有角色
  async getAllRoles(){
    const res = await httpService('get', 'cubeuaa/api/roles')
    return res;
  },
  // 获取该角色下的所有成员
  async getRoleMembers(roleId){
    const res = await httpService('get', `cubeuaa/api/roles/${roleId}`)
    return res;
  },
  // 获取日志信息
  async getLog(dataId){
    const res = await httpService('get', `workflow/api/workflowlog/${dataId}`)
    return res;
  },
  // 获取用户信息
  async getUserInfo(){
    const res = await httpService('get', `cubeuaa/api/current-user`)
    return res;
  },
  // 判断字段值是否重复
  async repeateCheck(data){
    const res = await httpService('post', `workflow/api/app/field/duplication`, {data: data})
    return res;
  },
  // 查询外部数据表
  async getRemoteTables(){
    const res = await httpService('get', `workflow/api/app/relate-data-types`)
    return res;
  },
  // 查询外部数据字段
  async getRemoteFields(id){
    const res = await httpService('get', `workflow/api/app/relate-data-other`, {params: {type: id}})
    return res;
  },
  // 查询数据关联外部数据
  async getRemoteData(data){
    const res = await httpService('post', `workflow/api/app/relate-data-other`, {data: data})
    return res;
  }
}
export default services
