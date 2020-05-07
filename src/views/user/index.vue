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
        <el-table-column label="性别" width="150">
          <template slot-scope="{row}">
            <el-tag size="medium" v-if="row.gender">女</el-tag>
            <el-tag size="medium" v-else>男</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="college" label="学院" width="150"></el-table-column>
        <el-table-column prop="userGrade" label="年级" width="150"></el-table-column>
        <el-table-column prop="userNumber" label="学号" width="150"></el-table-column>
        <el-table-column label="联系方式" width="150">
          <template slot-scope="{row}">
            <el-tag size="medium">{{row.userEmail}}</el-tag>
            <el-tag size="medium" style="margin-top: 10px">{{row.userPhone}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userResume" label="简历" width="150"></el-table-column>
        <el-table-column prop="userSpecialty" label="特长" width="150"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="个人信息" :visible.sync="dialogFormVisible" width="60%">
        <el-form :model="info" class="form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="info.userName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-radio v-model="genderNum" label="0">女</el-radio>
                <el-radio v-model="genderNum" label="1">男</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学院" :label-width="formLabelWidth">
                <el-input v-model="info.college" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年级" :label-width="formLabelWidth">
                <el-select v-model="info.userGrade" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="info.userEmail" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="info.userPhone" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学号" :label-width="formLabelWidth">
                <el-input v-model="info.userNumber" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="特长" :label-width="formLabelWidth">
                <el-input v-model="info.userSpecialty" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="简历" :label-width="formLabelWidth">
            <el-input
              v-model="info.userResume"
              autocomplete="off"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
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
import { allUser, deleteUser, updateUser, createUser } from "@/api/user";
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
      genderNum: "0", //0代表女生，1代表男生
      dialogFormVisible: false,
      formLabelWidth: "100px",
      info: {},
      default: {
        college: "",
        gender: false,
        userEmail: "",
        userGrade: "",
        userPhone: "",
        userName: "",
        userNumber: "",
        userSpecialty: "",
        userRusume: ""
      },
      sendDefault:{
         college: "",
        gender: false,
        email: "",
        grade: "",
        phone: "",
        name: "",
        stuNumber: "",
        specialty: "",
        rusume: "",
        id: null,
        password:'123456'
      },
      tableData: [{
         college: "",
        gender: '',
        userEmail: "",
        userGrade: "",
        userPhone: "",
        userName: "",
        userNumber: "",
        userSpecialty: "",
        userRusume: ""
      }],
      perData: [],
      options: [{
          value: '大一',
          label: '大一'
        },
        {
          value: '大二',
          label: '大二'
        },
        {
          value: '大三',
          label: '大三'
        },
        {
          value: '大四',
          label: '大四'
        },
        {
          value: '研一',
          label: '研一'
        },
         {
          value: '研二',
          label: '研二'
        },
         {
          value: '研三',
          label: '研三'
        },
        
      ]
    }
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.info = row;
      console.log(this.info);
      if (this.info.gender) this.genderNum = "1";
      else this.genderNum = "0";
    },
    handleCreate() {
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.info = this.default;
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
    editAcitvity() {
      var that = this;
      if (this.genderNum == "0") this.info.gender = false;
      else this.info.gender = true;
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
    convert(){
      this.sendDefault.name = this.info.userName;
      this.sendDefault.gender = this.info.gender;
      this.sendDefault.stuNumber = this.info.userNumber;
      this.sendDefault.grade = this.info.userGrade;
      this.sendDefault.phone = this.info.userPhone;
      this.sendDefault.email = this.info.userEmail;
      this.sendDefault.specialty = this.info.userSpecialty;
       this.sendDefault.college = this.info.college;
       this.sendDefault.rusume = this.info.userRusume;
       this.sendDefault.id = this.info.userId;
      
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

