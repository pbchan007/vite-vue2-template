import Vue from "vue";
import Router from "vue-router";
import Layout from "/@/layout/index.vue";
Vue.use(Router);

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("/@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("/@/views/dashboard/index.vue"),
  },
  {
    path: "/login",
    component: () => import("/@/views/login/index.vue"),
    hidden: true,
  },
 
];

const createRouter = () =>
  new Router({
    mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
