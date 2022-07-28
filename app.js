/***
 * @Description: 
 * @Author: Harry
 * @Date: 2021-09-04 16:22:00
 * @Url: https://u.mr90.top
 * @LastEditTime: 2021-09-20 08:41:12
 * @LastEditors: Harry
 */
// app.js
const Api = require('./utils/api.js');
const wxRequest = require('./utils/wxRequest.js')
import config from './config/config.js'
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()
    
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
 
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
              })
        })
 
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })
  },
  globalData: {
    userInfo: null,
    Api, wxRequest, config
  }
})
