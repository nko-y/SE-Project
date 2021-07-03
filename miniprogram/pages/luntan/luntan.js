var app = getApp()
var db = wx.cloud.database()
const cd = db.command

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
      {'id':1, "name":"皮肤科", "isSelect":false},
      {'id':2, "name":"妇科", "isSelect":false},
      {'id':3, "name":"儿科", "isSelect":false},
      {'id':4, "name":"泌尿外科", "isSelect":false},
      {'id':5, "name":"骨科", "isSelect":false},
      {'id':6, "name":"消化内科", "isSelect":false},
      {'id':7, "name":"口腔科", "isSelect":false},
      {'id':8, "name":"耳鼻咽喉科", "isSelect":false},
      {'id':9, "name":"产科", "isSelect":false},
      {'id':10, "name":"普通内科", "isSelect":false},
      {'id':11, "name":"内分泌科", "isSelect":false},
      {'id':12, "name":"心血管内科", "isSelect":false},
      {'id':13, "name":"普外科", "isSelect":false},
      {'id':14, "name":"精神心理科", "isSelect":false},
      {'id':15, "name":"美容整形科", "isSelect":false},
      {'id':16, "name":"性病科", "isSelect":false},
      {'id':17, "name":"眼科", "isSelect":false},
      {'id':18, "name":"肿瘤科", "isSelect":false},
    ],
    nowKeyWord: "",
    searchKeyWord: "",
    
    //记录个人信息的相关数据
    isFirstIn: true,

    //从数据库获取的帖子相关数据
    postOnPage : [],
    postIdOnPage : [],

    //页面加载相关控制变量
    isAdding: false,
    isLoading: true,

    //搜索框相关变量
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(this.data.isFirstIn){
      await this.doFirstIn();
    }
    this.setData({
      isFirstIn: false
    })

    //首次进入页面加载数据
    this.setData({isAdding: true})
    await this.obtainAndhandlePost(4, false)
    this.setData({isAdding: false, isLoading: false})
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
    this.setData({
      inputValue: ""
    })
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
  onPullDownRefresh: async function () {
    if(this.data.isLoading || this.data.isAdding) return
    this.setData({isAdding: true})
    wx.showNavigationBarLoading()
    wx.showToast({
      title: '加载中',
      icon:"loading",
      duration:4000
    })
    await this.obtainAndhandlePost(4, true)
    wx.showToast({
      title: '刷新成功',
      icon:'none',
      duration:2000
    })
    wx.hideNavigationBarLoading()
    this.setData({isAdding: false})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    if(this.data.isLoading || this.data.isAdding) return
    this.setData({isAdding: true})
    wx.showNavigationBarLoading()
    wx.showToast({
      title: '加载中',
      icon:"loading",
      duration:4000
    })
    var tempBeforeAmount = this.data.postOnPage.length
    await this.obtainAndhandlePost(4, false)
    var tempAfterAmount = this.data.postOnPage.length
    if(tempAfterAmount==tempBeforeAmount){
      wx.showToast({
        title: '已经没有更多啦',
        icon:"none",
        duration:3000
      })
    }
    else{
      wx.showToast({
        title: '刷新成功',
        icon:'none',
        duration:2000
      })
    }
    wx.hideNavigationBarLoading()
    this.setData({isAdding: false})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //点击上方的小标签切换页面
  changeTab: async function(e){
    if(this.data.isLoading || this.data.isAdding) return
    this.setData({isLoading: true})
    this.setData({inputValue:""})
    //改变加载条样式
    var whichOne = e.currentTarget.dataset.index
    var tempList = this.data.typeList
    for(var i=0; i<this.data.typeList.length; i++){
      if(i!=whichOne) tempList[i].isSelect = false
      else tempList[i].isSelect = true
    }
    this.setData({typeList: tempList})
    //加载符合要求的新数据
    if(this.data.nowKeyWord==tempList[whichOne].name){

    }else{
      this.setData({nowKeyWord: tempList[whichOne].name})
      await this.obtainAndhandlePost(4, true)
    }
    this.setData({isLoading: false})
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

  // 点击某个帖子的事件处理函数
  bindItemTap: function(e) {
    if(this.data.isLoading || this.data.isAdding) return;
    var certainpost_id = e.currentTarget.dataset.certainpost._id;
    // console.log(certainpost);
    // var str = JSON.stringify(certainpost);
    wx.navigateTo({
      url: '/pages/certainpost/certainpost?certainpost_id=' + certainpost_id,
    });

  },

  createNewPost:function(event) {
    if(this.data.isLoading || this.data.isAdding) return
    wx.navigateTo({
      url: '/pages/newpost/newpost',
      })
  },

  //处理模糊搜索的函数
  clickSearch: async function(e){
    if(this.data.isLoading || this.data.isAdding) return
    let value = e.detail.value
    //如果是空的话
    if(value==""){
      wx.showToast({
        title: '请输入要搜索的内容',
        icon:'none',
        duration:2000,
      })
    }
    else{
      this.setData({isLoading: true})
      //搜索出相关内容
      this.setData({nowKeyWord: "搜索"})
      this.setData({searchKeyWord: value})
      await this.obtainAndhandlePost(4, true)
      this.setData({isLoading: false})
      //将分类标签tag全部变为未选中
      var tempList = this.data.typeList
      for(var i=0; i<this.data.typeList.length; i++){
        tempList[i].isSelect = false
      }
      this.setData({typeList: tempList})
    }
  },




  //获取并处理帖子信息
  obtainAndhandlePost: async function(num, isNew){
    if(isNew) this.setData({postIdOnPage: []})
    var rtData = await this.getPosts(num)
    //提取出简要信息
    for(let i=0; i<rtData.length; i++){
      var richText = rtData[i].post_content
      var re1 = new RegExp("<.+?>","g");
      var msg = richText.replace(re1,'');
      rtData[i].contain = msg
    }
    //判断是否要全部刷新数据
    if(isNew) this.setData({postOnPage: []})
    //更新要显示的post数据
    var nP = this.data.postOnPage
    for(let i=0; i<rtData.length; i++){
      rtData[i].containPic = rtData[i].download_img[0]
      rtData[i].postTime = rtData[i].post_time
      rtData[i].userName = rtData[i].user_name
      rtData[i].userSrc = rtData[i].user_img
      rtData[i].title = rtData[i].post_title
      rtData[i].love = rtData[i].love_users.length
      nP.push(rtData[i])
    }
    this.setData({
      postOnPage: nP
    })
    console.log(this.data.postOnPage)
  },

  //从数据库加载指定数量的帖子的所有信息
  getPosts: async function(num){
    var allPosts = await this.getPostsInDataBase(num)
    //首先下载对应的所有图片
    await this.getAllImgURL(allPosts.data)
    //再获取对应帖子的对应作者名称和照片信息

    //然后把已经获取的id进行记录
    var tempPostIdOnPage = this.data.postIdOnPage
    for(let i=0; i<allPosts.data.length; i++){
      tempPostIdOnPage.push(allPosts.data[i]._id)
    }
    //设定数据
    this.setData({
      postIdOnPage: tempPostIdOnPage
    })
    return allPosts.data
  },

  //获取还未获取的指定数量的帖子
  getPostsInDataBase: async function(num){
    var that = this
    var relateValue = this.data.searchKeyWord
    if(that.data.nowKeyWord=="搜索"){
      return db.collection("post").where(cd.or([
        {
          post_title: db.RegExp({regexp: relateValue, options:'i'})
        },{
          post_board: db.RegExp({regexp: relateValue, options:'i'})
        },{
          post_content: db.RegExp({regexp: relateValue, options:'i'})
        },{
          post_type: db.RegExp({regexp: relateValue, options:'i'})
        }
      ]).and([{_id: cd.nin(that.data.postIdOnPage)}])).limit(num).orderBy("post_time", "desc").get()
    }
    else if(that.data.nowKeyWord==""||that.data.nowKeyWord=="热门"){
      return db.collection("post").where({
        _id: cd.nin(that.data.postIdOnPage)
      }).limit(num).orderBy("post_time", "desc").get()
    }
    else{
      return db.collection("post").where({
        _id: cd.nin(that.data.postIdOnPage),
        post_board: cd.eq(that.data.nowKeyWord)
      }).limit(num).orderBy("post_time", "desc").get()
    }
  },

  //加载所有图片
  getAllImgURL: async function(tempAllPosts){
    for(let i=0; i<tempAllPosts.length; i++){
      var download_img = []
      for(let j=0; j<tempAllPosts[i].images.length; j++){
        var tempOnePath = await this.downloadOneFile(tempAllPosts[i].images[j])
        download_img.push(tempOnePath.tempFilePath)
      }
      tempAllPosts[i].download_img = download_img
    }
  },

  //将一张图片下载
  downloadOneFile: async function(path){
    return wx.cloud.downloadFile({
      fileID: path
    })
  },
})