Page({
  /**
   * 页面的初始数据
   */
  data: {
    edit:'edit',
    clickFlag: false,
    top_bg: 'https://coachorder.zen-x.com.cn/media/images/photo/order.png',
    title: "",
    obj: {
      src: '',
      all: "10:00-22:00"
    }
  },
  edit(e) { //点击修改预约
    let order_id = e.currentTarget.dataset.order_id;
    let ser_type = e.currentTarget.dataset.ser_type;
    let edit = e.currentTarget.dataset.status;
    console.log(this.data.obj)
    wx.navigateTo({
      url: '../../pages/subscribe/subscribe?order_id=' + order_id+'&ser_type='+ser_type+'&edit='+edit+'&editstore='+this.data.obj.store
    })
  },
  cancel() { //点击取消预约
    let order_id = this.data.obj.order_id;
    let login_key = wx.getStorageSync('login_key')
    wx.showModal({
      title: '提示',
      content: '您确定要取消预约吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://coachorder.zen-x.com.cn/api/coach/updatetorder/',
            method: 'DELETE',
            data: {
              order_id,
              login_key
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.status === 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                wx.switchTab({
                  url: '../../pages/index/index'
                })
                }, 1000)
              }
            }
          })
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.service) {
      this.setData({
        ['obj.ser_type']: options.service,
      })
    }
    let that = this;
    if (options.rec_id) { //showorder/
      let rec_id = options.rec_id;
      let login_key = wx.getStorageSync('login_key')
      wx.request({
        url: 'https://coachorder.zen-x.com.cn/api/coach/showorder/',
        data: {
          rec_id,
          login_key
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          let imgUrl = 'https://coachorder.zen-x.com.cn/'
          that.setData({
            ['obj.gender']:res.data.results.gender,
            ['obj.src']: imgUrl + res.data.results.rec_qr_code,
            ['obj.date']: res.data.results.rec_reserve_time ? res.data.results.rec_reserve_time.substring(0, 10) : null,
            ['obj.phone']: res.data.results.rec_phone,
            ['obj.order_id']: res.data.results.rec_id,
            ['obj.remark']: res.data.results.rec_remark,
            ['obj.res_id']: res.data.results.res_id,
            ['obj.ser_type']: res.data.results.res__ser__ser_type,
            ['obj.w_week']: res.data.results.rec_week,
            ['obj.sto_addr']: res.data.results.res__sto__sto_addr,
            ['obj.store']: res.data.results.res__sto__sto_name,
            ['obj.time']: res.data.results.rec_time,
            ['obj.sto_phone']: res.data.results.res__sto__sto_phone
          })
        }
      })
    }
   
    if (options.parms) {
      let data = decodeURIComponent(options.parms)
      let parms = JSON.parse(data)
      let imgUrl = 'https://coachorder.zen-x.com.cn/'
      this.setData({
        ['obj.src']: imgUrl + parms.image,
        ['obj.ser_type']: parms.ser_type,
      })
      const newObj = Object.assign(this.data.obj, parms)
      console.log(newObj)
      this.setData({
        obj: newObj
      })
    }
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
    // window.addEventListener("popstate", function (e) {
    //wx.miniProgram.reLaunch({ url: '/pages/index/index' });
    //   }, false)
    // var backpage = getCurrentPages()[1];
    // backpage.setData({}); //父页面 setData
    // backpage.xxxxxx();//父页面自定义方法
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
    this.gotoHomePage();
  },
  gotoHomePage: function () { //自定义页面跳转方法
    let that = this;
    if (that.data.clickFlag) {
      return;
    } else {
      that.setData({
        clickFlag: true
      });
    }
    wx.reLaunch({
      url: '../../pages/index/index'
    })
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