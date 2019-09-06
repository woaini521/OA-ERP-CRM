<template>
  <div class="box">
    <div class="content_box">
      <div class="leave">
        <el-form :model="leaveForm" ref="leaveForm">
          <el-form-item label="类型" label-width="100px">
            <el-select v-model="leaveForm.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预算" label-width="100px">
            <el-input v-model="leaveForm.budget" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="时间" label-width="100px">
            <el-input
              v-model="leaveForm.timeT"
              type="number"
              placeholder="请输入天数"
              style="width:150px;"
            ></el-input>天数
            <el-input
              style="margin-left:20px;width:150px;"
              type="number"
              v-model="leaveForm.timeH"
              placeholder="请输入小时数"
            ></el-input>小时
          </el-form-item>
          <el-form-item label="开始时间" label-width="100px">
            <el-date-picker
              v-model="leaveForm.startTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" label-width="100px">
            <el-date-picker
              v-model="leaveForm.endTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="100px">
            <el-input type="textarea" v-model="leaveForm.remark" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label=" " label-width="100px">
            <el-button @click="add1">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      options: [
        {
          lable: "请假",
          value: "1"
        },
        {
          lable: "出差",
          value: "2"
        },
        {
          lable: "外出",
          value: "3"
        }
      ],
      show: false,
      leaveForm: {
        //请假表单
        type: "",
        budget: "",
        timeT: 0,
        timeH: 0,
        startTime: "",
        endTime: "",
        remark: "",
        leave_id: ""
      },
      rules: {
        budget: [
          { type: "number", message: "预算必须为数字", trigger: "blur" }
        ],
        timeT: [{ type: "number", message: "天数必须为数字", trigger: "blur" }],
        timeH: [{ type: "number", message: "小时必须为数字", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions("Tabs", ["triggerDeleteTabs"]),
    add1() {
      if (
        this.leaveForm.type == "" ||
        this.leaveForm.startTime == "" ||
        this.leaveForm.endTime == ""
      ) {
        this.open("填写完整", "error");
      } else {
        if (this.leaveForm.timeT > 0 || this.leaveForm.timeH > 0) {
          this.axios
            .post("/oa.Days/leave_update", {
              leave_type: this.leaveForm.type,
              money: this.leaveForm.budget,
              day: this.leaveForm.timeT,
              hour: this.leaveForm.timeH,
              start_time: this.leaveForm.startTime,
              end_time: this.leaveForm.endTime,
              content: this.leaveForm.remark,
              leave_id: this.leaveForm.leave_id
            })
            .then(res => {
              if (res.data.code == 2000) {
                this.open(res.data.msg, "success");
                this.triggerDeleteTabs(this.$route.path);
                this.$router.push({ path: "/oa/Days/leave_select" });
              } else {
                this.open(res.data.msg, "error");
              }
            });
        } else {
          this.open("请假天数或小时其中必须要有一个不为0", "error");
        }
      }
    },
    getData() {
      this.axios
        .get("/oa.Days/leave_update?leave_id=" + this.$route.params.id)
        .then(res => {
            this.leaveForm.budget = res.data.money;
            this.leaveForm.timeT = res.data.day;
            this.leaveForm.timeH = res.data.hour;
            this.leaveForm.startTime = res.data.start_time;
            this.leaveForm.endTime = res.data.end_time;
            this.leaveForm.remark = res.data.content;
            this.leaveForm.leave_id = res.data.id;
            this.leaveForm.type = String(res.data.leave_type.leave_type);
        });
    },
    open(a, b) {
      this.$message({
        message: a,
        type: b
      });
    }
  },
  // created(){
  //     if(this.$route.params.id){
  //        this.activeName =  this.$route.params.type;

  //     }else{

  //     }
  // },
  activated() {
    if (this.$route.params.id) {
      this.show = true;
      this.activeName = String(this.$route.params.type);
      this.getData();
    } else {
      this.show = false;
      this.leaveForm.budget = "";
      this.leaveForm.timeT = "";
      this.leaveForm.timeH = "";
      this.leaveForm.startTime = "";
      this.leaveForm.endTime = "";
      this.leaveForm.remark = "";
      this.leaveForm.leave_id = "";

      this.businessForm.budget = "";
      this.businessForm.timeT = "";
      this.businessForm.timeH = "";
      this.businessForm.startTime = "";
      this.businessForm.endTime = "";
      this.businessForm.remark = "";
      this.businessForm.leave_id = "";

      this.egressForm.budget = "";
      this.egressForm.timeT = "";
      this.egressForm.timeH = "";
      this.egressForm.startTime = "";
      this.egressForm.endTime = "";
      this.egressForm.remark = "";
      this.egressForm.leave_id = "";
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  min-width: 500px;
  .leave {
    margin-top: 20px;
  }
  .egress {
    margin-top: 20px;
  }
  .overtime {
    margin-top: 20px;
  }
  .business {
    margin-top: 20px;
  }
}
</style>
