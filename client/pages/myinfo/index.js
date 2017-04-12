// const cityData = require('../../libs/cityData');
const app = getApp();
const { getProvince, getDepartment } = require('../../utils/util');

let stupidData = getProvince();
let stupidData2 = getDepartment();

const myNewData = stupidData.map((item, index) => {
    const citys = stupidData[item].map((city) => {
        return {
            name: city
        };
    });

    return {
        name: item,
        city: citys
    }
});


let cacheProvince = 0;
let cacheCity = 0;

// 初始化地址选择器
const provinces = myNewData.map((item) => {
    return item.name;
});
const citys = myNewData.filter((item) => item.name === '北京市')[0].city.map((city) => city.name);
// const areas = cityData.filter((item) => item.name === '北京')[0].city.filter((city) => city.name === '北京')[0].area;


Page({
    data: {
        user: {},
        genderDialogStatus: false,
        cityPickerDialogStatus: false,
        certificateCategoryDialogStatus: false,
        // 证件类型
        certificateCategories: [
            {
                name: '身份证',
                value: '身份证',
                checked: false
            }, {
                name: '护照',
                value: '护照',
                checked: false
            }, {
                name: '军官证',
                value: '军官证',
                checked: false
            }
        ],
        // 性别属性
        genders: [
            {
                name: '男',
                value: '男',
                checked: false
            }, {
                name: '女',
                value: '女',
                checked: false
            }
        ],
        //  地址选择器属性
        value: [
            0, 0, 0
        ],
        provinces,
        citys,
        // areas,
        province: '',
        city: '',
        // area: ''
    },
    onLoad(option) {
        const that = this;

        wx.pro.getStorage('user').then((user) => {
            that.setData({user});
            const gender = user.sex;
            const certificate_category = user.certificate_category;
            that.changeGenders(gender);
            that.changeCertificateCategories(certificate_category);
        }).catch((err) => {
            console.log(err);
        })
    },
    changeGenders(gender) {
        const that = this;
        const genders = that.data.genders.map((item) => {
            if (item.value === gender) {
                return {name: item.name, value: item.value, checked: true}
            } else {
                return {name: item.name, value: item.value, checked: false}
            }
        });
        that.setData({genders});
    },
    changeCertificateCategories(certificate_category) {
        const that = this;
        const certificateCategories = that.data.certificateCategories.map((item) => {
            if (item.value === certificate_category) {
                return {name: item.name, value: item.value, checked: true}
            } else {
                return {name: item.name, value: item.value, checked: false}
            }
        });
        that.setData({certificateCategories});
    },
    genderRadioChange(e) {
        const that = this;
        const sex = e.detail.value;
        const user = Object.assign({}, that.data.user, {sex});
        wx.pro.setStorage('user', user).then((user) => {
            const gender = user.sex;
            that.setData({user, genderDialogStatus: false});
            that.changeGenders(gender);
        }).catch((err) => {
            console.log(err);
        })
    },
    certificateCategoryRadioChange(e) {
        const that = this;
        const certificate_category = e.detail.value;
        const user = Object.assign({}, that.data.user, {certificate_category});
        wx.pro.setStorage('user', user).then((user) => {
            const certificate_category = user.certificate_category;
            that.setData({user, certificateCategoryDialogStatus: false});
            that.changeCertificateCategories(certificate_category);
        }).catch((err) => {
            console.log(err);
        })
    },
    showCertificateCategoryDialog() {
        const that = this;
        that.setData({certificateCategoryDialogStatus: true});
    },
    showGenderDialog() {
        const that = this;
        that.setData({genderDialogStatus: true});
    },
    showCityPickerDialog() {
        const that = this;
        that.setData({cityPickerDialogStatus: true});
    },
    hideCityPickerDialog() {
        const that = this;
        that.setData({cityPickerDialogStatus: false});
    },
    saveCity() {
        const that = this;
        const user = Object.assign({}, that.data.user, {province: that.data.province, city: that.data.city});
        wx.pro.setStorage('user', user).then((_user) => {
            that.setData({user: _user});
            that.hideCityPickerDialog();
        }).catch((err) => {
            console.log(err);
        })
        console.log(that.data.province);
        console.log(that.data.city);
        // console.log(that.data.area);
    },
    bindChange: function(e) {
        const val = e.detail.value

        if (cacheProvince != val[0]) {
            const province = provinces[val[0]];
            const citys = myNewData.filter((item) => item.name === province)[0].city.map((city) => city.name);
            this.setData({citys});
            // const city = citys[0];
            // const areas = cityData.filter((item) => item.name === province)[0].city.filter((_city) => _city.name === city)[0].area;
            // this.setData({areas});
            this.setData({
                value: [
                    val[0], 0, 0
                ],
                province: this.data.provinces[val[0]],
                city: this.data.citys[0],
                // area: this.data.areas[0]
            });
            cacheProvince = val[0];
        }  else if (cacheCity != val[1]) {
            const province = provinces[val[0]];
            const citys = myNewData.filter((item) => item.name === province)[0].city.map((city) => city.name);
            this.setData({citys});
            // const city = citys[val[1]];
            // const areas = cityData.filter((item) => item.name === province)[0].city.filter((_city) => _city.name === city)[0].area;
            // this.setData({areas});
            this.setData({
                value: [
                    val[0], val[1], 0
                ],
                province: this.data.provinces[val[0]],
                city: this.data.citys[val[1]],
                // area: this.data.areas[0]
            });
            cacheCity = val[1];
        } else {
            const province = provinces[val[0]];
            const citys = myNewData.filter((item) => item.name === province)[0].city.map((city) => city.name);
            this.setData({citys});
            const city = citys[val[1]];
            const areas = cityData.filter((item) => item.name === province)[0].city.filter((_city) => _city.name === city)[0].area;
            this.setData({areas});
            this.setData({
                value: [
                    val[0], val[1], val[2]
                ],
                province: this.data.provinces[val[0]],
                city: this.data.citys[val[1]],
                area: this.data.areas[val[2]]
            });
        }
    }
})
