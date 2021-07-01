// pages/newpost/newpost.js
Page({
  data: {
    keyboardHeight: 0,
    isIOS: false,
    isEditorFocused: false,
    title:null,
    pcontent:null,
    type:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
  
  newPostForm: function(data){
    var type = data.detail.value.choose_type;
    var title = data.detail.value.input_title;
    /*
    var that=this;
    //console.log(data);
    this.editorCtx.getContents({
      success(res) {
        that.setData({
          pcontent:res.html,
        });
      }
    });
    */
    this.setData({
      type:type,
      title:title,
    });
    console.log(this.data);
    console.log(this.data.pcontent)
    wx.navigateTo({
      url: `/pages/chooseboard/chooseboard?title=${this.data.title}&pcontent=${this.data.pcontent}&type=${this.data.type}`,
    })
  },

  editorInputChange: function(e){
    this.setData({
      pcontent:encodeURIComponent(e.detail.html),
    });
    console.log(this.data.pcontent)
  }
})