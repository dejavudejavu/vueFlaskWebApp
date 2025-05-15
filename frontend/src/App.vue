<script setup>
import { ref, onMounted } from 'vue'
import { ElContainer, ElHeader, ElMain, ElButton, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(false)

function checkLogin() {
  isLogin.value = !!localStorage.getItem('token')
}

onMounted(checkLogin)
window.addEventListener('storage', checkLogin)

function logout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    type: 'warning',
    confirmButtonText: '退出',
    cancelButtonText: '取消',
  }).then(() => {
    localStorage.removeItem('token')
    isLogin.value = false
    router.replace('/login')
  })
}
</script>

<template>
  <div class="app">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>博客管理系统</h1>
          <el-button v-if="isLogin" type="danger" size="small" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </el-header>
      <el-main>
        <div class="content-wrapper">
          <div class="content-center">
            <router-view />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f7fa;
  left: 0;
  position: absolute;
  right: 0;
  margin: auto;
  top: 0;
}

.el-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 2px;
}

.logout-btn {
  margin-right: 20px;
}

.el-main {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
}

.content-center {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
