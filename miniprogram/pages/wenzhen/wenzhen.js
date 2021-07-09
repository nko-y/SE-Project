var db = wx.cloud.database()
const cd = db.command

// pages/wenzhen/wenzhen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorOnPage: [],
    doctorIdOnPage: [],
    //页面加载相关控制变量
    isAdding: false,
    isLoading: true,

    //筛选项
    nowKeyWord: "",
    searchKeyWord: "",
    inputValue: "",

    //筛选器
    departArray:["全部","内科","外科","皮肤科","妇科","儿科","泌尿外科","骨科","消化内科","口腔科","耳鼻咽喉科"],
    departNowValue: "科室"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      doctorOnPage: [],
      doctorIdOnPage: [],
      departNowValue: "科室"
    })
    this.setData({isAdding: true})
    await this.obtainAndhandleDoctor(2, false)
    this.setData({isAdding: false, isLoading:false})
  },

  //前往新的界面
  toNewPost: function(){
    if(this.data.isLoading || this.data.isAdding) return
    wx.navigateTo({
      url: '../newpost/newpost',
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
    inputValue: ""
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
    await this.obtainAndhandleDoctor(2, true)
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
    var tempBeforeAmount = this.data.doctorOnPage.length
    await this.obtainAndhandleDoctor(2, false)
    var tempAfterAmount = this.data.doctorOnPage.length
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
      await this.obtainAndhandleDoctor(2, true)
      this.setData({isLoading: false})
    }
    this.setData({departNowValue: "科室"})
  },

  //处理科室筛选
  departSort: async function(e){
    if(this.data.isLoading || this.data.isAdding) return
    this.setData({isLoading: true})
    //设置显示名称
    var tempDepartValue = this.data.departArray[e.detail.value]
    if(e.detail.value==0) tempDepartValue = "科室" 
    this.setData({
      departNowValue: tempDepartValue
    })
    //设置选择相关变量
    this.setData({
      nowKeyWord: "科室",
      searchKeyWord: tempDepartValue
    })
    await this.obtainAndhandleDoctor(2, true)
    this.setData({isLoading: false})
  },



  obtainAndhandleDoctor: async function(num, isNew){
    if(isNew) this.setData({doctorIdOnPage: []})
    var rtData = await this.getDoc(num)
    //判断是否要全部刷新数据
    if(isNew) this.setData({doctorOnPage: []})
    //更新要显示的doctor数据
    var nP = this.data.doctorOnPage
    //修改需要显示的数据
    for(let i=0; i<rtData.length; i++){
      rtData[i].docName = rtData[i].doctor_name
      rtData[i].docPosition = rtData[i].doctor_pos
      rtData[i].isFirstClass = rtData[i].doctor_isFirstClass
      rtData[i].master = rtData[i].doctor_department
      rtData[i].from = rtData[i].doctor_hospital
      rtData[i].goodAt = rtData[i].doctor_expert
      rtData[i].claim = rtData[i].doctor_detail
      rtData[i].starNum = rtData[i].doctor_score
      rtData[i].relateTag = rtData[i].doctor_tag
      nP.push(rtData[i])
    }
    this.setData({
      doctorOnPage: nP
    })
    console.log(this.data.doctorOnPage)
  },

  //从数据库加载指定数量的医生信息
  getDoc: async function(num){
    var allDoc = await this.getDoctorInDataBase(num)
    //首先下载对应的所有图片
    await this.getAllImgURL(allDoc.data)
    //然后把已经获取的id进行记录
    var tempDoctorIdOnPage = this.data.doctorIdOnPage
    for(let i=0; i<allDoc.data.length; i++){
      tempDoctorIdOnPage.push(allDoc.data[i]._id)
    }
    //设定数据
    this.setData({
      doctorIdOnPage : tempDoctorIdOnPage
    })
    return allDoc.data
  },

  //获取数据库的医生信息
  getDoctorInDataBase: async function(num){
    var that = this
    var relateValue = this.data.searchKeyWord
    if(that.data.nowKeyWord=="搜索"){
      return db.collection("doctor").where(cd.or([
        {
          doctor_name: db.RegExp({regexp: relateValue, options:'i'})
        },{
          doctor_department: db.RegExp({regexp: relateValue, options:'i'})
        },{
          doctor_hospital: db.RegExp({regexp: relateValue, options:'i'})
        },{
          doctor_detail: db.RegExp({regexp: relateValue, options:'i'})
        },{
          doctor_expert: db.RegExp({regexp: relateValue, options:'i'})
        }
      ]).and([{_id: cd.nin(that.data.doctorIdOnPage)}])).limit(num).orderBy("doctor_score", "desc").get()
    }else if(that.data.nowKeyWord=="科室" && relateValue!="科室"){
      return db.collection("doctor").where(cd.or([
        {
          doctor_department: db.RegExp({regexp: relateValue, options:'i'})
        }
      ]).and([{_id: cd.nin(that.data.doctorIdOnPage)}])).limit(num).orderBy("doctor_score", "desc").get()
    }else{
      return db.collection("doctor").where({
        _id: cd.nin(that.data.doctorIdOnPage)
      }).limit(num).orderBy("doctor_score", "desc").get()
    }
  },

  //加载所有图片
  getAllImgURL: async function(tempAllPosts){
    for(let i=0; i<tempAllPosts.length; i++){
      var tempOnePath = await this.downloadOneFile(tempAllPosts[i].doctor_src)
      tempAllPosts[i].docScr = tempOnePath.tempFilePath
    }
  },

  //下载一张图片
  downloadOneFile: async function(path){
    return wx.cloud.downloadFile({
      fileID: path
    })
  },
})