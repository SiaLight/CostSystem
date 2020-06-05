import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
console.log("已知的role");
console.log(roles);
console.log(value);
   
    // const hasPermission = roles.some(role => {
    //   return permissionRoles.includes(role)
    // })
    var hasPermission = false;
    if(roles.includes('admin'))
       hasPermission = true;
    else{
      let num =0;
       for(let  x of value){
          if(roles.includes(x))
          num++;
       }
       if(num==value.length)
        hasPermission = true;
        else
        hasPermission = false;
    }
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
