<template>
  <PageWrapper :title="`用户` + userInfo?.username " contentBackground @back="goBack">
    <template #extra>
      <!-- <a-button type="primary" danger> 禁用用户 </a-button> -->
      <!-- <a-button type="primary"> 修改密码 </a-button> -->
    </template>
    <!-- <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="用户资料" />
        <a-tab-pane key="logs" tab="操作日志" />
      </a-tabs>
    </template> -->
    <div class="pt-4 m-4 desc-wrap">
      <p>用户名：{{ userInfo?.username }}</p>
      <p>邮箱：{{ userInfo?.email }}</p>
      <p>创建时间：{{ userInfo?.createdAt }}</p>
      <p>更新时间：{{ userInfo?.updatedAt }}</p>
    </div>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { PageWrapper } from '/@/components/Page';
import { useGo } from '/@/hooks/web/usePage';
import { useTabs } from '/@/hooks/web/useTabs';
import { Tabs } from 'ant-design-vue';
import { getUserDetail } from '/@/api/demo/system';

export default defineComponent({
  name: 'UserDetail',
  components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane },
  setup() {
    //获取地址栏参数
    const getQueryString = (name) => {
      let params_url = window.location.href.split('?')[1];
      let params_val = params_url?.toString().split('&');
      for (let i in params_val) {
        let key = params_val?.[i].split('=')[0];
        let val = params_val?.[i].split('=')[1];
        if (key == name) {
          return val;
        }
      }
      return false;
    };

    const route = useRoute();
    const go = useGo();
    // 此处可以得到用户ID
    const userId = ref(route.params?.id);
    const currentKey = ref('detail');
    const { setTitle } = useTabs();
    const userInfo = ref(null);
    // TODO
    // 本页代码仅作演示，实际应当通过userId从接口获得用户的相关资料

    getUserDetail({ id: userId.value }).then((res) => {
      userInfo.value = res
      // 设置Tab的标题（不会影响页面标题）
      setTitle('详情：用户' + userInfo.value?.username);
    });

    // 页面左侧点击返回链接时的操作
    function goBack() {
      // 本例的效果时点击返回始终跳转到用户列表页，实际应用时可返回上一页
      go('/system/User');
    }
    return { userInfo, currentKey, goBack };
  },
});
</script>

<style scoped>
  .desc-wrap p{
    padding-left: 20px;
  }
</style>
