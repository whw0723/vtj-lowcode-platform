<template>
  <div>
    <el-form :model="state.queryParams" inline>
      <el-form-item label="用户名">
        <el-input
          v-model="state.queryParams.username"
          placeholder="请输入用户名"
          clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="state.queryParams.gender"
          placeholder="请选择性别"
          clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input
          v-model="state.queryParams.phone"
          placeholder="请输入手机号"
          clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="state.tableData" border stripe v-loading="state.loading">
      <el-table-column prop="id" label="用户ID" width="100" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="{ row }">{{
          row.gender === 1 ? '男' : '女'
        }}</template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120" />
      <el-table-column prop="email" label="邮箱地址" width="180" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
      <el-table-column prop="createTime" label="注册时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" style="color: #f56c6c"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="state.pagination.currentPage"
      :page-size="state.pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="state.pagination.total"
      @size-change="handlePageChange('pageSize', $event)"
      @current-change="handlePageChange('currentPage', $event)" />
  </div>
</template>

<script>
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { useProvider } from '@vtj/renderer';
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination
  } from 'element-plus';

  export default defineComponent({
    name: 'UserList',
    components: {
      ElForm,
      ElFormItem,
      ElInput,
      ElSelect,
      ElOption,
      ElButton,
      ElTable,
      ElTableColumn,
      ElPagination
    },
    setup(props) {
      //   const provider = useProvider({ id: '45tltwv09', version: '1740707174334' });
      const state = reactive({
        queryParams: {
          username: '',
          gender: '',
          phone: ''
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      });
      return { state, props };
    },
    methods: {
      async fetchData() {
        this.state.loading = true;
        try {
          // 模拟接口调用
          const mockData = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            username: `user${i}`,
            age: 20 + i,
            gender: (i % 2) + 1,
            phone: `1380013800${i}`,
            email: `user${i}@example.com`,
            address: `北京市海淀区中关村大街${i}号`,
            createTime: new Date().toLocaleString()
          }));

          this.state.tableData = mockData;
          this.state.pagination.total = 50;
        } finally {
          this.state.loading = false;
        }
      },
      handleSearch() {
        this.state.pagination.currentPage = 1;
        this.fetchData();
      },
      handlePageChange(type, value) {
        this.state.pagination[type] = value;
        this.fetchData();
      }
    },
    mounted() {
      this.fetchData();
    }
  });
</script>

<style lang="css" scoped>
  .el-form--inline .el-form-item {
    margin-right: 20px;
  }
  .el-pagination {
    justify-content: flex-end;
  }
</style>
