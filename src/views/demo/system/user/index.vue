<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增用户</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此用户',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getUserList } from '/@/api/demo/system';
import { PageWrapper } from '/@/components/Page';
import { useModal } from '/@/components/Modal';
import UserModal from './UserModal.vue';
import { columns, searchFormSchema } from './user.data';
import { useGo } from '/@/hooks/web/usePage';
import { delUser } from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';

export default defineComponent({
  name: 'UserManagement',
  components: { BasicTable, PageWrapper, UserModal, TableAction },
  setup() {
    const go = useGo();
    const [registerModal, { openModal }] = useModal();
    const searchInfo = reactive<Recordable>({});
    const [registerTable, { reload, updateTableDataRecord }] = useTable({
      title: '用户列表',
      api: getUserList,
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
      openModal(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      openModal(true, {
        record,
        isUpdate: true,
      });
    }

    function handleDelete(record: Recordable) {
      operationApi('del', record, {
        delAction: delUser,
      });
      handleSuccess();
    }

    function handleSuccess() {
      setTimeout(() => {
        reload();
      }, 300);
    }

    function handleView(record: Recordable) {
      go('/system/User_detail/' + record.id);
    }

    return {
      registerTable,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleSuccess,
      handleView,
      searchInfo,
    };
  },
});
</script>