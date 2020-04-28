var WxParse = require('../../wxParse/wxParse.js');
import {
  requestNext,
  authorizationCheck
} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    answerInfo: {},
    questionAccount:0,
    answerParam: {
      url: '',
      data: {},
      header: {
        'Authorization': 123
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
    },
    loading: false,
    answerFlag: false,
    answerId:0
  },

  back() {
    if (this.data.loading) {
      // wx.redirectTo({
      //   url: '../questionInfo/index?questionId='+this.data.answerInfo.questionId
      // });
      wx.navigateBack({
        delta: 1
      })
    }

  },
  async handleInitAnswer(answerId) {
    this.data.answerParam.url = "/answerInfo/" + answerId;
    let res = await requestNext(this.data.answerParam);
    console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {
      let answerInfo = res.data.extend.answerInfo;
      if(answerInfo.detail == null || answerInfo.detail == '')
        answerInfo.detail = '';
      WxParse.wxParse('detail', 'html', answerInfo.detail, this, 0);
      this.setData({
        answerInfo: answerInfo,
        loading: true
      })
    }
  },
  async handleUpAnswer() {
    this.data.answerParam.url = "/answerUp/" + this.data.answerId;
    let res = await requestNext(this.data.answerParam);
    console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {
      wx.showToast({
        title: '采纳成功',
        icon: 'success',
        duration: 1000
      });
    } else {
      wx.showToast({
        title: '采纳失败',
        icon: 'none',
        duration: 1000
      });
    }
  },
  onLoad: function (options) {
    var answerId = options.answerId;
    var title = options.title;
    var questionAccount = options.questionAccount;
    var questionFlag = options.questionFlag;
    let account = wx.getStorageSync("account");
    let answerFlag =false;
    if(account == questionAccount){
      if(questionFlag == "true"){
        answerFlag = true;
      }  
    }
    this.setData({
      title: title,
      questionAccount:questionAccount,
      questionFlag:questionFlag,
      answerFlag:answerFlag,
      answerId:answerId
    })

    console.log(answerId);
    this.handleInitAnswer(answerId);
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