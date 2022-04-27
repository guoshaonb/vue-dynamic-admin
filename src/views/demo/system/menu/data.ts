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
    title: '名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 150,
    customRender: ({ record }) => {
      return h("span", {
        style: {
          'padding': '8px 15px',
          'border-radius': '5px',
          'color': record.type == '1' ? '#409EFF' : '#67c23a',
          'background-color': record.type == '1' ? '#ecf5ff' : '#e1f3d8'
        }
      }, record.type == '1' ? '目录' : '菜单');
    },
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
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  }
];

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '菜单类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '目录', value: '1' },
        { label: '菜单', value: '2' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'parent_id',
    label: '上级菜单',
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
    field: 'name',
    label: '菜单名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'icon',
    label: '菜单图标',
    component: 'IconPicker',
    required: true
  },
  {
    field: 'z_index',
    label: '排序值',
    defaultValue: '1',
    component: 'InputNumber',
  },
];
