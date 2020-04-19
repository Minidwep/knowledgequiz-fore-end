// pages/login/index.js
// pages/info/index.js
import {
  requestNext,
  authorizationCheck
} from "../../request/index";
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    current: '',
    keyword:'',
    questionParam: {
      url: '',
      data: {},
      header: {
        'Authorization': 123
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      
    }
  },
  handleNavigator(e) {
    let item = e.currentTarget.dataset.item

    wx.redirectTo({
      url: '../questionInfo/index?questionId=' + item.id,
    });
  },
  async handleGetQuestion(pn) {
    let accout = wx.getStorageSync('account');
    this.data.questionParam.url = "/questionList/" + accout + "/" + pn;
    let res = await requestNext(this.data.questionParam);
    // console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {
      let questionList = this.data.questionList;
      let {
        pageInfo
      } = res.data.extend;
      let questionListNew = pageInfo.records;

      let current = pageInfo.current;
      questionList.push.apply(questionList, questionListNew);
      this.setData({
        questionList: questionList,
        current: current
      });
    }

  },
  async handleGetQuestionInit() {
    let accout = wx.getStorageSync('account');
    this.data.questionParam.url = "/questionList/" + accout + "/" + 1;
    let res = await requestNext(this.data.questionParam);
    // console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {
      let {
        pageInfo
      } = res.data.extend;
      let questionList = pageInfo.records;
      let current = pageInfo.current;
      this.setData({
        questionList: questionList,
        current: current
      });
    }

  },
  keyInput(e){
    this.setData({
      keyword: e.detail.value
    })
  },
  async handleSearch(){
    if(this.data.keyword == ''){
      return;
    }
    this.data.questionParam.url = "/questionList/keyword/"+this.data.keyword;
    let res = await requestNext(this.data.questionParam);
    // console.log(res);
    authorizationCheck(res);
    if (res.data.code == 100) {

      let questionList = res.data.extend.questionList;
      this.setData({
        questionList: questionList,
        current: 1
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetQuestion(1);
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

    this.handleGetQuestionInit();
    wx.stopPullDownRefresh()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.handleGetQuestion(this.data.current + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})