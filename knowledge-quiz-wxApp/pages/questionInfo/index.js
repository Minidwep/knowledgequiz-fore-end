// pages/questionInfo/index.js
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
    questionInfo: {},
    answerList:{},
    questionParam: {
      url: '',
      data: {},
      header: {
        'Authorization': 123
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
    },
    istrue: false,
    loading:false,
    flag:true
  },
  handleOpenAnswer() {
    wx.navigateTo({
      url: '../answer/index?questionId='+this.data.questionInfo.id
    });
  },
  back() {
    wx.switchTab({
      url: '../index/index'
    });
  },
  async handleInitAnswer(questionId){
    this.data.questionParam.url = "/question/answer/" + questionId;
    let res = await requestNext(this.data.questionParam);
    console.log(res);
    authorizationCheck(res);
    if(res.data.code == 100){
      let answerList = res.data.extend.answerVOList;
      let flag = true;
      answerList.forEach((element, index) => {
        if (element.star == "1") {
          let temp = answerList[0];
          answerList[0] = element;
          answerList[index] = temp;
          flag= false;
        }
      });
      this.setData({
        answerList:answerList,
        loading:true,
        flag:flag
      })
    }
  },
  async handleGetQuestionInfo(questionId) {
    this.data.questionParam.url = "/questionInfo/" + questionId;
    let res = await requestNext(this.data.questionParam);
    console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {
      let questionInfo = res.data.extend.questionInfo;
      
      WxParse.wxParse('detail', 'html', questionInfo.detail, this, 0);
      this.setData({
        questionInfo: questionInfo
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var questionId = options.questionId;
    this.handleGetQuestionInfo(questionId);
    this.handleInitAnswer(questionId);

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