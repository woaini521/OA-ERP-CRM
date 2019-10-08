<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box" style="min-width: 1150px;">
    <div class="head_box">
      <el-select v-model="state4" filterable placeholder="请输入公司关键词" @change="kehuName">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        v-model="kehuValue"
        @change="xzaddress"
        filterable
        placeholder="请选择客户名称"
        style="margin-left:10px;"
      >
        <el-option v-for="item in listKuhuName" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>

      <div class="riqi">
        <div class="xiaohou">
          <span>销售日期</span>
          <el-date-picker
            v-model="starttime"
            type="date"
            disabled
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="margin-left:20px;"
          ></el-date-picker>
        </div>
        <div class="fahuo">
          <span>收货日期</span>
          <el-date-picker
            v-model="endtime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="margin-left:20px;"
          ></el-date-picker>
        </div>
      </div>
      <div class="danxuan">
        <div class="danxuan1" style="float: left;">
          <el-radio v-model="radio" label="1">商品</el-radio>
          <el-radio v-model="radio" label="2">农产品</el-radio>
          <el-radio v-model="radio" label="3">服务</el-radio>
        </div>
        <div class="danxuan1" style="margin-left: 100px;float: left;">
          <el-radio v-model="class_id" label="1">传统</el-radio>
          <el-radio v-model="class_id" label="2">线上</el-radio>
          <el-radio v-model="class_id" label="3">京东</el-radio>
          <el-radio v-model="class_id" label="4">国美</el-radio>
          <el-radio v-model="class_id" label="5">负数订单</el-radio>
        </div>
        <br />

        <div class="beizhu" style="overflow: hidden;margin-top:20px;">
          <label>补开票费用:</label>
          <el-input v-model="repair_invoice" style="width:217px;margin-right:30px"></el-input>
          <label>补运费费用:</label>
          <el-input v-model="repair_freight" style="width:217px;"></el-input>
          <br />
          <span style="float: left;line-height: 40px;margin-right: 10px;margin-top:10px">备注</span>
          <el-input style="float: left;width:90%;margin-top:10px" v-model="remarks"></el-input>
        </div>
        <br />
        <div class="danxuan2">
          <h4>发票信息</h4>
          <el-radio
            v-model="piao"
            v-for="(item,index) in InvoiceType[Number(radio)-1]"
            :key="index"
            :label="item.id"
          >{{item.name}}{{item.type}}{{item.percentile}}</el-radio>
        </div>
      </div>
    </div>

    <div class="content_box_product">
      <el-button @click="addOrder" v-if="class_id != 5">添加产品</el-button>
      <el-button @click="dialogFushu = true" v-else>同步产品</el-button>
      <el-table
        :data="tableData"
        show-summary
        style="width: 100%;margin-top:20px"
        v-loading="loading"
      >
        <el-table-column label="图片" width="100">
          <template slot-scope="scope">
            <img style="width: 90px; height: 90px" :src="scope.row.src" />
          </template>
        </el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80"></el-table-column>
        <el-table-column label="数量" width="100">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-show="edit[scope.$index] == true"
              v-model="scope.row.number"
              :value="scope.row.number"
            ></el-input>
            <span v-show="edit[scope.$index] == false">{{scope.row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.cost_price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-show="edit[scope.$index] == true"
              v-model="scope.row.selling_price"
              :value="scope.row.selling_price"
            ></el-input>
            <span v-show="edit[scope.$index] == false">{{scope.row.selling_price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总价" width="80" prop="total_price">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.selling_price) * Number(scope.row.number) | keepTowNum}}</span>
          </template>
        </el-table-column>

        <el-table-column label="额外提成" width="110" v-if="class_id != 5">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="click"
              v-show="edit[scope.$index] == true"
            >
              <el-table :data="scope.row.commission">
                <el-table-column property="user_name" label="业务员"></el-table-column>
                <el-table-column property="ratio" label="提成系数"></el-table-column>
                <el-table-column label="修改" width="150">
                  <template slot-scope="scopes">
                    <!-- <el-button type="danger" @click.native="editRoyalty(scopes.row)" size="mini">修改</el-button> -->
                    <el-button
                      type="warning"
                      @click.native="deleteRoyalty(scopes.row)"
                      size="mini"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button slot="reference" type="text" size="mini">查看</el-button>
            </el-popover>
            <el-button
              v-show="edit[scope.$index] == true"
              type="primary"
              size="mini"
              style="margin-left:5px;"
              @click="addRoyalty(scope.row)"
            >添加</el-button>
            <span v-show="edit[scope.$index] == false">{{scope.row.commission_price}}</span>
          </template>
        </el-table-column>

        <el-table-column label="预计利润">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.total_price)-Number(scope.row.user_price) - Number(scope.row.total_cost_price) | keepTowNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-show="edit[scope.$index] == true "
              v-model="scope.row.remarks"
              :value="scope.row.remarks"
            ></el-input>
            <span v-show="edit[scope.$index] == false">{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="warning"
              v-show="edit[scope.$index] == false"
              size="mini"
              @click="Editors(scope.$index)"
            >编辑</el-button>
            <el-button
              type="success"
              v-show="edit[scope.$index] == true"
              size="mini"
              @click="updata(scope.row,scope.$index)"
            >完成</el-button>
            <el-button type="danger" size="mini" @click="deletep(scope.row)" v-if="class_id != 5">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="产品库选择" :visible.sync="product" width="65%">
      <el-input
        placeholder="名称搜索"
        v-model="tableProductValue"
        style="width:30%;"
        @keyup.enter.native="tableProductSeach"
      ></el-input>
      <el-button style="margin-left:5%" @click="tableProductSeach">筛选</el-button>
      <el-table :data="tableProduct" style="width: 100%;margin-top:20px">
        <el-table-column label="产品图片">
          <template slot-scope="scope">
            <img :src="scope.row.src" style="width:100px;height:100px;" />
          </template>
        </el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}{{scope.row.sku_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="cost_price" label="成本"></el-table-column>
        <el-table-column prop="selling_price" label="售价"></el-table-column>
        <el-table-column prop="supplier_inventory_sum" label="库存"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.native="add(scope.row)" size="small">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="per_page"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="提成添加修改" :visible.sync="Royalty">
      <el-form :data="formRoyalty">
        <el-form-item label="业务员" label-width="100px">
          <el-select
            v-model="formRoyalty.name"
            filterable
            clearable
            placeholder="请选择"
            style="width:300px;"
            @change="pickRatio"
          >
            <el-option
              v-for="item in optionsSalesman"
              :key="item.user_id"
              :label="`${item.dep_title}${item.role_name}${item.name}`"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提成系数" label-width="100px">
          <el-input v-model="formRoyalty.xishu" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="xianRoyalty">
        <el-table-column property="user_name" label="参与人员"></el-table-column>
        <el-table-column property="ratio" label="提成系数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scopes">
            <el-button type="warning" @click.native="deleteRoyalty(scopes.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Royalty = false">取 消</el-button>
        <el-button type="primary" @click="pushRoyalty">确 定</el-button>
      </div>
    </el-dialog>
    <div class="content_box_address" v-if="class_id != 5">
      <div class="content_box_address_left">
        <div class="content_box_address_head">
          <el-button @click="changeAddress">选择地址</el-button>
          <el-button type="success" @click="dialogExcel = true" style="margin-left:20px;">上传文件</el-button>
        </div>
        <el-form ref="formAddress" :model="formAddress" inline>
          <el-form-item>
            <el-input v-model="formAddress.name" style="width:100px;" placeholder="名字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formAddress.phone" placeholder="电话" style="width:140px;"></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-select v-model="formAddress.payment" placeholder="付款方式" style="width:140px;">
              <el-option label="到付" value="1"></el-option>
              <el-option label="现付" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formAddress.delivery" placeholder="物流方式" style="width:140px;">
              <el-option label="到楼下" value="1"></el-option>
              <el-option label="上楼" value="2"></el-option>
              <el-option label="自提" value="3"></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item>
            <el-select
              v-model="sheng"
              @change="choseProvince"
              filterable
              placeholder="省级地区"
              style="width:140px;"
            >
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="shi"
              @change="choseCity"
              filterable
              placeholder="市级地区"
              style="width:140px;"
            >
              <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="qu"
              @change="choseBlock"
              filterable
              clearable
              placeholder="区级地区"
              style="width:140px;"
            >
              <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item>
            <el-input placeholder="具体地址" v-model="formAddress.address" style="width:590px"></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="tijiao">保存地址配货信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_box_address_right">
        <h4>配货数量填写</h4>
        <div
          class="content_box_address_right_inner"
          v-for="item in distributeProduct"
          :key="item.id"
        >
          <p
            style="float:left;width:90px;height:40px;line-height:40px;"
          >{{item.name}}{{item.sku_name}}</p>
          <el-input style="float:left;width:100px;" v-model="item.number"></el-input>
        </div>
      </div>
    </div>
    <el-dialog title="地址选择" :visible.sync="address">
      <div class="ChoiceAddress" style="height:400px;overflow-y: scroll;">
        <div class="ChoiceAddressInner" v-for="item in ChoiceAddress" :key="item.id">
          <div class="ChoiceAddressInnerLeft">
            <p>收货人：{{item.name}} 收货电话：{{item.phone}}</p>
            <p>
              <span>{{item.province}}</span>
              <span style="margin-left:10px">{{item.city}}</span>
              <span style="margin-left:10px">{{item.county}}</span>
              <span style="margin-left:10px">{{item.address}}</span>
            </p>
          </div>
          <div class="ChoiceAddressInnerRight">
            <el-button size="small" type="primary" @click="addAddress(item)">选择</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <div class="generatedAddress" v-if="class_id != 5">
      <label>地址配货信息</label>
      <hr />
      <div class="generatedAddressInner" v-for="item in fixedAddress" :key="item.id">
        <div class="generatedAddressInnerLeft">
          <p>
            <span>收货人：{{item.name}}</span>
            <span style="margin-left:20px;">收货电话：{{item.phone}}</span>
            <span style="margin-left:60px;">付款方式:{{ item.payment == 1 ? '到付' : '现付'}}</span>
            <span v-if="item.delivery==1" style="margin-left:20px;">物流方式:到楼下</span>
            <span v-if="item.delivery==2" style="margin-left:20px;">物流方式:上楼</span>
            <span v-if="item.delivery==3" style="margin-left:20px;">物流方式:自提</span>
          </p>
          <p style="margin-top:10px">
            <span>{{item.province}}</span>
            <span style="margin-left:20px;">{{item.city}}</span>
            <span style="margin-left:20px;">{{item.county}}</span>
            <span style="margin-left:20px;">{{item.address}}</span>
          </p>
          <p style="margin-top:10px">
            发货清单：
            <span
              style="margin-left:10px;"
              v-for="pcu in item.product"
              :key="pcu.pid"
            >{{pcu.name}}{{pcu.sku_name}}---数量：{{pcu.number}}</span>
          </p>
        </div>
        <div class="generatedAddressInnerRight">
          <el-button type="primary" @click="generatedAddressgengxin(item)">更新</el-button>
          <br />
          <el-button
            type="danger"
            @click="generatedAddressshanchu(item)"
            style="margin-top:10px;"
          >删除</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="更新地址配货信息" :visible.sync="gengxinfixedAddress" width="65%">
      <el-form :model="fixedAddressform" inline>
        <el-form-item label="姓名">
          <el-input v-model="fixedAddressform.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="fixedAddressform.phone"></el-input>
        </el-form-item>
        <el-form-item label="物流">
          <el-input v-model="fixedAddressform.wuliu"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="省">
          <el-input v-model="fixedAddressform.sheng"></el-input>
        </el-form-item>
        <el-form-item label="市">
          <el-input v-model="fixedAddressform.shi"></el-input>
        </el-form-item>
        <el-form-item label="区">
          <el-input v-model="fixedAddressform.qu"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="具体地址">
          <el-input v-model="fixedAddressform.address" style="width:260%"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div
          class="content_box_address_right_inner"
          v-for="item in distributeProduct1"
          :key="item.product_sku_id"
        >
          <p
            style="float:left;width:90px;height:40px;line-height:40px;"
          >{{item.name}}{{item.sku_name}}</p>
          <el-input style="float:left;width:100px;" v-model="item.number"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gengxinfixedAddress = false">取 消</el-button>
        <el-button type="primary" @click="pushgengxinfixedAddress">确 定</el-button>
      </div>
    </el-dialog>

    <div class="contract" v-if="class_id != 5">
      <label>上传合同</label>
      <div class="contractInner">
        <div class="contractInnerLeft">
          <el-upload
            class="avatar-uploader"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            action="/file/customer_order_img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="img" v-show="imageUrlstate">
          <div class="imginner" v-for="item in imageUrl" :key="item.src">
            <img :src="item.src" class="avatar" />
            <div class="avatars">
              <i
                @click="deleteimg(item.src)"
                style="font-size: 30px;margin-top: 75px;margin-left: 75px;color:#FFF;"
                class="el-icon-delete"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提交数据 页面清空 -->
    <el-button type="primary" style="margin-bottom:20px;margin-top:10px;" @click="confirm">确认提交</el-button>

    <el-dialog title="文件" :visible.sync="dialogExcel" width="1000px">
      <excel
        :distributeProduct="distributeProduct"
        :customer_order_id="customer_order_id"
        v-on:chuan="getchildmsg"
      ></excel>
    </el-dialog>

    <el-dialog title="负数产品同步" :visible.sync="dialogFushu" width="30%">
      <el-form :model="dialogFushuForm">
        <el-form-item label="关联订单编号" label-width="100px">
          <el-input v-model="dialogFushuForm.id"></el-input>
        </el-form-item>
        <el-form-item label=" " label-width="100px">
          <el-button @click="fushuBtn">同步</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import excel from "@/components/excel";

export default {
  components: {
    excel
  },
  data() {
    return {
      InvoiceType: [
        [
          {
            id: "a1",
            type: "专票",
            name: "湖南可为文化传播有限公司",
            percentile: "13%"
          },
          {
            id: "a2",
            type: "专票",
            name: "湖南润家润科技有限公司",
            percentile: "13%"
          },
          {
            id: "a3",
            type: "专票",
            name: "长沙市芙蓉区日升文化用品商行",
            percentile: "3%"
          },
          {
            id: "a4",
            type: "专票",
            name: "长沙吾福田信息咨询合伙企业（有限合伙）",
            percentile: "3%"
          },
          {
            id: "a5",
            type: "普票",
            name: "湖南可为文化传播有限公司",
            percentile: "13%"
          },
          {
            id: "a6",
            type: "普票",
            name: "湖南润家润科技有限公司",
            percentile: "13%"
          },
          {
            id: "a7",
            type: "普票",
            name: "长沙市芙蓉区日升文化用品商行",
            percentile: "3%"
          },
          {
            id: "a8",
            type: "普票",
            name: "长沙吾福田信息咨询合伙企业（有限合伙）",
            percentile: "3%"
          },
          {
            id: "a9",
            type: "其他",
            name: "",
            percentile: "0%"
          }
        ],
        [
          {
            id: "b1",
            type: "专票",
            name: "湖南可为文化传播有限公司",
            percentile: "9%"
          },
          {
            id: "b2",
            type: "专票",
            name: "湖南润家润科技有限公司",
            percentile: "9%"
          },
          {
            id: "b3",
            type: "普票",
            name: "湖南可为文化传播有限公司",
            percentile: "9%"
          },
          {
            id: "b4",
            type: "普票",
            name: "湖南润家润科技有限公司",
            percentile: "9%"
          },
          {
            id: "b5",
            type: "其他",
            name: "",
            percentile: "0%"
          }
        ],
        [
          {
            id: "c1",
            type: "专票",
            name: "湖南可为文化传播有限公司",
            percentile: "6%"
          },
          {
            id: "c2",
            type: "专票",
            name: "湖南润家润科技有限公司",
            percentile: "6%"
          },
          {
            id: "c3",
            type: "专票",
            name: "长沙市芙蓉区日升文化用品商行",
            percentile: "3%"
          },
          {
            id: "c4",
            type: "专票",
            name: "长沙吾福田信息咨询合伙企业（有限合伙）",
            percentile: "3%"
          },
          {
            id: "c5",
            type: "普票",
            name: "湖南可为文化传播有限公司",
            percentile: "6%"
          },
          {
            id: "c6",
            type: "普票",
            name: "湖南润家润科技有限公司",
            percentile: "6%"
          },
          {
            id: "c7",
            type: "普票",
            name: "长沙市芙蓉区日升文化用品商行",
            percentile: "3%"
          },
          {
            id: "c8",
            type: "普票",
            name: "长沙吾福田信息咨询合伙企业（有限合伙）",
            percentile: "3%"
          },
          {
            id: "c9",
            type: "其他",
            name: "",
            percentile: "0%"
          }
        ]
      ],
      // 客户公司数据
      options: [],
      //  提交第一次数据  获取id值
      state4: "",
      kehuValue: "",
      starttime: "",
      endtime: "",
      radio: "1",
      piao: "",
      class_id: "1",
      repair_invoice: "",
      repair_freight: "",
      remarks: "", //订单备注

      // 产品数据
      tableProduct: [],
      loading: false, //加载
      currentPage: 0, //当前页
      total: 0, //总数
      per_page: 0, //每页多少条
      last_page: 0, //总页数
      product: false, // 产品弹窗
      tableProductValue: "", //筛选产品的关键字
      Royalty: false, //提成弹窗
      // 订单产品数据
      customer_order_id: "", //订单id
      tableData: [],

      // 订单产品编辑
      edit: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      // 业务提成
      formRoyalty: {
        name: "",
        bumen: "",
        xishu: "",
        product_sku_id: "",
        id: ""
      },
      xianRoyalty: [], //提成显示数据

      // 获取业务员数据
      optionsSalesman: [],

      address: false, // 选择地址弹窗

      // 地址表单
      formAddress: {
        name: "",
        phone: "",
        sheng: "",
        shi: "",
        qu: "",
        payment: "",
        delivery: "",
        address: "",
        id: ""
      },
      province: "",
      city: "",
      block: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],

      // 弹窗地址列表
      ChoiceAddress: [],

      distributeProduct: [],

      fixedAddress: [],
      fixedAddressform: {
        id: null,
        name: "",
        phone: "",
        wuliu: "",
        sheng: "",
        shi: "",
        qu: "",
        address: "",
        customer_address_id: ""
      },
      distributeProduct1: [],

      addressProduct: [],
      gengxinfixedAddress: false,
      loading: false,
      list: [],
      listKuhuName: [],

      // 合同图片存储
      imageUrl: [],
      imageUrlType: [],
      imageUrlstate: false,

      dialogExcel: false, //文件弹窗

      ID: "",

      dialogFushu: false,
      dialogFushuForm: {
        id: ""
      }
    };
  },
  filters: {
    keepTowNum: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  methods: {
    getoptions() {
      this.axios.get("/crm.Customer/company_list").then(res => {
        // this.qiye = res.data.company;
        let Customercompany = res.data.company;
        for (let i = 0; i < Customercompany.length; i++) {
          let ins = {
            name: `└${Customercompany[i].name}`,
            id: Customercompany[i].id
          };
          this.options.push(ins);
          if (Customercompany[i].hasOwnProperty("child")) {
            for (let z = 0; z < Customercompany[i].child.length; z++) {
              let ins1 = {
                name: `└└${Customercompany[i].child[z].name}`,
                id: Customercompany[i].child[z].id
              };
              this.options.push(ins1);
              if (Customercompany[i].child[z].hasOwnProperty("child")) {
                for (
                  let y = 0;
                  y < Customercompany[i].child[z].child.length;
                  y++
                ) {
                  let ins2 = {
                    name: `└└└${Customercompany[i].child[z].child[y].name}`,
                    id: Customercompany[i].child[z].child[y].id
                  };
                  this.options.push(ins2);
                  if (
                    Customercompany[i].child[z].child[y].hasOwnProperty("child")
                  ) {
                    for (
                      let e = 0;
                      e < Customercompany[i].child[z].child.length;
                      e++
                    ) {
                      if (
                        Customercompany[i].child[z].child[y].child[e] ==
                        undefined
                      ) {
                      } else {
                        let ins3 = {
                          name: `└└└└${Customercompany[i].child[z].child[y].child[e].name}`,
                          id: Customercompany[i].child[z].child[y].child[e].id
                        };
                        this.options.push(ins3);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // console.log(this.Customercompany);
      });
    },
    // 客户匹配
    kehuName: function(value) {
      //console.log(value);
      let self = this;
      self.axios
        .post("/crm.Customer/customer_select", {
          company_id: value
        })
        .then(res => {
          //console.log(res.data);
          if (res.data.customer.length == 0) {
            self.kehuValue = "";
          }
          self.listKuhuName = res.data.customer;

          //console.log(self.listKuhuName);
        });
    },
    // 选择客户后 显示地址
    xzaddress(value) {
      // console.log(value);
      this.listKuhuName.filter(item => {
        if (item.id == value) {
          this.sheng = item.province;
          this.shi = item.city;
          this.qu = item.county;
          this.formAddress.address = item.address;
          this.formAddress.name = item.name;
          this.formAddress.phone = item.working_phone;
          this.formAddress.sheng = item.province;
          this.formAddress.shi = item.city;
          this.formAddress.qu = item.county;
          this.formAddress.id = item.company_id;
        }
      });
    },

    // 生成订单客户信息
    addOrder() {
      if (this.customer_order_id == "") {
        if (
          this.state4 == "" ||
          this.starttime == "" ||
          this.kehuValue == "" ||
          this.piao == ""
        ) {
          this.open("请把客户信息下单时间类型勾选完整", "error");
        } else {
          this.PostaddOrder();
        }
      } else {
        this.getProduct(); // 获取产品列表
        this.getChoiceAddress(this.kehuValue); // 获取客户地址
        this.product = true;
      }
    },
    // 生成客户订单请求  获取customer_order_id
    PostaddOrder() {
      let shu;
      this.InvoiceType[0].filter(item => {
        if (item.id == this.piao) {
          shu = item;
        }
      });
      this.InvoiceType[1].filter(item => {
        if (item.id == this.piao) {
          shu = item;
        }
      });
      this.InvoiceType[2].filter(item => {
        if (item.id == this.piao) {
          shu = item;
        }
      });
      this.axios
        .post("/crm.Order/order_add", {
          customer_id: this.kehuValue,
          sales_time: this.starttime,
          delivery_time: this.endtime,
          type_id: this.radio,
          invoice_name: shu.name,
          invoice_type: shu.type,
          invoice_tax: shu.percentile.substring(0, shu.percentile.length - 1),
          class_id: this.class_id,
          remarks: this.remarks,
          repair_invoice: this.repair_invoice,
          repair_freight: this.repair_freight
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.getProduct(); // 获取产品列表
            this.getChoiceAddress(this.kehuValue); // 获取客户地址
            this.customer_order_id = res.data.id;
            this.product = true;
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },

    // 获取产品库
    getProduct() {
      this.axios.get("/erp.product/product_sku_select").then(res => {
        this.tableProduct = res.data.product.data;
        this.currentPage = res.data.product.current_page;
        this.total = res.data.product.total;
        this.per_page = res.data.product.per_page;
        this.last_page = res.data.product.last_page;
      });
    },
    //产品库分页
    handleCurrentChange(val) {
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.axios
        .post("/erp.product/product_sku_select", {
          page: val,
          name: this.tableProductValue
        })
        .then(res => {
          this.tableProduct = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
          loading.close();
        });
    },
    // 负数订单同步
    fushuBtn() {
      if (this.piao == "") {
        this.open("请确认都已经勾选！", "error");
      } else {
        let shu;
        this.InvoiceType[0].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.InvoiceType[1].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.InvoiceType[2].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.axios
          .post("/crm.Order/order_add", {
            customer_id: this.kehuValue,
            sales_time: this.starttime,
            delivery_time: this.endtime,
            type_id: this.radio,
            invoice_name: shu.name,
            invoice_type: shu.type,
            invoice_tax: shu.percentile.substring(0, shu.percentile.length - 1),
            class_id: this.class_id,
            remarks: this.remarks,
            repair_invoice: this.repair_invoice,
            repair_freight: this.repair_freight,
            pid: this.dialogFushuForm.id
          })
          .then(res => {
            if (res.data.code == 2000) {
              this.gettableData(res.data.id);
              this.gettableData1(res.data.id);
              this.customer_order_id = res.data.id;
              this.dialogFushu = false;
              this.open(res.data.msg, "success");
            } else {
              this.open(res.data.msg, "error");
            }
          });
      }
    },

    // 产品进行筛选
    tableProductSeach() {
      this.axios
        .post("/erp.product/product_sku_select", {
          name: this.tableProductValue
        })
        .then(res => {
          this.tableProduct = res.data.product.data;
          this.currentPage = res.data.product.current_page;
          this.total = res.data.product.total;
          this.per_page = res.data.product.per_page;
          this.last_page = res.data.product.last_page;
        });
    },

    // 产品添加到订单中
    add(a) {
      this.axios
        .post("/crm.Order/customer_order_product_sku_add", {
          customer_order_id: this.customer_order_id,
          product_sku_id: a.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.gettableData(this.customer_order_id);
            this.gettableData1(this.customer_order_id);
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },

    // 获取生成的产品订单
    gettableData(a) {
      this.axios
        .get(
          "/crm.Order/customer_order_product_sku_select?customer_order_id=" + a
        )
        .then(res => {
          this.tableData = res.data.product_sku;
          if (this.ID != "") {
            res.data.product_sku.filter(item => {
              if (item.id == this.ID) {
                this.xianRoyalty = item.commission;
              }
            });
          }
        });
    },
    gettableData1(a) {
      this.axios
        .get(
          "/crm.Order/customer_order_product_sku_select?customer_order_id=" + a
        )
        .then(res => {
          this.distributeProduct = res.data.product_sku;
        });
    },
    // Editors 编辑按钮
    Editors(a) {
      //console.log(a);
      this.loading = true;
      this.edit[a] = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
      this.getcaogao();
    },
    // 更新产品订单数据数据
    updata(a, b) {
      if (a.number == "") {
        this.open("数量不能为空", "error");
      } else if (a.selling_price == "") {
        this.open("单价不能为空", "error");
      } else {
        this.axios
          .post("/crm.Order/customer_order_product_sku_update", {
            id: a.id,
            number: a.number,
            unit_price: a.unit_price,
            selling_price: a.selling_price,
            remarks: a.remarks
          })
          .then(res => {
            if (res.data.code == 2000) {
              this.edit[b] = false;
              this.open(res.data.msg, "success");
              this.gettableData(this.customer_order_id);
              this.gettableData1(this.customer_order_id);
            } else {
              this.open(res.data.msg, "error");
            }
          });
      }
    },
    // 删除产品订单
    deletep(a) {
      this.axios
        .post("/crm.Order/customer_order_product_sku_delete", {
          id: a.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.gettableData(this.customer_order_id);
            this.gettableData1(this.customer_order_id);
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },
    // 提成添加按钮
    addRoyalty(a) {
      this.formRoyalty.name = "";
      this.formRoyalty.xishu = "";
      this.formRoyalty.id = "";
      this.formRoyalty.product_sku_id = a.id;
      this.xianRoyalty = a.commission;
      this.ID = a.id;
      this.Royalty = true;
    },

    // 提成删除按钮
    deleteRoyalty(a) {
      this.axios
        .post("/crm.Order/customer_order_commission_delete", {
          id: a.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.gettableData(this.customer_order_id);
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },

    // getoptionsSalesman(){
    //   this.axios.get('/oa.user/user_select').then(res => {
    //     this.optionsSalesman = res.data;
    //   })
    // },

    // 提成系数 赋值
    pickRatio(val) {
      let obj = {};
      obj = this.optionsSalesman.find(item => {
        return item.user_id === val;
      });
      this.formRoyalty.xishu = obj.ratio;
    },

    // 提交 提成
    pushRoyalty() {
      this.axios
        .post("/crm.Order/customer_order_commission_add", {
          customer_order_product_id: this.formRoyalty.product_sku_id,
          user_id: this.formRoyalty.name,
          ratio: "0",
          profit: "",
          customer_order_id: this.customer_order_id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.gettableData(this.customer_order_id);
          } else {
            this.open(res.data.msg, "error");
          }
        });
      this.formRoyalty.name = "";
      this.formRoyalty.xishu = "";
    },
    changeAddress() {
      this.address = true;
      this.getChoiceAddress(this.kehuValue);
    },
    // 获取客户收货地址
    getChoiceAddress(a) {
      this.axios
        .get("/crm.Customer/customer_address_list?id=" + a)
        .then(res => {
          this.ChoiceAddress = res.data.customer_address;
        });
    },
    // 选择客户地址
    addAddress(a) {
      this.sheng = a.province;
      this.shi = a.city;
      this.qu = a.county;
      this.formAddress.address = a.address;
      this.formAddress.name = a.name;
      this.formAddress.phone = a.phone;
      this.formAddress.sheng = a.province;
      this.formAddress.shi = a.city;
      this.formAddress.qu = a.county;
      this.formAddress.id = a.id;
      this.address = false;
    },
    // post地址和配货信息
    tijiao() {
      if (this.formAddress.id == "") {
        if (
          this.formAddress.address == "" ||
          this.formAddress.name == "" ||
          this.formAddress.phone == "" ||
          this.formAddress.sheng == "" ||
          this.formAddress.shi == "" ||
          this.formAddress.payment == "" ||
          this.formAddress.delivery == ""
        ) {
          this.open("请填写完整客户收货地址", "error");
        } else {
          this.axios
            .post("/crm.Customer/customer_address_add", {
              customer_id: this.kehuValue,
              name: this.formAddress.name,
              phone: this.formAddress.phone,
              province: this.formAddress.sheng,
              city: this.formAddress.shi,
              county: this.formAddress.qu,
              address: this.formAddress.address,
              payment: this.formAddress.payment,
              delivery: this.formAddress.delivery
            })
            .then(res => {
              if (res.data.code == 2000) {
                this.posttijiao(res.data.id);
              } else {
                this.open(res.data.msg, "error");
              }
            });
        }
      } else {
        this.posttijiao(this.formAddress.id);
      }
    },
    // post地址 配货信息
    posttijiao(id) {
      if (
        this.formAddress.address == "" ||
        this.formAddress.name == "" ||
        this.formAddress.phone == "" ||
        this.formAddress.sheng == "" ||
        this.formAddress.shi == "" ||
        this.formAddress.payment == "" ||
        this.formAddress.delivery == ""
      ) {
        this.open("请填写完整客户收货地址", "error");
      } else {
        let fenpei = [];
        for (let i = 0; i < this.distributeProduct.length; i++) {
          let P = {
            number: this.distributeProduct[i].number,
            customer_order_product_sku_id: this.distributeProduct[i].id
          };
          fenpei.push(P);
        }
        if (fenpei[0].number == "") {
          this.open("配货数量不能为空");
        } else {
          this.axios
            .post("/crm.Order/customer_order_address_add", {
              customer_order_id: this.customer_order_id,
              customer_address_id: id,
              name: this.formAddress.name,
              phone: this.formAddress.phone,
              province: this.formAddress.sheng,
              city: this.formAddress.shi,
              county: this.formAddress.qu,
              address: this.formAddress.address,
              payment: this.formAddress.payment,
              delivery: this.formAddress.delivery,
              product: fenpei
            })
            .then(res => {
              if (res.data.code == 2000) {
                this.open(res.data.msg, "success");
                this.formAddress.address = "";
                this.formAddress.name = "";
                this.formAddress.phone = "";
                this.formAddress.sheng = "";
                this.formAddress.shi = "";
                this.formAddress.qu = "";
                this.formAddress.payment = "";
                this.formAddress.delivery = "";
                this.formAddress.id = "";
                this.sheng = "";
                this.shi = "";
                this.qu = "";
                fenpei = [];
                this.getfixedAddress();
                this.getChoiceAddress(kehuValue);
              } else {
                this.open(res.data.msg, "error");
              }
            });
        }
      }
    },

    // 已经生成的地址和配货信息操作
    getfixedAddress() {
      this.axios
        .get(
          "/crm.Order/customer_order_address_select?customer_order_id=" +
            this.customer_order_id
        )
        .then(res => {
          this.fixedAddress = res.data.address;
        });
    },

    generatedAddressgengxin(a) {
      this.gengxinfixedAddress = true;
      (this.fixedAddressform.id = a.id), (this.fixedAddressform.name = a.name);
      this.fixedAddressform.phone = a.phone;
      this.fixedAddressform.wuliu = a.type;
      this.fixedAddressform.sheng = a.province;
      this.fixedAddressform.shi = a.city;
      this.fixedAddressform.qu = a.county;
      this.fixedAddressform.address = a.address;
      this.fixedAddressform.customer_address_id = a.customer_address_id;
      this.distributeProduct1 = a.product;
    },
    // 提交跟新
    pushgengxinfixedAddress() {
      let fenpei = [];
      for (let i = 0; i < this.distributeProduct1.length; i++) {
        let P = {
          number: this.distributeProduct1[i].number,
          customer_order_product_sku_id: this.distributeProduct1[i]
            .customer_order_product_sku_id
        };
        fenpei.push(P);
      }
      this.axios
        .post("/crm.Order/customer_order_address_update", {
          id: this.fixedAddressform.id,
          customer_order_id: this.customer_order_id,
          customer_address_id: this.fixedAddressform.customer_address_id,
          name: this.fixedAddressform.name,
          phone: this.fixedAddressform.phone,
          province: this.fixedAddressform.sheng,
          city: this.fixedAddressform.shi,
          county: this.fixedAddressform.qu,
          address: this.fixedAddressform.address,
          type: this.fixedAddressform.wuliu,
          product: fenpei
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.getfixedAddress();
            this.gengxinfixedAddress = false;
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },
    // 删除已经生成的地址和配货信息
    generatedAddressshanchu(a) {
      this.axios
        .post("/crm.Order/customer_order_address_delete", {
          id: a.id
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.open(res.data.msg, "success");
            this.getfixedAddress();
          } else {
            this.open(res.data.msg, "error");
          }
        });
    },

    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      that.axios.get("./api/map.json").then(function(response) {
        if (response.status == 200) {
          var data = response.data;
          that.province = [];
          that.city = [];
          that.block = [];
          // 省市区数据分类
          for (var item in data) {
            if (item.match(/0000$/)) {
              //省
              that.province.push({ id: item, value: data[item], children: [] });
            } else if (item.match(/00$/)) {
              //市
              that.city.push({ id: item, value: data[item], children: [] });
            } else {
              //区
              that.block.push({ id: item, value: data[item] });
            }
          }
          // 分类市级
          for (var index in that.province) {
            for (var index1 in that.city) {
              if (
                that.province[index].id.slice(0, 2) ===
                that.city[index1].id.slice(0, 2)
              ) {
                that.province[index].children.push(that.city[index1]);
              }
            }
          }
          // 分类区级
          for (var item1 in that.city) {
            for (var item2 in that.block) {
              if (
                that.block[item2].id.slice(0, 4) ===
                that.city[item1].id.slice(0, 4)
              ) {
                that.city[item1].children.push(that.block[item2]);
              }
            }
          }
        } else {
          //console.log(response.status)
        }
      });
      // .catch(function(error){console.log(typeof+ error)})
    },
    // 省
    choseProvince: function(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          // console.log(this.province[index2].id)//你选择的省级编码
          //console.log(this.province[index2].value)//省级编码 对应的汉字
          this.shi1 = this.province[index2].children;
          // this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          // this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].value;
          this.formAddress.sheng = this.province[index2].value;
          this.formAddress.shi = this.province[index2].children[0].value;
          this.formAddress.qu = this.province[
            index2
          ].children[0].children[0].value;
          //console.log(this.form.sheng);
          //console.log(this.form.shi);
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          //console.log(this.form.shi)
          if (this.city[index3].children.length == 0) {
            this.formAddress.qu = " ";
            this.qu = "";
            this.qu1 = [];
          } else {
            this.qu1 = this.city[index3].children;
            // this.qu = this.city[index3].children[0].value;
          }
          this.formAddress.shi = this.city[index3].value;
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      if (e == "") {
        this.formAddress.qu = "";
      } else {
        for (var index4 in this.block) {
          if (e === this.block[index4].id) {
            this.formAddress.qu = this.block[index4].value;
            //console.log(this.form.qu)
          }
        }
      }
    },
    // 合同上传
    handleAvatarSuccess(response, file, fileList) {
      //let url = res.src;
      //this.imageUrl.push(url);
      if (response.code == 2000) {
        this.getimgUrl(this.customer_order_id);
      } else {
        this.open(response.msg, "error");
      }
    },
    handleAvatarError(err, file, fileList) {
      this.open(err, "error");
    },
    beforeAvatarUpload(file) {
      let type = file.type;
      this.imageUrlType.push(type);
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片必须是JPG/PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 获取合同图片
    getimgUrl(a) {
      this.axios
        .get(
          "/crm.Order/customer_order_file_select?id=" +
            a +
            "&class=customer_order"
        )
        .then(res => {
          if (res.data != null) {
            this.imageUrlstate = true;
            this.imageUrl = res.data.customer_order;
          } else {
            this.imageUrlstate = false;
            this.imageUrl = [];
          }
        });
    },
    // 删除合同数据图片
    deleteimg(a) {
      this.axios
        .post("/file/customer_order_delete", {
          src: a,
          class: "customer_order"
        })
        .then(res => {
          if (res.data.code == 2000) {
            this.getimgUrl(this.customer_order_id);
          }
        });
    },

    // 确认提交订单数据 清空页面
    confirm() {
      if (this.class_id == 5) {
        let shu;
        this.InvoiceType[0].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.InvoiceType[1].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.InvoiceType[2].filter(item => {
          if (item.id == this.piao) {
            shu = item;
          }
        });
        this.axios
          .post("/crm.Order/order_update", {
            id: this.customer_order_id,
            status: "1",
            customer_id: this.kehuValue,
            sales_time: this.starttime,
            delivery_time: this.endtime,
            invoice_name: shu.name,
            invoice_type: shu.type,
            invoice_tax: shu.percentile.substring(0, shu.percentile.length - 1),
            type_id: this.radio,
            repair_invoice: this.repair_invoice,
            repair_freight: this.repair_freight,
            remarks: this.remarks
          })
          .then(res => {
            if (res.data.code == 2000) {
              let d = new Date();
              let year = d.getFullYear();
              let month = this.change(d.getMonth() + 1);
              let day = this.change(d.getDate());
              let hour = this.change(d.getHours());
              let minute = this.change(d.getMinutes());
              let second = this.change(d.getSeconds());
              this.starttime =
                year +
                "-" +
                month +
                "-" +
                day +
                " " +
                hour +
                ":" +
                minute +
                ":" +
                second;

              this.open(res.data.msg, "success");
              this.state4 = "";
              this.listKuhuName = "";
              this.kehuValue = "";
              this.repair_freight = "";
              this.repair_invoice = "";
              this.remarks = "";
              this.endtime = "";
              this.piao = "";
              this.radio = "1";
              this.class_id = "1";
              this.customer_order_id = "";
              this.tableProduct = [];
              this.currentPage = 0; //当前页
              this.total = 0; //总数
              this.per_page = 0; //每页多少条
              this.last_page = 0; //总页数
              this.tableData = [];
              this.ChoiceAddress = [];
              this.distributeProduct = [];
              this.fixedAddress = [];
              this.distributeProduct1 = [];
              this.addressProduct = [];
              this.imageUrl = [];
              this.imageUrlType = [];
              this.imageUrlstate = false;
            } else {
              this.open(res.data.msg, "error");
            }
          });
      } else {
        if (this.imageUrl.length !== 0) {
          let shu;
          this.InvoiceType[0].filter(item => {
            if (item.id == this.piao) {
              shu = item;
            }
          });
          this.InvoiceType[1].filter(item => {
            if (item.id == this.piao) {
              shu = item;
            }
          });
          this.InvoiceType[2].filter(item => {
            if (item.id == this.piao) {
              shu = item;
            }
          });
          this.axios
            .post("/crm.Order/order_update", {
              id: this.customer_order_id,
              status: "1",
              customer_id: this.kehuValue,
              sales_time: this.starttime,
              delivery_time: this.endtime,
              invoice_name: shu.name,
              invoice_type: shu.type,
              invoice_tax: shu.percentile.substring(
                0,
                shu.percentile.length - 1
              ),
              type_id: this.radio,
              repair_invoice: this.repair_invoice,
              repair_freight: this.repair_freight,
              remarks: this.remarks
            })
            .then(res => {
              if (res.data.code == 2000) {
                let d = new Date();
                let year = d.getFullYear();
                let month = this.change(d.getMonth() + 1);
                let day = this.change(d.getDate());
                let hour = this.change(d.getHours());
                let minute = this.change(d.getMinutes());
                let second = this.change(d.getSeconds());
                this.starttime =
                  year +
                  "-" +
                  month +
                  "-" +
                  day +
                  " " +
                  hour +
                  ":" +
                  minute +
                  ":" +
                  second;

                this.open(res.data.msg, "success");
                this.state4 = "";
                this.listKuhuName = "";
                this.kehuValue = "";
                this.repair_freight = "";
                this.repair_invoice = "";
                this.remarks = "";
                this.endtime = "";
                this.piao = "";
                this.radio = "1";
                this.class_id = "1";
                this.customer_order_id = "";
                this.tableProduct = [];
                this.currentPage = 0; //当前页
                this.total = 0; //总数
                this.per_page = 0; //每页多少条
                this.last_page = 0; //总页数
                this.tableData = [];
                this.ChoiceAddress = [];
                this.distributeProduct = [];
                this.fixedAddress = [];
                this.distributeProduct1 = [];
                this.addressProduct = [];
                this.imageUrl = [];
                this.imageUrlType = [];
                this.imageUrlstate = false;
              } else {
                this.open(res.data.msg, "error");
              }
            });
        } else {
          this.open("合同没有上传！", "error");
        }
      }
    },
    // 公用弹窗
    open(a, b) {
      this.$message({
        message: a,
        type: b
      });
    },
    // 订单草稿箱
    getcaogao() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: '拼命加载中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      this.axios.get("/crm.Order/order_update?id=0").then(res => {
        if (res.data.order === undefined) {
          this.state4 = res.data.company_name;
          this.kehuName(res.data.company_id);
          this.kehuValue = res.data.customer_id;
          this.starttime = res.data.sales_time;
          this.endtime = res.data.delivery_time;
          this.radio = String(res.data.type_id);
          this.remarks = res.data.remarks;
          this.customer_order_id = res.data.id;
          this.gettableData(res.data.id);
          this.gettableData1(res.data.id);
          this.getChoiceAddress(res.data.customer_id);
          this.getfixedAddress(res.data.id);
          this.getimgUrl(res.data.id);
          let shu;
          this.InvoiceType[res.data.type_id - 1].filter(item => {
            if (
              `${item.name}${item.type}` ==
              `${res.data.invoice_name}${res.data.invoice_type}`
            ) {
              shu = item;
            }
          });
          //console.log(shu);
          this.piao = shu.id;
          this.class_id = String(res.data.class_id);
        }
        this.optionsSalesman = res.data.user;
        //loading.close();
        this.repair_invoice = res.data.repair_invoice;
        this.repair_freight = res.data.repair_freight;
      });
    },
    // 上传子组件传过来的值
    getchildmsg(data) {
      if (data == 1) {
        this.getfixedAddress();
        this.dialogExcel = false;
        this.open("上传成功", "success");
      }
    },

    // 默认时间
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    }
  },
  activated() {
    let d = new Date();
    let year = d.getFullYear();
    let month = this.change(d.getMonth() + 1);
    let day = this.change(d.getDate());
    let hour = this.change(d.getHours());
    let minute = this.change(d.getMinutes());
    let second = this.change(d.getSeconds());
    this.starttime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;

    this.getCityData();
    this.getcaogao();
    this.getoptions();
  }
};
</script>
<style scoped lang="less">
.head_box {
  border: 1px solid #ccc;
  padding: 20px 10px;
  min-width: 1150px;
  .riqi {
    overflow: hidden;
    float: right;
    margin-right: 30px;
    .xiaohou {
      float: left;
    }
    .fahuo {
      margin-left: 20px;
      float: left;
    }
  }
  .danxuan {
    margin-top: 20px;
    overflow: hidden;
    .danxuan1 {
    }
    .danxuan2 {
      h4 {
        padding-bottom: 10px;
      }
      .el-radio {
        margin-right: 10px !important;
      }
    }
  }
}
.content_box_product {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px 10px;
}
.addr {
  font-size: 10px !important;
  color: #b4b4b4 !important;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
.content_box_address {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px 10px;
  overflow: hidden;
  .content_box_address_left {
    width: 620px;
    float: left;
    .content_box_address_head {
      margin-bottom: 20px;
    }
  }
  .content_box_address_right {
    float: left;
    width: 500px;
    overflow: hidden;
    margin-left: 10px;
    .content_box_address_right_inner {
      overflow: hidden;
      width: 200px;
      float: left;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}
.ChoiceAddressInner {
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px 5px;
  margin-top: 10px;
  .ChoiceAddressInnerLeft {
    float: left;
    width: 70%;
  }
  .ChoiceAddressInnerRight {
    float: left;
    margin-top: 5px;
  }
}
.generatedAddress {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px 10px;
  overflow: hidden;
  margin-bottom: 10px;
  hr {
    margin-top: 10px;
  }
  .generatedAddressInner {
    overflow: hidden;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #ccc;
    .generatedAddressInnerLeft {
      float: left;
      width: 65%;
    }
    .generatedAddressInnerRight {
      float: left;
      width: 30%;
    }
  }
}
.contract {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px 10px;
  overflow: hidden;
  margin-bottom: 10px;
  .contractInner {
    margin-top: 20px;
    overflow: hidden;
    .contractInnerLeft {
      float: left;
      margin-left: 20px;
    }
  }
}
.avatar-uploader,
.el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px dashed #ccc !important;
}
.avatar-uploader,
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.img {
  overflow: hidden;
  .imginner {
    float: left;
    width: 178px;
    height: 178px;
    margin-left: 10px;
    border-radius: 5px;
    position: relative;
    .avatar {
      width: 178px;
      height: 178px;
    }

    .avatars {
      width: 178px;
      height: 178px;
      background: rgba(102, 102, 102, 0.4);
      position: absolute;
      top: 0;
      display: none;
    }
  }
  .imginner:hover .avatars {
    display: block;
    cursor: pointer;
  }
}
</style>
