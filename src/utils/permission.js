import store from "/@/store";

export const hasPermissionFn = value => {
  const buttons = store.getters && store.getters.buttons;
  const permissionRoles = value;
  return buttons.some(btn => {
    return permissionRoles.includes(btn.buttonName);
  });
};

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {

  if (value && value instanceof Array && value.length > 0) {
    // const roles = store.getters && store.getters.roles
    // const permissionRoles = value

    // const hasPermission = roles.some(role => {
    //   return permissionRoles.includes(role)
    // })

    const hasPermission = hasPermissionFn(value);

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
}
