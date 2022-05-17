<template>
  <BasicModal
    centered
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm
      ref="BasicForm"
      :labelWidth="100"
      :schemas="schemas"
      :showActionButtonGroup="false"
      @submit="handleSubmitForm"
    />
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index';
import {
  getGeneralConfigList,
  getGeneralDataList,
  addGeneralData,
  editGeneralData,
  delGeneralData,
} from '/@/api/demo/system';
import { columns, formSchema } from './data';
import { getDeptList } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
import { message } from 'ant-design-vue';
import { json } from 'stream/consumers';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';

export default defineComponent({
  name: 'DeptModal',
  components: { BasicModal, BasicForm },
  emits: ['success', 'register'],
  props: {
    configObj: {
      type: Object,
      default: {},
    },
    classifys: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const BasicForm = ref(null);
    const isUpdate = ref(true);
    const route = useRoute();
    const state = reactive({
      schemas: [],
    });
    const userId = ref('');
    const pageId = ref('');

    (() => {
      userId.value = Persistent.getLocal(USER_INFO_KEY)?.id;
      setTimeout(() => {
        state.schemas = formSchema(props.configObj, props.classifys);
      }, 1000);
    })();

    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      BasicForm.value.resetFields();
      setModalProps({ confirmLoading: false });
      pageId.value = data?.id;
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        state.schemas = state.schemas.map((item) => {
          switch (item.component) {
            case 'Switch':
              item.defaultValue = data.record[item.field] == '1';
              break;
            case 'RangePicker':
              item.defaultValue =
                data.record[item.field] != '' ? data.record[item.field].split(',') : '';
              break;
            default:
              item.defaultValue = data.record[item.field];
              break;
          }
          return item;
        });
      } else {
        state.schemas = state.schemas.map((item) => {
          switch (item.component) {
            case 'Switch':
              item.defaultValue = item.componentProps?.options?.[0]?.value == '1';
              break;
            case 'RangePicker':
              item.defaultValue = '';
              break;
            default:
              item.defaultValue = item.componentProps?.options?.[0]?.value;
              break;
          }
          return item;
        });
      }
    });

    const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

    async function handleSubmit() {
      BasicForm.value.submit();
    }

    async function handleSubmitForm(values) {
      try {
        Object.keys(values).forEach((item) => {
          if (values[item] instanceof Array) {
            values[item] = values[item].join(',');
          }
        });

        const params = {
          user_id: userId.value,
          menu_id: route.query.menu_id,
          ...values,
        };

        operationApi('addOredit', params, {
          id: pageId.value,
          addAction: addGeneralData,
          editAction: editGeneralData,
        }).then(() => {
          closeModal();
          emit('success');
        });
      } finally {
      }
    }

    return {
      ...toRefs(state),
      BasicForm,
      registerModal,
      getTitle,
      handleSubmit,
      handleSubmitForm,
    };
  },
});
</script>