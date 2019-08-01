<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="head_box">
        <label>筛选：</label>
        <el-select v-model="value" placeholder="请选择" style="width:120px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input style="width:217px;margin-left:20px;"></el-input>
        <el-button type="primary" style="margin-left:20px;">搜索</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        options:[
          {
            value: "",
            label: "全部"
          },
          {
            value: "刀具",
            label: "人保财险"
          },
          {
            value: "手册",
            label: "人保寿险"
          },
          {
            value: "毛巾",
            label: "中国人寿"
          },
          {
            value: "中国太平",
            label: "中国太平"
          },
        ]
      };
    }
  }
</script>
<style scoped lang="less">
  
</style>
