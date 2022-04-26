<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema } from './menu.data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

import {
  getCatalogueList,
  addCatalogue,
  editCatalogue,
  addMenu,
  editMenu,
} from '/@/api/demo/system';
import { message } from 'ant-design-vue';
import { json } from 'node:stream/consumers';

export default defineComponent({
  name: 'MenuDrawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const menuId = ref('');

    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
      labelWidth: 100,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { lg: 12, md: 24 },
    });

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      menuId.value = data?.record?.id;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
          parent_id: data.record?.catalogueId,
        });
      }
      const treeData = await getCatalogueList();
      updateSchema({
        field: 'parent_id',
        componentProps: { treeData },
      });
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

    async function handleSubmit() {
      try {
        const values = await validate();
        setDrawerProps({ confirmLoading: true });
        // TODO custom api
        //判断是目录还是菜单
        if (values.type == '0') {
          if (!values.parent_id) values.parent_id = '0';
          addCatalogue(values).then(() => {
            message.success('新增目录成功');
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: menuId.value } });
            closeDrawer();
          });
        } else {
          const valuesRes = JSON.parse(JSON.stringify(values));
          valuesRes.id = menuId.value;
          valuesRes.catalogueId = valuesRes.parent_id;
          const funcName = !menuId.value ? addMenu : editMenu;
          funcName(valuesRes).then(() => {
            message.success(menuId.value ? '编辑菜单成功' : '新增菜单成功');
            emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: menuId.value } });
            closeDrawer();
          });
        }
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return { registerDrawer, registerForm, getTitle, handleSubmit };
  },
});
</script>
