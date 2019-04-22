<template>
  <div class="page-section" >
    <div v-once class="title">
      <strong>{{ title }}</strong>
    </div>
    <slot/>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'VPageSection',
  props: ['title']
}
</script>

<style lang="scss" scoped>
    .page-section{
        display: block;
        width: 100%;
        margin-bottom: 10px*2;
        & > .title{
            height: 50px;
            margin-bottom: 10px;
            border-bottom: 1px solid #d2d2d2;
            &::after{
                content: "";
                display: block;
                height: 0;
                clear: both;
            }
            & > strong{
                font-weight: normal;
                font-size: 18px;
                line-height: 50px;
                color:  #333
            }
            &  > .toolbar{
                float: right;
            }
        }
    }
</style>
