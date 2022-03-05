Page({
  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    gender:'0',
    storeData: [],
    form: {},
    cityInfo: {},
    order_id: null,
    ser_type: '',
    inputValue: '',
    timeId: -1,
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
  },
  // 输入框的值改变  就会触发的事件
  handleInput(e) {
    // 1.获取输入框的值
    const {
      value
    } = e.detail;
    // 3.准备发送请求获取数据
    this.setData({
      inputValue: value,
      isFocus: true,
      ['form.store_name']: value
    })
    clearTimeout(this.timeId);

    console.log(this.data.form)
    this.timeId = setTimeout(() => {
      this.getStoreList(this.data.form)
    }, 1000)
  },
  //删除输入框值
  cancelInput: function (e) {
    this.setData({
      inputValue: '',
      ['form.store_name']: ''
    })
    this.getStoreList(this.data.form)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.order_id) {
      //联系人信息
      // let contactInfo = {
      //   gender: options.gender, 
      //   is_connection: options.is_connection
      // }
      // wx.setStorageSync("contactInfo",contactInfo)
      this.setData({
        order_id: options.order_id,
        ser_type: options.ser_type,
        gender:options.gender,
        ['form.ser_type']: options.ser_type,
      })
    }
    let that = this;
    //当前城市
    if (options.cityInfo) {
      let cityInfo = wx.getStorageSync("cityInfo") //获取当前页面城市经纬度
      this.setData({
        cityInfo,
        ['form.city']: cityInfo.city,
        ['form.ser_type']: cityInfo.ser_type,
        ['form.latitude']: cityInfo.latitude,
        ['form.longitude']: cityInfo.longitude
      })
    }
    if (options.city) { //更多城市
      let cityInfo = wx.getStorageSync("cityInfo") //获取当前页面城市经纬度
      that.setData({
        ['form.city']: options.city, //上一页传过来的更多城市名称
        ['form.ser_type']: cityInfo.ser_type, //当前城市经纬度
        ['form.ser_type']: options.ser_type,
        ['form.latitude']: cityInfo.latitude,
        ['form.longitude']: cityInfo.longitude
      })
      console.log(that.data.form)
    }
    console.log(that.data.form)
    that.getStoreList(that.data.form);
  },
  getStoreList(data) {
    let that = this;
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/showstore/',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8' // 默认值
      },
      success(res) {
        console.log(res)
        let storeList = [];
        let distList = [];
        if (res.data.data.length > 0) {
          storeList = res.data.data
          distList = res.data.dist //距离
          let list = distList.map(item => ({
            distance: item
          }));
          console.log(list)
          let storeData = storeList.map((item, index) => {
            return {
              ...item,
              ...list[index]
            }
          })

          if (storeData.length > 0) {
            let newArr = storeData.sort((a, b) => a.distance - b.distance)
            that.setData({
              storeData: newArr
            })
            console.log(newArr)
          }
          wx.setStorageSync('storeData', storeData)
        } else {
          that.setData({
            storeData: []
          })
          wx.showToast({
            title: '暂无门店信息',
            // title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  },
  toShop(e) { //预约到店
    let item = e.currentTarget.dataset.item;
    console.log(item)
    wx.redirectTo({
      url: '../../pages/subscribe/subscribe?sto_name=' + item.sto_name + '&sto_phone=' + item.sto_phone + '&sto_addr=' + item.sto_addr + '&order_id=' + this.data.order_id + '&ser_type=' + this.data.form.ser_type+'&gender='+this.data.gender,
    })
  },
  clickCity(e) { //跳转城市列表
    this.setData({
      ser_type: this.data.ser_type,
      gender:this.data.gender
      // ['form.order_id']:id
      // ['form.sto_name']:list.sto_name
    })
    console.log(this.data.form)
    wx.redirectTo({
      url: '../../pages/cityList/cityList?order_id=' + this.data.order_id + '&ser_type=' + this.data.ser_type+'&gender='+this.data.gender,
    })
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