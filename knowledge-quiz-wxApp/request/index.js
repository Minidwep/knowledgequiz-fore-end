let ajaxTimes = 0;
const baseUrl = "http://localhost:8080";
export const request = (params) => {
    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: '加载中',
        mask: true
    });

    // 定义功能的url
    console.log(params);

    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });

    });
}

/* promise 形式的 uploadFile */
export const uploadFile = (params) => {
    wx.showLoading({
        title: '上传中,请稍后',
        mask: true
    });
    let token = wx.getStorageSync('token');
    let type = wx.getStorageSync('userType');
    if (token == '' || type == '') {
        return;
    }
    let typeUrl = '';
    if (type == '1') {
        typeUrl = baseUrl + '/teacher'
    }
    if (type == '0') {
        typeUrl = baseUrl + '/student'
    }
    params.header.Authorization = token;
    console.log(params);
    return new Promise((resolve, reject) => {

        wx.uploadFile({
            ...params,
            url: typeUrl + params.url, //仅为示例，非真实的接口地址
            success(result) {
                resolve(result);
            },
            fail(error) {
                reject(error);
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    })
}

export const requestNext = (params) => {
    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    let token = wx.getStorageSync('token');
    let type = wx.getStorageSync('userType');
    if (token == '' || type == '') {
        return;
    }
    let typeUrl = '';
    if (type == '1') {
        typeUrl = baseUrl + '/teacher'
    }
    if (type == '0') {
        typeUrl = baseUrl + '/student'
    }
    // 定义功能的url
    console.log(params);
    params.header.Authorization = token;
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: typeUrl + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);

            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });

    });
}

export const authorizationCheck = (
    result
) => {
    if (result.statusCode == '401') {
        setTimeout(function () {
            wx.showToast({
                title: '连接超时，请重新登录',
                icon: 'none',
                duration: 2000
            });
            wx.redirectTo({
                url: '../login/index'
            });
        }, 2000);
    }
}