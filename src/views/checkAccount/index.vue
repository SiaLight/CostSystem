<template>
  <div class="app-container box">
    <div v-if="checkPermission(['fundManager'])">
    <div class="filter-container">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="search"
        style="width: 200px"
      ></el-input>
    </div>
    <!-- <div v-if="!isLoading"> -->
    <el-table
      :data="perData.filter(data => !search || data.accountId==search)"
      stripe
      border
      style="margin-top: 20px"
    >
    <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.items" >
            <el-table-column prop="name" label="报销项" ></el-table-column>
            <el-table-column prop="itemPrice" label="金额"></el-table-column>
            <el-table-column prop="des" label="备注"></el-table-column>
          </el-table>
          <div>
            <p>摘要：{{props.row.summary}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accountId" label="编号"></el-table-column>
      <el-table-column prop="accountDevice.deviceName" label="设备名称"></el-table-column>
      <el-table-column prop="submitUser.userName" label="提交人" ></el-table-column>
      <el-table-column  label="提交时间">
          <template slot-scope="{row}">
             <span>{{ row.submitTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" >
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="info" class="form">
        <el-input
          style="margin-top:5px"
          type="textarea"
          :rows="2"
          placeholder="请输入审核意见"
          v-model="info.des"
        ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleNoPass">审核不通过</el-button>
        <el-button type="primary" @click="handlePass">审核通过</el-button>
      </div>
    </el-dialog>
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
    <div v-else>
      <h3>您没有权限访问！</h3>
    </div>
  </div>
</template>

<script>
import { findAccountByStatus, passAccount, noPassAccount } from "@/api/account";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import checkPermission from '@/utils/permission';

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
      info: {
        name: "",
        des: "",
      },
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
      this.info = row;
      console.log(this.info);
    },
    checkPermission,
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
      var that = this;
         passAccount(this.info.accountId, this.info.des).then(res => {
        that.message(res.code);
        that.dialogFormVisible = false;
      });

    },
    formatTime(e) {
      return parseTime(e, "{y}-{m}-{d} {h}:{i}");
    },
    handleDelete(index, row) {
      var that = this;
      deleteActivity({ id: row.id }).then(res => {
        console.log(res);
        that.message(res.code);
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
  mounted() {
    var that = this;
    findAccountByStatus(0).then(res => {
      console.log("account");
      that.isLoading = false;
      console.log(res.data);
      that.tableData = res.data;
      that.totalNum = res.data.length;
      that.info = that.tableData[0];
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

