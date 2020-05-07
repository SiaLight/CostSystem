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
    <el-table :data="perData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))" stripe border style="width:100%;margin-top: 20px">
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="promoter.name" label="发起人" width="150"></el-table-column>
      <el-table-column label="活动类型" width="150">
        <template slot-scope="{row}">
          <div v-if="row.activityType == 'match' ">
            <el-tag size="medium">{{ row.activityType }}</el-tag>
            <el-tag size="medium" v-if="row.quantityType">团体赛</el-tag>
            <el-tag size="medium" v-else>个人赛</el-tag>
          </div>
          <div v-else>
            <el-tag size="medium">{{ row.activityType }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="actTime" label="比赛开始时间" width="150"></el-table-column>
      <el-table-column prop="endTime" label="报名截止时间" width="150"></el-table-column>
      <el-table-column prop="publishTime" label="比赛发布时间" width="150"></el-table-column>
      <el-table-column prop="description" label="详情" width="150"></el-table-column>
      <el-table-column prop="location" label="地址" width="150"></el-table-column>
      <el-table-column prop="phone" label="电话" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="活动信息" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="info" class="form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="info.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动类型" :label-width="formLabelWidth">
              <el-cascader
                :options="options"
                v-model="typeValue"
                clearable
                :placeholder="info.activityType"
                @change="changeType"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报名截止时间" :label-width="formLabelWidth">
              <el-date-picker v-model="info.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="比赛开始时间" :label-width="formLabelWidth">
              <el-date-picker v-model="info.actTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="!isAdd">
          <el-col :span="12">
            <el-form-item label="发起人" :label-width="formLabelWidth">
              <el-input v-model="info.promoter.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="比赛发布时间" :label-width="formLabelWidth">
              <el-date-picker v-model="info.publishTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地址" :label-width="formLabelWidth">
              <el-input v-model="info.location" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="info.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详情" :label-width="formLabelWidth">
          <el-input
            v-model="info.description"
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
    <!-- </div> -->
    <div  v-loading="isLoading" style="margin-top:200px">

    </div>
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
  getActivity,
  editActivity,
  deleteActivity,
  addActivity
} from "@/api/activity";
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
      info: {
        name: "",
        actTime: "",
        endTime: "",
        des: "",
        activityType: "",
        description: "",
        quantityType: 0,
        publishTime: "0000-00-00 00:00",
        location: "",
        phone: "",
        promoter:{
          name:''
        }
      },
      default: {
        name: "",
        actTime: "",
        endTime: "",
        des: "",
        activityType: "",
        description: "",
        quantityType: 0,
        publishTime: "0000-00-00 00:00",
        location: "",
        phone: ""
      },
      tableData: [{
        name: "",
        actTime: "",
        endTime: "",
        des: "",
        activityType: "",
        description: "",
        quantityType: 0,
        publishTime: "0000-00-00 00:00",
        location: "",
        phone: "",
        promoter:{
          name:''
        }
      }],
      perData: [],
      options: [
        {
          value: "match",
          label: "match",
          children: [
            {
              value: "single",
              label: "个人赛"
            },
            {
              value: "team",
              label: "团队赛"
            }
          ]
        },
        {
          value: "course",
          label: "course"
        }
      ]
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
    handleFilter() {},
    getCurrentData() {
      var x = this.currentPage * this.pageSize;
      var x0 = (this.currentPage - 1) * this.pageSize;
      if (x <= this.totalNum) this.perData = this.tableData.slice(x0, x);
      else this.perData = this.tableData.slice(x0);
    },
    editAcitvity() {
      var that = this;
      this.info.actTime = this.formatTime(this.info.actTime);
      this.info.endTime = this.formatTime(this.info.endTime);
      this.info.publishTime = this.formatTime(this.info.publishTime);
      if (!this.isAdd) {
        editActivity(this.info).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      } else {
        addActivity(this.info).then(res => {
          console.log(res);
          that.message(res.code);
          that.dialogFormVisible = false;
        });
      }
    },
    changeType() {
      console.log(this.typeValue);
      if (this.typeValue[0] == "match") {
        this.info.activityType = this.typeValue[0];
        if (this.typeValue[1] == "single") this.info.quantityType = 0;
        else this.info.quantityType = 1;
      } else this.info.activityType = this.typeValue[0];
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
    getActivity().then(res => {
      console.log("activity");
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

