<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "/@/styles/var.scss";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      uniqueOpened: false
    };
  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    controlUniqueOpened() {
      let computedShowItemNum = 0;
      const MAX_ITEM_NUM = 16;

      // 判断菜单个数
      for (let item of this.permission_routes) {
        if (!item.hidden) {
          computedShowItemNum++;
          if (computedShowItemNum >= MAX_ITEM_NUM) {
            this.uniqueOpened = true;
            break;
          }
          if (item.children) {
            for (let child of item.children) {
              if (!child.hidden) {
                computedShowItemNum++;
                if (computedShowItemNum >= MAX_ITEM_NUM) {
                  this.uniqueOpened = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
  },
  created() {
    this.controlUniqueOpened()
  }
};
</script>
