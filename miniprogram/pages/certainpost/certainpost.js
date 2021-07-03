// miniprogram/pages/certainpost.js
// var testList = require("../../Data/postData.js")
var app = getApp();
var db = wx.cloud.database();
var certainpost_id; // 当前帖子的id
var post_title;
const cd = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    certainPost: {},
    isLove: {},
    cur_user: {},
    love_num: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    certainpost_id = options.certainpost_id;
    // 从数据库得到这个帖子的内容
    var result = await this.get_post(certainpost_id);
    var certainpost = result.data[0];
    console.log(certainpost);
    
    this.setData({
      certainPost: certainpost,
      love_num: certainpost.love_users.length,
    });
    post_title = certainpost.post_title;
    console.log(this.data.love_num);
    // 从数据库查看当前用户是否给这个帖子点赞了
    var love_users = certainpost.love_users;
    console.log(love_users);
    var cur_user = app.globalData.userDocId;
    console.log(cur_user);
    var isLove = this.isInArray(love_users, cur_user);
    console.log("isLove: "+isLove);
    this.setData({
      isLove: isLove,
      cur_user: cur_user,
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
      url: '/pages/newcomment/newcomment?certainpost_id=' + certainpost_id + '&post_title=' + post_title,
    });
  },

  // 给楼主的帖子点赞的响应函数
  bindLoveTap: async function() {
    var that = this;
    var isLove = this.data.isLove;
    // 如果本来已经点赞了，现在不点赞了
    if(isLove) {
      // 将当前用户从帖子的love_users中删除
      await db.collection('post').doc(certainpost_id).update({
        data:{
          love_users: cd.pull(that.data.cur_user)
        }
      }).then(res=>{
        console.log(res);
      });
      this.setData({
        isLove: false,
        love_num: this.data.love_num - 1,
      });
    // 如果本来没点赞，现在点赞了
    } else {
      await db.collection('post').doc(certainpost_id).update({
        data:{
          love_users: cd.push(that.data.cur_user)
        }
      }).then(res=>{
        console.log(res);
      });
      this.setData({
        isLove: true,
        love_num: this.data.love_num + 1,
      });
    }
  },

  // 获取当前页面的帖子
  get_post: async function(certainpost_id){
    return db.collection("post").where({
      _id:certainpost_id
    }).get();
  },

  // 用于判断用户id是否在点赞列表里
  isInArray: (array, value) => {
    for (var i = 0; i < array.length; i++) {
      if (value == array[i]) {
        return true;
      }
    }
    return false;
  },

})