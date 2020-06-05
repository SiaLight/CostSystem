<template>
  <div class="app-container box">
    <div style="width:60%">
      <el-form label-position="right" label-width="80px" :model="user">
        <el-form-item label="名称">
          <el-input v-model="user.userName"></el-input>
          <el-button type="primary" @click="editName" size="small">确认修改</el-button>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.userPhone"></el-input>
          <el-button type="primary" @click="editPhone" size="small">确认修改</el-button>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPassword"></el-input>
          <el-button type="primary" @click="editPassword" size="small">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { userInfo, updateName, updatePhone, updatePassword } from "@/api/user";
export default {
  data() {
    return {
      user: {
        userName: "",
        userPhone: ""
      },
      newPassword: ""
    };
  },
  mounted() {
    var that = this;
    userInfo(that.$store.getters.userId).then(res => {
      console.log(res);
      that.user = res.data;
    });
  },
  methods: {
    editName() {
          var that = this;
      updateName(that.user.userId, that.user.userName).then(res => {
            that.message(res.code);
      });
    },
    editPhone(){
          var that = this;
          if(that.user.userPhone.trim().length!=11)
          this.$message.error("号码格式不对");
          else{
                updatePhone(that.user.userId, that.user.userPhone).then(res=>{
                      that.message(res.code);
                })
          }
    },
    editPassword(){
          var that = this;
          if(that.newPassword.trim().length<6)
          this.$message.error("请输入6位以上密码");
          else{
                updatePassword(that.user.userId, that.newPassword).then(res=>{
                      that.message(res.code);
                })
          }

          

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
  }
};
</script>