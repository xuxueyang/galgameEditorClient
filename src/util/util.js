import axios from 'axios'
const Nzh = require("nzh/cn");
export function dealFormData(item) {
  // 向表格中的子元素增加queId
  if (item.type === 'table') {
    for (let m = 0; m < item.value.length; m++) {
      const tableRow = item.value[m];
      for (let n = 0; n < tableRow.length; n++) {
        const tableCol = tableRow[n];
        tableCol.queId = item.children[n].queId;
      }
    }
  }
  // 如果是日期则根据displayValue给value赋值
  if (item.type === 'date') {
    if (item.displayValue) {
      item.value = Number(new Date(item.displayValue));
    }
  }
  // 如果是起止时间则根据displayValue给value赋值
  if (item.type === 'start_stop_time') {
    if (item.displayValue && item.displayValue.length > 0) {
      const array = [];
      for (let i = 0; i < item.displayValue.length; i++) {
        const date = item.displayValue[i];
        array.push(Number(new Date(date)));
      }
      item.value = array;
    }
  }
}

export function casLogin() {
  const url = location.href;
  const urlArray = url.split('?');
  axios.get(process.env.casUrl, {
    responseType: 'text',
    params: {
      currentPageUrl: urlArray[0]
    }
  })
    .then(function (response) {
      location.href = response.data;
    })
    .catch(function (error) {

    });
}

export const calculateFunction = {
  // 最小值
  MIN: function () {
    return Math.min(...arguments);
  },
  // 最大值
  MAX: function () {
    return Math.max(...arguments);
  },
  // 求和
  SUM: function () {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
      total += arguments[i];
    }
    return total;
  },
  // 平均数
  AVERAGE: function () {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
      total += arguments[i];
    }
    return total / arguments.length;
  },
  // 数字转中文
  NTC: function (str) {
    return Nzh.encodeB(str);
  }
}
