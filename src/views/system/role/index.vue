<template>
  <div class="app-container">
    <v-pageSearch>
      <el-form :inline="true">
        <el-form-item label="角色：" label-width="70px">
          <el-input v-model="formSearch.name" clearable placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="备注：" label-width="70px">
          <el-input v-model="formSearch.remark" clearable placeholder="请输入"/>
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
        <el-table-column prop="name" label="角色名"/>
        <el-table-column prop="createTime" label="创建时间" min-width="90">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" title="编辑" icon="el-icon-edit" @click="editHandle(scope.row)"/>
            <el-button type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.row)"/>
            <el-button type="primary" title="分配权限" @click="powerHandle(scope.row)">
              <i class="iconfont">&#xe62d;</i>
            </el-button>
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
    <el-dialog :close-on-click-modal="false" :visible.sync="popDetail" :title="title" top="10vh" width="400px">
      <el-form ref="popForm" :model="popData" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名：" prop="name">
              <el-input v-model="popData.name" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="popData.remark" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="submitForm('popForm')">确定</el-button>
        <el-button @click.native="popDetail = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--权限弹窗-->
    <el-dialog :close-on-click-modal="false" :visible.sync="powerPop" title="权限分配" top="10vh" width="800px">
      <el-tabs v-model="powName" @tab-click="treeStyle">
        <el-tab-pane v-for="item in powerData.systemPost" :key="item.id" :label="item.name" :name="item.name">
          <el-tree
            :ref="item.name"
            :data="item.children"
            :render-content="renderContent"
            :filter-node-method="filterNode"
            :highlight-current="false"
            :expand-on-click-node="false"
            :props="defaultProps"
            show-checkbox
            default-expand-all
            node-key="id"/>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" @click.native="submitPow()">确定</el-button>
        <el-button @click.native="powerPop = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
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
        name: '', // 角色名
        remark: '' // 备注
      },
      title: '新增角色',
      isAdd: true, // 新增：true; 编辑：false
      editLoading: false, // 提交按钮禁用状态
      popDetail: false, // 弹窗显示状态
      popData: {
        name: '',
        remark: ''
      },
      powerPop: false, // 分配权限弹窗
      powName: 'System', // tag标签
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      powerData: {
        id: '',
        systemPost: [],
        mids: []
      } // 权限数据
    }
  },
  mounted() {
    this.getTableData()
    this.getPostTree(6)
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
      const url = 'kaili-basic/v1/baseRole'
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
      this_.isAdd = true
      this_.title = '新增角色'
      this_.popDetail = true
      this_.resetForm('popForm')
      this_.$nextTick(() => {
        this_.$refs['popForm'].clearValidate()
      })
    },
    // 编辑
    editHandle(row) {
      const this_ = this
      this_.isAdd = false
      this_.title = '编辑角色'
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
        const url = `kaili-basic/v1/baseRole/${row.id}`
        this_.deleteRequest(url).then((data) => {
          this_.$message({
            message: '删除成功',
            type: 'success'
          })
          this_.getTableData()
        })
      })
    },
    // 分配权限
    powerHandle(row) {
      this.powerData.id = row.id
      this.getPostTree(row.id, true)
    },
    // 提交表单
    submitForm(formName) {
      const this_ = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this_.editLoading = true
          const url = 'kaili-basic/v1/baseRole'
          const params = this_.$gFun.arrDeepCopy(this_.popData)
          let message = ''
          if (this_.isAdd) {
            message = '新增成功'
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
            message = '修改成功'
            this_.putRequest(url, params).then(data => {
              this_.editLoading = false
              this_.$message({
                message: message,
                type: 'success'
              })
              this_.getTableData()
              this_.popDetail = false
            })
          }
          setTimeout(function() {
            this_.editLoading = false
          }, 2000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.popData = {
        name: '',
        remark: ''
      }
    },
    // 获取权限树
    getPostTree(id, flag) {
      const this_ = this
      const url = `kaili-basic/v1/baseRole/menu/${id}`
      this.getRequestParams(url, '').then((data) => {
        this_.powName = data.data.baseMenus[0].name
        if (flag) {
          this_.powerPop = true
          this_.treeStyle()
          this_.powerData.mids = data.data.mids
          this_.treeCheck()
        } else {
          this_.powerData.systemPost = data.data.baseMenus
          this_.powerData.mids = []
        }
      })
    },
    // 设置权限树勾选
    treeCheck() {
      const arr = this.powerData.systemPost
      const post = this.powerData.mids
      this.$nextTick(() => {
        arr.forEach(e => {
          const key = e.name
          this.$refs[key][0].setCheckedKeys(post)
        })
      })
    },
    // 内容区渲染后执行 判断底层 赋 class, 最低层横向排列
    renderContent(h, { node, data, store }) {
      let classname = ''
      if (node.level === 3) {
        classname = 'levelname'
      }
      // 由于项目中有二级菜单也有三级菜单，就要在此做出判断。
      if (node.level === 2 && node.childNodes.length === 0) {
        classname = 'levelname'
      }
      return (
        <p class={classname}>
          {node.label}
        </p>)
    },
    // 设置权限树class样式
    treeStyle() {
      setTimeout(() => {
        var levelName = document.getElementsByClassName('levelname') // levelname是上面的最底层节点的名字
        for (var i = 0; i < levelName.length; i++) {
          // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
          levelName[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
          levelName[i].parentNode.style.styleFloat = 'left'
        }
      }, 100)
    },
    // 权限树过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 提交权限分配
    submitPow() {
      this.editLoading = true
      const arr = this.powerData.systemPost
      let checkedKeys = [] // 勾选的权限数组
      arr.forEach(e => {
        const key = e.name
        const checked = this.$refs[key][0].getCheckedKeys()
        checkedKeys = checkedKeys.concat(checked)
      })
      const url = 'kaili-basic/v1/baseRole/roleMenu'
      const params = {
        id: this.powerData.id,
        mids: checkedKeys
      }
      this.postRequest(url, params).then(data => {
        this.editLoading = false
        this.$message({
          message: '权限分配成功',
          type: 'success'
        })
        this.powerPop = false
        this.getTableData()
      })
      setTimeout(() => {
        this.editLoading = false
      }, 2000)
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

