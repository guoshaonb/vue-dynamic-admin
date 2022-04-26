<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="字段说明" name="configName">
      <a-input v-model:value="formState.configName" />
    </a-form-item>
    <a-form-item label="字段名称" name="configField">
      <a-input v-model:value="formState.configField"/>
    </a-form-item>
    <a-form-item label="选择分类" name="selectType">
      <a-select v-model:value="formState.selectType" placeholder="请选择所属分类">
        <template v-for="(item, index) in configClassifys" :key="item">
          <a-select-option :value="item">{{ item }}</a-select-option>
        </template>
      </a-select>
    </a-form-item>
    <!-- 
      Input
      InputNumber
      InputTextArea
      Select
      RadioGroup
      CheckboxGroup
      Switch
      DatePicker
      RangePicker
     -->
    <a-form-item label="配置类型" name="configType">
      <a-select v-model:value="formState.configType" placeholder="请选择配置名称">
        <a-select-option value="0">输入框</a-select-option>
        <a-select-option value="1">数字框</a-select-option>
        <a-select-option value="2">文本域</a-select-option>
        <a-select-option value="3">下拉框</a-select-option>
        <a-select-option value="4">单选按钮</a-select-option>
        <a-select-option value="5">复选框</a-select-option>
        <a-select-option value="6">switch开关</a-select-option>
        <a-select-option value="7">时间选择</a-select-option>
        <a-select-option value="8">时间选择[范围]</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineComponent, reactive, ref, toRefs, toRaw, UnwrapRef, watch } from 'vue';
import { getGeneralConfigTranslate } from '/@/api/demo/system';
import { debounce } from '/@/utils/common';

interface FormState {
  formState: {
    configName: string | undefined;
    configField: string | undefined;
    selectType: string | undefined;
    configType: string | undefined;
  };
  configClassifys: Object;
}
export default defineComponent({
  props: {
    configOption: {
      type: String,
    },
    configClassifys: {
      type: String,
    },
  },
  setup(props) {
    const formRef = ref();
    const state: UnwrapRef<FormState> = reactive({
      formState: {
        configName: '',
        configField: '',
        selectType: '',
        configType: '',
      },
      configClassifys: [],
    });

    //设置初始选项
    const configOption = props.configOption;
    const leftConfig = configOption?.split('`')?.[0]?.split(';')?.[0].split(',');
    state.formState.configName = leftConfig?.[0];
    state.formState.selectType = configOption?.split('`')?.[1] || '基础配置';
    state.formState.configType = leftConfig?.[3];

    const getOptionVal = () => {
      return state.formState;
    };

    const rules = {
      name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
      ],
      // configType: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
      date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
      type: [
        {
          type: 'array',
          required: true,
          message: 'Please select at least one activity type',
          trigger: 'change',
        },
      ],
      resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
      desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    watch(
      () => props.configClassifys,
      (newValue, oldValue) => {
        if (newValue) {
          state.configClassifys = newValue;
        }
      },
      { immediate: true, deep: true },
    );

    watch(
      () => state.formState.configName,
      (newValue, oldValue) => {
        if (newValue) {
          debounce(() => {
            getGeneralConfigTranslate({ q: newValue }).then((res) => {
              if (res) {
                state.formState.configField = res;
              }
            });
          }, 500)();
        }
      },
      { immediate: true, deep: true },
    );

    return {
      formRef,
      labelCol: { span: 2, style: { width: '150px' } },
      wrapperCol: { span: 14 },
      other: '',
      ...toRefs(state),
      rules,
      resetForm,
      getOptionVal,
    };
  },
});
</script>