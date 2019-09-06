<template>
    <div class="box">
        <label>标题：</label><el-input :disabled="!show" v-model="title" style="width:90%;"></el-input>
        <el-divider content-position="center">KOVI</el-divider>
        <label>排序：</label><el-input v-model="sort" :disabled="!show"  type="Number" style="width:25%;"></el-input>
        <vue-ueditor-wrap v-model="msg" :config="myConfig" style="margin-top:10px;"></vue-ueditor-wrap>
        <el-button @click="comfile" v-show="show" style="margin-top:20px;">提交</el-button>
    </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import {mapActions} from 'vuex';
export default {
    components: {
        VueUeditorWrap
    },
    data () {
        return{
            show:Boolean,
            title:'',
            sort:'',
            msg:'',
            myConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 450,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                //serverUrl: 'http://35.201.165.105:8000/controller.php',
                // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                UEDITOR_HOME_URL: '/static/UEditor/'
            },
        }
    },
    methods:{
        ...mapActions("Tabs", ['triggerDeleteTabs']),
        comfile(){
            if(this.$route.params.id == 0){
                this.axios.post('/oa.Days/company_rule_add',{
                    title:this.title,
                    content:this.msg,
                    sort:this.sort,
                }).then(res => {
                    if(res.data.code == 2000){
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/oa/Days/company_rule_select" });
                    }
                })
            }else{
                this.axios.post('/oa.Days/company_rule_update',{
                    title:this.title,
                    content:this.msg,
                    sort:this.sort,
                    id:this.$route.params.id
                }).then(res => {
                    if(res.data.code == 2000){
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/oa/Days/company_rule_select" });
                    }
                })
            }
        },
        getshuju(a){
            this.axios.get('/oa.Days/company_rule_update?id='+a).then(res => {
                if(res.data.guanliyuan == 1){
                    this.show = true;
                }else{
                    this.show = false;
                }
                this.title = res.data.data.title
                this.sort = res.data.data.sort
                this.msg = res.data.data.content
                this.title = res.data.data.title
            })
        }    
    },
    activated(){
        if(this.$route.params.id != 0){
            this.$nextTick( () => {
                this.getshuju(this.$route.params.id);
            })
            console.log(this.myConfig)
        }else{
            this.title='';
            this.sort='';
            this.msg='';
        }
    }
}
</script>

<style lang="less" scoped>
.edui-editor-iframeholder{
    height: 500px;
}
</style>

