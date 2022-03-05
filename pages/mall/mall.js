// pages/mall/mall.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    add: 'add',
    newsUrl: '',
    swiperList: [],
    list: [{
        id: 1,
        custom: false,
        detailImgList: []
      },
      {
        id: 2,
        custom: false,
        detailImgList: []
      },
      {
        id: 3,
        charge: "*此项为收费服务，详情敬请莅临门店咨询",
        custom: true,
        detailImgList: []
      }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    show: false,
    detailArr: [],
    clickIndex: 0,
  },
  //results
  getImg() {
    //https://coachorder.zen-x.com.cn/api/coach/getBanner/
    let that = this;
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/getBanner/',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data
        that.setData({
          swiperList: data
        })
      }
    })
  },
  getList() {
    let that = this;
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/service',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let arr = res.data.results
        let newArr = arr.map((item, index) => {
          let str = item.ser_explain
          let m = str.split("，");
          let m1 = m[0];
          let m2 = m[1];
          item.description = m1
          item.detailtext = m2
          return {
            ...item,
            ...that.data.list[index],
          }
        })
        that.setData({
          list: newArr,
        })
      }
    })
  },
  loadFuction(e) {
    console.log(e.currentTarget.dataset.id);
    let swiperList = this.data.swiperList
    console.log(swiperList)
    // newsUrl:item.content_link
    swiperList.forEach((item, index, array) => {
      console.log(item);
      this.setData({
        newsUrl: item.content_link
      })
      console.log(e.currentTarget.dataset.id, index)
      console.log(e.currentTarget.dataset.id === index)
      if (e.currentTarget.dataset.id === index) {
        wx.navigateTo({
          url: '../../pages/out/out?newsUrl=' + item.content_link, //路径必须跟app.json一致
          success: function () {

          }, //成功后的回调；
          fail: function () {}, //失败后的回调；
          complete: function () {}
        })
      }
      console.log(item.content_link)
    });
  },
  toSubscribe(e) {
    wx.setStorageSync("form", this.data.form)
    let ser_type = e.currentTarget.dataset.item.ser_type
    wx.navigateTo({
      url: '../subscribe/subscribe?ser_type=' + ser_type + '&add=' + this.data.add
    })
  },
  toExplain(e) { //点击服务说明
    this.setData({
      clickIndex: e.currentTarget.dataset.id
    })
    let that = this
    let item = e.currentTarget.dataset.item
    let arr = []
    arr.push(item)
    that.setData({
      show: true,
    })
  },
  closeMask() { //关闭弹层
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    this.getList()
    this.getImg()
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
  onShareAppMessage: function (options) {
    console.log(options)
    var share_title = "coach"; //名称
    var phoneNumber = wx.getStorageSync('phoneNumber');
    var share_path = '/pages/mall/mall?id=' + phoneNumber;
    let shareImg = 'https://coachorder.zen-x.com.cn/media/images/%E5%93%81%E7%89%8C%E8%B5%84%E8%AE%AF%20(2).png'; //候展示的图片
    console.log('转发地址：' + share_path);
    var that = this;
    return {
      title: share_title,
      path: share_path,
      imageUrl: shareImg,
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        console.log(res)
        // 转发失败
      },
      complete(res) {
        console.log(res)
      }

    }
  }
})