// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否已经授权登录
    isRegister: true,
    //信用积分值
    allIntegral:0,
    //是否认证
    whetherCert:true,
    //是否有个人信息
    withMessage:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toQuest: function(){
    wx.navigateTo({
      url: '../questionnaire/questionnaire',
    })
  },

  turntoPersonalInfo: function(){
    wx.navigateTo({
      url: '../../pages/personinfo/personinfo',
    })
  },

  toNotice: function(){
    wx.navigateTo({
      url: '../../pages/test/test',
    })
  },

  turnToemail: function(){
    wx.navigateTo({
      url: '../../pages/email/email',
    })
  }
})