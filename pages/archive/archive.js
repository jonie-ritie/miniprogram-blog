// pages/archive/archive.js
const appInst = getApp();
const { config, Api, wxRequest } = appInst.globalData
let { webSiteName, getIndexNav:topNav, getAd:ad } = config;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postsList: [],  // 文章列表
    isLastPage: false,
    page: 1, // 请求页数
    pageCounts: 0,  // 总的页数
    showerror: "none",  // 网络加载失败问题
    showallDisplay: "block",
    floatDisplay: "none",  // 底部文章的提示
    webSiteName: webSiteName,  // 网站的名称
    isLoading: false,
    isAd: ad,
    sortMethod: "↓ 最新"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let self = this;
    self.fetchPostsData();
  },

  changeSortMethod: function (e) {
    if (this.data.postsList){
      if (this.data.sortMethod == "↓ 最早") {
        this.setData({sortMethod: "↓ 最新"});
        this.data.postsList.sort((m, n) => {
          if (m.date > n.date) return -1;
          else if (m.date < n.date) return 1;
          else return 0;
        });
      } else if (this.data.sortMethod == "↓ 最新") {
        this.setData({sortMethod: "↓ 最早"});
        this.data.postsList.sort((m, n) => {
          if (m.date > n.date) return 1;
          else if (m.date < n.date) return -1;
          else return 0;
        });
      }
      this.setData({
        postsList: this.data.postsList,
      });
    }
  },

  // 跳转至查看小程序列表页面或文章详情页
  redictAppDetail: function (e) {
    // console.log(e);
    let { url } = e.currentTarget.dataset
    if (url) {
      wx.navigateTo({
        url: `/pages/articles/articles?id=${url}`,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }
  },

  // 获取文章的数据信息
  fetchPostsData(e) {
    let page = this.data.page
    // 请求数据
    wxRequest.getRequest(Api.getPostList(page))
      .then(res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            pageCounts: res.data.pageCount,
            postsList: [...this.data.postsList, ...res.data.data]
          });
        } else {
          console.log('最后一页');
        }
      })
      .catch(res => {
        console.log(res);
      })
      .final(res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        this.setData({
          isLoading: false,
          op: 1
        })
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    let self = this;
    self.setData({
      isLoading: true,
      postsList: [],
      showerror: "none",
      showallDisplay: "block",
      floatDisplay: "none",
      isLastPage: false,
      page: 1,
      listAdsuccess: true
    });
    this.fetchPostsData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let self = this;
    if (!self.data.isLastPage && this.data.page < this.data.pageCounts) {
      self.setData({
        page: self.data.page + 1,
        isLoading: true
      });
      this.fetchPostsData();
    } else {
      self.setData({
        floatDisplay: 'block',
        isLoading: false,
        isLastPage: true,
        showerror: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `Arts of love & persistence`,
      path: 'pages/archive/archive',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    // console.log(e)
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