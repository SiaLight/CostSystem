const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  loginState: state => state.user.loginState,
  name: state => state.user.name,
  userId:state => state.user.userId,
  roles: state => state.user.roles,
}
export default getters
