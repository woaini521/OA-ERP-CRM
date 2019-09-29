<template>
    <div class="box">
        <el-date-picker v-model="time" type="daterange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-input v-model="company" style="width:217px;margin-left:10px" placeholder="供应商"></el-input>
        <el-select v-model="zt" placeholder="状态" clearable style="width:150px;margin-left:10px">
            <el-option label="等待巴长审核" value="-1"></el-option>
            <el-option label="等待财务审核" value="0"></el-option>
            <el-option label="等待出纳打款" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
        </el-select>
        <el-input v-model="name" style="width:217px;margin-left:10px" placeholder="产品名称"></el-input>
        <el-button @click="seach" style="margin-left:20px">搜索</el-button>
        <el-table :data="data" class="kk" show-summary>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="备注" label-width="90px">
                            <span>{{ props.row.remarks }}</span>
                        </el-form-item>
                        <el-form-item label="添加时间" label-width="90px">
                            <span>{{ props.row.add_time }}</span>
                        </el-form-item>
                        <el-form-item label="是否含票" label-width="90px">
                            <span></span>
                        </el-form-item>
                        <el-form-item label="货款" label-width="90px">
                            <span v-if="props.row.status == 0">现款</span>
                            <span v-if="props.row.status == 3">未结算</span>
                            <span v-if="props.row.status == 6">已结算</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="编号" width="50px">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品名称" prop="name" width="200px">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span><br>
                    <span>{{ scope.row.add_time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购单价">
                <template slot-scope="scope">
                    <span>{{ (Number(scope.row.purchase_money) / Number(scope.row.purchase_number)).toFixed(4) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购数量">
                <template slot-scope="scope">
                    <span>{{ scope.row.purchase_number }}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购总价" prop="purchase_money"></el-table-column>
            <el-table-column label="实付总价" prop="prepayment"></el-table-column>
            <el-table-column label="供应商" prop="supplier_name" width="250px"></el-table-column>
            <el-table-column label="结算方式">
                <template slot-scope="scope">
                    <span>{{ scope.row.settlement == 1 ?'月结':'现结' }}</span><br>
                    <span>{{scope.row.invoice == 1 ? '含票' : '不含票'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == -1" style="color:red">等待巴长审核</span>
                    <span v-if="scope.row.status == 0">等待财务审核</span>
                    <span v-if="scope.row.status == 1">等待出纳打款</span>
                    <span v-if="scope.row.status == 2">审核通过</span>
                </template>
            </el-table-column>
            <el-table-column label="采购" prop="purchase_user_name"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="see(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            time:null,
            data:[],
            zt:'',
            name:'',
            company:'',
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        getData(a){
            this.axios.post('/erp.Purchase/purchase_product_lists',{
                start_time:a,
                end_time:a
            }).then(res => {
                this.data = res.data.purchase_product
            })
        },
       
        seach(){
            let a,b ;
            if(this.time == null){
                a='';
                b='';
            }else{
                a=this.time[0]/1000;
                b=this.time[1]/1000;
            }   
            this.axios.post('/erp.Purchase/purchase_product_lists',{
                    start_time:a,
                    end_time:b,
                    supplier_name:this.company,
                    status:this.zt,
                    name:this.name
                 }).then(res => {
                    this.data = res.data.purchase_product
                 })
            
        },
        see(a){
            this.triggerReplaceId(a.customer_order_id);
            this.$router.push({ path: `/erp/Purchase/seePurchase/${a.customer_order_id}`,params:{userId:a.customer_order_id,name:`/erp/Purchase/seePurchase/${a.customer_order_id}`}});
            let ins1 = {
                route: `/erp/Purchase/seePurchase/${a.customer_order_id}`,
                name: "采购查看",
                id: a.customer_order_id
            };
            let ins2 = `/erp/Purchase/seePurchase/${a.customer_order_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 默认时间
        change(t){
            if(t<10){
                return "0"+t;
            }else{
                return t;
            }
        },
        getTimestamp (mytime){
            let dateTmp = mytime.replace(/-/g,'/')
            return Date.parse(dateTmp)
        },
    },
    created(){
        let d=new Date();
        let year=d.getFullYear();
        let month=this.change(d.getMonth()+1);
        let day=this.change(d.getDate());
        let starttime = year+'-'+month+'-'+day;
        starttime = this.getTimestamp(starttime)/1000
        this.getData(starttime);
    }
}
</script>

<style lang="less">
.box{
    .kk{
        .demo-table-expand {
            font-size: 0;
        }
        
        .el-form-item__label{
            color: #99a9bf;
        }
        .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
        }
    }
    
}

</style>


