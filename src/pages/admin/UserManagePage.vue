<template>
  <div id="userManagePage">
    <!-- 搜索条件 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号" name="id">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" />
      </a-form-item>
      <a-form-item label="角色">
        <a-input v-model:value="searchParams.userRole" placeholder="输入权限名" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          <template #icon>
            <SearchOutlined />
          </template>
          搜索
        </a-button>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="openAddDrawer">
          <template #icon>
            <PlusOutlined />
          </template>
          添加
        </a-button>
      </a-form-item>

      <!-- 抽屉表单 -->
      <a-drawer :title="titleName" :width="720" :open="open" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">
        <a-form :model="form" :rules="rules" layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="账号" name="userAccount">
                <a-input v-model:value="form.userAccount" placeholder="请输入账号" :disabled="isEditMode" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户昵称" name="userName">
                <a-input v-model:value="form.userName" style="width: 100%" placeholder="请输入昵称" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户权限" name="userRole">
                <a-select v-model:value="form.userRole" placeholder="选择权限信息">
                  <a-select-option value="user">user</a-select-option>
                  <a-select-option value="admin">admin</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="用户头像" name="userAvatar">
                <a-upload v-model:file-list="fileList" name="userAvatar" list-type="picture-card"
                  class="avatar-uploader" :show-upload-list="false"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :before-upload="beforeUpload"
                  @change="handleChange">
                  <img v-if="imageUrl" :src="imageUrl" alt="userAvatar" :width="120" />
                  <div v-else>
                    <loading-outlined v-if="loading"></loading-outlined>
                    <plus-outlined v-else></plus-outlined>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="简介" name="userProfile">
                <a-textarea v-model:value="form.userProfile" :rows="4" placeholder="请输入用户简介" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <template #extra>
          <a-space>
            <a-button @click="onClose">取消</a-button>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
          </a-space>
        </template>
      </a-drawer>
    </a-form>

    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="120" />
        </template>

        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">{{ record.userRole }}</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">{{ record.userRole }}</a-tag>
          </div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-button danger @click="doDelete(record.id)">删除</a-button>
          <a-button type="link" @click="showDrawer(record.id)">编辑</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import {
  addUserUsingPost,
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  getUserByIdUsingGet,
  updateUserUsingPost
} from '@/api/userController';
import { message } from 'ant-design-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs'

// 图标
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

// 头像上传相关
function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    getBase64(info.file.originFileObj, (base64Url: string) => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('上传失败');
  }
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

// 抽屉表单相关
const titleName = ref('');
const form = ref<API.UserAddRequest>({});
const isEditMode = ref(false);
const editUserId = ref('');

const rules: Record<string, Rule[]> = {
  userAccount: [{ required: true, message: '请输入账号' }],
  userName: [{ required: true, message: '请输入用户名' }],
  userRole: [{ required: true, message: '请选择用户角色' }],
};

// 抽屉开关
const open = ref<boolean>(false);

// 清空数据
const onClose = () => {
  form.value = {
    userAccount: '',
    userName: '',
    userProfile: '',
    userRole: '',
    userAvatar: ''
  };
  imageUrl.value = '';
  editUserId.value = '';
  isEditMode.value = false;
  open.value = false;
};

// 打开添加用户抽屉
const openAddDrawer = () => {
  open.value = true;
  titleName.value = '添加用户';
  isEditMode.value = false;
  form.value = {
    userAccount: '',
    userName: '',
    userProfile: '',
    userRole: '',
    userAvatar: ''
  };
  imageUrl.value = '';
}

// 表格列定义
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 编辑数据
const showDrawer = async (id: string) => {
  open.value = true;
  titleName.value = '编辑用户';
  isEditMode.value = true;
  editUserId.value = id;

  try {
    // 获取该行数据
    const res = await getUserByIdUsingGet({ id });
    if (res.data.code === 0 && res.data.data) {
      const user = res.data.data;
      form.value = {
        userAccount: user.userAccount,
        userName: user.userName,
        userProfile: user.userProfile,
        userRole: user.userRole,
        userAvatar: user.userAvatar,
      };

      // 设置头像预览
      if (user.userAvatar) {
        imageUrl.value = user.userAvatar;
      }
    } else {
      message.error('获取用户信息失败');
    }
  } catch (error) {
    message.error('获取用户信息失败');
  }
};

// 统一提交函数
const handleSubmit = async () => {
  if (isEditMode.value) {
    await updateUser();
  } else {
    await submitUser();
  }
};

// 更新用户
const updateUser = async () => {
  if (!editUserId.value) {
    message.error('用户ID不存在');
    return;
  }

  const updateData = {
    id: editUserId.value,
    userName: form.value.userName,
    userProfile: form.value.userProfile,
    userRole: form.value.userRole,
    userAvatar: form.value.userAvatar,
  };

  const res = await updateUserUsingPost(updateData);
  if (res.data.code === 0) {
    message.success('修改成功');
    fetchData();
    onClose();
  } else {
    message.error('修改失败：' + res.data.message);
  }
};

// 添加用户
const submitUser = async () => {
  const res = await addUserUsingPost(form.value);
  if (res.data.code === 0) {
    message.success('添加成功');
    fetchData();
    onClose();
  } else {
    message.error('账号重复或' + res.data.message);
  }
};

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return;
  }
  const res = await deleteUserUsingPost({ id });
  if (res.data.code === 0) {
    message.success('删除成功');
    fetchData();
  } else {
    message.error('删除失败');
  }
}

// 搜索
const doSearch = () => {
  searchParams.current = 1;
  fetchData();
}

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
}

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条数据`,
  };
});

// 数据响应器
const dataList = ref<API.UserVO[]>([]);
const total = ref(0);

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
});

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams
  });

  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  } else {
    message.error('获取数据失败，' + res.data.message);
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData();
});
</script>
