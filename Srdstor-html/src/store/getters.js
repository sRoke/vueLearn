const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  srdstorIp: state => state.app.SRDSTOR_IP,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  physicalDevice: state => {
    const physicalDeviceList = {}
    state.physicalResource.physicalDevice.forEach(item => {
      physicalDeviceList[item.name] = item.slot
    })
    return physicalDeviceList
  },
  storagePoolNameMap: state => {
    const storagePoolNameMap = {}
    if (Array.isArray(state.physicalResource.storagePoolNameMap.orgname)) {
      state.physicalResource.storagePoolNameMap.orgname.forEach((orgNameItem, index) => {
        storagePoolNameMap[orgNameItem] = state.physicalResource.storagePoolNameMap.altname[index]
      })
    }
    return storagePoolNameMap
  }
}
export default getters
