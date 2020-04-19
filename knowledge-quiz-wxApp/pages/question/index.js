// pages/editor.js
import {
  requestNext,
  authorizationCheck
} from "../../request/index";
Page({
  /**
   * 
   * 页面的初始数据
   */
  data: {
    isShow: false,
    placeholder: '请输入',
    param: {
      content: '',
    },
    richContent: "",
    richJobRemark: "",
    title: '',
    questionParam: {
      url: '',
      data: {},
      header: {
        'Authorization': 123
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
    },
    array: [],
    arrayIdIndex: [],
    arrayIndex: 0,
    courseList: '',
    courseIndex: 0,
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.handleGetCourseList();


  },
  async handleGetCourseList() {
    let type = wx.getStorageSync('userType');
    let account = wx.getStorageSync('account');
    let typeUrl = '';
    if (type == '1') {
      typeUrl = '/teaCourse'
    }
    if (type == '0') {
      typeUrl = '/stuCourse'
    }
    let questionParam = this.data.questionParam;
    console.log(questionParam);

    questionParam.method = "GET";
    questionParam.url = typeUrl + "/" + account;
    let res = await requestNext(questionParam);
    authorizationCheck(res)
    if (res.data.code == 100) {
      let courseList = res.data.extend.courseList;
      let array = [];
      let arrayIdIndex = [];
      courseList.forEach(element => {
        array.push(element.name);
        arrayIdIndex.push(element.id);

      });
      this.setData({
        array: array,
        arrayIdIndex: arrayIdIndex,
        courseList: courseList
      })
    }
    console.log(res);

  },
  //富文本
  // 富文本相关的函数
  onEditorReady1() { //1
    const that = this
    this.createSelectorQuery().select('#editor1').context(function (res) {
      console.log(res)
      that.editorCtx1 = res.context
      if (that.data.richContent == "" || that.data.richContent == null) {} else {
        that.editorCtx1.setContents({
          html: that.data.richContent
        }) // 注意：插入的是对象
      }
    }).exec()
  },
  //富文本失焦的事件
  blur1(e) { //1
    let html = e.detail.html
    let delta = e.detail.delta
    console.log(html)
    console.log(delta)
    this.data.param.content = html
    this.setData({
      param: this.data.param
    })
    this.editorCtx1.blur()
  },
  //样式设置的部分
  format1(e) { //1
    console.log(e)
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    console.log(this)
    this.editorCtx1.format(name, value)

  },
  //富文本编辑器状态改变
  onStatusChange1(e) { //1
    console.log(this.editorCtx1)
    console.log("----");

    const formats = e.detail
    this.setData({
      formats
    })
  },
  //插入图片 （需要自己配置url以及上传参数）
  insertImage1() { //1
    const that = this
    // let user_token = global.state.token;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let baseUrl = "http://localhost:8080";
        let token = wx.getStorageSync('token');
        let type = wx.getStorageSync('userType');
        if (token == '' || type == '') {
          return;
        }
        let typeUrl = '';
        if (type == '1') {
          typeUrl = baseUrl + '/teacher'
        }
        if (type == '0') {
          typeUrl = baseUrl + '/student'
        }
        wx.uploadFile({
          url: typeUrl + '/fileUpload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            "Authorization": token
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data);
              let img = baseUrl + "/" + data.extend.url;
              that.editorCtx1.insertImage({
                src: img,
                data: {
                  id: 'abcd',
                  role: 'god'
                },
                width: '400px',
                success: function () {
                  console.log('insert image success')
                }
              })
            }
          }
        })
      }
    })
  },

  async handleUp() {
    console.log("冒泡");
  },

  async handleQuestion() {
    console.log("******");
    console.log(this.data.param.content);
    if (this.data.flag == false || this.data.title == '' || this.data.param.content == '') {
      wx.showToast({
        title: '再次确认',
        icon: 'success',
        duration: 1000
      });
      this.setData({
        flag: true
      })
      return;
    }
    let questionParam = this.data.questionParam;
    questionParam.url = "/question";
    questionParam.method = "POST";
    questionParam.data.title = this.data.title;
    let account = wx.getStorageSync("account");
    questionParam.data.account = account;
    questionParam.data.detail = this.data.param.content;
    questionParam.data.courseId = this.data.courseList[this.data.arrayIndex].id;
    let res = await requestNext(questionParam);
    authorizationCheck(res);
    this.setData({
      flag: false
    })
    console.log(res);

    if (res.data.code == 100) {
      let type = wx.getStorageSync("userType");

      if (type == '0') {
        console.log(123);
        wx.showModal({
          title: '等待审核',
          content: '发布成功！等待问题通过审核后显示。',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '返回主页',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: '../index/index'
              });
            } else {
              wx.switchTab({
                url: '../index/index'
              });
            }
          },
          fail: () => {},
          complete: () => {}
        });
      }
      if (type == '1') {
        wx.showModal({
          title: '发布成功',
          content: '现在题目可以回答了！',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '返回主页',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: '../index/index'
              });
            } else {
              wx.switchTab({
                url: '../index/index'
              });
            }
          },
          fail: () => {},
          complete: () => {}
        });
        this.onShow();
      }



    }
  },
  titleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindCountryChange(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      arrayIndex: e.detail.value
    })
    console.log(this.data.courseList[this.data.arrayIndex]);

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.handleGetCourseList();
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
  keyInput(e) {
    this.setData({
      keyword: e.detail.value
    })
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