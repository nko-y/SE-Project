var testList = require("../../Data/postData.js")
var app = getApp()
var db = wx.cloud.database()


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
    allPosts: [],
    
    //记录个人信息的相关数据
    isFirstIn: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      allPosts: testList.postData
    })
    if(this.data.isFirstIn){
      await this.doFirstIn();
    }
    this.setData({
      isFirstIn: false
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
  onShow: async function () {

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
  },


  //用于个人相关信息的获取
  doFirstIn: async function(){
    var openIdRes = await this.firstIn()
    var hasJoined = await this.searchoenId(openIdRes.result._openid)
    if(hasJoined.data.length==0){
      var OneMember = await this.insertMember()
      app.globalData.userDocId = OneMember._id
    }
    else{
      app.globalData.userDocId = hasJoined.data[0]._id
    }
  },

  //获取openid
  firstIn: async function(){
    return wx.cloud.callFunction({
      name:"login"
    })
  },

  //查询该openid是否存在
  searchoenId: async function(onesOpenId){
    return db.collection("user").where({
      openid:onesOpenId
    }).get()
  },

  //插入一个用户
  insertMember: async function(){
    return db.collection("user").add({
      data:{
        user_certified:false,
        user_integral:100,
        user_QQ:"",
        user_wechat:"",
        user_email:"",
        user_address:"",
        user_notes:"",
      }
    })
  },

  getItem: function(e){
    console.log(e)
  },

    // 事件处理函数
    bindItemTap: function(e) {
      console.log(e);
      wx.navigateTo({
        url: '/pages/certainpost/certainpost?index='+e.currentTarget.dataset.index,
      });
  
    },


  createNewPost:function(event) {
    wx.navigateTo({
      url: '/pages/newpost/newpost',
      })
  }
})