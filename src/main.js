import Vue from "vue";
import "normalize.css/normalize.css";
import './styles/index.scss'
import Element from "element-ui";
import App from "./App.vue";
import store from "./store/index";
import router from "./router/index";

Vue.use(Element, {
  size: "samll",
});

const app = new Vue({
  el: "#app",
  router,
  store,
  created() {},
  render: (h) => h(App),
});

export default app;

// vite 2
// https://juejin.cn/post/6934316962952544269#heading-9
