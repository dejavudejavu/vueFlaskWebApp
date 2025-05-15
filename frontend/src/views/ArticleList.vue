<template>
  <div class="article-list">
    <div class="header">
      <h2>文章列表</h2>
      <el-button type="primary" @click="showCreateDialog">新建文章</el-button>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="搜索文章标题"
        class="search-input"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 文章列表 -->
    <el-table :data="filteredArticles" style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="scope">
          {{ new Date(scope.row.created_at).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="viewArticle(scope.row)">查看</el-button>
          <el-button size="small" type="primary" @click="editArticle(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteArticle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑文章对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建文章' : dialogType === 'edit' ? '编辑文章' : '查看文章'"
      width="50%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            :disabled="dialogType === 'view'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogType !== 'view'" type="primary" @click="saveArticle">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const API_BASE_URL = 'http://localhost:5000/api'

const articles = ref([])
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogType = ref('create') // 'create', 'edit', 'view'
const form = ref({
  id: null,
  title: '',
  content: ''
})

// 过滤文章列表
const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value
  return articles.value.filter(article => 
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 获取文章列表
const fetchArticles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles`)
    articles.value = response.data
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogType.value = 'create'
  form.value = {
    id: null,
    title: '',
    content: ''
  }
  dialogVisible.value = true
}

// 查看文章
const viewArticle = (article) => {
  dialogType.value = 'view'
  form.value = { ...article }
  dialogVisible.value = true
}

// 编辑文章
const editArticle = (article) => {
  dialogType.value = 'edit'
  form.value = { ...article }
  dialogVisible.value = true
}

// 保存文章
const saveArticle = async () => {
  try {
    if (dialogType.value === 'edit') {
      await axios.put(`${API_BASE_URL}/articles/${form.value.id}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await axios.post(`${API_BASE_URL}/articles`, form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchArticles()
  } catch (error) {
    ElMessage.error(dialogType.value === 'edit' ? '更新失败' : '创建失败')
  }
}

// 删除文章
const deleteArticle = async (article) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    await axios.delete(`${API_BASE_URL}/articles/${article.id}`)
    ElMessage.success('删除成功')
    fetchArticles()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.article-list {
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.search-box {
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-end;
}

.search-input {
  width: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
}

:deep(.el-button) {
  margin-left: 8px;
}

:deep(.el-button:first-child) {
  margin-left: 0;
}
</style> 