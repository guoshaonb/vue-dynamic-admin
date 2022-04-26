import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';

export const columns = function (data?) {
  const startArray = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 150,
    }
  ]
  const middleArray: any = []
  const afterArray = [{
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 150,
  }]

  for (let i = 1; i <= 50; i++) {
    middleArray.push({
      title: data?.['c_' + i]?.name,
      dataIndex: 'data' + i,
      width: 150,
      isExist: data?.['c_' + i]?.isExist,
    })
  }
  return [...startArray, ...middleArray, ...afterArray]?.filter(item => item?.isExist !== 'f')
}

export const searchFormSchema = function (data?) {
  let options: any = []
  if (!(JSON.stringify(data) === '{}')) {
    for (let i = 1; i <= 50; i++) {
      if (!data?.['c_' + i]?.name?.includes("字段")) {
        options.push({
          label: data?.['c_' + i]?.name,
          value: 'data' + i,
          key: 'data' + i,
        })
      }
    }
  }
  return [{
    field: 'selectField',
    label: '选择查询条件',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options,
    },
  },
  {
    field: 'inputValue',
    label: '输入查询内容',
    component: 'Input',
    colProps: { span: 8 },
  }]
}

export const formSchema = function (data?, classifys?) {
  const configArray: any = []
  if (classifys?.length > 1) {
    for (const item of classifys) {
      configArray.push({
        field: 'divider-basic',
        component: 'Divider',
        label: item,
        colProps: {
          span: 24,
        },
        isExist: 't'
      })
      for (let i = 1; i <= 50; i++) {
        if (data?.['c_' + i]?.class == item) {
          configArray.push({
            field: 'data' + i,
            label: data?.['c_' + i]?.name,
            component: data?.['c_' + i]?.type,
            componentProps: {
              options: data?.['c_' + i]?.options,
            },
            isExist: data?.['c_' + i]?.isExist
          })
        }
      }
    }
  }
  return configArray?.filter(item => item?.isExist !== 'f')
}