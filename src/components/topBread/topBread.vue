<template>
  <!-- 面包屑头部 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{levet1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{levet2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props:['levet1','levet2'],
};
</script>

<style>
</style>