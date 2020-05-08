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
    <el-table
      :data="perData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
      stripe
      border
      style="width:100%;margin-top: 20px"
    >
      <el-table-column prop="userName" label="名称" width="150"></el-table-column>
      <el-table-column prop="userPhone" label="号码" width="150"></el-table-column>
      <el-table-column label="角色" width="300">
        <template slot-scope="{row}">
          <el-tag
            size="medium"
            v-for="(item,index) in row.userRoles"
            :key="index"
            closable
            style="margin-top:3px;margin-left:3px"
            @close="handleColse(item,row)"
          >{{item.roleName}}</el-tag>
          <el-button size="mini" @click="handleRoleEdit(row)">+角色</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加角色" :visible.sync="visible" width="50%">
      <el-radio v-model="RoleRadio" label="1">deviceManager</el-radio>
      <el-radio v-model="RoleRadio" label="2">fundManager</el-radio>
      <el-radio v-model="RoleRadio" label="3">admin</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRoleCancle">取 消</el-button>
        <el-button type="primary" @click="handleRoleOK">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="info" class="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="info.userName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="号码" :label-width="formLabelWidth">
              <el-input v-model="info.userPhone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="isAdd">
          <el-col :span="12" >
            <el-form-item label="角色" :label-width="formLabelWidth">
              <el-checkbox-group v-model="roleList">
                <el-checkbox label="设备管理员"></el-checkbox>
                <el-checkbox label="经费管理员"></el-checkbox>
                <el-checkbox label="总管理员"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="info.userPassword" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAcitvity">确 定</el-button>
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
</template>

<script>
import {
  allUser,
  deleteUser,
  updateUser,
  createUser,
  addRole,
  removeRole
} from "@/api/user";
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
      isAdd: false,
      isLoading: true,
      totalNum: 0,
      pageSize: 2,
      currentPage: 1,
      search: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      roleList: [],
      info: {},
      visible: false,
      RoleRadio: "",
      currentRoloInfo:{},
      default: {
        userPhone: "",
        userName: "",
      },
      sendDefault: {
        phone: "",
        name: "",
        id: null,
      },
      tableData: [
        {
          userPhone: "",
          userName: "",
          userRoles: []
        }
      ],
      perData: []
    };
  },
  methods: {
    handleRoleEdit(row){
       this.visible = true;
       this.currentRoloInfo = row;
    },
    handleRoleCancle(){
       this.visible = false;
       this.currentRoloInfo = {};
       this.RoleRadio="";
    },
    handleRoleOK(){
      var currentRole = this.currentRoloInfo.userRoles;
      for(let i=0;i<currentRole.length;i++){
        if(currentRole[i].roleId==this.RoleRadio){
          this.$message('已拥有该角色');
          return;
        }
      }

      addRole(this.currentRoloInfo.userId,parseInt(this.RoleRadio)).then(res=>{
        console.log(res.data);
        this.message(res.code);
      })
      this.visible = false;
         
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
    handleColse(item, row) {
      var that = this;
      removeRole(row.userId, item.roleId).then(res => {
        console.log(res);
        that.message(res.code);
      });
    },
    getCurrentData() {
      var x = this.currentPage * this.pageSize;
      var x0 = (this.currentPage - 1) * this.pageSize;
      if (x <= this.totalNum) this.perData = this.tableData.slice(x0, x);
      else this.perData = this.tableData.slice(x0);
    },
    editAcitvity() {
      var that = this;
      this.convert();
      if (!this.isAdd) {
        updateUser(this.sendDefault).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      } else {
        createUser(this.sendDefault).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      }
    },
    handleDelete(index, row) {
      var that = this;
      var id = parseInt(row.userId);
      deleteUser({ id: row.userId }).then(res => {
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
    },
    convert() {
      this.sendDefault.name = this.info.userName;
      this.sendDefault.phone = this.info.userPhone;
      this.sendDefault.id = this.info.userId;
      if(this.isAdd){
        let roleIdList = [];
        let role1={
          id:1,
          name:"deviceManager",
          status:1
        },
        role2={
          id:2,
          name:"fundManager",
          status:1
        },
        role3={
          id:3,
          name:"admin",
          status:1
        }
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i] == "设备管理员") roleIdList.push(role1);
        else if (this.roleList[i] == "经费管理员") roleIdList.push(role2);
        else roleIdList.push(role3);
      }

      this.sendDefault.roles = roleIdList;
      this.sendDefault.password = this.info.userPassword;

      }
    }
  },
  mounted() {
    var that = this;
    allUser().then(res => {
      console.log("user");
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

