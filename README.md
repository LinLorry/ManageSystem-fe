# Manage-fe


## 完成对需求的分析，新建仓库



## 上传页面框架
完成登录、注册、个人首页的编写

## 上传popup组件的文件

### pupop的说明：
1. 所有alert、confirm的title为自定义，需以参数传入。
2. confirm 弹窗支持回调。
3. 带图片的弹窗，图片自定义imgConfirm。
4. toast弱提示，时间可以自定义，默认为2s。

### pupop的示例：

1. alert
    ```
    var Popup = new Popup();
    Popup.alert('alert提示','创建的弹窗出来了！');
    ```
2. confirm
    ```
    function confirmData () {
        console.log('hahaha')
    }
    
    var Popup = new Popup();
    var title = 'confirm提示',
    text = '确定要删除吗？';
    Popup.confirm(title,text,confirmData);
    ```
3. imgConfirm
    ```
    var Popup = new Popup();
    Popup.imgConfirm('带图片弹窗','这里是有图片的弹窗,图片必须传入！',img,confirmData);
    ```
4. toast
    ```
    var Popup = new Popup();
    Popup.toast('toast提示！时间可以自定义单位秒',3);
    ```
    
## 下一个写啥还没想好...

