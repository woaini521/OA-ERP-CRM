<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="router-template">
    <div class="template-wrap">
        <p>大展宏图 一展伟业</p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {};
    },
  }
</script>
<style>
  .router-template {
    color: #000;
    font-size: 20px;
    font-weight: 700;
    height: 100%;
  }
  .template-wrap {
    height: 100%;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
</style>
