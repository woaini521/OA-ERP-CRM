const state = {
  id: "",
  userInfo: '/customerList',
  userInfo1: '/customerList',
  userInfo2: '/customerList',
  userInfo3: '/customerList'
};
const getters = {
  renderId(state) {
    return state.id;
  },
  renderUserInfo(state) {
    return state.userInfo;
  },
  renderUserInfo1(state) {
    return state.userInfo1;
  },
  renderUserInfo2(state) {
    return state.userInfo2;
  },
  renderUserInfo3(state) {
    return state.userInfo3;
  }
};
const mutations = {
  // 添加tabs
  replaceId(state, data) {
    state.id = data;
  },
  replaceUserInfo(state, data) {
    state.userInfo = data;
  },
  replaceUserInfo1(state, data) {
    state.userInfo1 = data;
  },
  replaceUserInfo2(state, data) {
    state.userInfo2 = data;
  },
  replaceUserInfo3(state, data) {
    state.userInfo3 = data;
  }
};
const actions = {
  triggerReplaceId(context, item) {
    context.commit("replaceId", item);
  },
  triggerReplaceUserInfo(context, item) {
    context.commit("replaceUserInfo", item);
  },
  triggerReplaceUserInfo1(context, item) {
    context.commit("replaceUserInfo1", item);
  },
  triggerReplaceUserInfo2(context, item) {
    context.commit("replaceUserInfo2", item);
  },
  triggerReplaceUserInfo3(context, item) {
    context.commit("replaceUserInfo3", item);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
