<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      v-if="notMobileDevice"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />

    <div class="right-menu">
      <template>
        <search
          v-if="notMobileDevice"
          id="header-search"
          class="right-menu-item"
        />

        <error-log
          v-if="notMobileDevice"
          class="errLog-container right-menu-item hover-effect"
        />

        <el-tooltip
          v-if="notMobileDevice"
          content="布局大小"
          effect="dark"
          placement="bottom"
        >
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        :style="device === 'mobile' ? 'margin-right:10px' : ''"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>

          <el-dropdown-item divided>
            <div @click="logout">退出登录</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "/@/components/Breadcrumb/index.vue";
import Hamburger from "/@/components/Hamburger/index.vue";
import ErrorLog from "/@/components/ErrorLog/index.vue";

import SizeSelect from "/@/components/SizeSelect/index.vue";
import Search from "/@/components/HeaderSearch/index.vue";


import permission from "/@/directive/permission/index.js"; // 权限判断指令

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,

    SizeSelect,
    Search,
  },
  directives: { permission },
  data() {
    return {
     
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "device",
      "manageDtoList",
    ]),
    notMobileDevice() {
      return this.device !== "mobile";
    },
  },
  watch: {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },

  mounted() {
    // console.log("this.data", this);
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
