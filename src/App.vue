<template>
  <div id="app">

    <a-config-provider :locale="zhCN">
      <BasicLayout />
    </a-config-provider>

  </div>

</template>

<script setup lang="ts">
import BasicLayout from './layouts/BasicLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// import { healthCheckUsingGet } from './api/mainController';
// import { useLoginUserStore } from './stores/useUserLoginStore';
dayjs.locale('zh-cn');


// healthCheckUsingGet().then((res) => {
//   console.log(res)
// })


// 已经改为在权限校验文件中获取
// const loginUserStore = useLoginUserStore();
// loginUserStore.fetchLoginUser();

</script>

<style scoped></style>
