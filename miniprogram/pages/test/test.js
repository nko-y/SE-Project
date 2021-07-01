// miniprogram/pages/test/test.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPic : false,
    picSrc : '',
    formateDate:"",

    //个人信息
    nameValue: "",
    posValue: "",
    departValue: "",
    region:['', '', ''],
    hosValue: "",
    expertiseValue: "",
    detailValue: "",

    //是否可以操作
    opAble: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatDate(new Date());
    this.setData({
      formateDate:TIME,
      hasPic: false,
      picSrc: '../../images/wenzhen/camera.svg',
      opAble:true,

      nameValue: "",
      posValue: "",
      departValue: "",
      region:['', '', ''],
      hosValue: "",
      expertiseValue: "",
      detailValue: "",
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

  }
})