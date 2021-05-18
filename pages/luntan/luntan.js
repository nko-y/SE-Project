var testList = require("../../Data/postData.js")

// pages/luntan/luntan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否已经登录
    isRegister: true,
    //是否有邮件
    message: true,

    //临时使用的分类信息
    typeList:[
      {'id':0, "name":"热门", "isSelect":true},
      {'id':1, "name":"心理", "isSelect":false},
      {'id':2, "name":"生理", "isSelect":false},
      {'id':3, "name":"药理", "isSelect":false},
      {'id':4, "name":"卫生", "isSelect":false},
      {'id':5, "name":"儿科", "isSelect":false},
      {'id':6, "name":"眼科", "isSelect":false},
      {'id':7, "name":"内科", "isSelect":false},
      {'id':8, "name":"外科", "isSelect":false},
    ],

    //临时使用本地的数据
    allPosts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allPosts: testList.postData
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

  //点击上方的小标签切换页面
  changeTab: function(e){
    var whichOne = e.currentTarget.dataset.index
    var tempList = this.data.typeList
    for(var i=0; i<this.data.typeList.length; i++){
      if(i!=whichOne) tempList[i].isSelect = false
      else tempList[i].isSelect = true
    }
    this.setData({typeList: tempList})
  }
})