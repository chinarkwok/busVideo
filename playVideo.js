  
        $(document).ready(function () {
			var siteVideoConfig = {
				sleepTime: 1000,
				timeOutTime: 500
			};
            "use strict";
           
            var video = new videoHIS();//视频控件对象
            var inspectViewNum = 4;     //当前监控的分屏数量
            var curInspectDevIdes = [];  //当前监控的视频ID列表
            var iniVideoWndNum = 4;//默认视频控件显示的屏幕数量
            var dvrselfId = '';
            var channelNum = 0;//通道数量
            //视频树节点数据
            var zNodes = [{"iconSkin":"tree_camera_active","name":"通道_5","pId":"-1","id":"5","dvrselfId":"20390969"},{"iconSkin":"tree_camera_active","name":"通道_1","pId":"-1","id":"1","dvrselfId":"20390969"},{"iconSkin":"tree_camera_active","name":"通道_2","pId":"-1","id":"2","dvrselfId":"20390969"},{"iconSkin":"tree_camera_active","name":"通道_3","pId":"-1","id":"3","dvrselfId":"20390969"},{"iconSkin":"tree_camera_active","name":"通道_4","pId":"-1","id":"4","dvrselfId":"20390969"},{"iconSkin":"tree_dir_active","name":"摄像头列表","pId":"-9999","id":"-1","open":"true"}];
            //var zNodes=[{"iconSkin":"tree_dir_active","id":"-1","name":"鲁B09522F摄像头列表","open":"true","pId":"-9999"},{"dvrselfId":"99940530","iconSkin":"tree_dir_active","id":"0","name":"车前","pId":"-1"}]
            var setting = {
                data: {
                    key: {
                        title: "name"
                    },
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onDblClick: videoTreeOnDblClick
                }
            };
			$.fn.zTree.init($("#busVideo_tree"), setting, zNodes);
			video.videoInit("bus-single-video-ocx",null);
            //video.setWindowsNum(inspectViewNum);
            video.setCfgParam();
			
            //双击显示某视频
            function videoTreeOnDblClick(event, treeId, treeNode) {
                
                // var i = curInspectDevIdes.length;               
                // var id = treeNode.id;
                // i = curInspectDevIdes.length;
                // console.log("当前播放的视频是：" + curInspectDevIdes);
                // if (i < 4) {
                //     var devId = {};
                //     devId.id = id;
                //     devId.index = i;
                //     devId.dvrselfId = treeNode.dvrselfId;
                //     dvrselfId = treeNode.dvrselfId;
                //     curInspectDevIdes.push(devId);
                //     highLightTreeNodeById(id, true);
                // }
                // video.videoPlay(treeNode.dvrselfId, 0, 0, 0, i);
                       
                var channelId = treeNode.id;

                if (curInspectDevIdes.length < 4 && $.inArray(channelId,curInspectDevIdes)==-1) {
                    curInspectDevIdes.push(channelId);
                    highLightTreeNodeById(channelId, true);
                    video.videoPlay(treeNode.dvrselfId, 0, 0, 0, channelId);
                }
                else if($.inArray(channelId,curInspectDevIdes)>-1){
                    video.videoStopPlay(treeNode.dvrselfId,channelId);
                    highLightTreeNodeById(channelId, false);
                    curInspectDevIdes.splice($.inArray(channelId,curInspectDevIdes),1);
                }
            };


            //设置某节点高亮显示
            function highLightTreeNodeById(id, h) {
                var treeObj = $.fn.zTree.getZTreeObj("busVideo_tree");
                var sNode = treeObj.getNodeByParam("id", id);
                treeObj.setting.view.fontCss = {"color": "#000", "font-weight": "normal"};
                if (h) {
                    //treeObj.setting.view.fontCss["color"] ="#ff0000";
                    treeObj.setting.view.fontCss = {"color": "#00aa76", "font-weight": "bold"};
                }
                if (sNode) {
                    treeObj.updateNode(sNode);
                }
            }

            window.onbeforeunload = onclose;
            function onclose() {
                //关闭通道
               /* var nDevIds = curInspectDevIdes.length;
                var i;
                for (i = nDevIds - 1; i >= 0; i--) {
                    //console.log("会死循环吗？");
                    //先停止播放当前的视频
                    video.videoStopPlay(i);
                    sleep(100);
                    //alert(" video.videoStopPlay(" + i + ");");
                }*/
                video.UnregOCX();
                //sleep(5000);

            }
        });