<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="工号：" label-width="70px">
          <el-input v-model="formSearch.employeeCode" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="用户名：" label-width="70px">
          <el-input v-model="formSearch.employeeName" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="部门：" label-width="70px">
          <select-basics
            v-model="formSearch.deptId"
            type="dept"
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="角色：" label-width="70px">
          <select-basics
            v-model="formSearch.rid"
            type="roles"
            clearable
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </v-pageSearch>

    <v-pageToolbar align="left">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
      <el-button>
        <i class="iconfont icon">&#xe67b;</i>导出
      </el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table
        v-loading="table.loading"
        :header-cell-style="$store.state.element.headerBg"
        :data="table.body"
        :max-height="table.autoHeight"
      >
        <el-table-column prop="employeeName" label="用户名"/>
        <el-table-column prop="employeeCode" label="用户编号" min-width="100"/>
        <el-table-column prop="employeeRealName" label="真名"/>
        <el-table-column prop="mail" label="邮箱" min-width="150"/>
        <el-table-column prop="phone" label="手机" min-width="100"/>
        <el-table-column prop="landPhone" label="固定电话" min-width="100"/>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column prop="loginNum" label="登录次数"/>
        <el-table-column prop="deptName" label="部门"/>
        <el-table-column prop="employeeName" label="角色"/>
        <el-table-column prop="employeeTypeName" label="类型"/>
        <el-table-column prop="shipperName" label="货主"/>
        <el-table-column prop="depotName" label="仓库"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" title="编辑" icon="el-icon-edit" @click="editHandle(scope.row)"/>
            <el-button type="primary" title="修改密码" @click="resetHandle(scope.row)">
              <i class="iconfont">&#xe614;</i>
            </el-button>
            <el-button type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <template slot="pagination" slot-scope="props">
        <el-pagination
          :layout="props.layout"
          :total="table.paginationTotal"
          :current-page.sync="table.currentPage"
          :page-size="table.pageSize"
          :page-sizes="props.sizes"
          background
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </template>
    </v-pageTable>
    <!--新增弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="popDetail" :title="title" top="10vh" width="800px">
      <el-form ref="popForm" :model="popData" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名：" prop="employeeName">
              <el-input v-model="popData.employeeName" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号：" prop="employeeCode">
              <el-input v-model="popData.employeeCode" disabled readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isAdd">
          <el-col :span="12">
            <el-form-item label="密码：" prop="password">
              <el-input v-model="popData.password" type="password" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled label="确认密码：" prop="passwordConfirm">
              <el-input v-model="popData.passwordConfirm" type="password"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="employeeRealName">
              <el-input v-model="popData.employeeRealName" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled label="邮箱：" prop="mail">
              <el-input v-model="popData.mail"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电话：" prop="landPhone">
              <el-input v-model="popData.landPhone" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled label="手机：" prop="phone">
              <el-input v-model="popData.phone"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="部门：" prop="deptId">
              <select-basics
                v-model="formSearch.deptId"
                type="dept"
                clearable
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled label="角色：" prop="rid">
              <select-basics
                v-model="popData.rid"
                type="roles"
                clearable
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="用户类型：" prop="employeeType">
              <el-select v-model="popData.employeeType" placeholder="请选择" class="fullW">
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item disabled label="备注：" prop="remark">
              <el-input v-model="popData.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="submitForm('popForm')">确定</el-button>
        <el-button @click.native="popDetail = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--修改密码弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="passPop" title="修改密码" top="10vh" width="400px">
      <el-form ref="passForm" :model="passData" :rules="passRules" label-width="120px">
        <el-row>
          <el-col>
            <el-form-item label="密码：" prop="password">
              <el-input v-model="passData.password" type="password" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item disabled label="确认密码：" prop="passwordConfirm">
              <el-input v-model="passData.passwordConfirm" type="password"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="submitPass('passForm')">确定</el-button>
        <el-button @click.native="passPop = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Staff',
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度不小于6位'))
        } else {
          if (this.popDetail) {
            if (value === this.popData.passwordConfirm) {
              callback()
            } else {
              this.$refs.popForm.validateField('passwordConfirm')
            }
          } else if (this.passPop) {
            if (value === this.passData.passwordConfirm) {
              callback()
            } else {
              this.$refs.passForm.validateField('passwordConfirm')
            }
          }
        }
      }
    }
    var validatePassConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度不小于6位'))
        } else {
          if (this.popDetail) {
            if (value === this.popData.password) {
              callback()
            } else {
              callback(new Error('两次密码不相同'))
            }
          } else if (this.passPop) {
            if (value === this.passData.password) {
              callback()
            } else {
              callback(new Error('两次密码不相同'))
            }
          }
        }
      }
    }
    return {
      rules: {
        employeeName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        rid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        employeeType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      },
      passRules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' }
        ]
      },
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        currentPage: 1,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
      formSearch: {
        employeeCode: '', // 工号
        employeeName: '', // 用户名
        deptId: '', // 部门Id
        rid: '' // 角色Id
      },
      roleOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '前端开发'
        }
      ], // 角色列表
      userTypeOptions: [
        {
          value: '',
          label: '平台用户'
        },
        {
          value: 1,
          label: '货主用户'
        }
      ], // 用户类型
      title: '新增员工',
      isAdd: true, // 新增：true; 编辑：false
      editLoading: false, // 提交按钮禁用状态
      popDetail: false, // 弹窗显示状态
      popData: {
        employeeName: '',
        employeeCode: '',
        password: '',
        passwordConfirm: '',
        employeeRealName: '',
        mail: '',
        landPhone: '',
        phone: '',
        deptId: '',
        rid: '',
        employeeType: '',
        remark: ''
      },
      passPop: false, // 修改密码弹窗状态
      passData: {
        password: '',
        passwordConfirm: ''
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 分页查询
    getTableData(val, flag) {
      const this_ = this
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }
      const url = 'kaili-basic/v1/baseEmployee'
      const params = this.formSearch
      params.page = this.table.page
      params.pageSize = this.table.pageSize
      this.table.loading = true
      this.getRequestParams(url, params).then(data => {
        this_.table.loading = false
        this.table.body = data.data.records
        this.table.paginationTotal = data.data.total
      })
    },
    // 新增
    onAdd() {
      const this_ = this
      this_.title = '新增员工'
      const url = 'kaili-basic/v1/baseEmployee/code'
      this.getRequest(url).then(data => {
        this_.isAdd = true
        this_.popDetail = true
        this_.resetForm('popForm')
        this_.popData.employeeCode = data.data.code
        this_.$nextTick(() => {
          this_.$refs['popForm'].clearValidate()
        })
      })
    },
    // 编辑
    editHandle(row) {
      const this_ = this
      this_.isAdd = false
      this_.title = '编辑员工'
      this_.popDetail = true
      this_.resetForm('popForm')
      this.popData = this.$gFun.arrDeepCopy(row)
      this_.$nextTick(() => {
        this_.$refs['popForm'].clearValidate()
      })
    },
    // 删除
    deleteHandle(row) {
      const this_ = this
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        const url = `kaili-basic/v1/baseEmployee/${row.id}`
        this_.deleteRequest(url).then((data) => {
          this_.$message({
            message: '删除成功',
            type: 'success'
          })
          this_.getTableData()
        })
      })
    },
    // 修改密码
    resetHandle(row) {
      const this_ = this
      this.passPop = true
      this.resetForm('passForm')
      this.passData.id = row.id
      this.$nextTick(() => {
        this_.$refs['passForm'].clearValidate()
      })
    },
    // 提交密码
    submitPass(formName) {
      const this_ = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this_.editLoading = true
          const url = 'kaili-basic/v1/baseEmployee'
          const params = this_.$gFun.arrDeepCopy(this_.passData)
          delete params.passwordConfirm
          this_.putRequest(url, params).then(data => {
            this_.editLoading = false
            this_.$message({
              message: '密码修改成功',
              type: 'success'
            })
            this_.getTableData()
            this_.passPop = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
        setTimeout(function() {
          this_.editLoading = false
        }, 2000)
      })
    },
    // 提交表单
    submitForm(formName) {
      const this_ = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this_.editLoading = true
          const url = 'kaili-basic/v1/baseEmployee'
          const params = this_.$gFun.arrDeepCopy(this_.popData)
          delete params.passwordConfirm
          let message = ''
          if (this_.isAdd) {
            message = '新增成功'
          } else {
            message = '修改成功'
            delete params.password
          }
          this_.postRequest(url, params).then(data => {
            this_.editLoading = false
            this_.$message({
              message: message,
              type: 'success'
            })
            this_.getTableData()
            this_.popDetail = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
        setTimeout(function() {
          this_.editLoading = false
        }, 2000)
      })
    },
    // 重置表单
    resetForm(formName) {
      if (formName === 'popForm') {
        this.popData = {
          employeeName: '',
          employeeCode: '',
          password: '',
          passwordConfirm: '',
          employeeRealName: '',
          mail: '',
          landPhone: '',
          phone: '',
          deptId: '',
          rid: '',
          employeeType: '',
          remark: ''
        }
      } else if (formName === 'passForm') {
        this.passData = {
          id: '',
          password: '',
          passwordConfirm: ''
        }
      }
    },
    // 表格条数改变
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    // 表格页数改变
    pageChange(val) {
      this.getTableData(val, 'page')
    }
  }
}
</script>

