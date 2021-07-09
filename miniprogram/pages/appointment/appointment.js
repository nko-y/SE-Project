var util = require('../../utils/util.js');

// pages/appointment/appointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formateDate:"",

    //基本信息
    nameValue: "",
    contactValue:"",
    infoValue:"",
    symptomValue:"",

    opAble: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatDate(new Date());
    this.setData({
      formateDate: TIME,
      opAble: true
    })
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

  saveForm: function(e){
    if(this.data.opAble==false) return
    this.setData({
      opAble: false
    })

    var finName = e.detail.value.nameInput
    var finContact = e.detail.value.contacInput
    var finInfo = e.detail.value.infoInput
    var finSymptom = e.detail.value.symptomInput

    if(finSymptom==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写症状描述信息",
      })
      this.setData({
        opAble:true
      })
      return
    }

    //提交申请
    wx.showToast({
      title: '预约发送成功',
      icon:'none',
      duration:2000
    })
    this.setData({
      opAble: true
    })

    
  }
})