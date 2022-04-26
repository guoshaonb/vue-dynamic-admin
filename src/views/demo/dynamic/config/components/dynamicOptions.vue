<template>
  <a-form ref="formRef" :model="dynamicValidateForm" v-bind="formItemLayoutWithOutLabel">
    <a-form-item
      v-for="(domain, index) in dynamicValidateForm.domains"
      :key="domain.key"
      v-bind="index == 0 ? formItemLayout : {}"
      :label="index == 0 ? '配置选项' : ''"
      :name="['domains', index, 'value']"
    >
      <a-input
        v-model:value="dynamicValidateForm.domains[index]"
        :placeholder="'请输入选项内容'"
        style="margin-right: 8px"
        :style="{ width: index == 0 ? '100%' : '70%' }"
      />
      <MinusCircleOutlined
        v-if="dynamicValidateForm?.domains?.length > 1"
        class="dynamic-delete-button"
        :disabled="dynamicValidateForm?.domains?.length === 1"
        @click="removeDomain(domain)"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 70%" @click="addDomain">
        <PlusOutlined />
        添加选项
      </a-button>
    </a-form-item>
  </a-form>
  <div></div>
</template>
<script lang="ts">
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineComponent, reactive, ref, toRefs, UnwrapRef } from 'vue';
import { Alert, Card, message } from 'ant-design-vue';

interface Domain {
  value: string;
  key: number;
}
export default defineComponent({
  props: {
    configOption: {
      type: String,
    },
  },
  setup(props) {
    const formRef = ref();
    const formItemLayout = {
      labelCol: { span: 2, style: { width: '150px' } },
      wrapperCol: { span: 14 },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 2 },
      },
    };

    //UnwrapRef<{ domains: Domain[] }>
    const state: any = reactive({
      dynamicValidateForm: {
        domains: {},
      },
    });

    //设置初始选项
    const configOption = props.configOption;
    const domainsArray: any = configOption?.split('`')?.[0]?.split(';')?.[1]?.split(',');
    domainsArray?.forEach((item, index) => {
      state.dynamicValidateForm.domains[index] = item;
    });

    const getOptionVal = () => {
      return state.dynamicValidateForm.domains;
    };

    const submitForm = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', state.dynamicValidateForm.domains);
        })
        .catch((error: ValidateErrorEntity<any>) => {
          console.log('error', error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const removeDomain = (item: Domain) => {
      let index = state.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        state.dynamicValidateForm.domains.splice(index, 1);
      }
    };

    const addDomain = () => {
      if (state.dynamicValidateForm.domains.length > 19) {
        return message.warning('最多设置20条选项哦！');
      }
      state.dynamicValidateForm.domains[Date.now()] = '';
    };

    return {
      formRef,
      formItemLayout,
      formItemLayoutWithOutLabel,
      ...toRefs(state),
      submitForm,
      resetForm,
      removeDomain,
      addDomain,
      getOptionVal,
    };
  },
  components: {
    MinusCircleOutlined,
    PlusOutlined,
  },
});
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>