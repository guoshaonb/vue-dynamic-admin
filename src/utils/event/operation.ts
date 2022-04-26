import { message } from 'ant-design-vue';

export function operationApi(type: string, values: Object, actions: Object) {
  function hintContent(text, type = 'success') {
    message[type](
      text,
      2,
    );
  }
  
  return new Promise((reslove, reject) => {
    try {
      switch (type) {
        case "addOredit":
          if (actions['id']) {
            values['id'] = actions['id']
            return actions['editAction'](values).then(res => {
              hintContent('编辑成功！', 'success')
              reslove(res)
            })
          } else {
            return actions['addAction'](values).then(res => {
              hintContent('添加成功！', 'success')
              reslove(res)
            })
          }
        case "del":
          return actions['delAction'](values).then(res => {
            hintContent('删除成功！', 'success')
            reslove(1)
          })
      }
    } catch (err) {
      reject(err)
    }
  })
};
