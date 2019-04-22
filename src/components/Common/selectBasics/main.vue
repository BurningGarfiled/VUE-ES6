<template>
  <div>
    <el-select
      v-model="newValue"
      :loading="loading"
      :clearable="clearable"
      :placeholder="placeholder"
      :style="styleName"
      :remote-method="remoteMethod"
      :filterable="filterable"
      :remote="remote"
      :disabled="disabled"
      :popper-class="popperClass">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="obj?item:item.value">
        <slot v-bind="bindArr(item)" />
      </el-option>
    </el-select>
  </div>
</template>

<script>
import BasicsType from './install'
export default {
  name: 'SelectBasics',
  props: {
    /* eslint-disable*/
    // v-model默认传入属性值
    value: [Number, String, Object],
    defOpt:[String,Object],
    // 配置是否可清空(查询条件中 可以配置清空方便查询全部)
    clearable: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认提醒
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    // 默认返回数据
    obj: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 默认样式
    styleName: {
      type: String,
      default() {
        return ''
      }
    },
    //Select 下拉框的类名
    popperClass:{
            type: String,
      default() {
        return ''
      }

    },
    // 默认类型
    type: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default() {
        return false
      }
    },
    //是否为远程搜索
    remote: {
      type: Boolean,
      default() {
        return false
      }
    },
    //是否禁用
    disabled:{
      type: Boolean,
      default() {
        return false
      }
    },
        //多参数模糊查询
    queryArr: {
      type: Object,
      default() {
        return {}
      }
    },
    //
    query:{
   type: Object,
      default() {
        return {}
      }
    }

  },
  data() {
    return {
      options: [],//
      loading: false,
      BasicsType,
    }
  },
  computed: {
    newValue: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  },
  methods: {
    //插槽
    bindArr(item) {
      const obj = {}
      for (const key in item) {
        obj[key] = item[key]
      }
      return obj
    },
    //初始请求
    onSearch() {
      const suffix = this.BasicsType[this.type].mode1.url
      const options = this.BasicsType[this.type].mode1.options?this.BasicsType[this.type].mode1.options:this.BasicsType[this.type].options
      const url = 'kaili-basic/v1/' + suffix
      let params=Object.keys(this.query).length>0?this.query:''
      this.getRequestParams(url, params).then((res) => {
        this.options = res.data.map(item => {
          const obj = {}
          for (const key in options) {
            if(item[options[key]]!=undefined){
               obj[key] = item[options[key]]
            }else{
              obj[key]=''
            }
   
          }
          return obj
        })
      })
    },
    //远程搜索
    remoteMethod(query) {
      this.options=[] 
      let params={}
      let options=[]
      let url=''
      let state=false
      let message=''
      if (query) {
        if(Object.keys(this.queryArr).length>0){
          options =  this.BasicsType[this.type].mode3.options?this.BasicsType[this.type].mode3.options:this.BasicsType[this.type].options
          url =  'kaili-basic/v1/'+ this.BasicsType[this.type].mode3.url
          params[this.BasicsType[this.type].mode3.key]=query

       this.BasicsType[this.type].mode3.queryArr.forEach(item=>{
            if(item.required){
              if(this.queryArr[item.value]){
                    params[item.value]=this.queryArr[item.value] 
              }else{
                   state=true
                   message=item.message
              }
            }else{
              params[item.value]=this.queryArr[item.value]
            }
          })
        }else{
        let suffix = this.BasicsType[this.type].mode2.url.replace('xxxxx',query)
            options =  this.BasicsType[this.type].mode2.options?this.BasicsType[this.type].mode2.options:this.BasicsType[this.type].options
            url = 'kaili-basic/v1/' + suffix
        }
        if(state){
      this.$message({
            message: message,
            type: 'warning'
          })
          return false
        }
        this.loading = true
        this.getRequestParams(url, params).then((data) => {
          if (data.data) {
            this.loading = false
            this.options = data.data.map(item => {
              const obj = {}
              for (const key in options) {
          if(item[options[key]]!=undefined){
               obj[key] = item[options[key]]
            }else{
              obj[key]=''
            }
              }
              return obj
            })
          }
        })
      }else{
    
      }

    }
  },
  created() {
    if(!this.remote){
    this.onSearch()
    }else{
      if(this.defOpt){
        this.options=[]
        this.options.push(this.defOpt)
      }
    }

  }
}

</script>

<style lang="scss" scoped>
</style>
