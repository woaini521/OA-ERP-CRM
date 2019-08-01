<template>
  <div id="app">
    <!-- <Apptab></Apptab>  -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  neme: "#app",
};
</script>

<style lang="less">
*{margin: 0;padding: 0}
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  // display: flex;
  flex-flow: column;
  overflow: hidden;
}
</style>
