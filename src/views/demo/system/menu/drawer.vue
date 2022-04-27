<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm"></BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { formSchema } from './data';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { TreeItem } from '/@/components/Tree';

import { getMenusList, addMenu, editMenu } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';

export default defineComponent({
  name: 'drawer',
  components: { BasicDrawer, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const MenuId = ref('');
    const treeData = ref<TreeItem[]>([]);

    const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
      labelWidth: 90,
      schemas: formSchema,
      showActionButtonGroup: false,
    });

    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
      resetFields();
      setDrawerProps({ confirmLoading: false });
      // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
      if (unref(treeData).length === 0) {
        treeData.value = (await getMenusList()) as any as TreeItem[];
      }
      isUpdate.value = !!data?.isUpdate;
      MenuId.value = data?.id;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
      }

      updateSchema({
        field: 'parent_id',
        componentProps: { treeData },
      });
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '新增目录' : '编辑目录'));

    async function handleSubmit() {
      try {
        const values = await validate();
        setDrawerProps({ confirmLoading: true });
        // TODO custom api
        if (!values.parent_id) values.parent_id = '0';
        operationApi('addOredit', values, {
          id: MenuId.value,
          addAction: addMenu,
          editAction: editMenu,
        }).then(() => {
          closeDrawer();
          emit('success');
        });
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    return {
      registerDrawer,
      registerForm,
      getTitle,
      handleSubmit,
      treeData,
    };
  },
});
</script>
