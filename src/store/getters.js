const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  loginState: state => state.user.loginState,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId:state => state.user.userId
}
export default getters
