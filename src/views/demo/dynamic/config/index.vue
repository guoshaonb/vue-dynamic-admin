<template>
  <div style="width: 100%">
    <div class="config-header">
      <div>
        <span class="config-header-titp">操作按钮</span>
        <a-button type="success" @click="initConfig">创建配置</a-button>
        <a-button type="danger" @click="delConfig">删除配置</a-button>
        <a-button type="primary" @click="updConfig">更新配置</a-button>
      </div>
      <div v-if="configData">
        <span class="config-header-titp">配置分类</span>
        <dynamicTag
          :id="id"
          :pageId="menu_id"
          :configClassifys="configClassifys"
          @saveClassifys="saveClassifys"
        />
      </div>
    </div>
    <a-tabs
      v-if="configData"
      tab-position="left"
      :style="{ height: '800px', overflowY: 'scroll' }"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane
        v-for="i in 50"
        :key="i"
        :tab="`配置-${i}${configData['c_' + i]?.includes('字段') ? '(未用)' : ''}`"
      >
        <h4 class="config-content-header">
          表单配置{{ i }}
          <span style="color: red" v-if="configData['c_' + i]?.includes('字段')">(待配置)</span>
        </h4>
        <commonForm
          :ref="sonRefFormObj[i]"
          :configOption="configData['c_' + i]"
          :configClassifys="configClassifys"
        />
        <dynamicOptions :ref="sonRefOptionObj[i]" :configOption="configData['c_' + i]" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
// 系统引入项
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Alert, Card, message } from 'ant-design-vue';
// import { useStore } from '@/store'
// 组件引入项
import commonForm from './components/commonForm.vue';
import dynamicOptions from './components/dynamicOptions.vue';
import dynamicTag from './components/dynamicTag.vue';
// api引入项
import {
  getGeneralConfigList,
  addGeneralConfig,
  editGeneralConfig,
  delGeneralConfig,
  getConfigclassifyList,
  addConfigclassify,
  editConfigclassify,
  delConfigclassify,
} from '/@/api/demo/system';
import configObj from './configObj';
import classObj from './classObj';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { isObjectValueEqual } from '/@/utils/common';

let sonRefFormObj = {};
let sonRefOptionObj = {};
export default defineComponent({
  components: {
    commonForm,
    dynamicOptions,
    dynamicTag,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userId = ref(null);
    const state = reactive({
      id: 0,
      class_id: 0,
      menu_id: 0,
      activeKey: 1,
      configData: null,
      configClassifys: null,
    });

    //获取动态字段配置
    const getDynamicConfig = async () => {
      //获取配置数据
      const dynamicResult = await getGeneralConfigList({
        menu_id: route.query.menu_id,
      });
      const dynamicData = dynamicResult?.[0];
      if (dynamicData) {
        state.id = dynamicData.id;
        state.menu_id = dynamicData.menu_id;
        state.configData = dynamicData;
      } else {
        state.configData = null;
        state.configClassifys = null;
      }

      //获取配置分类
      const classifyResult = await getConfigclassifyList({
        menu_id: route.query.menu_id,
      });
      const classData = classifyResult?.[0];
      if (classData) {
        let configClassifys = [];
        state.class_id = classData.id;
        Object.keys(classData).forEach((item) => {
          if (item.includes('class') && classData[item] !== '0') {
            configClassifys.push(classData[item]);
          }
        });
        state.configClassifys = configClassifys;
      }

      for (let i = 1; i <= 50; i++) {
        sonRefFormObj[i] = ref(null);
        sonRefOptionObj[i] = ref(null);
      }
      userId.value = Persistent.getLocal(USER_INFO_KEY).id;
    };
    getDynamicConfig();

    //重新加载数据
    const reloadContent = (content) => {
      message.success(content);
      getDynamicConfig();
    };

    /**
     * ------------------------配置按钮事件------------------------
     */
    //创建配置
    const initConfig = async () => {
      if (!state.configData) {
        const dynamicData = {
          menu_id: route.query.menu_id,
          user_id: userId.value,
          ...configObj,
        };
        const classData = {
          menu_id: route.query.menu_id,
          user_id: userId.value,
          ...classObj,
          class1: '基础配置',
        };
        await addGeneralConfig(dynamicData);
        const result = await addConfigclassify(classData);
        if (result) {
          reloadContent('创建配置成功！');
        }
      } else {
        message.warning('已包含配置了，请先删除改配置再初始化哦！');
      }
    };

    //更新配置
    const updConfig = () => {
      const configData = {};
      const configNames: any = [];
      for (let i = 1; i <= 50; i++) {
        const formData = sonRefFormObj[i].value?.[0]?.getOptionVal();
        const optionData = sonRefOptionObj[i].value?.[0]?.getOptionVal();
        if (formData && !isObjectValueEqual(state.configData['c_' + i], formData)) {
          if (formData.configName.includes('字段')) {
            return message.error('字段说明不能包含字段2字哦');
          }
          if (configNames.includes(formData.configName)) {
            return message.error('字段说明不能重复哦');
          }
          configNames.push(formData.configName);
          const options: any = [];
          Object.values(optionData).forEach((value) => {
            options.push(value);
          });
          configData['c_' + i] =
            formData.configName +
            ',' +
            formData.configField +
            ',t,' +
            formData.configType +
            ';' +
            options.join(',') +
            '`' +
            formData.selectType;
        }
      }
      const data = {
        ...state.configData,
        ...configData,
      };
      editGeneralConfig({
        id: state.id,
        user_id: userId.value,
        menu_id: state.menu_id,
        ...data,
      }).then(() => {
        reloadContent('更新配置成功！');
      });
    };

    //删除配置
    const delConfig = () => {
      delGeneralConfig({ id: state.id }).then(() => {
        reloadContent('删除配置成功！');
      });
    };

    //保存分类
    const saveClassifys = (row) => {
      if (!row) return;
      const classObj = {};
      JSON.parse(row || '')?.forEach((item, index) => {
        classObj['class' + (index + 1)] = item;
      });
      editConfigclassify({
        id: state.class_id,
        user_id: userId.value,
        menu_id: state.menu_id,
        ...classObj,
      }).then(() => {
        reloadContent('配置分类成功！');
      });
    };

    return {
      ...toRefs(state),
      sonRefFormObj,
      sonRefOptionObj,
      initConfig,
      updConfig,
      delConfig,
      saveClassifys,
    };
  },
});
</script>
<style lang="less" scoped>
::v-deep {
  .ant-form-item {
    margin-bottom: 15px !important;
  }
  .ant-tag {
    padding: 5px 10px !important;
  }
}

.config-header {
  padding: 15px;
  padding-bottom: 0;
  div {
    margin-bottom: 10px;

    button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  &-titp {
    margin-right: 10px;
  }
}

.config-content-header {
  margin: 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid grey;
}
</style>