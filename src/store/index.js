import Vue from "vue";
import Vuex from "vuex";
import Tabs from "./tabs/index";
import customerList from "./crm/customerList"

Vue.use(Vuex);

//使用modules引用NavModules模块的值
const store = new Vuex.Store({
  modules: {
    Tabs,
    customerList
  }
});

export default store;
