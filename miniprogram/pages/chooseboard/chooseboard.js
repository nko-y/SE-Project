// pages/chooseboard/chooseboard.js
var util = require('../../utils/util.js');
var db = wx.cloud.database();
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:null,
    pcontent:null,
    type:null,
    board:null,

    NowUserNickName: null,
    NowUserUrl: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      title: options.title,
      pcontent:decodeURIComponent(options.pcontent),
      type:options.type,
      NowUserNickName: options.NowUserNickName,
      NowUserUrl: options.NowUserUrl
    });
    console.log(this.data.title);
    console.log(this.data.pcontent);
    console.log(this.data.type)
    console.log(this.data.NowUserNickName)
    console.log(this.data.NowUserUrl)
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
  checkClick: async function(e){//检测点击板块
    console.log(e.target.dataset["id"]);
    this.setData({
      board:e.target.dataset["id"],
    });
    var that=this;
    this.SendPost(app.globalData.userDocId,app.globalData.userInfo,this.data.title,this.data.type,this.data.pcontent,this.data.board);
  },
  SendPost:async function(user_id,user_name,title,type,content,board){//将帖子传送到服务器
    //上传照片是不是要与其他部分分开？那样的话得遍历content，检测每张照片
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
    db.collection('post').add({
      data:{
        user_id: user_id,
        user_name: that.data.NowUserNickName,
        user_img: that.data.NowUserUrl,
        post_id: post_id,
        post_title:title,
        post_time:uploadTime,
        post_type:type,
        post_content:content,
        images:picpath,
        post_board:board,
        love:0,
        save:0,
      }
    }).then(res=>{
      wx.showToast({
        title: '帖子上传成功',
        icon:"success",
        duration:1000
      })
    })
    .catch(err=>{
      console.log(err)
    });
    wx.navigateBack({
      delta: 2
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
})