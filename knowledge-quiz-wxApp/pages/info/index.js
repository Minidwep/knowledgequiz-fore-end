// pages/info/index.js
import {
  requestNext,
  authorizationCheck
} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      answerNum: "",
      answerStarNum: "",
      questionNum: "",
      user: {}
    },
    infoParam: {
      url: '',
      data: {},
      header: {
        'Authorization': 123
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',

    },
    type: 10

  },
  async handleGetInfo() {
    let infoParam = this.data.infoParam;
    let account = wx.getStorageSync("account");
    infoParam.url = "/userInfo/" + account;
    let res = await requestNext(infoParam);
    authorizationCheck(res);
    if (res.data.code == 100) {
      console.log(res);
      
      let userInfoTemp = res.data.extend;
      let userInfo = this.data.userInfo;
      userInfo.answerNum = userInfoTemp.answerNum;
      userInfo.answerStarNum = userInfoTemp.answerStarNum;
      userInfo.questionNum = userInfoTemp.questionNum;
      userInfo.user = userInfoTemp.user;
      this.setData({
        userInfo: userInfo
      })
    }

  },
  handleExit(){
    wx.removeStorageSync('token');
    wx.removeStorageSync('account');
    wx.removeStorageSync('name');
    wx.removeStorageSync('userType');
    wx.redirectTo({
      url: '../login/index',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = wx.getStorageSync("userType");
    this.setData({
      type: type
    })
    this.handleGetInfo();
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