<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增菜单</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:tool',
              onClick: handleConfig.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useDrawer } from '/@/components/Drawer';
import { PageWrapper } from '/@/components/Page';
import { getMenusList, delMenu } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
import DeptTree from './DeptTree.vue';
import MenuDrawer from './MenuDrawer.vue';

import { useModal } from '/@/components/Modal';
import { columns, searchFormSchema } from './menu.data';
import { useGo } from '/@/hooks/web/usePage';

export default defineComponent({
  name: 'MenuManagement',
  components: { BasicTable, PageWrapper, DeptTree, MenuDrawer, TableAction },
  setup() {
    const router = useRouter();
    const go = useGo();
    const [registerModal, { openModal }] = useModal();
    const [registerDrawer, { openDrawer }] = useDrawer();
    const searchInfo = reactive<Recordable>({});
    const [registerTable, { reload, updateTableDataRecord }] = useTable({
      title: '菜单列表',
      api: getMenusList,
      rowKey: 'id',
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      handleSearchInfoFn(info) {
        return info;
      },
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
      },
    });

    function handleCreate() {
      openDrawer(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      openDrawer(true, {
        record,
        isUpdate: true,
      });
    }

    function handleDelete(record: Recordable) {
      operationApi('del', record, {
        delAction: delMenu,
      });
      handleSuccess({ isUpdate: false, values: null });
    }

    function handleSuccess({ isUpdate, values }: any) {
      if (isUpdate) {
        // 演示不刷新表格直接更新内部数据。
        // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
        const result = updateTableDataRecord(values.id, values);
      } else {
        setTimeout(() => {
          reload();
        }, 200);
      }
    }

    function handleSelect(catalogueId = '') {
      searchInfo.catalogueId = catalogueId;
      setTimeout(() => {
        reload();
      }, 200);
    }

    function handleConfig(record: Recordable) {
      router.push({ path: '/dynamic/config', query: { menu_id: record.id } });
    }

    return {
      registerTable,
      registerModal,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleSelect,
      handleConfig,
      searchInfo,
    };
  },
});
</script>