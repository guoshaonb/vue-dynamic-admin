<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue';
import { AppProvider } from '/@/components/Application';
import { useTitle } from '/@/hooks/web/useTitle';
import { useLocale } from '/@/locales/useLocale';

import 'dayjs/locale/zh-cn';
// support Multi-language
const { getAntdLocale } = useLocale();

// Listening to page changes and dynamically changing site titles
useTitle();
</script>

<style lang="less">
// 强制修改antd样式
// 修改输入框、下拉框、时间选择框样式
.ant-select-selector,
.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-sm),
.ant-input-number,
.ant-picker {
  min-width: 305px !important;
}
// 修改文本域宽高
.ant-input-affix-wrapper.ant-input-affix-wrapper-textarea-with-clear-btn {
  min-width: 305px !important;
  height: 80px;
}
// 修改菜单页面左边的搜索框宽度
.ant-pagination-options .ant-select-selector {
  min-width: 100px;
}
// 修改通用页面的弹窗宽度
.ant-modal-content .ant-form{
  max-height: 400px !important;
}
</style>
