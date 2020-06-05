<template>
  <div class="app-container box">
    <div class="filter-container">
      <el-input
        placeholder="请输入编号"
        prefix-icon="el-icon-search"
        v-model="search"
        style="width: 200px"
      ></el-input>
    </div>
    <!-- <div v-if="!isLoading"> -->
    <el-table
      :data="perData.filter(data => !search || data.accountId==serarch)"
      stripe
      border
      style="width:100%;margin-top: 20px"
    >
    <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.items" style="width: 100%">
            <el-table-column prop="name" label="报销项" width="180"></el-table-column>
            <el-table-column prop="itemPrice" label="金额" width="180"></el-table-column>
            <el-table-column prop="des" label="备注"></el-table-column>
          </el-table>
          <div>
            <p>摘要：{{props.row.summary}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accountId" label="编号" width="150"></el-table-column>
      <el-table-column prop="accountDevice.deviceName" label="设备名称" width="150"></el-table-column>
      <el-table-column prop="submitUser.userName" label="提交人" width="150"></el-table-column>
      <el-table-column  label="提交时间" width="150">
          <template slot-scope="{row}">
             <span>{{ row.submitTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkUser.userName" label="审核人" width="150"></el-table-column>
      <el-table-column  label="审核时间" width="150">
          <template slot-scope="{row}">
             <span>{{ row.checkTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="des" label="审核意见" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">导出账单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-dialog title="导出账单" :visible.sync="dialogFormVisible" width="60%">
       <input type="file" @change="changeFile($event)"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleNoPass">确定</el-button>
        <el-button type="primary" @click="handlePass">删除</el-button>
      </div>
    </el-dialog> -->
    <div v-loading="isLoading" style="margin-top:200px"></div>
    <el-pagination
      background
      class="page"
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :pager-count="5"
      :total="totalNum"
    ></el-pagination>
  </div>
</template>

<script>
import { findAccountByStatus,submitAccount,printPdf} from "@/api/account";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      typeValue: "",
      activeIndex: "1",
      isLoading: true,
      isAdd: false,
      totalNum: 0,
      pageSize: 5,
      search:'',
      currentPage: 1,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      tableData: [
        {
          name: "",
          des: "",
        }
      ],
      perData: [],
    };
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      var that = this;
      printPdf(row.accountId).then(res =>{
          console.log(res);
           that.message(res.code);
      })

    },
    handleCurrentChange() {
      this.getCurrentData();
    },
    getCurrentData() {
      var x = this.currentPage * this.pageSize;
      var x0 = (this.currentPage - 1) * this.pageSize;
      if (x <= this.totalNum) this.perData = this.tableData.slice(x0, x);
      else this.perData = this.tableData.slice(x0);
    },
    handleNoPass() {
      var that = this;
      noPassAccount(this.info.accountId, this.info.des).then(res => {
        that.message(res.code);
        that.dialogFormVisible = false;
      });
    },
    handlePass(){
         passAccount(this.info.accountId, this.info.des).then(res => {
        that.message(res.code);
        that.dialogFormVisible = false;
      });

    },
    message(code) {
      if (code == 200)
        this.$message({
          message: "操作成功！",
          type: "success"
        });
      else {
        this.$message.error("操作失败！");
      }
    }
  },
  changeFile(event){

  },
  mounted() {
    var that = this;
    submitAccount(1).then(res => {
      console.log("submitaccount");
      console.log(res.data);
      that.tableData = res.data;
      that.isLoading = false;
      that.totalNum = res.data.length;
      that.getCurrentData();
    });
  }
};
</script>
<style scoped>
.page {
  position: fixed;
  bottom: 30px;
  left: 50%;
}
</style>

