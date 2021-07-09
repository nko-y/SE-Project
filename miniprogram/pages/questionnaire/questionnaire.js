// pages/questionnaire/questionnaire.js
var util = require('../../utils/util.js');
var db = wx.cloud.database()
var app = getApp()

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

  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //从相机获取图片
  getPic: function(){
    var that = this;
    var tempItemList = ['拍照','从相册中选择']
    if(that.data.hasPic){
      tempItemList = ['拍照','从相册中选择','删除照片']
    }
    wx.showActionSheet({
      itemList: tempItemList,
      success(res){
        if(res.tapIndex==2){
          that.setData({
            hasPic: false,
            picSrc: '../../images/wenzhen/camera.svg'
          })
        }
        else{
          let sourceType = 'camera'
          if(res.tapIndex==0){
            sourceType = 'camera'
          }else if(res.tapIndex==1){
            sourceType = 'album'
          }
          wx.chooseImage({
            count: 1,
            sizeType:['compressed'],
            sourceType:[sourceType],
            success:res=>{
              that.setData({
                hasPic: true,
                picSrc: res.tempFilePaths[0]
              })
            }
          })
        }
      }
    })
  },

  saveForm: async function(e){
    if(this.data.opAble==false) return
    this.setData({
      opAble:false
    })
    var that = this
    var finName = e.detail.value.NameInput
    var finDepart = e.detail.value.departInput
    var finDetail = e.detail.value.detailInput
    var finExpert = e.detail.value.expertiseInput
    var finHos = e.detail.value.hosInput
    var finPos = e.detail.value.posInput
    var finRegion = that.data.region
    var finPic = that.data.picSrc

    if(finPic=="../../images/wenzhen/camera.svg"){
      wx.showModal({
        cancelColor: '提示',
        content:"请上传照片",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finName==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写姓名",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finPos==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写职称",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finDepart==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写科室",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finRegion[0]==""||finRegion[1]==""||finRegion[2]==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请选择完整的所在位置",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finHos==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写工作地点",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finExpert==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写擅长领域",
      })
      this.setData({
        opAble:true
      })
      return
    }

    if(finDetail==""){
      wx.showModal({
        cancelColor: '提示',
        content:"请填写补充信息",
      })
      this.setData({
        opAble:true
      })
      return
    }

    //信息完备可以选择上传
    wx.showModal({
      title: '提示',
      content: '确认申请?',
      success(res){
        if(res.confirm){
          console.log("确认创建")
          //插入一条记录
          that.sendOneApply(that.data.picSrc, finName, finPos, finDepart, finRegion, finHos, finExpert, finDetail);
        }else{
          this.setData({
            opAble:true
          })
        }
      }
    })
  },

  sendOneApply: async function(finSrc, finName, finPos, finDepart, finRegion, finHos, finExpert, finDetail){
    var that = this
    //将每张照片上传到云存储
    var picPath = await this.uploadOneFile(finSrc)
    //最后再获取一次时间
    var finTime = util.formatDate(new Date());
    //上传
    db.collection('doctor').add({
      data:{
        doctor_src: picPath.fileID,
        doctor_name: finName,
        doctor_pos: finPos,
        doctor_department: finDepart,
        doctor_region: finRegion,
        doctor_hospital: finHos,
        doctor_expert: finExpert,
        doctor_detail: finDetail,
        doctor_applyTime: finTime,
        doctor_createId: app.globalData.userDocId,
        doctor_iscertify: false,
        doctor_isFirstClass: false,
        doctor_score: "5.00",
        doctor_tag: []
      }
    }).then(res=>{
      wx.showToast({
        title: '已发送申请',
        icon:"success",
        duration:1000
      })
      that.setData({opAble: true})
    })
    .catch(err=>{
      console.log(err)
    })
    wx.navigateBack({
      delta: 2
    })
  },

  uploadOneFile: async function(photoPath){
    var currTime = util.formatFileTime(new Date());
    return wx.cloud.uploadFile({
      filePath: photoPath,
      cloudPath: app.globalData.userDocId+'/'+ currTime,
    })
  }
})