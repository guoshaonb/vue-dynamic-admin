/**
 * 获取数据
 */
//获取地址栏参数
const getQueryString = (name: string): any => {
  let params_url = window.location.href.split("?")[1]
  let params_val = params_url?.toString().split("&")
  for (let i in params_val) {
    let key = params_val?.[i].split("=")[0]
    let val = params_val?.[i].split("=")[1]
    if (key == name) {
      return decodeURI(val)
    }
  }
  return false
}

//获取时间差
const daysDistance = (date1: any, date2: any) => {
  //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
  date1 = Date.parse(date1);
  date2 = Date.parse(date2);
  //计算两个日期之间相差的毫秒数的绝对值
  var ms = Math.abs(date2 - date1);
  //毫秒数除以一天的毫秒数,就得到了天数
  return Math.floor(ms / (24 * 3600 * 1000));
};

/**
 * 防抖和节流
 */

// 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
const debounce = (callback: Function, time?: number) => {
  let timer: any;
  return function (this: any) {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(context, args)
    }, time || 1000);
  }
}
// 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
const throttle = (callback: Function, time?: number) => {
  let timer: any;
  return function (this: any) {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        callback.apply(context, args)
      }, time || 1000)
    }
  }
}

/**
 * 其他方法
 */

//时钟延迟
const delayExec = async (times) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, times)
  })
}

//深拷贝
const deepClone = function (obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

// 对比两个对象的值是否完全相等 返回值 true/false
const isObjectValueEqual = function (a, b) {
  //取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  //判断属性名的length是否一致
  if (aProps.length != bProps.length) {
    return false;
  }
  //循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

export {
  getQueryString,
  daysDistance,
  debounce,
  throttle,
  delayExec,
  deepClone,
  isObjectValueEqual
}