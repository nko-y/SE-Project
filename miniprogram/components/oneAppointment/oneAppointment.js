// components/oneAppointment/oneAppointment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type: Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hasAccept: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    acceptAppoint: function(e){
      var that = this
      wx.showModal({  
        title: '提示',  
        content: '确认接受预约？',  
        success: function(res) {  
          if (res.confirm) {  
            that.setData({hasAccept:true})
          } else if (res.cancel) {  
            console.log('用户点击取消')  
          }  
        }  
    })
    }
  }
})
