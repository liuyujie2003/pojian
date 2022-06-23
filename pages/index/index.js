//index.js
//获取应用实例
import api from '../../config/content';
let bookCloseAction = 'book-cover-close-action';
let bookCloseStatus = 'book-cover-close-status';
let bookOpenAction = 'book-cover-open-action';
let bookOpenStatus = 'book-cover-open-status';
Page({
  data: {
    bookStatus: bookCloseStatus,
    showBook: true,
    collectBook: '关闭',
    content: api.array,
    answer: '',
    showTip: true,
    showTipClickFlag: false,
    bgAudioPlay: true
  },
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.clickAudioCtx = wx.createAudioContext('clickAudio');
    this.bgAudioCtx = wx.createAudioContext('bgAudio');
    this.bgAudioCtx.play()
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 设置打开书本的动作，以及打开书本的状态
   */
  openBook: function () {
    this.clickAudioPlay();
    let bookStatus = this.data.bookStatus;
    //状态为关闭的动作（关闭中），打开的动作（打开中），或打开的状态禁止操作
    if (bookStatus === bookCloseAction || bookStatus === bookOpenAction || bookStatus === bookOpenStatus) {
      return;
    }
    
    //获取内容的下标
    let _content = this.data.content;
    let answerIndex = parseInt(Math.random() * _content.length);

    let _this = this;
    //设置答案以及进行书本打开操作
    _this.setData({
      answer: _content[answerIndex],
      bookStatus: bookOpenAction
    })
    setTimeout (function () { 
      wx.hideLoading();
    }, 3000);
    let setBookOpenStatus = setTimeout (function () { 
      //设置书本为打开的状态
      _this.setData({
        bookStatus: bookOpenStatus
      })
      clearTimeout(setBookOpenStatus);
    }, 8000);
  },
  /**
   * 设置关闭书本的动作，以及关闭书本的状态
   */
  collectBooks: function (event) {
    this.clickAudioPlay();
    let bookStatus = this.data.bookStatus;
    if (bookStatus === bookOpenAction || bookStatus === bookCloseAction) {
      wx.showToast({
        title: '您手速太快了！',
        icon: 'none',
        duration: 3000,
        mask: true
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let _this = this;
    //显示书籍并且是关闭状态，才能收藏
    if (this.data.showBook && bookStatus === bookCloseStatus) {
      _this.setData({
        showBook: false,
        collectBook: '取出',
      })
      wx.hideLoading()
      return;
    }
    if (this.data.showBook) {
      _this.setData({
        bookStatus: bookCloseAction
      })
      let setBookCloseStatus = setTimeout (function () { 
        _this.setData({
          bookStatus: bookCloseStatus
        })
        wx.hideLoading()
        if (event.target.id === 'collect') {
          let collect = setTimeout (function () { 
            _this.setData({
              showBook: false,
              collectBook: '取出',
            })
            clearTimeout(collect);
          }, 10);
        }
        clearTimeout(setBookCloseStatus);
      }, 8000);
    } else {
      _this.setData({
        showBook: true,
        collectBook: '关闭',
      })
      wx.hideLoading()
    }
  },
  hideTip: function () {
    this.clickAudioPlay();
    let _this = this;
    if (!_this.data.showTipClickFlag) {
      wx.showLoading({
        title: '正在关闭提示',
        mask: true
      })
      _this.setData({
        showTipClickFlag: true
      })
      let showTip = setTimeout (function () { 
        _this.setData({
          showTip: false
        })
        wx.hideLoading();
        clearTimeout(showTip);
      }, 10);
    }
  },
  clickAudioPlay: function () {
    this.clickAudioCtx.play()
  },
  bgAudioPause: function () {
    let bgAudioPlay = this.data.bgAudioPlay;
    if (bgAudioPlay) {
      this.bgAudioCtx.pause()
      this.setData({
        bgAudioPlay: false
      })
    } else {
      this.bgAudioCtx.play()
      this.setData({
        bgAudioPlay: true
      })
    }
  },
})
