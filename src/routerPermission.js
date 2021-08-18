import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

import getPageTitle from "/@/utils/get-page-title";
import Layout from "/@/layout/index.vue";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  NProgress.start();

  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = store.getters.token

//   return next()

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        if (to.matched.length === 0) {
          next({ path: "/404" });
          return;
        }
        next();
      } else {
        
        try {
          const { menus } = await store.dispatch("user/getInfo");

          if (!menus || (Array.isArray(menus) && menus.length <= 0)) {
            throw "该账号没有可访问菜单";
          }

          let accessRoutes;
          
          if (
            
            process.env.NODE_ENV === "production" ||
            process.env.NODE_ENV === "test"
          ) {
            accessRoutes = await store.dispatch("permission/setRoutes", menus);
          } else {
            console.log("customPlatform", customPlatform);
            if (true || customPlatform && customPlatform.localMenus) {
              accessRoutes = await store.dispatch("permission/generateRoutes", [
                "admin"
              ]);
            } else {
              accessRoutes = await store.dispatch(
                "permission/setRoutes",
                menus
              );
            }
          }
          
          // 处理 路由跳转
          const routerhead = {
            path: "/",
            component: Layout,
            hidden: true
          };
         
          try {
            if (accessRoutes[0]) {
              if (accessRoutes[0].children) {
                routerhead.redirect = {
                  name: accessRoutes[0].children[0].name
                };
              } else {
                routerhead.redirect = { name: accessRoutes[0].name };
              }
            }
          } catch (e) {
            console.error(e);
          }
         
          const router404 = {
            path: "*",
            meta: { title: "404" },
            redirect: "/404",
            hidden: true
          };

          router.addRoutes([routerhead, ...accessRoutes, router404]);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (error) {
          console.warn(error);
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.fullPath}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
