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

      <!-- 用户信息展示栏 -->
      <a-col flex="150px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout" width="100%">
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <div v-else>
            <!-- <a-button type="primary" href="/user/login">登录</a-button> -->
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>

    </a-row>
  </div>

</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import { message, type MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { routes } from '../router/routes';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { userLogoutUsingPost } from '@/api/userController';
const loginUserStore = useLoginUserStore();
// loginUserStore.fetchLoginUser();




//用户注销事件函数，退出登录后跳转到登录页
const doLogout = async () => {
  const res = await userLogoutUsingPost();
  console.log(res);
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功');
    await router.push('/user/login')
  } else {
    message.error('退出登录失败, ' + res.data.message);
  }
}



//菜单栏显示
const items = computed<MenuProps['items']>(() => {
  //通过meta 属性控制显示过滤
  const filteredRoutes = routes.filter(route => {
    //管理员路由显示：需要admin权限且meta为false
    if (route.path.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser;
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false;
      }
      return route.meta?.showInMenu !== false;
    }
    //普通路由显示
    return route.meta?.showInMenu !== false;
  });
  return [
    ...filteredRoutes.map(route => ({
      key: route.path,
      icon: () => h(route.meta?.icon as string),
      label: route.name as string,
      title: route.meta?.title as string,
    })),
    {
      key: 'others',
      label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    },
  ];
});

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

.user.user-login-status {
  max-width: 150px;
  /* 或者你想要的宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}
</style>
