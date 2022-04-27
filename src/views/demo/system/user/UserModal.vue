<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import { userFormSchema } from './user.data';
import { addUser, editUser } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
export default defineComponent({
  name: 'UserModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  setup(_, { emit }) {
    const isUpdate = ref(true);
    const userId = ref('');

    const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
      labelWidth: 100,
      schemas: userFormSchema,
      showActionButtonGroup: false,
      actionColOptions: {
        span: 23,
      },
    });

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      userId.value = data?.record?.id;
      if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
      }

      updateSchema([
        {
          field: 'username',
          componentProps: { disabled: unref(isUpdate) }
        },
        {
          field: 'password',
          required: !unref(isUpdate),
          show: !unref(isUpdate),
        },
      ]);
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

    async function handleSubmit() {
      try {
        const values = await validate();
        setModalProps({ confirmLoading: true });
        // TODO custom api
        operationApi('addOredit', values, {
          id: userId.value,
          addAction: addUser,
          editAction: editUser,
        }).then(() => {
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: userId.value } });
        });
      } finally {
        setModalProps({ confirmLoading: false });
      }
    }

    return { registerModal, registerForm, getTitle, handleSubmit };
  },
});
</script>
