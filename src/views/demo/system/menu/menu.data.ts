import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
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
    title: '菜单名称',
    dataIndex: 'name',
    width: 150,
  },
  // {
  //   title: '目录名称',
  //   dataIndex: 'catalogue.name',
  //   width: 150,
  // },
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
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  }
];

const isDir = (type: string) => type === '0';
const isMenu = (type: string) => type === '1';

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '目录', value: '0' },
        { label: '菜单', value: '1' },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
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
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    required: true,
    ifShow: ({ values }) => isDir(values.type),
  },
];
