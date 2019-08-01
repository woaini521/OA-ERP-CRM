//import Cookie from 'vue-cookies'

const state = {
  options: [],
  activeIndex: "/sy",
  userInfo: '',
 // keepAlive: Cookie.get('keepAliveRoute') || []
};
const getters = {
  renderOptions(state) {
    return state.options;
  },
  renderActiveIndex(state) {
    return state.activeIndex;
  },
  renderUserInfo(state) {
    return state.userInfo;
  }
  // renderkeepAlive(state) {
  //   return state.keepAlive;
  // }
};
const mutations = {
  // 添加tabs
  add_tabs(state, data) {
    state.options.some((item,i) => {
      if(item.name == data.name){
        state.options.splice(i,1);
        return true;
      }
    });
    state.options.push(data);
  },
  // 删除tabs
  delete_tabs(state, route) {
    let index = 0;
    for (let option of state.options) {
      if (option.route === route) {
        break;
      }
      index++;
    }
    state.options.splice(index, 1);
  },
  // 设置当前激活的tab
  set_active_index(state, index) {
    state.activeIndex = index;
  },
  // 设置详情信息
  save_detail_info(state, info) {
    state.userInfo = info;
  }
  // 添加缓存信息到数组
  // save_keepAlive(state, info) {
  //   state.keepAlive.some((item,i) => {
  //     if(item.name == info.name){
  //       state.keepAlive.splice(i,1);
  //       return true;
  //     }
  //   });
  //   state.keepAlive.push(info);
  // },
  // 删除缓存在数组的信息
  // delete_keepAlive(state) {
  //   state.keepAlive = [];
  //   // let index = 0;
  //   // for (let keepAlive of state.keepAlive) {
  //   //   if (keepAlive.name === str.name) {
  //   //     break;
  //   //   }
  //   //   index++;
  //   // }
  //   // state.keepAlive.splice(index, 1);
  // }
};
const actions = {
  triggerAddTabs(context, item) {
    context.commit("add_tabs", item);
  },
  triggerDeleteTabs(context, item) {
    context.commit("delete_tabs", item);
  },
  triggerSetActiveIndex(context, item) {
    context.commit("set_active_index", item);
  },
  triggerSaveDetailInfo(context, item) {
    context.commit("save_detail_info", item);
  },
  triggerkeepAlive(context, item) {
    context.commit("save_keepAlive", item);
  }
  // triggerDeleteKeepAlive(context, item) {
  //   context.commit("delete_keepAlive", item);
  // }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
