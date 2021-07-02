// miniprogram/pages/certainpost.js
// var testList = require("../../Data/postData.js")
var db = wx.cloud.database()
const cd = db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    certainPost: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // var index = options.index;
    // console.log(options.certainpost); // 帖子的index
    // var certainpost = JSON.parse(options.certainpost);
    var certainpost_id = options.certainpost_id;
    // 从数据库得到这个帖子的内容
    var result = await this.search_post(certainpost_id);
    console.log(result.data[0]);
    
    this.setData({
      certainPost: result.data[0],
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

  // 添加评论：跳转至评论编辑页面
  bindCommentTap: function() {
    wx.navigateTo({
      url: '/pages/newcomment/newcomment',
    });

  },

  search_post: async function(certainpost_id){
    return db.collection("post").where({
      _id:certainpost_id
    }).get();
  },

})