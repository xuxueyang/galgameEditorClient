const state = {
  formConfigs: [],
  applicationId: null,
  workflowData: []
}

export function dealBranchNode (node, targetId, nextNode) {
  const branches = node.branches
  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i]
    // 如果该分支存在下一个节点
    if (branch.nextNodeId) {
      // 如果找到了
      if (branch.nextNodeId === targetId) {
        branch.nextNodeId = nextNode ? nextNode.auditNodeId : null
        branch.nextAuditNode = nextNode || null
        return
      } else {
        // 如果不是分支节点
        if (branch.nextAuditNode.type !== 4) {
          dealNormalNode(branch.nextAuditNode, targetId, nextNode)
        } else {
          dealBranchNode(branch.nextAuditNode, targetId, nextNode)
        }
      }
    }
  }
  dealNormalNode(node, targetId, nextNode)
}

export function dealNormalNode (node, targetId, nextNode) {
  // 如果存在下一个节点
  if (node.nextNodeId) {
    // 如果找到了
    if (node.nextNodeId === targetId) {
      node.nextNodeId = nextNode ? nextNode.auditNodeId : null
      node.nextAuditNode = nextNode || null
    } else {
      // 如果不是分支节点
      if (node.nextAuditNode.type !== 4) {
        dealNormalNode(node.nextAuditNode, targetId, nextNode)
      } else {
        dealBranchNode(node.nextAuditNode, targetId, nextNode)
      }
    }
  }
}

const mutations = {
  // 设置应用id
  setApplicationId (state, payload) {
    state.applicationId = payload
  },
  // 设置当前表单配置
  setNodeFormConfigs (state, payload) {
    state.formConfigs = payload
  },
  // 设置流程信息
  setWorkflowData (state, payload) {
    state.workflowData = payload || []
  },
  // 添加节点
  createNode (state, payload) {
    const currentNode = payload.currentNode
    const preNode = payload.preNode
    // 如果新增的节点为根节点，则直接在数组中插入当前节点
    if (currentNode.root) {
      state.workflowData.splice(payload.preRootIndex + 1, 0, currentNode)
    } else {
      // 如果前节点存在下一个节点则先设置下一个节点的的preNodeId为当前节点的id
      if (preNode.nextAuditNode) {
        preNode.nextAuditNode.preNodeId = currentNode.auditNodeId
      }
      // 再设置当前节点的下一个节点为前节点下一个节点
      currentNode.nextNodeId = preNode.nextNodeId
      currentNode.nextAuditNode = preNode.nextAuditNode ? Object.assign({}, preNode.nextAuditNode) : null
      // 再将上一个节点的下一个节点设置为当前节点
      preNode.nextNodeId = currentNode.auditNodeId
      preNode.nextAuditNode = currentNode
    }
  },
  // 添加子分支
  createChildBranch (state, payload) {
    payload.parentBranch.branches.push(payload.currentBranch)
  },
  // 删除子分支
  deleteChildBranch (state, payload) {
    payload.branch.splice(payload.index, 1)
  },
  // 删除节点
  deleteNode (state, payload) {
    const currentNode = payload.currentNode
    // 如果是根节点则直接在数组中删除该节点
    if (currentNode.root) {
      state.workflowData.splice(payload.rootIndex, 1)
    } else {
      const currentBranchNode = state.workflowData[payload.rootIndex]
      // 如果当前节点存在下一个节点则先将当前节点的下一个节点的preNodeId设置为当前节点的preNodeId
      if (currentNode.nextAuditNode) {
        currentNode.nextAuditNode.preNodeId = currentNode.preNodeId
      }
      // 从根分支节点的开始位置递归查找到当前删除节点的前节点，将它的下一个节点信息设置为当前删除节点的下一个节点信息
      dealBranchNode(currentBranchNode, currentNode.auditNodeId, currentNode.nextAuditNode)
    }
  },
  // 初始化节点配置时表单元素的可见编辑隐藏状态
  initFormElementsStatus (state, payload) {
    for (let i = 0; i < state.formConfigs.length; i++) {
      const row = state.formConfigs[i]
      for (let j = 0; j < row.length; j++) {
        const item = row[j]
        if (payload.auditEdits && payload.auditEdits.length > 0 && payload.auditEdits.filter((edit) => edit.queId === item.queId).length > 0) {
          item.status = 'canEdit'
        } else if (payload.auditHides && payload.auditHides.length > 0 && payload.auditHides.filter((hide) => hide.queId === item.queId).length > 0) {
          item.status = 'hide'
        } else {
          item.status = 'readonly'
        }
      }
    }
  },
  // 全局设置表单元素状态
  overallSetFormElementsStatus (state, payload) {
    for (let i = 0; i < state.formConfigs.length; i++) {
      const row = state.formConfigs[i]
      for (let j = 0; j < row.length; j++) {
        const item = row[j]
        item.status = payload
      }
    }
  },
  // 设置单个表单元素的状态
  setFormElementStatus (state, payload) {
    state.formConfigs[payload.rowIndex][payload.colIndex].status = payload.status
  }
}

const actions = {
  // 设置应用id
  setApplicationId ({commit}, payload) {
    commit('setApplicationId', payload)
  },
  // 设置当前表单配置
  setNodeFormConfigs ({commit}, payload) {
    commit('setNodeFormConfigs', payload)
  },
  // 设置流程信息
  setWorkflowData ({commit}, payload) {
    commit('setWorkflowData', payload)
  },
  // 添加节点
  createNode ({commit}, payload) {
    commit('createNode', payload)
  },
  // 添加子分支
  createChildBranch ({commit}, payload) {
    commit('createChildBranch', payload)
  },
  // 删除子分支
  deleteChildBranch ({commit}, payload) {
    commit('deleteChildBranch', payload)
  },
  // 删除分支
  deleteNode ({commit}, payload) {
    commit('deleteNode', payload)
  },
  // 初始化节点配置时表单元素的可见编辑隐藏状态
  initFormElementsStatus ({commit}, payload) {
    commit('initFormElementsStatus', payload)
  },
  // 全局设置表单元素状态
  overallSetFormElementsStatus ({commit}, payload) {
    commit('overallSetFormElementsStatus', payload)
  },
  // 设置单个表单元素的状态
  setFormElementStatus ({commit}, payload) {
    commit('setFormElementStatus', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
