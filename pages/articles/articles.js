// pages/articles/articles.js
const appInst = getApp();
const { config, Api, wxRequest } = appInst.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    htmlText: '',
    author_d: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    let { id } = options
    if (options !== null) {
      this.getDetail(id)
    }
  },
  // 进入页面后进行请求
  getDetail(e) {
    let _this = this
    wxRequest.getRequest(Api.getArticleDetail(e))
      .then(res => {
        if (res.statusCode == 200) {
          _this.setData({
            htmlText: res.data,
            author_d: {
              name: config.getAuthorname,
              img: config.getAuthorImg,
              domain: config.getDomain,
              webname: config.getWebsiteName
            },
            isLoaded: true
          })
        }
      })
  },
  // 点击复制链接到剪切板
  Nav_a(e) {
    let { con } = e.currentTarget.dataset
    let data = ''
    switch (con) {
      case "1":
        data = config.getDomain
        break;
      case "2":
        data = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
    }
    // 设置剪切板的内容
    wx.setClipboardData({data})
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
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
})