<!-- 左侧菜单导航栏组件 -->
<template>
  <el-scrollbar style="height: 100%;background:#324057">
    <div class="app-nav-wrap" style="height: 100%;">
      <i style="font-size: 22px;color: #CCC;margin-left: 22px;" :class="[ isCollapse == false ? 'el-icon-s-fold' : 'el-icon-s-unfold']" @click="isCollapse = !isCollapse" :title="[isCollapse == false ? '回收' : '展开']"></i>
      <!-- 这里是动态渲染数据 -->
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router :collapse="isCollapse" background-color="#324057" text-color="#FFFFFF" active-text-color="#409EFF">
        <el-menu-item :index="'/sy'" :key="'/sy'">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu :index="item.name" v-for="item in menus" :key="item.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.title}}</span>
              </template>

              <template v-for="items in item.child">
                <template v-if="items.child !== null">
                  <el-submenu :index="`${item.name}${items.name}`" :key="items.id" >
                      <span slot="title">{{items.title}}</span>
                      <el-menu-item v-for="it in items.child" :index="`/${item.name}/${items.name}/${it.name}`" :key="it.id">{{it.title}}</el-menu-item>
                  </el-submenu>
                </template>

                <template v-if="items.child == null">
                    <el-menu-item :index="`/${item.name}/${items.name}`" :key="items.id">{{items.title}}</el-menu-item>
                </template>
              </template>
        </el-submenu> 
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      menus: [],
      isCollapse: false
    };
  },
  mounted() {
    // 刷新时以当前路由做为tab加入tabs
    if (
      this.$route.path !== "/sy" &&
      this.$route.path.indexOf("userInfo") == -1
    ) {
      let actions1 = { route: "/sy", name: "首页" };
      let actions2 = {
        route: this.$route.path,
        name: this.$route.name
      };
      let actions3 = this.$route.path;
      this.triggerSetActiveIndex(actions3);
      this.triggerAddTabs(actions1);
      this.triggerAddTabs(actions2);
    } else {
      let actions1 = { route: "/sy", name: "首页" };
      let actions2 = "/sy";
      this.triggerSetActiveIndex(actions2);
      this.triggerAddTabs(actions1);
      this.$router.push("/sy");
    }
  },
  computed: {
    ...mapGetters("Tabs", {
      options: "renderOptions",
      activeIndex: "renderActiveIndex"
    })
  },
  methods: {
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"])
  },
  created() {
     this.menus = JSON.parse(localStorage.getItem('Arr'));
  }
};
</script>
<style lang="less" scoped>
.app-nav-wrap {
  background: #324057;
  .el-menu {
    border-right: none;
  }
}
.el-scrollbar{height:100%;}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

</style>
