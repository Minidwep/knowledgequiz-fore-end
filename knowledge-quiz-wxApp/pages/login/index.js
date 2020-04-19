// pages/info/index.js
import {
  request
} from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [{
        name: '学生',
        value: '0',
        checked: true
      },
      {
        name: '教师',
        value: '1'
      }
    ],
    username: '',
    password: '',
    type:0,
    loginParam: {
      data:{
        username: '',
        password: ''
      },
      header: {'content-type':'application/json'},
      method: 'POST',
      dataType: 'json',
      url:"/authenticate"
    }
  },
  userNameInput(e) {
    this.setData({
      username: e.detail.value
    })
  },
  passWordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  radioChange(e) {
    var radioItems = this.data.radioItems;
    let type = 0;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
      if(radioItems[i].checked){
      type = radioItems[i].value;
      }
    }
    this.setData({
      radioItems: radioItems,
      type:type
    });

  },
  async handleLogin() {
    if (this.data.username.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      this.data.loginParam.data.username = this.data.username;
      this.data.loginParam.data.password = this.data.password;
      let res = await request(this.data.loginParam);
      console.log(res);
      
      let temp =  res.data.extend.token.token;
      let token ="Bearer " + temp;
      let user = res.data.extend.user;
      if(res.data.code == 100 && user.userType == this.data.type){
        wx.setStorage({
          key: 'account',
          data: user.account,
        });
        wx.setStorage({
          key: 'name',
          data: user.name,
        });
        wx.setStorage({
          key: 'userType',
          data: user.userType,
        });

        wx.setStorage({
          key: 'token',
          data: token,
        });
        wx.switchTab({
          url: '../index/index'
        })
      }else{
        wx.showToast({
          title: '密码错误',
          icon: 'none',
          duration: 2000
        });
      }
     
    }        
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})