<template>
  <div class="app-container">
    <v-pageSearch>
      <el-row v-if="isAdd" class="search-container">
        <el-form ref="formSearch" :model="formSearch" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="流水号类型：" prop="ewbType">
                <el-select v-model="formSearch.ewbType" filterable placeholder="请输入">
                  <el-option
                    v-for="item in ewbType_options_add"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item v-show="SubunitStatus==formSearch.ewbType" label="子弹扩展位数：">
                <el-input-number v-model="formSearch.SubunitLength" :min="0" :max="4"/>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第1段规则类型：" prop="ruleType1">
                <el-select :disabled="dis_ruleType1" v-model="formSearch.ruleType1" filterable @change="change_ruleType1()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength1">
                <el-input-number ref="ruleLength1" :disabled="dis_ruleLength1" v-model="formSearch.ruleLength1" :min="0" @change="vchange('ruleLength1', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue1">
                <el-input :disabled="dis_ruleValue1" :maxlength="formSearch.ruleLength1" v-model="formSearch.ruleValue1" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第2段规则类型：" prop="ruleType2">
                <el-select :disabled="dis_ruleType2" v-model="formSearch.ruleType2" filterable @change="change_ruleType2()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength2">
                <el-input-number ref="ruleLength2" :disabled="dis_ruleLength2" v-model="formSearch.ruleLength2" :min="0" @change="vchange('ruleLength2', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue2">
                <el-input :disabled="dis_ruleValue2" :maxlength="formSearch.ruleLength2" v-model="formSearch.ruleValue2" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第3段规则类型：" prop="ruleType3">
                <el-select :disabled="dis_ruleType3" v-model="formSearch.ruleType3" filterable @change="change_ruleType3()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength3" >
                <el-input-number ref="ruleLength3" :disabled="dis_ruleLength3" v-model="formSearch.ruleLength3" :min="0" @change="vchange('ruleLength3', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue3" >
                <el-input :disabled="dis_ruleValue3" :maxlength="formSearch.ruleLength3" v-model="formSearch.ruleValue3" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第4段规则类型：" prop="ruleType4">
                <el-select :disabled="dis_ruleType4" v-model="formSearch.ruleType4" filterable @change="change_ruleType4()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength4">
                <el-input-number ref="ruleLength4" :disabled="dis_ruleLength4" v-model="formSearch.ruleLength4" :min="0" @change="vchange('ruleLength4', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue4">
                <el-input :disabled="dis_ruleValue4" :maxlength="formSearch.ruleLength4" v-model="formSearch.ruleValue4" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第5段规则类型：" prop="ruleType5">
                <el-select :disabled="dis_ruleType5" v-model="formSearch.ruleType5" filterable @change="change_ruleType5()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength5">
                <el-input-number ref="ruleLength5" :disabled="dis_ruleLength5" v-model="formSearch.ruleLength5" :min="0" @change="vchange('ruleLength5', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue5">
                <el-input :disabled="dis_ruleValue5" :maxlength="formSearch.ruleLength5" v-model="formSearch.ruleValue5" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="第6段规则类型：" prop="ruleType6">
                <el-select :disabled="dis_ruleType6" v-model="formSearch.ruleType6" filterable @change="change_ruleType6()">
                  <el-option
                    v-for="item in ruleType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规定长度：" prop="ruleLength6">
                <el-input-number ref="ruleLength6" :disabled="dis_ruleLength6" v-model="formSearch.ruleLength6" :min="0" @change="vchange('ruleLength6', $event)"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则固定值：" prop="ruleValue6">
                <el-input :disabled="dis_ruleValue6" :maxlength="formSearch.ruleLength6" v-model="formSearch.ruleValue6" @change="makeBarCode()"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="流水号规则：" prop="barcode_rule">
                <el-input v-model="formSearch.barcode_rule" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规则示例：">
                <span style="font-size: 20px;color: red;">{{ formSearch.example }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="规则备注：">
              <el-input v-model="formSearch.remark" type="textarea"/>
            </el-form-item>
          </el-row>

          <el-form-item class="operation-bar">
            <el-button :disabled="ableSave" :loading="editLoading" type="primary" @click="submitForm('formSearch')">提交</el-button>
            <el-button @click="goBack()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-form v-else :inline="true">
        <el-form-item label="流水号类型：" prop="ewbType">
          <el-select v-model="formSearch.ewbTypeQuery" filterable placeholder="请选择">
            <el-option
              v-for="item in ewbType_options"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.dictId"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </v-pageSearch>

    <v-pageToolbar align="left">
      <el-button :disabled="isAdd" type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </v-pageToolbar>

    <v-pageTable>
      <el-table
        v-loading="table.loading"
        :header-cell-style="$store.state.element.headerBg"
        :data="table.body"
        :max-height="table.autoHeight"
      >
        <el-table-column prop="ewbTypeName" label="流水号类型" min-width="110"/>
        <el-table-column prop="barcodeRule" label="流水号规则" min-width="250"/>
        <el-table-column prop="remark" label="备注" min-width="180"/>
        <el-table-column prop="createByName" label="创建人" min-width="80"/>
        <el-table-column prop="createTime" label="创建时间" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="primary" title="删除" icon="el-icon-delete" @click="deleteHandle(scope.$index, scope.row)"/>
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
  </div>
</template>

<script>
export default {
  name: 'BarCode',
  data() {
    var validate_ruleLength1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue1 !== '') {
          this.$refs.formSearch.validateField('ruleValue1')
        }
        callback()
      }
    }
    var validate_ruleValue1 = (rule, value, callback) => {
      if (this.formSearch.ruleType1 === 9) {
        if (this.formSearch.ruleLength1 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength1) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_ruleLength2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue2 !== '') {
          this.$refs.formSearch.validateField('ruleValue2')
        }
        callback()
      }
    }
    var validate_ruleValue2 = (rule, value, callback) => {
      if (this.formSearch.ruleType2 === 9) {
        if (this.formSearch.ruleLength2 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength2) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_ruleLength3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue3 !== '') {
          this.$refs.formSearch.validateField('ruleValue3')
        }
        callback()
      }
    }
    var validate_ruleValue3 = (rule, value, callback) => {
      if (this.formSearch.ruleType3 === 9) {
        if (this.formSearch.ruleLength3 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength3) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_ruleLength4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue4 !== '') {
          this.$refs.formSearch.validateField('ruleValue4')
        }
        callback()
      }
    }
    var validate_ruleValue4 = (rule, value, callback) => {
      if (this.formSearch.ruleType4 === 9) {
        if (this.formSearch.ruleLength4 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength4) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_ruleLength5 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue5 !== '') {
          this.$refs.formSearch.validateField('ruleValue5')
        }
        callback()
      }
    }
    var validate_ruleValue5 = (rule, value, callback) => {
      if (this.formSearch.ruleType5 === 9) {
        if (this.formSearch.ruleLength5 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength5) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_ruleLength6 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入长度'))
      } else {
        if (this.formSearch.ruleValue6 !== '') {
          this.$refs.formSearch.validateField('ruleValue6')
        }
        callback()
      }
    }
    var validate_ruleValue6 = (rule, value, callback) => {
      if (this.formSearch.ruleType6 === 9) {
        if (this.formSearch.ruleLength6 !== 0 && value === '') {
          callback(new Error('请输入字符'))
        } else if (value.length !== this.formSearch.ruleLength6) {
          callback(new Error('字符长度不匹配'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validate_barcode_rule = (rule, value, callback) => {
      if (value === '/^(\S.)$/') {
        callback(new Error('请定义运单规则'))
      } else {
        callback()
      }
    }
    return {
      formSearch: {
        ewbType: '', // 运单类型
        ewbTypeQuery: '', // 查询运单类型
        SubunitLength: 3, // 子弹扩展位数
        example: '000000000000',
        ruleType1: 2, // 规则类型
        ruleLength1: 0, // 规则长度
        ruleValue1: '', // 规则固定值
        ruleType2: 1,
        ruleLength2: 0,
        ruleValue2: '',
        ruleType3: 1,
        ruleLength3: 0,
        ruleValue3: '',
        ruleType4: 1,
        ruleLength4: 0,
        ruleValue4: '',
        ruleType5: 1,
        ruleLength5: 0,
        ruleValue5: '',
        ruleType6: 1,
        ruleLength6: 0,
        ruleValue6: '',
        barcode_rule: '/^(\S.)$/', // 规则
        remark: ''// 备注
      },
      SubunitStatus: false, // 新增子单状态
      // 文本标识
      ableSave: false,
      dis_ruleType1: false,
      dis_ruleLength1: false,
      dis_ruleValue1: true,
      dis_ruleType2: false,
      dis_ruleLength2: true,
      dis_ruleValue2: true,
      dis_ruleType3: true,
      dis_ruleLength3: true,
      dis_ruleValue3: true,
      dis_ruleType4: true,
      dis_ruleLength4: true,
      dis_ruleValue4: true,
      dis_ruleType5: true,
      dis_ruleLength5: true,
      dis_ruleValue5: true,
      dis_ruleType6: true,
      dis_ruleLength6: true,
      dis_ruleValue6: true,
      rules: {
        ruleLength1: [
          { validator: validate_ruleLength1, trigger: 'change' }
        ],
        ruleValue1: [
          { validator: validate_ruleValue1, trigger: 'change' }
        ],
        ruleLength2: [
          { validator: validate_ruleLength2, trigger: 'change' }
        ],
        ruleValue2: [
          { validator: validate_ruleValue2, trigger: 'change' }
        ],
        ruleLength3: [
          { validator: validate_ruleLength3, trigger: 'change' }
        ],
        ruleValue3: [
          { validator: validate_ruleValue3, trigger: 'change' }
        ],
        ruleLength4: [
          { validator: validate_ruleLength4, trigger: 'change' }
        ],
        ruleValue4: [
          { validator: validate_ruleValue4, trigger: 'change' }
        ],
        ruleLength5: [
          { validator: validate_ruleLength5, trigger: 'change' }
        ],
        ruleValue5: [
          { validator: validate_ruleValue5, trigger: 'change' }
        ],
        ruleLength6: [
          { validator: validate_ruleLength6, trigger: 'change' }
        ],
        ruleValue6: [
          { validator: validate_ruleValue6, trigger: 'change' }
        ],
        barcode_rule: [
          { validator: validate_barcode_rule, trigger: 'change' }
        ]
      },
      table: {
        body: [],
        page: 1,
        pageSize: 15,
        paginationTotal: 15,
        autoHeight: 749,
        loading: false
      },
      editLoading: false,
      isAdd: false, // 表单显示状态
      ewbType_options: [],
      ewbType_options_add: [],
      ruleType_options: [{
        value: 1,
        label: '不存在',
        expression: '',
        example: ''
      }, {
        value: 2,
        label: '数字',
        expression: '[0-9]',
        example: '0'
      }, {
        value: 3,
        label: '数字或大小写字母',
        expression: '[0-9A-Za-z]',
        example: '0aA'
      }, {
        value: 4,
        label: '数字或大小写字母',
        expression: '[0-9A-Z]',
        example: '0A'
      }, {
        value: 5,
        label: '数字或大小写字母',
        expression: '[0-9a-z]',
        example: '0a'
      }, {
        value: 6,
        label: '大小写字母',
        expression: '[A-Za-z]',
        example: 'aA'
      }, {
        value: 7,
        label: '大写字母',
        expression: '[A-Z]',
        example: 'A'
      }, {
        value: 8,
        label: '小写字母',
        expression: '[a-z]',
        example: 'a'
      }, {
        value: 9,
        label: '固定字符',
        expression: '',
        example: ''
      }]
    }
  },
  mounted() {
    this.onSearch()
    this.baseInfo()

    const this_ = this
    const clientHeight = document.body.clientHeight
    this_.table.autoHeight = clientHeight - 290
    window.addEventListener('resize', function() {
      const clientHeight = document.body.clientHeight
      this_.table.autoHeight = clientHeight - 290
    })
  },
  methods: {
    sumAll(els) {
      var sum = 0
      for (const el of els) {
        sum += this.$refs[el].currentInputValue || 0
      }
      return sum
    },
    setInputValue(newVal, el, max, min) {
      if (newVal >= max) newVal = max
      if (newVal <= min) newVal = min
      this.$nextTick(() => {
        this.formSearch[el] = newVal
      })
    },
    vchange(currentEl, currentElVal) {
      var els = ['ruleLength1', 'ruleLength2', 'ruleLength3', 'ruleLength4', 'ruleLength5', 'ruleLength6']
      els.splice(els.indexOf(currentEl), 1) // 删除当前
      var otherSum = this.sumAll(els) // 计算出当前外的和
      if (otherSum + currentElVal > 30) { // 如果当前加其他超过30
        this.$message.warning('长度不能超过30位')
        this.ableSave = true
        var overVal = 30 - otherSum // 剩下还能支配值的数值
        this.setInputValue(currentElVal, currentEl, overVal, 0) // 将剩下还能支配的数值作为最大值，更新改组件
      } else {
        this.ableSave = false
      }
      this.makeBarCode()
    },
    // 数据字典获取
    baseInfo() {
      const this_ = this
      const url = `kaili-basic/v1/dicts/${69}/byParentId`
      this.getRequestParams(url, {}).then(data => {
        this_.ewbType_options = Object.assign([], data.data)
        this_.ewbType_options.unshift({
          dictCode: '0',
          dictId: '',
          dictName: '全部'
        })
        this_.ewbType_options_add = Object.assign([], data.data)
      })
    },
    // 查询
    getTableData(val, flag) {
      const this_ = this
      this_.table.loading = true
      const url = 'kaili-basic/v1/barcoderules'
      if (flag === 'pageSize') {
        this.table.pageSize = val
      } else if (flag === 'page') {
        this.table.page = val
      }

      const params = {
        'page': this.table.page,
        'pageSize': this.table.pageSize,
        'ewbType': this.formSearch.ewbTypeQuery
      }

      this.getRequestParams(url, params).then(data => {
        this_.table.body = data.data.records
        this_.table.paginationTotal = data.data.total
        this_.table.loading = false
      })
    },
    // 表格显示条数变化
    sizeChange(val) {
      this.getTableData(val, 'pageSize')
    },
    // 表格显示页数变化
    pageChange(val) {
      this.getTableData(val, 'page')
    },

    /* 新增 查询 */
    // 第一段规则类型
    change_ruleType1() {
      if (this.formSearch.ruleType1 === 1) {
        this.dis_ruleLength1 = true
        this.dis_ruleValue1 = true
        this.dis_ruleType2 = true
        this.dis_ruleLength2 = true
        this.dis_ruleValue2 = true
        this.formSearch.ruleType2 = 1
        this.formSearch.ruleLength2 = 0
        this.formSearch.ruleValue2 = ''
        this.dis_ruleType3 = true
        this.dis_ruleLength3 = true
        this.dis_ruleValue3 = true
        this.formSearch.ruleType3 = 1
        this.formSearch.ruleLength3 = 0
        this.formSearch.ruleValue3 = ''
        this.dis_ruleType4 = true
        this.dis_ruleLength4 = true
        this.dis_ruleValue4 = true
        this.formSearch.ruleType4 = 1
        this.formSearch.ruleLength4 = 0
        this.formSearch.ruleValue4 = ''
        this.dis_ruleType5 = true
        this.dis_ruleLength5 = true
        this.dis_ruleValue5 = true
        this.formSearch.ruleType5 = 1
        this.formSearch.ruleLength5 = 0
        this.formSearch.ruleValue5 = ''
        this.dis_ruleType6 = true
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
        this.formSearch.ruleType6 = 1
        this.formSearch.ruleLength6 = 0
        this.formSearch.ruleValue6 = ''
      } else if (this.formSearch.ruleType1 === 9) {
        this.dis_ruleValue1 = false
        this.dis_ruleLength1 = false
        this.dis_ruleType2 = false
      } else {
        this.dis_ruleLength1 = false
        this.dis_ruleValue1 = true
        this.dis_ruleType2 = false
      }
      this.formSearch.ruleLength1 = 0
      this.formSearch.ruleValue1 = ''
    },
    // 第二段规则类型
    change_ruleType2() {
      if (this.formSearch.ruleType2 === 1) {
        this.dis_ruleLength2 = true
        this.dis_ruleValue2 = true
        this.dis_ruleType3 = true
        this.dis_ruleLength3 = true
        this.dis_ruleValue3 = true
        this.formSearch.ruleType3 = 1
        this.formSearch.ruleLength3 = 0
        this.formSearch.ruleValue3 = ''
        this.dis_ruleType4 = true
        this.dis_ruleLength4 = true
        this.dis_ruleValue4 = true
        this.formSearch.ruleType4 = 1
        this.formSearch.ruleLength4 = 0
        this.formSearch.ruleValue4 = ''
        this.dis_ruleType5 = true
        this.dis_ruleLength5 = true
        this.dis_ruleValue5 = true
        this.formSearch.ruleType5 = 1
        this.formSearch.ruleLength5 = 0
        this.formSearch.ruleValue5 = ''
        this.dis_ruleType6 = true
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
        this.formSearch.ruleType6 = 1
        this.formSearch.ruleLength6 = 0
        this.formSearch.ruleValue6 = ''
      } else if (this.formSearch.ruleType2 === 9) {
        this.dis_ruleValue2 = false
        this.dis_ruleLength2 = false
        this.dis_ruleType3 = false
      } else {
        this.dis_ruleLength2 = false
        this.dis_ruleValue2 = true
        this.dis_ruleType3 = false
      }
      this.formSearch.ruleLength2 = 0
      this.formSearch.ruleValue2 = ''
      this.makeBarCode()
    },
    // 第三段规则类型
    change_ruleType3() {
      if (this.formSearch.ruleType3 === 1) {
        this.dis_ruleValue3 = true
        this.dis_ruleLength3 = true
        this.dis_ruleType4 = true
        this.dis_ruleLength4 = true
        this.dis_ruleValue4 = true
        this.formSearch.ruleType4 = 1
        this.formSearch.ruleLength4 = 0
        this.formSearch.ruleValue4 = ''
        this.dis_ruleType5 = true
        this.dis_ruleLength5 = true
        this.dis_ruleValue5 = true
        this.formSearch.ruleType5 = 1
        this.formSearch.ruleLength5 = 0
        this.formSearch.ruleValue5 = ''
        this.dis_ruleType6 = true
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
        this.formSearch.ruleType6 = 1
        this.formSearch.ruleLength6 = 0
        this.formSearch.ruleValue6 = ''
      } else if (this.formSearch.ruleType3 === 9) {
        this.dis_ruleLength3 = false
        this.dis_ruleValue3 = false
        this.dis_ruleType4 = false
      } else {
        this.dis_ruleLength3 = false
        this.dis_ruleValue3 = true
        this.dis_ruleType4 = false
      }
      this.formSearch.ruleLength3 = 0
      this.formSearch.ruleValue3 = ''
      this.makeBarCode()
    },
    // 第四段规则类型
    change_ruleType4() {
      if (this.formSearch.ruleType4 === 1) {
        this.dis_ruleLength4 = true
        this.dis_ruleValue4 = true
        this.dis_ruleType5 = true
        this.dis_ruleLength5 = true
        this.dis_ruleValue5 = true
        this.formSearch.ruleType5 = 1
        this.formSearch.ruleLength5 = 0
        this.formSearch.ruleValue5 = ''
        this.dis_ruleType6 = true
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
        this.formSearch.ruleType6 = 1
        this.formSearch.ruleLength6 = 0
        this.formSearch.ruleValue6 = ''
      } else if (this.formSearch.ruleType4 === 9) {
        this.dis_ruleValue4 = false
        this.dis_ruleLength4 = false
        this.dis_ruleType5 = false
      } else {
        this.dis_ruleLength4 = false
        this.dis_ruleValue4 = true
        this.dis_ruleType5 = false
      }
      this.formSearch.ruleLength4 = 0
      this.formSearch.ruleValue4 = ''
      this.makeBarCode()
    },
    // 第五段规则类型
    change_ruleType5() {
      if (this.formSearch.ruleType5 === 1) {
        this.dis_ruleLength5 = true
        this.dis_ruleValue5 = true
        this.dis_ruleType6 = true
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
        this.formSearch.ruleType6 = 1
        this.formSearch.ruleLength6 = 0
        this.formSearch.ruleValue6 = ''
      } else if (this.formSearch.ruleType5 === 9) {
        this.dis_ruleValue5 = false
        this.dis_ruleLength5 = false
        this.dis_ruleType6 = false
      } else {
        this.dis_ruleLength5 = false
        this.dis_ruleValue5 = true
        this.dis_ruleType6 = false
      }
      this.formSearch.ruleLength5 = 0
      this.formSearch.ruleValue5 = ''
      this.makeBarCode()
    },
    // 第六段规则类型
    change_ruleType6() {
      if (this.formSearch.ruleType6 === 1) {
        this.dis_ruleLength6 = true
        this.dis_ruleValue6 = true
      } else if (this.formSearch.ruleType6 === 9) {
        this.dis_ruleValue6 = false
        this.dis_ruleLength6 = false
      } else {
        this.dis_ruleLength6 = false
        this.dis_ruleValue6 = true
      }
      this.formSearch.ruleLength6 = 0
      this.formSearch.ruleValue6 = ''
      this.makeBarCode()
    },
    // 运单规则生成函数
    getReg(index) {
      for (const elem of this.ruleType_options) {
        if (elem.value === index) {
          return elem.expression
        }
      }
    },
    // 规则示例生成函数
    getExample(index, length) {
      for (const elem of this.ruleType_options) {
        if (elem.value === index) {
          const num = Math.ceil(length / elem.example.length)
          const arr = []
          for (let i = 0; i < num; i++) {
            arr.push(elem.example)
          }
          const value = (arr.join('')).substr(0, length)
          return value
        }
      }
    },
    makeBarCode() {
      // 初始化阶段规则变量
      let rule1 = ''
      let rule2 = ''
      let rule3 = ''
      let rule4 = ''
      let rule5 = ''
      let rule6 = ''
      // 初始化阶段规则变量
      let example1 = ''
      let example2 = ''
      let example3 = ''
      let example4 = ''
      let example5 = ''
      let example6 = ''
      if (this.formSearch.ruleType1 !== 9) {
        rule1 = this.formSearch.ruleLength1 ? this.getReg(this.formSearch.ruleType1) + '{' + this.formSearch.ruleLength1 + '}' : ''
        example1 = this.formSearch.ruleLength1 ? this.getExample(this.formSearch.ruleType1, this.formSearch.ruleLength1) : ''
      } else {
        rule1 = this.formSearch.ruleValue1
        example1 = this.formSearch.ruleValue1
      }

      if (this.formSearch.ruleType2 !== 9) {
        rule2 = this.formSearch.ruleLength2 ? this.getReg(this.formSearch.ruleType2) + '{' + this.formSearch.ruleLength2 + '}' : ''
        example2 = this.formSearch.ruleLength2 ? this.getExample(this.formSearch.ruleType2, this.formSearch.ruleLength2) : ''
      } else {
        rule2 = this.formSearch.ruleValue2
        example2 = this.formSearch.ruleValue2
      }

      if (this.formSearch.ruleType3 !== 9) {
        rule3 = this.formSearch.ruleLength3 ? this.getReg(this.formSearch.ruleType3) + '{' + this.formSearch.ruleLength3 + '}' : ''
        example3 = this.formSearch.ruleLength3 ? this.getExample(this.formSearch.ruleType3, this.formSearch.ruleLength3) : ''
      } else {
        rule3 = this.formSearch.ruleValue3
        example3 = this.formSearch.ruleValue3
      }

      if (this.formSearch.ruleType4 !== 9) {
        rule4 = this.formSearch.ruleLength4 ? this.getReg(this.formSearch.ruleType4) + '{' + this.formSearch.ruleLength4 + '}' : ''
        example4 = this.formSearch.ruleLength4 ? this.getExample(this.formSearch.ruleType4, this.formSearch.ruleLength4) : ''
      } else {
        rule4 = this.formSearch.ruleValue4
        example4 = this.formSearch.ruleValue4
      }

      if (this.formSearch.ruleType5 !== 9) {
        rule5 = this.formSearch.ruleLength5 ? this.getReg(this.formSearch.ruleType5) + '{' + this.formSearch.ruleLength5 + '}' : ''
        example5 = this.formSearch.ruleLength5 ? this.getExample(this.formSearch.ruleType5, this.formSearch.ruleLength5) : ''
      } else {
        rule5 = this.formSearch.ruleValue5
        example5 = this.formSearch.ruleValue5
      }

      if (this.formSearch.ruleType6 !== 9) {
        rule6 = this.formSearch.ruleLength6 ? this.getReg(this.formSearch.ruleType6) + '{' + this.formSearch.ruleLength6 + '}' : ''
        example6 = this.formSearch.ruleLength6 ? this.getExample(this.formSearch.ruleType6, this.formSearch.ruleLength6) : ''
      } else {
        rule6 = this.formSearch.ruleValue6
        example6 = this.formSearch.ruleValue6
      }

      if (this.formSearch.ruleLength1 === 0 && rule2 === '' && rule3 === '' && rule4 === '' && rule5 === '' && rule6 === '') {
        this.formSearch.barcode_rule = '/^(\S.)$/'
        this.formSearch.example = '000000000000'
      } else {
        this.formSearch.barcode_rule = '/^(' + rule1 + rule2 + rule3 + rule4 + rule5 + rule6 + ')$/'
        this.formSearch.example = example1 + example2 + example3 + example4 + example5 + example6
      }
    },
    // 多条件查询
    onSearch() {
      this.pageChange(1, 'page')
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const this_ = this
          this_.editLoading = true
          const url = 'kaili-basic/v1/barcoderules'
          const params = {
            'ewbType': this.formSearch.ewbType,
            'barcodeRule': this.formSearch.barcode_rule,
            'length': this.formSearch.ruleLength1 + this.formSearch.ruleLength2 + this.formSearch.ruleLength3 + this.formSearch.ruleLength4 + this.formSearch.ruleLength5 + this.formSearch.ruleLength6,
            'chLength': this.formSearch.SubunitLength,
            'parentId': 0,
            'remark': this.formSearch.remark
          }

          this.postRequest(url, params).then(data => {
            this_.editFormVisible = false
            this_.getTableData()
            this_.isAdd = false
          })
          setTimeout(function() {
            this_.editLoading = false
          }, 2000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      // 文本标识
      this.dis_ruleType1 = false
      this.dis_ruleLength1 = false
      this.dis_ruleValue1 = true
      this.dis_ruleType2 = false
      this.dis_ruleLength2 = true
      this.dis_ruleValue2 = true
      this.dis_ruleType3 = true
      this.dis_ruleLength3 = true
      this.dis_ruleValue3 = true
      this.dis_ruleType4 = true
      this.dis_ruleLength4 = true
      this.dis_ruleValue4 = true
      this.dis_ruleType5 = true
      this.dis_ruleLength5 = true
      this.dis_ruleValue5 = true
      this.dis_ruleType6 = true
      this.dis_ruleLength6 = true
      this.dis_ruleValue6 = true
      this.formSearch = {
        ewbType: this.ewbType_options[0].dictId, // 运单类型
        ewbTypeQuery: '',
        SubunitLength: 3, // 子弹扩展位数
        example: '000000000000',
        ruleType1: 2, // 规则类型
        ruleLength1: 0, // 规则长度
        ruleValue1: '', // 规则固定值
        ruleType2: 1,
        ruleLength2: 0,
        ruleValue2: '',
        ruleType3: 1,
        ruleLength3: 0,
        ruleValue3: '',
        ruleType4: 1,
        ruleLength4: 0,
        ruleValue4: '',
        ruleType5: 1,
        ruleLength5: 0,
        ruleValue5: '',
        ruleType6: 1,
        ruleLength6: 0,
        ruleValue6: '',
        barcode_rule: '/^(\S.)$/', // 规则
        remark: ''// 备注
      }
    },
    // 删除
    deleteHandle(index, row) {
      if (row.ewbTypeName === '子单') {
        this.$message.warning('运单类型为子单，不允许删除')
      } else {
        const this_ = this
        this.$confirm('确认删除？', '提示', {
          type: 'warning'
        }).then(() => {
          this_.table.loading = true
          const arr = [row.id]
          const param = {
            ids: arr.join(',')
          }
          const url = 'kaili-basic/v1/barcoderules/bat'
          this_.deleteRequest(url, param).then(data => {
            this_.getTableData()
            this_.table.loading = false
            this_.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {
          console.log('删除失败')
        })
      }
    },
    // 新增
    onAdd() {
      this.isAdd = true
      this.ewbType_options_add.forEach((item, index) => {
        if (item.dictName === '子单') {
          this.ewbType_options_add.splice(index, 1)
        }
        if (item.dictName === '托运单') {
          this.SubunitStatus = item.dictId
        }
      })
      this.formSearch.ewbType = this.ewbType_options_add[0].dictId
    },
    // 返回查询
    goBack() {
      this.resetForm('formSearch')
      this.isAdd = false
      this.formSearch.ewbTypeQuery = ''
      this.onSearch()
    }
  }
}
</script>

