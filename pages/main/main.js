/***
 * @Description: 个人主页的登录设计
 * @Author: Jonas
 */
// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    closeLoginBlock: false,
    isLogin: false,
    isLoaded: true,
    weatherTop: 83,
    weatherHeight: 32,
    weatherWidth: 87,
    region: [],
    temperature: "~°C",
    weatherIcon: "../../static/weather/999-fill.svg",
    addrid: 0,
    longitude: 0,
    latitude: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置天气胶囊所在位置
    this.setWeatherCellStyle();
    
    //设置用户所在位置
    this.setUserLoc();
  },
  setUserLoc: function(e) {
    var that = this;
    wx.getFuzzyLocation({
      type: 'gcj02',
      success (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        console.log(that.data.longitude + "," + that.data.latitude);
      },
      complete () {
        that.getCurrentLoc();
      }
    })
  },
  setWeatherCellStyle: function () {
    // 设置天气胶囊所在位置
    this.setData({
      weatherTop: wx.getMenuButtonBoundingClientRect().top + wx.getMenuButtonBoundingClientRect().height,
      weatherHeight: wx.getMenuButtonBoundingClientRect().height,
      weatherWidth: wx.getMenuButtonBoundingClientRect().width,
    })
    console.log(wx.getMenuButtonBoundingClientRect().right)
  },
  getCurrentLoc: function() {
    var that = this; //this不可以直接在wxAPI函数内部使用
    // 调用和风天气API获取位置ID
    var loc = that.data.longitude.toString() + "," + that.data.latitude.toString();
    wx.request({
      url: 'https://geoapi.qweather.net/v2/city/lookup?',
      data: {
        location: loc,
        key: 'cdf6c29c017144a49986d73463f868ca'
      },
      success: function (res) {
        console.log(res.data.location[0].name)
        that.setData({ addrid: res.data.location[0].id })
      },
      complete: function () {
        if (that.data.addrid !== 0) {
          that.getWeather();
        }
      }
    });
  },
  getSelectLoc: function(e) {
    var that = this; //this不可以直接在wxAPI函数内部使用
    that.setData({ region: e.detail.value });
    wx.request({
      url: 'https://geoapi.qweather.net/v2/city/lookup?',
      data: {
        location: that.data.region[2],
        key: 'cdf6c29c017144a49986d73463f868ca'
      },
      success: function (res) {
        console.log(res.data.location[0].name);
        that.setData({ addrid: res.data.location[0].id });
      },
      complete: function () {
        if (that.data.addrid !== 0) {
          that.getWeather();
        }
      }
    });
  },
  getWeather: function () {
    var that = this; //this不可以直接在wxAPI函数内部使用 
    // 调用和风天气API获取天气信息
    wx.request({
      url: 'https://devapi.qweather.com/v7/weather/now?',
      data: {
        location: that.data.addrid,
        key: 'cdf6c29c017144a49986d73463f868ca'
      },
      success: function (res) {
        // console.log(res.data)
        that.setData({ 
          temperature: res.data.now.temp + "°C",
          weatherIcon: "../../static/weather/" + res.data.now.icon + "-fill.svg",
        })
      }
    });
  },
  // 登录
  getUserProfile(e) {
    this.setData({isLoaded: false});
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '收集小程序质量以及错误反馈', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync("userInfo", res.userInfo);
        this.setData({
          hasUserInfo: res.userInfo,
          isLogin: true,
          closeLoginBlock: true,
        });
        wx.showToast({
          title: '更新成功',
          icon: 'none',
          duration: 1000
        });
      },
      complete: (res) => {
        this.setData({
          isLoaded: true,
        });
      }
    })
  },
  closeLoginPopup() {
    this.setData({
      closeLoginBlock: !this.data.closeLoginBlock
    })
  },
  // 退出登录
  closeF(){
    wx.clearStorage();
    wx.switchTab({
      url: '/pages/index/index',
      success: (result)=>{
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 1500
        });
      }
    }); 
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
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.setData({
        hasUserInfo: false,
        closeLoginBlock: false,
        isLogin: false,
      })
    } else {
      this.setData({
        hasUserInfo: userInfo,
        closeLoginBlock: true,
        isLogin: true,
      })
    }
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

  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})