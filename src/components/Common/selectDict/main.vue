<template>
  <div >
    <el-select v-model="newValue" :clearable="clearable" :placeholder="placeholder" :style="styleName" :type="type">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectDict',
  props: {
    /* eslint-disable*/
    // v-model默认传入属性值
    value: [Number,String,Object],
    // 配置是否可清空(查询条件中 可以配置清空方便查询全部)
    clearable: {
      type: Boolean,
      default() {
        return false
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    styleName: {
      type: String,
      default() {
        return ''
      }
    },
    type: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      options: [],
      dictType: {
        depot: 200, // 仓库类型
        storage: 210,// 库位类型
        inStore:200//入库类型
      }
    }
  },
  computed: {
    newValue: {
      get: function() {
        return this.value
      },
      set: function(value) {
        this.$emit('input', value)
      }
    }
  },
  created() {
    if (this.type) {
      const url = `kaili-basic/v1/dicts/${this.dictType[this.type]}/byParentId`
      this.getRequest(url, '').then((res) => {
        this.options = res.data.map(item => {
          return { value: item.dictId, label: item.dictName }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
