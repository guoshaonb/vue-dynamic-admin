<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增目录 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
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
    <drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getCatalogueList, delCatalogue } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';

import { useDrawer } from '/@/components/Drawer';
import drawer from './drawer.vue';

import { columns, searchFormSchema } from './data';

export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, drawer, TableAction },
  setup() {
    const [registerDrawer, { openDrawer }] = useDrawer();
    const [registerTable, { reload }] = useTable({
      title: '目录列表',
      api: getCatalogueList,
      columns,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
      },
      useSearchForm: true,
      showTableSetting: true,
      bordered: true,
      showIndexColumn: false,
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
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
        id: record.id,
      });
    }

    function handleDelete(record: Recordable) {
      operationApi('del', record, {
        delAction: delCatalogue,
      });
      handleSuccess();
    }

    function handleSuccess() {
      setTimeout(() => {
        reload();
      }, 200);
    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
    };
  },
});
</script>
  