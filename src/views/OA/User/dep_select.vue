<template>
    <div class="box">
        <div class="head">
            <p style="font-weight:bold;" v-for="item in tableData" :key="item.id">{{item.title}}
            <p>
                <span v-for="item in tableData[0].user" :key="item.id" style="margin-left:10px;">
                    {{item.name}}
                </span>
            </p>
        </div>
        <div class="head" style="margin-top:10px">
            <p style="font-weight:bold;" v-for="item in tableData[0].child" :key="item.id">{{item.title}}</p>
            <p>
                <span v-for="item in tableData[0].child[0].user" :key="item.id" style="margin-left:10px;">
                    {{item.name}}
                </span>
                
            </p>
            <p style="font-weight:bold;margin-top:10px">总经理室</p>
            <p><span>副总 -- 周昆</span><span style="margin-left:10px">副总 -- 黄鹰翔</span></p>
        </div>
        <div class="head_er">
             <div class="lirui" v-for="items in bumen" :key="items.id">
                <p style="font-weight:bold;">{{ items.title }}</p>
                <template v-if="items.child != undefined">
                    <p v-for="itemb in items.user" :key="itemb.group_id">{{ itemb.name }} -- {{ itemb.role_name }}</p>    
                    <div class="liruiInner">
                        <div v-for="item in items.child" :key="item.id">
                            <p style="margin-bottom:10px;font-weight:bold;">{{item.title}}</p>
                            <p v-for="er in item.user" :key="er.group_id">{{er.name}}--{{er.role_name}}</p>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <p v-for="itemu in items.user" :key="itemu.group_id">{{ itemu.name }} -- {{ itemu.role_name }}</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
          tableData:[],
          bumen:[],
        }
    },
    methods:{
        // 获取数据
        gettableData(){
            this.axios.get('/oa.User/dep_select').then(res => {
                this.tableData = res.data;
                this.bumen = res.data[0].child[0].child;
            })
        },
    },
    created(){
        this.$nextTick(() => {
            this.gettableData();
        })
    }
}
</script>

<style lang="less" scoped>
.box{
    width: 2080px;
    text-align: center;
    .head{
        width: 200px;
        padding-bottom: 10px;
        margin: auto;
        border:1px solid #CCC;
    }
    .head_er{
        width: 2180px;
        margin: auto;
        margin-top: 20px;
        overflow: hidden;
        .lirui{ 
            margin-left: 10px;
            border:1px solid #CCC;
            float: left;
            padding: 10px 10px;
            .liruiInner{
               overflow: hidden;
               div{
                   float: left;
                    padding: 10px 10px;
                   border-right: 1px dashed #CCC; 
               }
            }
        }
    }
}
</style>
