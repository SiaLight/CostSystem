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
        :data="perData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        stripe
        border
        style="width:100%;margin-top: 20px"
      >
        <el-table-column prop="teamName" label="名称" width="150"></el-table-column>
        <el-table-column prop="leaderName" label="发起人" width="150"></el-table-column>
        <el-table-column prop="activityName" label="活动名称" width="150"></el-table-column>
        <el-table-column label="团队成员" width="150">
          <template slot-scope="{row}">
            <div v-for="(item,index) in row.members" :key="index">
              <el-tag size="medium">{{ item.userName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="团队信息" :visible.sync="dialogFormVisible" width="60%">
        <el-form :model="info" class="form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="info.teamName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!isAdd">
              <el-form-item label="团队成员" :label-width="formLabelWidth">
                <div v-for="(item,index) in info.members" :key="index">
                <el-tag
                  closable
                  :disable-transitions="false"
                  @close="handleClose(item.userId)"
                >{{item.userName}}</el-tag>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="!isAdd">
            <el-col :span="12">
              <el-form-item label="发起人" :label-width="formLabelWidth">
                <el-input v-model="info.leaderName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="info.activityName" autocomplete="off"></el-input>
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
import { getTeam, updateTeam, createTeam, deleteTeam } from "@/api/team";
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
      info: {},
      default: {
        teamName: "",
        activity: {
          id: 1
        }
      },
      send: {
        name: "",
        activity: {
          id: 1
        }
      },
      tableData: [{
        teamName: "",
        leaderName:'',
        activityName:'',
        members:[
          {
            userName:''
          }
        ]
      }],
      perData: [],
    };
  },
  methods: {
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.info = row;
      console.log(this.info);
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
      if (!this.isAdd) {
        updateTeam(this.info).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
          
        });
      } else {
        this.send.name = this.info.teamName;
        createTeam(this.send).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      }
    },
    handleDelete(index, row) {
      var that = this;
      deleteTeam({ id: row.id }).then(res => {
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
    handleClose(id) {
      console.log(id);
      var len = this.info.memberNum;
      for(var i=0;i<len;i++)
      {
        if(this.info.members[i].userId== id)
        {
               this.info.members.splice(i,1);
               break;
        }
      }

      },
  },
  mounted() {
    var that = this;
    getTeam().then(res => {
      console.log("team");
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

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

