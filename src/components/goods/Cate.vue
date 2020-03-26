<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 商品分类列表 -->
    <el-card>
      <el-button type="primary" @click="cateAdd">添加商品</el-button>
      <zk-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            :style="{color:mycolor}"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="action" scope>
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[1,2,5,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- form -->
      <el-form :model="cateForm" :rules="cateFormrRules" ref="cateFormRef" label-width="80px">
        <el-form-item label="商品名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="assign"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      mycolor: 'lime',
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'action'
        }
      ],
      cateDialogVisible: false,
      // 添加分类
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentCateList: [],
      cateFormrRules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      selectKeys: [],
      assign: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const res = await this.$http.get('categories', { params: this.queryInfo })
      // console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = data.result
      this.total = data.total
    },
    // 分页事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 添加商品分类
    cateAdd() {
      this.addCateList()
      this.cateDialogVisible = true
    },
    async addCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.parentCateList = res.data
    },
    // 级联选择器事件
    handleChange() {
      // console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        // 父级分类id
        this.cateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]

        // 当前分类等级
        this.cateForm.cat_level = this.selectKeys.length
      } else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      }
    },
    // 提交商品分类添加
    submitCate() {
      console.log(this.cateForm)
      // 校验
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.cateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加商品成功')
        this.getCateList()
        this.cateDialogVisible = false
      })
    },
    // 弹框关闭事件
    addCateDialogClosed() {
      // 重置表单
      this.$refs.cateFormRef.resetFields()
      this.cateForm.cat_pid = 0
      this.cateForm.cat_level = 0
      this.selectKeys = []
      // this.cateDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
