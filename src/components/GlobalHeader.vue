<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo _1.png" alt="logo" />
            <div class="title">智能协同云图库</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick" />
      </a-col>
      <a-col flex="100px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.userId">
            {{ loginUserStore.loginUser.userName ?? '无名' }}
          </div>
          <div v-else>
            <!-- <a-button type="primary" href="/user/login">登录</a-button> -->
            <a-button type="primary" @click="() => $router.push('/login')">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>

</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import type { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { routes } from '../router/routes';
import { useLoginUserStore } from '@/stores/useUserLoginStore';
const loginUserStore = useLoginUserStore();


const items = ref<MenuProps['items']>([
  ...routes.map(route => ({
    key: route.path,
    icon: () => h(route.meta?.icon as string),
    label: route.name as string,
    title: route.meta?.title as string,
  })),
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]);

//引入路由
const router = useRouter();

//默认主页
const current = ref<string[]>([]);
//路由跳转后，更新选中高亮
router.afterEach((to) => {
  current.value = [to.path];
});

//路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}



</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
  /* justify-content: center; */
  background-color: #fafafa;
  /* padding: 16px; */
  margin-bottom: 16px;
}

.title {
  color: black;
  font-size: 18px;
  /* margin-left: 16px; */
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
