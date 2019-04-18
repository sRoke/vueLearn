import { getDisks } from '@/api/SRDstor/physicalResources/physicalDevices'
import { getStoragePoolNameMap } from '@/api/SRDstor/physicalResources/storagePools'

const physicalResource = {
  state: {
    physicalDevice: [],
    storagePoolNameMap: {}
  },
  mutations: {
    SET_PHYSICAL_DEVICE: (state, physicalDevice) => {
      state.physicalDevice = physicalDevice
    },
    SET_STORAGE_POOL_NAME_MAP: (state, storagePoolNameList) => {
      state.storagePoolNameMap = storagePoolNameList
    }
  },
  actions: {
    GetPhysicalDevice({ commit }) {
      return new Promise((resolve, reject) => {
        getDisks().then(response => {
          if (response.rc === 0) {
            commit('SET_PHYSICAL_DEVICE', response.Data.disks)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetStoragePoolMapTable({ commit }) {
      return new Promise((resolve, reject) => {
        getStoragePoolNameMap().then(response => {
          if (response.rc === 0) {
            commit('SET_STORAGE_POOL_NAME_MAP', response.poolmap)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default physicalResource
