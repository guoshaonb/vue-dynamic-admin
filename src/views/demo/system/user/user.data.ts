import { getAllRoleList, isusernameExist } from '/@/api/demo/system';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 150,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  }
];

export const userFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    required: true,
    rules: [
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            function isEmailAvailable(obj) {
              let email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              if (!email.test(obj)) {
                return false;
              }
              return true;
            }
            if (isEmailAvailable(value)) {
              resolve()
            } else {
              reject('邮箱格式有误');
            }
          })
        },
      },
    ],
  },
];
