// miniprogram/pages/newcomment/newcomment.js
var util = require('../../utils/util.js');
var certainpost_id;
var app = getApp();
var db = wx.cloud.database();
const cd = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_title: null,

    keyboardHeight: 0,
    isIOS: false,
    isEditorFocused: false,
    title:null,
    pcontent:null,
    type:null,

    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 从传递的参数获得这个帖子的标题
    this.setData({
      post_title: options.post_title,
    })
    certainpost_id = options.certainpost_id;
    // var result = await db.collection("post").where({
    //   _id:certainpost_id
    // }).get();
    // var certainpost = result.data[0];
    // console.log(certainpost.post_title);

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {// 拉起键盘时调用，应该改成点击编辑器时调用
      if (res.height === keyboardHeight&& this.data.isEditorFocused==true) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {//编辑器初始化完成触发，绑定编辑器上下文
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  EditorFocus(){
    this.setData({
      isEditorFocused: true
    });
  },
  Editorblur() {//编辑器失焦，同时收起键盘。
    this.editorCtx.blur();
    this.setData({
      isEditorFocused: false
    })
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {//通过 Context 方法改变编辑器内样式时触发
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],//本地图片地址
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
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

  editorInputChange: function(e){//对内容编码，用以解决=后面的字符串在传参时被错误处理问题
    this.setData({
      pcontent:encodeURIComponent(e.detail.html),
    });
    //console.log(this.data.pcontent)
  },

  // 将回复上传至数据库
  SendPost: async function(user_id, user_img, user_name, content, post_id){
    var uploadTime = util.formatTime(new Date());
    var that=this;
    var post_id = user_id+'/'+uploadTime;
    var i=0;
    var picpath=[];
    var str=content;
    content="";
    var rex=/<img.*?\">/;//提取图片
    var n = str.search(rex);
    var tmp,src,tmppath;
    while(n!=-1){
      content+=str.substr(0,n);
      str=str.substr(n)
      tmp=str.match(rex)[0];//获取<img ……>
      src=tmp.match(/\"http.*?\"/)[0];//提取图片地址
      src=src.substr(1,src.length-2);//去除双引号
      tmppath=await this.uploadOneImage(post_id,i,src);//上传图片
      //console.log(tmppath);
      picpath.push(tmppath.fileID); //获取云服务图片地址
      i=i+1;
      str=str.replace(rex,"")
      tmp=tmp.replace(/\"http.*?\"/,"\""+tmppath.fileID+"\"")//将本地地址换成云图片地址
      content+=tmp;//不直接content.replace(/\"http.*?\"/,tmppath.fileID)是防止替换掉其他超链接
      n = str.search(rex);
    }
    content+=str;//加上结尾
    console.log(content);//查看改变后的内容

    var result = await db.collection("post").where({
      _id:certainpost_id
    }).get();
    var certainpost = result.data[0];
    var len = certainpost.comments.length;

    db.collection('post').doc(certainpost_id).update({
      data:{
        comments: cd.push({
          index: len,
          user_id: user_id,
          user_name: user_name,
          user_img: user_img,
          post_id: certainpost_id,
          post_time:uploadTime,
          post_content:content,
          images:picpath,
          love_users:[],
        })
      }
    }).then(res=>{
      wx.showToast({
        title: '评论添加成功',
        icon:"success",
        duration:1000
      })
    })
    .catch(err=>{
      console.log(err)
    });
    wx.navigateBack({
      delta: 1
    })
  },
  uploadOneImage:async function(post_id,num,imagepath){
    var currTime = util.formatFileTime(new Date());
    var that=this;
    return wx.cloud.uploadFile({
      filePath: imagepath,
      cloudPath: post_id+'-'+num,
    })
    /*
    .then(res => {//加上then就没有返回值了，会把返回值在这边处理
      // get resource ID
      console.log(res.fileID)
      
      var array=that.data.picpath
      array.push(res.fileID)
      that.setData({
        picpath:array
      })
      
    }).catch(error => {
      // handle error
    })
    */
  },


  getUserProfile(e) {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善帖子基本信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        console.log(that.data.userInfo);
        // user_id, user_img, user_name, content
        that.SendPost(app.globalData.userDocId, that.data.userInfo.avatarUrl, that.data.userInfo.nickName, decodeURIComponent(that.data.pcontent), certainpost_id);
        // wx.navigateTo({
        //   url: `/pages/chooseboard/chooseboard?title=${that.data.title}&pcontent=${that.data.pcontent}&type=${that.data.type}&NowUserNickName=${that.data.userInfo.nickName}&NowUserUrl=${that.data.userInfo.avatarUrl}`,
        // })
      }
    })
  },
  getUserInfo(e) {
    var that = this
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(that.data.userInfo);
    wx.showToast({
      title: '需要登录才能评论哦~',
      icon:"none",
      duration: 1000
    })
    // wx.navigateTo({
    //   url: `/pages/chooseboard/chooseboard?title=${this.data.title}&pcontent=${this.data.pcontent}&type=${this.data.type}&NowUserInfo=${that.data.userInfo}`,
    // })
  },


})