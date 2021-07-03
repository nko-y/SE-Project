// components/oneComment.js
var app = getApp();
var db = wx.cloud.database();
const cd = db.command;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    certainComment: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLove: {},
    love_num: {},
    post_id: {},
    cur_user: {},
    index: {},
  },

  lifetimes: {
    attached: function() {
      var love_users = this.properties.certainComment.love_users;
      var cur_user = app.globalData.userDocId;
      var isLove = this.isInArray(love_users, cur_user);
      var love_num = this.properties.certainComment.love_users.length;
      console.log(love_users);
      console.log("oneComment isLove: " + isLove);
      console.log("oneComment love_num: " + love_num);
      var index = this.properties.certainComment.index;
      this.setData({
        isLove: isLove,
        cur_user: cur_user,
        post_id: this.properties.certainComment.post_id,
        index: index,
        love_num: love_num,
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindLoveTap: async function() {
      var that = this;
      var isLove = this.data.isLove;
      if(isLove) {
        console.log(that.data.post_id);
        console.log(that.data.index);
        await db.collection('post').doc(that.data.post_id).update({
          data:{
            comments: cd.pull({
              index: cd.eq(that.data.index)
            })
          }
        }).then(res=>{
          console.log(res);
        });
        that.properties.certainComment.love_users = that.deleteElement(that.properties.certainComment.love_users, that.data.cur_user);
        console.log(that.properties.certainComment.love_users);
        await db.collection('post').doc(that.data.post_id).update({
          data:{
            comments: cd.push(that.properties.certainComment)
          }
        }).then(res=>{
          console.log(res);
        });
        this.setData({
          isLove: false,
          love_num: that.data.love_num - 1,
        });
      } else {
        await db.collection('post').doc(that.data.post_id).update({
          data:{
            comments: cd.pull({
              index: cd.eq(that.data.index)
            })
          }
        }).then(res=>{
          console.log(res);
        });
        that.properties.certainComment.love_users.push(that.data.cur_user);
        console.log(that.properties.certainComment.love_users);
        await db.collection('post').doc(that.data.post_id).update({
          data:{
            comments: cd.push(that.properties.certainComment)
          }
        }).then(res=>{
          console.log(res);
        });
        this.setData({
          isLove: true,
          love_num: that.data.love_num + 1,
        });
      }
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

    deleteElement: (array, value) => {
      var index = array.indexOf(value);
      array.splice(index, 1);
      return array;
    }
  }
})