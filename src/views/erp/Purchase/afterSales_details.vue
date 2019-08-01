<template>
    <div class="box">
        <div class="head_box_man">
            <h3>
                <span style="margin-left: 10px;">销售员：</span><span>{{ user }}</span> 
                <span style="margin-left: 40px;">备注：</span><span>{{ remarks }}</span> 
                <span style="margin-left: 40px;">金额：</span><span>{{ fee }}</span> 
            </h3>
        </div>
        <el-table :data="tableData">
            <el-table-column label="订单编号" prop="customer_order_id"></el-table-column>
            <el-table-column label="产品"  width="280px">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}{{ scope.row.sku_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品数量" prop="number"></el-table-column>
            <el-table-column label="采购价" prop="purchase_price"></el-table-column>
            <el-table-column label="供应商" prop="supplier_name"></el-table-column>
            <el-table-column label="收货人" prop="address_name"></el-table-column>
            <el-table-column label="收货地址" width="300px">
                <template slot-scope="scope">
                    <span>{{ scope.row.address_province }}{{ scope.row.address_city }}{{ scope.row.address_county }}{{ scope.row.address_address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="chuli(scope.row)">售后处理</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user:'',
            remarks:'',
            fee:'',
            tableData:[],
        }
    },
    methods:{
        gettableData(){
            // const loading = this.$loading({
            //     lock: true,
            //     text: '拼命加载中',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
            this.axios.get('/erp.Purchase/purchase_order_after_sales_find?id='+this.$route.params.id).then(res => {
                this.user = res.data.user.name;
                this.remarks = res.data.remarks;
                this.fee = res.data.fee;
                this.tableData = res.data.product_sku;
               // loading.close();
            })
        }
    },
    created(){
        this.gettableData();
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){
            
            }else{
                this.gettableData();
            }
        }
    }
}
</script>

