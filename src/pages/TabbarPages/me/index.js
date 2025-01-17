import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

// 本地工具
import {COLOR_DIY} from '../../../utils/uiMap';
import {pxToDp} from '../../../utils/stylesKits';

// 本Tabbar相關頁面
import Login from './pages/Login';
import MeSetting from './pages/MeSetting';
import AppSetting from './pages/AppSetting';
import AboutUs from './pages/AboutUs';
import MyFollow from './pages/MyFollow';
import Reminder from './pages/Reminder';

// 第三方庫
import {Header} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {inject} from 'mobx-react';

const {black, white} = COLOR_DIY;
const {bg_color, card_color} = COLOR_DIY.meScreenColor;

// 循環渲染選項
const optionsInfo = [
    {
        title: '我的追蹤',
        iconPath: 'heart-outline',
        routeName: 'MyFollow',
    },
    {
        title: '設置',
        iconPath: 'settings-outline',
        routeName: 'AppSetting',
    },
    {
        title: '關於我們',
        iconPath: 'at-circle-outline',
        routeName: 'AboutUs',
    },
];

//个人信息页
class MeScreen extends Component {
    state = {
        // 是否已登錄
        isLogin: false,
        RootStoreChange: true,
    };

    componentDidMount() {
        const globalData = this.props.RootStore;
        if (
            globalData.userInfo &&
            JSON.stringify(globalData.userInfo) != '{}'
        ) {
            console.log('Me檢測：有token緩存');
            this.setState({
                isClub: globalData.userInfo.isClub,
                isLogin: true,
            });
        }
    }

    // 渲染個人信息欄
    renderUserInfo = () => {
        return (
            <TouchableOpacity
                style={{...s.personalInfoContainer}}
                onPress={() => this.props.navigation.navigate('MeSetting')}
                activeOpacity={0.8}>
                <View
                    style={{
                        height: '100%',
                        width: '80%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: pxToDp(20),
                    }}>
                    {/* 頭像 */}
                    <Image
                        source={require('./icon/testphoto.png')}
                        style={{
                            height: pxToDp(70),
                            width: pxToDp(70),
                            borderRadius: pxToDp(70),
                        }}
                    />
                    {/* 暱稱 & 書院 & 學院 展示 */}
                    <View
                        style={{
                            marginLeft: pxToDp(20),
                            justifyContent: 'center',
                        }}>
                        {/* 暱稱 Nick Name */}
                        <Text
                            style={{
                                color: 'black',
                                fontSize: pxToDp(20),
                                fontWeight: '600',
                            }}>
                            {'自定義暱稱'}
                        </Text>

                        {/* 學院、書院 縮寫展示 */}
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <Text
                                style={{
                                    color: black.second,
                                    fontSize: pxToDp(13),
                                }}>
                                {'FST'}
                            </Text>
                            <Text
                                style={{
                                    color: black.third,
                                    fontSize: pxToDp(13),
                                }}>
                                {'  |  '}
                            </Text>
                            <Text
                                style={{
                                    color: black.second,
                                    fontSize: pxToDp(13),
                                }}>
                                {'CKLC'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 引導編輯圖標 */}
                <View style={{flexDirection: 'row', right: pxToDp(20)}}>
                    <MaterialIcons
                        name={'edit'}
                        size={pxToDp(16)}
                        color={black.third}
                    />
                    {/* 引導點擊的 > 箭頭 */}
                    <Ionicons
                        name="chevron-forward-outline"
                        color={black.third}
                        size={pxToDp(16)}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    // 渲染對應的選項
    renderOptions = optionsInfoIndex => {
        const {title, iconPath, routeName} = optionsInfo[optionsInfoIndex];
        return (
            <TouchableOpacity
                style={{...s.optionContainer}}
                activeOpacity={0.8}
                onPress={() => this.props.navigation.navigate(routeName)}>
                {/* 左側flex佈局 */}
                <View style={{flexDirection: 'row'}}>
                    {/* 選項圖標 */}
                    <Ionicons
                        name={iconPath}
                        size={pxToDp(22)}
                        color={COLOR_DIY.themeColor}
                    />
                    {/* 選項標題 */}
                    <Text style={{...s.optionTitle}}>{title}</Text>
                </View>

                {/* 右側flex佈局 */}
                {/* 引導點擊的 > 箭頭 */}
                <Ionicons
                    name="chevron-forward-outline"
                    color={black.third}
                    size={pxToDp(20)}
                />
            </TouchableOpacity>
        );
    };

    handleRootStoreChange = () => {
        this.setState({RootStoreChange: !this.state.RootStoreChange});
    };

    render() {
        return (
            <View style={{flex: 1}}>
                {/* 檢查是否登錄 */}
                {this.state.isLogin ? (
                    // 展示學生個人系統頁面
                    <ScrollView>
                        <Header
                            backgroundColor={card_color}
                            statusBarProps={{
                                backgroundColor: 'transparent',
                                barStyle: 'dark-content',
                                translucent: true,
                            }}
                        />
                        {/* 個人信息欄 */}
                        {this.renderUserInfo()}

                        <View style={{marginTop: pxToDp(6)}} />

                        {/* 渲染選項 */}
                        {optionsInfo.map((_, index) =>
                            this.renderOptions(index),
                        )}

                        <View style={{paddingBottom: pxToDp(100)}} />
                    </ScrollView>
                ) : (
                    // 未登錄的用戶則展示登錄界面
                    <Login></Login>
                )}
            </View>
        );
    }
}

const s = StyleSheet.create({
    personalInfoContainer: {
        height: pxToDp(120),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLOR_DIY.meScreenColor.card_color,
        borderBottomLeftRadius: pxToDp(40),
        borderBottomRightRadius: pxToDp(40),
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pxToDp(45),
        padding: pxToDp(10),
        backgroundColor: COLOR_DIY.meScreenColor.card_color,
        marginBottom: pxToDp(1),
        borderRadius: pxToDp(15),
        marginHorizontal: pxToDp(10),
        marginVertical: pxToDp(6),
    },
    optionTitle: {
        fontSize: pxToDp(16),
        color: COLOR_DIY.black.main,
        marginLeft: pxToDp(10),
    },
});

export default inject('RootStore')(MeScreen);
