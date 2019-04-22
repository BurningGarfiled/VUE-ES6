<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role.index">{{ role }}</span></div>
    <el-button type="info" icon="el-icon-message" circle @click="toTime"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {

  },
  methods: {
    toTime() {
      location.href = './static/canvas/index.html'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin:10px 20px;
    height: 100%;
    width:auto;
  }
  &-text {
    font-size: 20px;
    line-height: 20px;
    padding: 10px 0;
  }
}
</style>
