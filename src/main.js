import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCookies from "vue-cookies";
import Print from "vue-print-nb";
import axios from "axios";
import filters from "./filter";
//import routeMap from './router/components.js';
// import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(Print);
Vue.prototype.axios = axios;

//全局方法Vue.filter()统一注册自定义过滤器
Object.keys(filters).forEach(key => {
  //返回filters对象中属性名组成的数组
  Vue.filter(key, filters[key]);
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    axios.get("/Index/Index").then(res => {
      if (res.data.code == 10000) {
        next({
          path: "/login"
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
