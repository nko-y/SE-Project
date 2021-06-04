// pages/newpost/newpost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  choose1:function(e){//允许再点击取消选中，并且只允许选中一个
    var checked1 = this.data.checked;
    this.setData({
      "checked1": !checked1
    })
  },
  choose2:function(e){//允许再点击取消选中，并且只允许选中一个
    var checked2 = this.data.checked;
    this.setData({
      "checked2": !checked2
    })
  },
  choose3:function(e){//允许再点击取消选中，并且只允许选中一个
    var checked3 = this.data.checked;
    this.setData({
      "checked3": !checked3
    })
  }
})