<!-- 每个页面的标题，用来重复确认当前所处页面，亦可用作面包屑导航的外层结构。 -->
<template>
  <div class="page-title">
    <strong>{{ title }}</strong><span class="text-small" style="color:red;"> {{ small }}</span>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'VPageTitle',
  props: ['title', 'small']
}
</script>

<style lang="scss" scoped>
    .page-title{
        height: 30px;
        margin-bottom: 10px;
        border-bottom: 1px solid #d2d2d2;
        & > strong{
            line-height: 30px;
            font-size: 15px;
            font-weight: bold;
            color:  #333
        }
    }
</style>
