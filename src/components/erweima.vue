<template>
  <div>
    <div id="qrcode"></div> <!-- 创建一个div，并设置id为qrcode -->
  </div>
</template>
   
<script>
import QRCode from 'qrcodejs2'  // 引入qrcode
export default {
  name : 'test',
  props:['link'],
  mounted () {
    this.qrcode(this.link);
  },
  methods: {
    qrcode(a) {
      let qrcode = new QRCode('qrcode', {
        width: 132,  
        height: 132,
        text: a, // 二维码地址
        colorDark : "#000",
        colorLight : "#fff",
      })
    },
  }
}
</script>