<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
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
    <drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getMenusList, delMenu } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
import { useDrawer } from '/@/components/Drawer';
import drawer from './drawer.vue';
import { columns, searchFormSchema } from './data';
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'RoleManagement',
  components: { BasicTable, drawer, TableAction },
  setup() {
    const router = useRouter();
    const [registerDrawer, { openDrawer }] = useDrawer();
    const [registerTable, { reload }] = useTable({
      title: '菜单列表',
      api: getMenusList,
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
        delAction: delMenu,
      });
      handleSuccess();
    }

    function handleSuccess() {
      setTimeout(() => {
        reload();
      }, 200);
    }

    function handleConfig(record: Recordable) {
      if(record.type == '1') {
        return message.warning("只能给【菜单】添加配置哦")
      }
      router.push({ path: '/dynamic/config', query: { menu_id: record.id } });
    }

    return {
      registerTable,
      registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleConfig
    };
  },
});
</script>
  