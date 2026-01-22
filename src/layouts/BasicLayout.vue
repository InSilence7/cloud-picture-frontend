<template>
  <div id="basic-layout">
    <a-layout style="min-width: 100vh;">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="centent">
        <router-view />
      </a-layout-content>


      <a-layout-footer class="footer">
        <a href="https://www.codefather.cn" target="">
          desigend by giftbox
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';

</script>
<style scoped>
#basic-layout .header {
  padding-inline: 20px;
  background: #fafafa;
  color: unset;
  margin-bottom: 16px;
}


#basic-layout .centent {
  background: linear-gradient(to right, #fefefe, #eaf4ff);
  padding: 20px;
  margin-bottom: 35px;

}

#basic-layout .footer {
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
