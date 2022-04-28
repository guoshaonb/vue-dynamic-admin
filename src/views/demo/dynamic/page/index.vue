<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable
      ref="tableRef"
      :title="route.query.name + '列表'"
      :columns="columns"
      :api="getGeneralDataList"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      :pagination="{ pageSize: 10 }"
      :formConfig="{
        labelWidth: 120,
        schemas: searchFormSchema,
      }"
      :beforeFetch="
        (row) => {
          row.menu_id = route.query.menu_id;
        }
      "
      :useSearchForm="true"
      :showTableSetting="true"
      :showIndexColumn="false"
      :actionColumn="{
        width: 120,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      }"
      rowKey="id"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #toolbar>
        <a-button type="danger" @click="handleDeletes"> 批量删除 </a-button>
        <a-button type="primary" @click="handleCreate"> 新增 </a-button>
        <a-button type="primary" @click="deriveExcelData"> 导出 </a-button>
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
    <pageModal
      :configObj="configObj"
      :classifys="classifys"
      @register="registerModal"
      @success="handleSuccess"
    />
  </PageWrapper>
</template>
<script lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent, ref, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { PageWrapper } from '/@/components/Page';
import {
  getGeneralConfigList,
  getGeneralDataList,
  addGeneralData,
  editGeneralData,
  delGeneralData,
  delsGeneralData,
  getConfigclassifyList,
} from '/@/api/demo/system';
import { operationApi } from '/@/utils/event/operation';
import { useModal } from '/@/components/Modal';
import pageModal from './pageModal.vue';
import { columns, searchFormSchema } from './data';
import { exportExcel } from '/@/utils/excel/exportExcel';
import { message, Modal } from 'ant-design-vue';

export default defineComponent({
  components: { TableAction, BasicTable, PageWrapper, pageModal },
  setup() {
    const tableRef = ref<Nullable<TableActionType>>(null);
    const [registerModal, { openModal }] = useModal();
    const route = useRoute();
    const state: any = reactive({
      searchFormSchema: [],
      columns: [],
      configObj: {},
      classifys: '',
    });

    //获取动态字段配置
    const getDynamicConfig = async () => {
      //获取配置数据
      const dynamicResult = await getGeneralConfigList({
        menu_id: route.query.menu_id,
      });
      if (dynamicResult) {
        const configNapeData = dynamicResult?.[0] || [];
        const configObj = {};
        Object.keys(configNapeData).forEach((key, index) => {
          if (key.includes('c_')) {
            const configNapeDatakey = configNapeData[key].toString();
            const configNapeDatake = configNapeData[key].toString();
            const typeCommonArray = [
              'Input',
              'InputNumber',
              'InputTextArea',
              'Select',
              'RadioGroup',
              'CheckboxGroup',
              'Switch',
              'DatePicker',
              'RangePicker',
            ];
            const leftOpions = configNapeDatakey?.split(';')?.[0];
            const optionsArray =
              configNapeDatakey?.split('`')?.[0]?.split(';')?.[1]?.split(',') || [];
            configObj['c_' + key?.split('c_')[1]] = {
              name: configNapeDatakey?.split(',')?.[0],
              isExist: leftOpions?.split(',')?.[2],
              field: leftOpions?.split(',')?.[1],
              type: typeCommonArray[leftOpions?.split(',')?.[3] || 0],
              options: [],
              class: configNapeDatakey.split('`')?.[1] || '基础配置',
            };
            optionsArray?.forEach((element) => {
              configObj['c_' + key?.split('c_')[1]]['options'].push({
                label: element,
                value: element,
              });
            });
          }
        });
        //设置表格、表单
        state.configObj = configObj;
        state.columns = columns(configObj);
        state.searchFormSchema = searchFormSchema(configObj);
      }

      //获取配置分类
      const classifyResult = await getConfigclassifyList({
        menu_id: route.query.menu_id,
      })
      if(classifyResult) {
        let configClassifys = [];
        const classifyData = classifyResult?.[0] || [];
        Object.keys(classifyData).forEach((item) => {
          if (item.includes('class') && classifyData[item] !== '0') {
            configClassifys.push(classifyData[item]);
          }
        });
        state.classifys = configClassifys;
      }
    };
    getDynamicConfig()

    function handleCreate() {
      openModal(true, {
        isUpdate: false,
      });
    }

    function handleEdit(record: Recordable) {
      openModal(true, {
        record,
        isUpdate: true,
        id: record.id,
      });
    }

    function handleDelete(record: Recordable) {
      operationApi('del', record, {
        delAction: delGeneralData,
      });
      handleSuccess();
    }

    const showDeleteConfirm = (callBack) => {
      Modal.confirm({
        title: '确定批量删除吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          callBack();
        },
        onCancel() {
          message.warning('您取消了删除');
        },
      });
    };

    function handleDeletes(record: Recordable) {
      const ids = tableRef.value.getRowSelection().selectedRowKeys;
      if (ids.length > 0) {
        showDeleteConfirm(() => {
          const params = {
            ids,
            is_del: 1,
          };
          operationApi('del', params, {
            delAction: delsGeneralData,
          });
          handleSuccess();
        });
      } else {
        message.warning('请选择数据后再删除哦');
      }
    }

    function handleSuccess() {
      setTimeout(() => {
        tableRef.value.reload();
      }, 200);
    }

    //导出excel
    const deriveExcelData = () => {
      const tableData = tableRef.value.getDataSource();
      exportExcel(state.columns, tableData, route.query.name + '数据');
    };

    return {
      ...toRefs(state),
      tableRef,
      route,
      registerModal,
      handleCreate,
      handleEdit,
      handleDelete,
      handleDeletes,
      handleSuccess,
      deriveExcelData,
      getGeneralDataList,
    };
  },
});
</script>
<style lang="less" scoped>
::v-deep {
  .ant-modal-content {
    width: 890px !important;
  }
}
</style>