<template>
    <div class="box">
        <el-button type="primary" @click="dao">导入</el-button>
        <el-button type="success" @click="xiazai">下载模板</el-button>
        <input id="upload" type="file" @change="importfxx(this)" style="display:none;"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        <div class="content_box">
            <el-table :data="tableData" width='1000px'>
                <el-table-column v-for="(item,index) in keys" :key="index" :label="keys[index]" :prop="keys[index]"></el-table-column>
            </el-table>
            <el-button type="primary" v-if="tableData.length != 0" @click="add" style="margin-top:20px;float:right">确认提交数据</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tableData:[],
            keys:[],
            province:[],
            city:[],
            block:[],
            map:[],
        } 
    },
    props:['distributeProduct','customer_order_id'],
    methods:{
        // 下载模板
        xiazai(){
            //console.log(this.distributeProduct);
            require.ensure([], () => {
                const {export_json_to_excel} = require('@/assets/vendor/Export2Excel');
                const tHeader = ['收货人','电话', '具体地址','省','付款方式','送货方式'];
                const filterVal = ['name','phone', 'address','province'];
                for(let i = 0;i< this.distributeProduct.length;i++){
                    tHeader.unshift(`${this.distributeProduct[i].name}${this.distributeProduct[i].sku_name}${this.distributeProduct[i].class_name}`)
                };
                const list = this.tableData;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, '模板');
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        // 触发上传
        dao(){
          document.getElementById('upload').click();  
          this.tableData = []
          this.keys = []
        },
        // 导入数据
        importfxx(obj) {
            let _this = this;
                let inputDOM = this.$refs.inputer;
                // 通过DOM取文件数据
                this.file = event.currentTarget.files[0];
                var rABS = false; //是否将文件读取为二进制字符串
                var f = this.file;
                var reader = new FileReader();
                const loading = _this.$loading({
                        lock: true,
                        text: '数据正在处理中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                }, 3000);
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(f) {
                    var binary = "";
                    var rABS = false; //是否将文件读取为二进制字符串
                    var pt = this;
                    var wb; //读取完成的数据
                    var outdata;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for(var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var XLSX = require('xlsx');
                        if(rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西

                        for(let i = 0; i < outdata.length;i++){
                            //console.log(outdata[i]['省份']);
                            _this.province.filter(item => {
                                //console.log(item);
                                if(item.value == outdata[i]['省']){
                                    _this.map = item.children;
                                   // console.log(_this.map)
                                    // 匹配市 
                                    if(_this.map.length != 0){
                                        _this.map.filter(item => {
                                            if(outdata[i]['具体地址'].includes(item.value)){
                                                outdata[i]['市'] = item.value;
                                                outdata[i]['区'] = ' ';  
                                                _this.map = item.children;
                                                console.log(item)  
                                            }
                                        })
                                        // 匹配区
                                        if(_this.map.length != 0){
                                            _this.map.filter(item => {
                                                if(outdata[i]['具体地址'].includes(item.value)){
                                                    outdata[i]['区'] = item.value;
                                                    _this.map = []; 
                                                }
                                            })
                                        }
                                    }else{
                                        _this.$message({
                                            message: '表格请写入省份',
                                            type: 'error'
                                        });
                                    }
                                };

                            })     
                        }
                    _this.tableData = outdata;
                    for (let p1 in outdata[0]) {
                        if (outdata[0].hasOwnProperty(p1))
                            _this.keys.push(p1);
                        }
                        //console.log(_this.keys)     
                    }
                    reader.readAsArrayBuffer(f);
                }
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
        },
        analyzeData: function (data) {  // 此处可以解析导入数据
            return data
        },
        dealFile: function (data) {   // 处理导入的数据
            console.log(data)
            this.imFile.value = ''
            this.fullscreenLoading = false
            if (data.length <= 0) {
            this.errorDialog = true
            this.errorMsg = '请导入正确信息'
            } else {
            this.excelData = data
            }
        },
        // 确认提交数据
       add(){   
           this.axios.post('/crm.Order/customer_order_address_add',{
               arr:this.tableData,
               param:'import',
               customer_order_id:this.customer_order_id
           }).then(res => {
               if(res.data.code == 2000){
                   this.$emit('chuan','1');
               }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
               }
           })
       }
    },
    created(){
        this.axios.get("./api/map.json").then(res => {
            if(res.status == 200){
                let dt = res.data;
                for (var item in dt) {
                    if (item.match(/0000$/)) {//省
                        this.province.push({id: item, value: dt[item], children: []});
                    } else if (item.match(/00$/)) {//市
                        this.city.push({id: item, value: dt[item], children: []});
                    } else {//区
                        this.block.push({id: item, value: dt[item]});
                    }
                }
                // 分类市级
                for (var index in this.province) {
                    for (var index1 in this.city) {
                        if (this.province[index].id.slice(0, 2) === this.city[index1].id.slice(0, 2)) {
                            this.province[index].children.push(this.city[index1]);
                        }
                    }
                }
                // 分类区级
                for(var item1 in this.city) {
                    for(var item2 in this.block) {
                        if (this.block[item2].id.slice(0, 4) === this.city[item1].id.slice(0, 4)) {
                            this.city[item1].children.push(this.block[item2]);
                        }
                    }
                }
            }
        });
    }
    
}
</script>

<style lang="less" scoped>
.box{
    width: 100%;
    .content_box{
        margin-top: 20px;
    }
}
</style>
