import store from "/@/store";

import hasPermissionFn from "/@/utils/permission";

export default {
  inserted(el, binding, vnode) {
    const { value } = binding;

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = hasPermissionFn(value);

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need2 buttons! Like v-permission="['admin','editor']"`);
    }
  }
};
