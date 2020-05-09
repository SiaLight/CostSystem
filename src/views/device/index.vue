<template>
  <div class="app-container box">
    <div class="filter-container">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="search"
        style="width: 200px"
      ></el-input>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <!-- <div v-if="!isLoading"> -->
    <el-table
      :data="perData.filter(data => !search || data.deviceName.toLowerCase().includes(search.toLowerCase()))"
      stripe
      border
      style="width:100%;margin-top: 20px"
    >
      <el-table-column prop="deviceName" label="名称" width="150"></el-table-column>
      <el-table-column prop="deviceExpense" label="总支出" width="150"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleAddAccount(scope.$index, scope.row)"
          >+账单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加账单" :visible.sync="accountVisible" width="60%">
      <el-table :data="item">
        <el-table-column prop="name" label="报销项" width="150"></el-table-column>
        <el-table-column label="金额" width="150">
          <template slot-scope="{row}">
            <el-input v-model="row.price" placeholder="请输入金额"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
          <template slot-scope="{row}">
            <el-input v-model="row.des" placeholder="请输入备注"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:5px">
          <el-button type="primary" size="small" @click="totalPrice">显示总价</el-button> <span>{{account.price}}</span>
      </div>
      <el-input style="margin-top:5px" type="textarea" :rows="2" placeholder="请输入详情" v-model="account.des"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="accountVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddAcount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备信息" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="info" class="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="info.deviceName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAcitvity">确 定</el-button>
      </div>
    </el-dialog>
    <!-- </div> -->
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
import {
  deleteDevice,
  allDevice,
  createDevice,
  updateDeviceName
} from "@/api/device";

import {addAccount} from "@/api/account";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      typeValue: "",
      activeIndex: "1",
      isLoading: true,
      isAdd: false,
      totalNum: 0,
      pageSize: 2,
      currentPage: 1,
      search: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      info: { deviceName: "" },
      default: {
        deviceName: ""
      },
      tableData: [
        {
          deviceName: ""
        }
      ],
      perData: [],
      sendDefault: {
        name: "",
        id: null,
        expense: 0
      },
      currentDevice: {},
      accountVisible: false,
      item: [
          {
            id: null,
            name: "报刊资料费",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "图书资料费",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "清洁劳动用品",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "培训资料印刷制作费",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "市内交通费",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "实验材料购置",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "软件购置",
            price: "0",
            des: ""
          },
          {
            id: null,
            name: "设备维修",
            price: "0",
            des: ""
          }
        ],
      account: {
        des: "",
        price: 0,
        
      }
    };
  },
  methods: {
      totalPrice(){
        var total=0.0;
        for(let i=0;i<this.item.length;i++){
            total+=parseFloat(this.item[i].price);
        }
        this.account.price = total;
      },
    handleAddAccount(index, row) {
      this.currentDevice = row;
      this.accountVisible = true;
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.info = row;
    },
    handleCreate() {
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.info = this.default;
    },
    handleCurrentChange() {
      this.getCurrentData();
    },
    handleFilter() {},
    getCurrentData() {
      var x = this.currentPage * this.pageSize;
      var x0 = (this.currentPage - 1) * this.pageSize;
      if (x <= this.totalNum) this.perData = this.tableData.slice(x0, x);
      else this.perData = this.tableData.slice(x0);
    },
    editAcitvity() {
      var that = this;
      if (!this.isAdd) {
        updateDeviceName(this.info.deviceName, this.info.deviceId).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      } else {
        this.sendDefault.name = this.info.deviceName;
        createDevice(this.sendDefault).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      }
    },
    handleDelete(index, row) {
      var that = this;
      deleteDevice({ deviceId: row.deviceId }).then(res => {
        console.log(res);
        that.message(res.code);
      });
    },
    editAddAcount(){
        var that = this;

        addAccount(this.currentDevice.deviceId,this.account.price,this.account.des,this.item).then(res =>{
            console.log(res);
        that.message(res.code);
        })

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
    allDevice().then(res => {
      console.log("device");
      console.log(res.data);
      that.tableData = res.data;
      that.isLoading = false;
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

