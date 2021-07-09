// app.js
import GoEasy from './static/lib/goeasy-2.0.12.min';

App({
  onLaunch() {
    if(!wx.cloud){
      console.error('请使用2.2.3或以上的基础库以及使用云能力')
    }else{
      wx.cloud.init({
        env:'se-5gd09z7qd5f96662',
        traceUser: true,
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                
              }
            }
          })
        }
      }
    })
    wx.goEasy = GoEasy.getInstance({
      host:'hangzhou.goeasy.io',//应用所在的区域地址: [hangzhou.goeasy.io, 新加坡暂不支持IM，敬请期待]
      appkey: 'BC-adebf342e8834842958a4e3feca476d5',// common key
      modules:["im"]
    });
    wx.GoEasy = GoEasy;
  },
  globalData: {
    userInfo: null,
    userDocId: '',           //用户的唯一指定ID
    service: null,
  }
})
