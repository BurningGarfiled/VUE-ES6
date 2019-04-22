/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (!time) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
    )
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 菜单数据加工
export function menuFormat(arr) {
  // 按钮权限，按钮权限在最后一层的children中
  const newArr = []
  arr.forEach(item => {
    let obj = {}
    const children = item.children
    if (children && children.length > 0) { // 有子菜单
      const grandson = children[0].children
      if (grandson && grandson.length > 0) { // 有三级菜单，表示不是最后一层
        obj = {
          path: item.path,
          name: item.name,
          children: menuFormat(children) // 递归调用
        }
      } else { // 没有三级菜单，表示是最后一层，对应字段为按钮权限
        obj = {
          path: item.path,
          name: item.name,
          permission: menuFormat(children) // 递归调用
        }
      }
      newArr.push(obj)
    } else { // 没有子菜单，表示按钮
      newArr.push(item.name)
    }
  })
  return newArr
}

// 将菜单列表扁平化形成权限列表---处理成同级菜单
export function getPermissionList(arr) {
  return new Promise((resolve) => {
    const permissionList = []
    // 将菜单数据扁平化为一级
    function flatNavList(arr) {
      for (const v of arr) {
        permissionList.push(v)
        if (v.children && v.children.length) {
          flatNavList(v.children)
        }
      }
    }
    flatNavList(arr)
    resolve(permissionList)
  })
}
