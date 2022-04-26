<template>
  <template v-for="(tag, index) in tags" :key="tag">
    <a-tooltip v-if="tag.length > 20" :title="tag">
      <a-tag :closable="index !== 0" @close="handleClose(tag)">
        {{ `${tag.slice(0, 20)}...` }}
      </a-tag>
    </a-tooltip>
    <a-tag v-else :closable="index !== 0" @close="handleClose(tag)">
      {{ tag }}
    </a-tag>
  </template>
  <a-input
    v-if="inputVisible"
    ref="inputRef"
    type="text"
    :style="{ width: '78px' }"
    v-model:value="inputValue"
    @blur="handleInputConfirm"
    @keyup.enter="handleInputConfirm"
  />
  <a-tag v-else @click="showInput" style="background: #fff; border-style: dashed">
    <plus-outlined />
    新增分类
  </a-tag>
  <a-button type="success" @click="saveConfig">保存</a-button>
</template>
<script lang="ts">
// 系统引入项
import { defineComponent, ref, reactive, toRefs, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import { Alert, Card, message } from 'ant-design-vue';
// api引入项
import { editGeneralConfig } from '/@/api/demo/system';
export default defineComponent({
  props: {
    id: {
      type: String,
    },
    pageId: {
      type: String,
    },
    configClassifys: {
      type: Object,
    },
  },
  components: {
    PlusOutlined,
  },
  setup(props, ctx) {
    const route = useRoute();
    const router = useRouter();
    const inputRef = ref();
    const state: any = reactive({
      tags: [],
      inputVisible: false,
      inputValue: '',
    });

    const handleClose = (removedTag: string) => {
      const tags = state.tags.filter((tag) => tag !== removedTag);
      state.tags = tags;
    };

    const showInput = () => {
      state.inputVisible = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };

    const handleInputConfirm = () => {
      const inputValue = state.inputValue;
      let tags = state.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: '',
      });
    };

    //保存配置分类
    const saveConfig = () => {
      ctx.emit('saveClassifys', JSON.stringify(state.tags));
    };

    watch(
      () => props.configClassifys,
      (newValue, oldValue) => {
        if (newValue) {
          state.tags = newValue;
        }
      },
      { immediate: true, deep: true },
    );
    
    return {
      ...toRefs(state),
      handleClose,
      showInput,
      handleInputConfirm,
      inputRef,
      saveConfig,
    };
  },
});
</script>
<style lang="less" scoped>
</style>