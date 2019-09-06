<template>
    <div class="box">
        <el-card class="box-card" v-for="item in card" :key="item.id">
           
                <!-- <el-button style="float: right; padding: 3px 5px;" type="text" @click="deteles(item)" v-if="show == 1">删除</el-button>     -->
                <el-button style="float: right; padding: 3px 5px;" type="text" @click="see(item)">查看</el-button>
                
                <p style="width:100%;float:left;text-align: center;font-size:20px;margin-top: 20px;">
                    {{item.title}} 
                </p>
            
        </el-card>
        
        <el-card class="box-card" style="text-align:center; line-height: 180px;">
            <i @click="add" class="el-icon-plus" style="font-size:30px;" title="新增"></i>
        </el-card>
        
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            card:[
                {
                    id:1,
                }
            ],
            show:'',
        }
    },
    methods:{
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        add(){
            // let id = this.card[this.card.length -1];
            // let a = {id:id+1};
            // this.card.push(a);
            this.$router.push({ path:'/oa/Days/rule_edit/0'});
            let ins1 = {
                route: `/oa/Days/rule_edit/0`,
                name: "制度编辑",
            };
            let ins2 = `/oa/Days/rule_edit/0`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);  
        },
        getCard(){
            this.axios.get('/oa.Days/company_rule_select').then(res => {
                this.card = res.data.data;
                 this.show = res.data.guanliyuan;
            })
        },
        see(a){
           this.$router.push({ path:`/oa/Days/rule_edit/${a.id}`});
            let ins1 = {
                route: `/oa/Days/rule_edit/${a.id}`,
                name: "制度编辑",
            };
            let ins2 = `/oa/Days/rule_edit/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2); 
        },
        deteles(a){
            this.axios.post('/oa.Days/company_rule_delete',{
                id:a.id
            }).then(res => {
                if(res.data.code == 2000){
                    this.getCard();
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
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
        this.getCard();
    }
}
</script>

<style lang="less" scoped>
.box{
    overflow: hidden;
    .box-card {
        height: 200px;
        width: 23%;
        float: left;
        margin-left: 1.5%;
        margin-top: 10px;
       
    }
}
    
    
</style>
