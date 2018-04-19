const status = {
  'sortStatus'(item) {
    switch (item.status_code) {
      case 6:
        item.delbtnStatus = true
        item.editbtnStatus = false
        item.passbtnStatus = false
        item.unpassbtnStatus = false
        break
      case 1:
        item.delbtnStatus = false
        item.editbtnStatus = false
        item.passbtnStatus = true
        item.unpassbtnStatus = true
        break
      default:
        item.delbtnStatus = true
        item.editbtnStatus = true
        item.passbtnStatus = false
        item.unpassbtnStatus = false
    }
    return item
  },
  'passStauts'(state, item) {
    item.delbtnStatus = true
    item.editbtnStatus = true
    item.passbtnStatus = false
    item.unpassbtnStatus = false
    item.status = state
    return item
  },
  'unpassStauts'(state, item) {
    item.delbtnStatus = true
    item.editbtnStatus = false
    item.passbtnStatus = false
    item.unpassbtnStatus = false
    item.status = state
    return item
  }
}
export default status
