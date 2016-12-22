/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

const electron = require('electron')
const ipcMain = electron.ipcMain
const messages = require('../js/constants/sync/messages')
const categories = require('../js/constants/sync/proto').categories
const config = require('../js/constants/appConfig').sync
const appActions = require('../js/actions/appActions')

const categoryNames = Object.keys(categories)

const onSyncReady = (e) => {
  ipcMain.on(messages.RECEIVE_SYNC_RECORDS, (event, categoryName, records) => {
    if (categoryNames.includes(categoryName) || !records || !records.length) {
      return
    }
    // TODO: update appstate
  })
  setInterval(() => {
    e.sender.send(messages.FETCH_SYNC_RECORDS, categoryNames)
  }, config.fetchInterval)
  setInterval(() => {
    e.sender.send(messages.SEND_SYNC_RECORDS, 'PREFERENCES', [])
  }, config.sendInterval)
}

module.exports.init = function (state) {
  ipcMain.on(messages.GET_INIT_DATA, (e) => {
    const seed = state.seed ? state.seed.data : null
    const deviceId = state.deviceId ? state.deviceId.data : null
    e.sender.send(messages.GOT_INIT_DATA, seed, deviceId, config)
  })
  ipcMain.on(messages.SAVE_INIT_DATA, (e, seed, deviceId) => {
    appActions.saveSyncInitData(seed, deviceId)
  })
  ipcMain.on(messages.SYNC_READY, onSyncReady)
  ipcMain.on(messages.SYNC_DEBUG, (e, msg) => {
    console.log('sync-client:', msg)
  })
}
