 function videoHIS() {
        this.singleVideo = false;
        this.setSingleVideo = function (isSingle) {
            this.singleVideo = isSingle;
        }
        this.getSingleVideo = function () {
            return singleVideo;
        }
        this.previewWndObj = function (index) {
            this.wndIndex = index;//窗口的位置
            this.previewOcx = null;//控件对象

            this.isPlaying = false;//是否正在播放
            this.cameraId = -1;
            this.frameNum = 1;//当前播放窗格索引
            this.wndNum = 4;//播放窗格总数

            this.cameraIdTmp = -1; // 在覆盖播放的时候记录上一次播放的监控点id，写操作日志用
            this.isCoverPlay = false; // 如果是覆盖播放为true，上一个监控点停止播放控件抛出后清为false
            this.isBeforeCoverPlaying = false;


            /* this.serverIP = "10.16.4.95";
             this.port = "2700";;*/
            this.serverIP = "101.200.209.131";
            /*this.serverIP = "10.16.229.106";*/
            this.port = "50005"
            this.userName = "123457";
            this.passWd = "12345";
            this.userInterface = 1;

        }

        this.checkBrowser = function (ocxId) {
            var cb = "Unknown";
            if (window.ActiveXObject) {
                cb = "IE";
            } else if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
                cb = "Firefox";
            } else if (navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
                cb = "Chrome";
            } else if ((typeof document.implementation != "undefined") && (typeof document.implementation.createDocument != "undefined") && (typeof HTMLDocument != "undefined")) {
                cb = "IE";
            }
           
        }
       
        this.videoInit = function (ocxId, iframeId) {

            this.previewWndObj(0);
           
            if (iframeId != null && iframeId.length > 0) {
                this.previewOcx = document.getElementById(iframeId).contentWindow.document.getElementById(ocxId);
            } else {
                this.previewOcx = document.getElementById(ocxId);//"RealTimePlayOcx"
                console.log(this.previewOcx);
            }
            this.initOcx();
            this.clear();
            return true;
        }
        this.initOcx = function () {
            var returnObj = {
                result: true,
                reason: "",
                isShow: false
            };
            if (this.previewOcx == null) {
                returnObj.reason = "ocx not loaded";
                returnObj.result = false;
            } else {
                console.log(this.serverIP + ":" + this.port);
				console.log(this.userName + ":" + this.passWd);
                var flag = this.previewOcx.InitOCX(this.serverIP, this.port, this.userName, this.passWd);
                console.log("初始化控件，调用InitOCX方法");
                if (0 != flag) {
                    returnObj.result = false;
                    returnObj.reason = "login error code:" + flag;
                    returnObj.isShow = true;
                }
            }
            return returnObj;
        };
        this.clear = function () {
            this.isPlaying = false;
            //this.cameraId = -1;
            this.cameraName = "";
            this.controlUnitId = -1;

            this.cameraIdTmp = -1;
            this.isCoverPlay = false;
        };
        this.getSelWnd = function () {
            return this.previewOcx.GetSelWnd();
        }
        this.selWnd = function (wndNum) {
            return this.previewOcx.ChangeLayout(wndNum);
        }
        this.videoPlay = function (strProductId, channelNum, protocolType, streamType, ulChannelId) {
            var returnObj = {
                result: true,
                reason: "",
                isShow: false
            };
            if (this.previewOcx == null) {
                returnObj.reason = "load failed";//"控件未成功加载,请加载控件后再操作";
                returnObj.result = false;
            }
            if (returnObj.result) {
                var startResult = -1;
                try {
                    //console.log("视频播放111，调用方法StartPlayVideo(" + strProductId + "," + ulChannelId + ")");
                    startResult = this.previewOcx.StartPlayVideo(strProductId, ulChannelId);
                    //console.log("视频播放111，调用方法StartPlayVideo");
                } catch (error) {
                    returnObj.reason = "start error";//"视频开始预览异常");
                }
                if (startResult != 0) {
                    this.clear();
                    returnObj.result = false;
                    if (returnObj.reason == "") {
                        returnObj.reason = "start failed";//"视频开始预览失败";
                        returnObj.isShow = true;
                    }

                }
            }
            return returnObj;
        }
        this.videoStopPlay = function (strProductId, ulChannelId) {
            var returnObj = {
                result: true,
                reason: "",
                isShow: false
            };
            if (this.previewOcx == null) {
                returnObj.reason = "ocx not loaded";//"控件未成功加载,请加载控件后再操作";
                returnObj.result = false;
            } else {
                var stopResult = 1;
                try {
                    stopResult = this.previewOcx.StopPlayVideo(strProductId, ulChannelId);
                    console.log("视频停止，调用方法StopPlayVideo");
                } catch (error) {
                    returnObj.reason = "stop error";//"视频停止预览异常");
                }
                if (stopResult != 0) {
                    returnObj.result = false;
                    if (returnObj.reason == "") {
                        returnObj.reason = "stop failed";//"视频停止预览失败";
                    }
                }
            }
            console.log(returnObj.result)
            return returnObj;
        }
        //设置配置参数
        this.setCfgParam = function () {
            var configXml = '<?xml version="1.0"?>' +
                '<data>' +
                '<SnapPath>D:\\snapshot</SnapPath>' +
                '<RecordPath>D:\\record</RecordPath>' +
                '</data>';
            console.log(configXml);
            console.log('this.previewOcx.SetCfgParam');
            this.previewOcx.SetCfgParam(configXml);
        }
        //截屏 1、DVR编号。2、通道号
        this.snap = function (strProductId, ulChannelId) {
            console.log('截屏：DVR编号=' + strProductId + ';通道号=' + ulChannelId);
            console.log('this.previewOcx.Snap');
            this.previewOcx.Snap(strProductId, ulChannelId);
            console.log('截屏结束');
        }
        //开始录像 1、DVR编号。2、通道号
        this.startRecord = function (strProductId, ulChannelId) {
            console.log('录像：DVR编号=' + strProductId + ';通道号=' + ulChannelId);
            console.log('this.previewOcx.StartRecord');
            this.previewOcx.StartRecord(strProductId, ulChannelId);
            console.log('录像开始');
        }
        //结束录像 1、DVR编号。2、通道号
        this.stopRecord = function (strProductId, ulChannelId) {
            console.log('录像：DVR编号=' + strProductId + ';通道号=' + ulChannelId);
            console.log('this.previewOcx.StopRecord');
            this.previewOcx.StopRecord(strProductId, ulChannelId);
            console.log('录像结束');
        }
        this.videoPrintScreen = function (path) {
            alert('截图功能接口未实现，控件不支持！');
        }

        this.videoStartCyclePlay = function (time) {
            alert('视频轮巡启动功能接口未实现，控件不支持！');
        }

        this.videoStopCyclePlay = function () {
            alert('视频轮巡中止功能接口未实现，控件不支持！');
        }
        this.videoStartRecord = function (wndNum, path) {
            alert('开始录像功能接口未实现，控件不支持！');
        }

        this.videoStopRecord = function (wndNum) {
            alert('结束录像功能接口未实现，控件不支持！');
        }
        this.setWndNum = function (maxWndNum) {
            this.previewOcx.ChangeLayout(maxWndNum);
        }
        this.getWndNum = function () {
            return this.previewOcx.GetWndNum();
        }
        this.UnregOCX = function () {
            this.previewOcx.UnregOCX();
        };
        //取Cookie中的值
        this.getCookie = function (name) {
            //取出cookie,
            var strCookie = document.cookie;
            //cookie的保存格式是 分号加空格 "; "
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (name == arr[0]) {
                    return arr[1];
                }
            }
            return "";
        }

        this.trim = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        }

    }