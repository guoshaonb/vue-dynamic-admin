import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/demo/system';
import { useMessage } from '/@/hooks/web/useMessage';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';

export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 150,
  },
  {
    title: '目录名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 150,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '上级id',
    dataIndex: 'parent_id',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 150,
  },
  {
    title: '排序',
    dataIndex: 'z_index',
    width: 100,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '目录名称',
    component: 'Input',
    colProps: { span: 8 },
  }
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '目录名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'icon',
    label: '目录图标',
    component: 'IconPicker',
    required: true
  },
  {
    field: 'parent_id',
    label: '上级目录',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
];
