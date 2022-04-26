import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dynamic: AppRouteModule = {
  path: '/dynamic',
  name: 'Dynamic',
  component: LAYOUT,
  redirect: '/dynamic/account',
  meta: {
    hideMenu: true,
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: t('routes.demo.dynamic.moduleName'),
  },
  children: [
    {
      path: 'config',
      name: 'config',
      meta: {
        title: t('routes.demo.dynamic.config'),
        hideMenu: true,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/demo/dynamic/config/index.vue'),
    },
    {
      path: 'page',
      name: 'page',
      meta: {
        title: t('routes.demo.dynamic.page'),
        hideMenu: true,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/demo/dynamic/page/index.vue'),
    },
  ],
};

export default dynamic;
