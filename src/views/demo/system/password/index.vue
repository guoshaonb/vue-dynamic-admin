<template>
  <PageWrapper title="修改当前用户密码" content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { PageWrapper } from '/@/components/Page';
import { BasicForm, useForm } from '/@/components/Form';
import { editPass } from '/@/api/demo/system';
import { useUserStore } from '/@/store/modules/user';
import { formSchema } from './pwd.data';
import { PageEnum } from '/@/enums/pageEnum';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'ChangePassword',
  components: { BasicForm, PageWrapper },
  setup() {
    const userStore = useUserStore();
    const [register, { validate, resetFields }] = useForm({
      size: 'large',
      labelWidth: 100,
      showActionButtonGroup: false,
      schemas: formSchema,
    });

    //  login out
    function handleLoginOut() {
      setTimeout(() => {
        userStore.logout(true);
      },1000)
    }

    async function handleSubmit() {
      try {
        const values = await validate();
        const { passwordOld, passwordNew } = values;
        const username = userStore.getUserInfo.username;
        const params = {
          username,
          passwordOld,
          passwordNew,
        };
        // TODO custom api
        editPass(params).then((res) => {
          message.success('密码修改成功，正在跳转登录...', 2);
          handleLoginOut()
        });
      } catch (error) {}
    }

    return { register, resetFields, handleSubmit };
  },
});
</script>
