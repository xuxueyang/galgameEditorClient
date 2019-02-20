import Vue from 'vue'
// 动态表单配置选项
import {FORM_ITEM_CONFIG} from '../../components/dynamic-form/dynamic-form.config'
import Immutable from 'immutable'
const state = {
  // 表单配置
  formConfigs: [],
  // 当前配置的元素属性
  currentFormItem: {},
  // 默认的表单属性
  formItemConfig: Immutable.fromJS(FORM_ITEM_CONFIG),
  // 子元素类型
  childType: null,
  // 子元素的位置
  childIndex: null,
  // 表单设计是否被修改
  formChanged: false
}

export function calculatePercent(count) {
  const num = getDividedNumber(100, count)
  return parseInt(100 / num)
}

export function getDividedNumber(a, b) {
  for (let i = b; i <= a; i++) {
    if (a % i === 0) {
      return i
    }
  }
}

const mutations = {
  // 添加表单组件
  addItem (state, payload) {
    state.formConfigs.splice(payload.rowIndex, 0, payload.data)
  },
  // 设置当前配置的表单元素
  setCurrentFormItem (state, payload) {
    state.currentFormItem = Object.assign({}, payload)
  },
  // 表单元素配置变更
  setFormItemConfig (state, payload) {
    Vue.set(state.formConfigs, payload.index, payload)
  },
  // 设置表单元素的某一项配置
  setFormItemValue (state, payload) {
    if (!state.childType) {
      Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex], payload.key, payload.value)
      Vue.set(state.currentFormItem, payload.key, payload.value)
    } else {
      if (payload.key === 'value' || payload.key === 'displayValue') {
        for (let i = 0; i < state.formConfigs[payload.rowIndex][payload.colIndex].value.length; i++) {
          const row = state.formConfigs[payload.rowIndex][payload.colIndex].value[i];
          row[state.childIndex][payload.key] = payload.value;
        }
        // 用于新增行时带出默认值
        Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex], payload.key, payload.value)
        Vue.set(state.currentFormItem.children[state.childIndex], payload.key, payload.value)
      } else {
        Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex], payload.key, payload.value)
        Vue.set(state.currentFormItem.children[state.childIndex], payload.key, payload.value)
      }
    }
  },
  // 删除某一项表单元素
  deleteFormItem (state, payload) {
    // 如果该行不止一个则删除该行的这个表单元素
    if (state.formConfigs[payload.rowIndex].length > 1) {
      state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1)
      // 重新设置该行的宽度占比
      const per = calculatePercent(state.formConfigs[payload.rowIndex].length)
      // 循环重新设置该行宽度占比
      for (let item of state.formConfigs[payload.rowIndex]) {
        Vue.set(item, 'width', per)
      }
    } else {
      // 如果该行只剩一个表单元素则将该行删除
      state.formConfigs.splice(payload.rowIndex, 1)
    }
  },
  // 重置表单配置索引
  resetFormItemIndex (state) {
    let count = 0
    for (let i in state.formConfigs) {
      let children = state.formConfigs[i]
      for (let j in children) {
        let child = children[j]
        child.index = count
        child.rowIndex = parseInt(i)
        child.colIndex = parseInt(j)
        count++
      }
    }
    state.formConfigs = Object.assign([], state.formConfigs)
  },
  // 向上移动
  moveUpFormItem (state, payload) {
    // 前一行元素个数
    const upperLength = state.formConfigs[payload.rowIndex - 1].length
    // 当前行元素个数
    const currentLength = state.formConfigs[payload.rowIndex].length
    // 如果上一行的元素小于四个，则将该元素插入上一行末尾
    if (upperLength < 4) {
      // TODO 只对当前比例生效
      const per = calculatePercent(upperLength + 1)
      // 插入末尾
      state.formConfigs[payload.rowIndex - 1].push(state.formConfigs[payload.rowIndex][payload.colIndex])
      // 修改宽度占比
      for (let i = 0; i < upperLength + 1; i++) {
        Vue.set(state.formConfigs[payload.rowIndex - 1][i], 'width', per)
      }
      // 如果当前行只有一个元素
      if (currentLength === 1) {
        // 删除原来那个元素
        state.formConfigs.splice(payload.rowIndex, 1)
      } else {
        // 在该行删除当前元素
        state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1)
      }
    } else {
      // do nothing
      // state.formConfigs.splice(payload.index - 1, 1, ...state.formConfigs.splice(payload.index, 1, state.formConfigs[payload.index - 1]));
    }
  },
  // 向下移动
  moveDownFormItem (state, payload) {
    // 只有当前行的元素个数大于1的时候才能下移
    if (state.formConfigs[payload.rowIndex].length > 1) {
      const child = []
      // 将下移的元素宽度占比重新改为100
      child.push(Object.assign(state.formConfigs[payload.rowIndex][payload.colIndex], {width: 100}))
      // 将元素下移
      state.formConfigs.splice(payload.rowIndex + 1, 0, child)
      // 将元素在原来那行删除
      state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1)
      // 原来那一行重新设置宽度占比
      const per = calculatePercent(state.formConfigs[payload.rowIndex].length)
      for (let item of state.formConfigs[payload.rowIndex]) {
        Vue.set(item, 'width', per)
      }
    }
  },
  // 复制表单元素
  copyFormItem (state, payload) {
    state.formConfigs.splice(parseInt(payload.rowIndex), 0, payload.data)
  },
  // 向左交换表单元素
  leftFormItem (state, payload) {
    state.formConfigs[payload.rowIndex].splice(payload.colIndex - 1, 1, ...state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1, state.formConfigs[payload.rowIndex][payload.colIndex - 1]))
  },
  // 向右交换表单元素
  rightFormItem (state, payload) {
    state.formConfigs[payload.rowIndex].splice(payload.colIndex + 1, 1, ...state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1, state.formConfigs[payload.rowIndex][payload.colIndex + 1]))
  },
  // 标记当前选中的表单元素
  markCurrentFormItem (state) {
    // 如果当前有选中的表单元素则标记
    if (state.currentFormItem.type) {
      Vue.set(state.formConfigs[state.currentFormItem.rowIndex][state.currentFormItem.colIndex], 'mActive', true)
    }
  },
  // 根据标记找到并设置选中元素
  findCurrentFormItem (state) {
    for (let i in state.formConfigs) {
      let children = state.formConfigs[i]
      for (let j in children) {
        let child = children[j]
        if (child.mActive) {
          delete child.mActive
          state.currentFormItem = Object.assign({}, child)
          return
        }
      }
    }
  },
  // 在某行添加元素
  addRow (state, payload) {
    state.formConfigs.splice(payload.rowIndex, 0, payload.data)
  },
  // 删除某行某列元素
  deleteCol (state, payload) {
    state.formConfigs[payload.rowIndex].splice(payload.colIndex, 1)
  },
  // 从某列开始删除元素
  deleteFromCol (state, payload) {
    state.formConfigs[payload.rowIndex].splice(payload.colIndex, payload.deleteLength)
  },
  // 替换表单配置
  replaceFormConfigs (state, payload) {
    state.formConfigs = Object.assign([], payload.data)
  },
  // 添加新的选项内容
  addNewOption (state, payload) {
    if (!state.childType) {
      state.formConfigs[payload.rowIndex][payload.colIndex].options.push({
        label: '未命名',
        value: 'option' + (new Date().getTime())
      })
    } else {
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].options.push({
        label: '未命名',
        value: 'option' + (new Date().getTime())
      })
    }
  },
  // 删除某个选项内容
  deleteOption (state, payload) {
    if (!state.childType) {
      state.formConfigs[payload.rowIndex][payload.colIndex].options.splice(payload.optionIndex, 1)
    } else {
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].options.splice(payload.optionIndex, 1)
    }
  },
  // 编辑选项文字
  editOptionLabel (state, payload) {
    if (!state.childType) {
      Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex].options[payload.optionIndex], 'label', payload.optionLabel)
    } else {
      Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].options[payload.optionIndex], 'label', payload.optionLabel)
    }
  },
  // 设置整个表单配置数组
  setFormConfigs (state, payload) {
    state.formConfigs = payload
  },
  // 根据id删除成员组件中可选范围的该用户
  deleteOptionalUsersById (state, payload) {
    const optionalUsers = state.formConfigs[payload.rowIndex][payload.colIndex].optionalUsers
    for (let i = 0; i < optionalUsers.length; i++) {
      const optionalUser = optionalUsers[i]
      // id匹配则删除
      if (optionalUser.id === payload.id) {
        state.formConfigs[payload.rowIndex][payload.colIndex].optionalUsers.splice(i, 1)
        break
      }
    }
    // 删除该可选用户后，在默认用户中查找是否有存在该用户，如果存在也删除
    const defaultUsers = state.formConfigs[payload.rowIndex][payload.colIndex].defaultUsers
    for (let m = 0; m < defaultUsers.length; m++) {
      const defaultUser = defaultUsers[m]
      // id匹配则删除
      if (defaultUser.id === payload.id) {
        state.formConfigs[payload.rowIndex][payload.colIndex].defaultUsers.splice(m, 1)
        break
      }
    }
    // 删除完后判断如果列表中存在值但是都不是用户，则将列表置空
    if (optionalUsers) {
      let count = 0
      for (let j = 0; j < optionalUsers.length; j++) {
        const user = optionalUsers[j]
        if (user.email) {
          count++
          break
        }
      }
      if (count === 0) {
        Vue.set(state.formConfigs[payload.rowIndex][payload.colIndex], 'optionalUsers', [])
      }
    }
  },
  // 根据id删除成员组件中默认用户下的该用户
  deleteDefaultUsersById (state, payload) {
    const defaultUsers = state.formConfigs[payload.rowIndex][payload.colIndex].defaultUsers
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      // id匹配则删除
      if (defaultUser.id === payload.id) {
        state.formConfigs[payload.rowIndex][payload.colIndex].defaultUsers.splice(i, 1)
        break
      }
    }
  },
  // 设置子元素类型
  setChildType (state, payload) {
    state.childType = payload
  },
  // 设置子元素位置
  setChildIndex (state, payload) {
    state.childIndex = payload
  },
  // 给table添加字段
  addChildToTable (state, payload) {
    state.formConfigs[payload.rowIndex][payload.colIndex].children.push(Object.assign(state.formItemConfig.toJS()[payload.type], {
      tempQueId: 'tempQueId_' + (new Date()).getTime(),
      status: 'canEdit',
      error: ''
    }))
    if (state.formConfigs[payload.rowIndex][payload.colIndex].value.length === 0) {
      state.formConfigs[payload.rowIndex][payload.colIndex].value.push([])
    }
    state.formConfigs[payload.rowIndex][payload.colIndex].value[0].push({queId: null, value: null, displayValue: null})
  },
  // table删除字段
  deleteChildOfTable (state, payload) {
    state.formConfigs[payload.rowIndex][payload.colIndex].children.splice(payload.childIndex, 1)
    state.formConfigs[payload.rowIndex][payload.colIndex].value[0].splice(payload.childIndex, 1)
  },
  // 更新默认内容的关联设置
  defaultRelatedData (state, payload) {
    if (!state.childType) {
      state.formConfigs[payload.rowIndex][payload.colIndex].default_applicationId = payload.applicationId
      state.formConfigs[payload.rowIndex][payload.colIndex].default_current_elementId = payload.currentElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].default_associated_elementId = payload.associatedElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].default_show_elementId = payload.showElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].default_applicationName = payload.applicationName
      state.formConfigs[payload.rowIndex][payload.colIndex].default_show_elementTitle = payload.showElementTitle
    } else {
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_applicationId = payload.applicationId
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_current_elementId = payload.currentElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_associated_elementId = payload.associatedElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_show_elementId = payload.showElementId
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_applicationName = payload.applicationName
      state.formConfigs[payload.rowIndex][payload.colIndex].children[state.childIndex].default_show_elementTitle = payload.showElementTitle
    }
  },
  // 设置表单是否被修改过
  setFormChanged(state, payload){
    state.formChanged = payload;
  },
  // 通过id删除可选的部门
  deleteOptionalDepartmentById(state, payload){
    const optionalDepartments = state.formConfigs[payload.rowIndex][payload.colIndex].optionalDepartments
    for (let i = 0; i < optionalDepartments.length; i++) {
      const optionalDepartment = optionalDepartments[i]
      // id匹配则删除
      if (payload.id) {
        if (optionalDepartment.id === payload.id) {
          state.formConfigs[payload.rowIndex][payload.colIndex].optionalDepartments.splice(i, 1)
          break
        }
      } else {
        if (optionalDepartment.type === 'currentDepartment') {
          state.formConfigs[payload.rowIndex][payload.colIndex].optionalDepartments.splice(i, 1)
          break
        }
      }
    }
    // 删除该可选部门后，在默认部门中查找是否有存在该部门，如果存在也删除
    const defaultDepartments = state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments
    for (let m = 0; m < defaultDepartments.length; m++) {
      const defaultDepartment = defaultDepartments[m]
      // id匹配则删除
      if (payload.id) {
        if (defaultDepartment.id === payload.id) {
          state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments.splice(m, 1)
          break
        }
      } else {
        if (defaultDepartment.type === 'currentDepartment') {
          state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments.splice(m, 1)
          break
        }
      }
    }
  },
  // 通过id删除默认的部门
  deleteDefaultDepartmentById(state, payload){
    const defaultDepartments = state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments
    for (let i = 0; i < defaultDepartments.length; i++) {
      const defaultDepartment = defaultDepartments[i]
      // id匹配则删除
      if (payload.id) {
        if (defaultDepartment.id === payload.id) {
          state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments.splice(i, 1)
          break
        }
      } else {
        if (defaultDepartment.type === 'currentDepartment') {
          state.formConfigs[payload.rowIndex][payload.colIndex].defaultDepartments.splice(i, 1)
          break
        }
      }
    }
  }
}

const actions = {
  // 重置索引并且设置新的表单元素为当前配置元素
  commonAction ({commit}, payload) {
    // 重置索引
    commit('resetFormItemIndex')
    // 设置新增的表单元素为当前配置元素
    commit('setCurrentFormItem', payload)
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 选择某个表单元素
  chooseFormItem ({commit}, payload) {
    commit('setChildType', null)
    commit('setChildIndex', null)
    commit('setCurrentFormItem', payload)
  },
  // 向动态表单中添加表单元素
  addFormItem ({commit, state, dispatch}, payload) {
    let index = null
    let rowIndex = null
    // 如果当前有元素被选中
    if (state.currentFormItem.index || state.currentFormItem.index === 0) {
      index = parseInt(state.currentFormItem.index) + 1
      rowIndex = parseInt(state.currentFormItem.rowIndex) + 1
    } else {
      // 如果是第一个表单元素则都设为0
      if (state.formConfigs.length === 0) {
        index = 0
        rowIndex = 0
      } else {
        const lastRow = state.formConfigs[state.formConfigs.length - 1]
        index = parseInt(lastRow[lastRow.length - 1].index) + 1
        rowIndex = state.formConfigs.length
      }
    }
    const colIndex = 0
    const newObj = Object.assign({}, payload, state.formItemConfig.toJS()[payload.type], {
      index: index,
      rowIndex: rowIndex,
      colIndex: colIndex,
      tempQueId: 'temp' + (new Date()).getTime()
    })
    const child = []
    child.push(newObj)
    // 添加元素
    commit('addItem', {rowIndex: rowIndex, data: child})
    dispatch('commonAction', newObj)
    commit('setChildType', null)
    commit('setChildIndex', null)
  },
  // 在动态表单中删除表单元素
  deleteFormItem ({commit, dispatch}, payload) {
    // 删除选中项
    commit('deleteFormItem', payload)
    dispatch('commonAction', {})
    commit('setChildType', null)
    commit('setChildIndex', null)
  },
  // 设置表单的某项配置
  setFormItemValue ({commit, state, dispatch}, payload) {
    // 当配置宽度的时候要检查当前行的宽度，超过100换行
    if (payload.key === 'width') {
      // 如果修改宽度时当前行不止一个元素则判断修改后所有长度是否超过100
      if (state.formConfigs[payload.rowIndex].length > 1) {
        // 先判断当前项和它前面的元素宽度是否超过100
        let frontWidth = payload.value
        for (let i = 0; i < payload.colIndex; i++) {
          const item = state.formConfigs[payload.rowIndex][i]
          frontWidth = frontWidth + item.width
        }
        // 如果已经超过了100,则将该行分成三行
        if (frontWidth > 100) {
          const child1 = []
          child1.push(Object.assign({}, state.formConfigs[payload.rowIndex][payload.colIndex], {width: payload.value}))
          const child2 = []
          for (let j = payload.colIndex + 1; j < state.formConfigs[payload.rowIndex].length; j++) {
            child2.push(state.formConfigs[payload.rowIndex][j])
          }
          // 先将换行元素从该行删除
          commit('deleteFromCol', {
            rowIndex: payload.rowIndex,
            colIndex: payload.colIndex,
            deleteLength: state.formConfigs[payload.rowIndex].length - payload.colIndex
          })
          commit('addRow', {rowIndex: payload.rowIndex + 1, data: child1})
          if (child2.length > 0) {
            commit('addRow', {rowIndex: payload.rowIndex + 2, data: child2})
          }
          dispatch('commonAction', state.formConfigs[payload.rowIndex + 1][0])
        } else {
          let breakIndex = 0
          // 如果还没有超过100则继续往后累加判断
          for (let k = payload.colIndex + 1; k < state.formConfigs[payload.rowIndex].length; k++) {
            frontWidth = frontWidth + state.formConfigs[payload.rowIndex][k].width
            if (frontWidth > 100) {
              breakIndex = k
              break
            }
          }
          // 如果加上后面元素超过100则将超过部分放到下一行
          if (breakIndex !== 0) {
            let child3 = []
            for (let m = breakIndex; m < state.formConfigs[payload.rowIndex].length; m++) {
              child3.push(state.formConfigs[payload.rowIndex][m])
            }
            // 先将换行元素从该行删除
            commit('deleteFromCol', {
              rowIndex: payload.rowIndex,
              colIndex: breakIndex,
              deleteLength: state.formConfigs[payload.rowIndex].length - breakIndex
            })
            commit('addRow', {rowIndex: payload.rowIndex + 1, data: child3})
          }
          commit('setFormItemValue', payload)
          // 重置索引
          commit('resetFormItemIndex')
        }
      } else {
        // 如果当前行只有一个元素则直接修改宽度
        commit('setFormItemValue', payload)
      }
    } else {
      commit('setFormItemValue', payload)
    }
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 将当前表单元素向上移动
  moveUpFormItem ({commit, state, dispatch}, payload) {
    // 除了第一行元素都向上移动
    if (parseInt(payload.rowIndex, 10) !== 0) {
      // 移动数组
      commit('moveUpFormItem', payload)
      dispatch('commonAction', state.formConfigs[payload.rowIndex - 1][state.formConfigs[payload.rowIndex - 1].length - 1])
    }
  },
  // 将当前表单元素向上移动
  moveDownFormItem ({commit, state, dispatch}, payload) {
    // 移动数组
    commit('moveDownFormItem', payload)
    dispatch('commonAction', state.formConfigs[payload.rowIndex + 1][0])
  },
  // 复制当前表单元素
  copyFormItem ({commit, state, dispatch}, payload) {
    const newObj = Object.assign({}, payload.toJS(), {
      index: parseInt(payload.toJS().index) + 1,
      rowIndex: parseInt(payload.toJS().rowIndex) + 1,
      colIndex: 0
    })
    const child = []
    child.push(newObj)
    // 复制表单元素
    commit('copyFormItem', {data: child, rowIndex: newObj.rowIndex})
    dispatch('commonAction', state.formConfigs[payload.toJS().rowIndex][payload.toJS().colIndex])
  },
  // 向左交换表单元素
  leftFormItem ({commit, dispatch}, payload) {
    commit('leftFormItem', payload)
    dispatch('commonAction', state.formConfigs[payload.rowIndex][payload.colIndex - 1])
  },
  // 向右交换表单元素
  rightFormItem ({commit, dispatch}, payload) {
    commit('rightFormItem', payload)
    dispatch('commonAction', state.formConfigs[payload.rowIndex][payload.colIndex + 1])
  },
  // 拖拽交换行与行之间的位置
  drag ({commit, state}, payload) {
    commit('replaceFormConfigs', payload)
    // 重置索引
    commit('resetFormItemIndex')
    // 找到之前选中的表单元素
    if (state.currentFormItem.type) {
      commit('findCurrentFormItem')
    }
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 添加新的选项
  addNewOption ({commit}, payload) {
    commit('addNewOption', payload)
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 删除某个选项内容
  deleteOption ({commit}, payload) {
    commit('deleteOption', payload)
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 编辑选项文字
  editOptionLabel ({commit}, payload) {
    commit('editOptionLabel', payload)
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 设置整个表单配置数组
  setFormConfigs ({commit}, payload) {
    commit('setFormConfigs', payload)
  },
  // 设置当前配置
  setCurrentFormItem ({commit}, payload) {
    commit('setCurrentFormItem', payload)
  },
  // 根据id删除成员组件中可选范围的该用户
  deleteOptionalUsersById ({commit, state}, payload) {
    commit('deleteOptionalUsersById', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 根据id删除成员组件中默认用户下的该用户
  deleteDefaultUsersById ({commit, state}, payload) {
    commit('deleteDefaultUsersById', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 设置子元素类型
  setChildType ({commit}, payload) {
    commit('setChildType', payload)
  },
  // 设置子元素位置
  setChildIndex ({commit}, payload) {
    commit('setChildIndex', payload)
  },
  // 给table添加字段
  addChildToTable ({commit, state}, payload) {
    commit('addChildToTable', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    commit('setChildType', payload.type)
    commit('setChildIndex', state.formConfigs[payload.rowIndex][payload.colIndex].children.length - 1)
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // table删除字段
  deleteChildOfTable ({commit}, payload) {
    commit('deleteChildOfTable', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 更新默认内容的关联设置
  defaultRelatedData ({commit}, payload) {
    commit('defaultRelatedData', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 设置表单是否被修改过
  setFormChanged({commit}, payload){
    commit('setFormChanged', payload)
  },
  // 通过id删除可选的部门
  deleteOptionalDepartmentById({commit}, payload){
    commit('deleteOptionalDepartmentById', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  },
  // 通过id删除默认的部门
  deleteDefaultDepartmentById({commit}, payload){
    commit('deleteDefaultDepartmentById', payload)
    commit('setCurrentFormItem', state.formConfigs[payload.rowIndex][payload.colIndex])
    // 标记表单被修改过了
    commit('setFormChanged', true)
  }
}

export default {
  state,
  mutations,
  actions
}
