// 信息頁 - 聊天詳情
import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
} from 'react-native';

import {COLOR_DIY} from '../../../utils/uiMap';
import {pxToDp} from '../../../utils/stylesKits';

import FastImage from 'react-native-fast-image';
import {Header} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Dimensions} from 'react-native';
import BlurViewWrapper from '../../../components/BlurViewWrapper';
import EventDescription from './EventDescription';

const {width: PAGE_WIDTH} = Dimensions.get('window');
const {height: PAGE_HEIGHT} = Dimensions.get('screen');

// 定義圖片類型的消息寬高
const IMAGE_CARD_WIDTH = PAGE_WIDTH * 0.92;
const IMAGE_CARD_HEIGHT = PAGE_HEIGHT * 0.3;

const dataList = [
    {
        _id: 0,
        title: 'Test0',
        text: `最新的消息
        askdhfkqwhekfhweifuhw
        qweflihqwoighqeliurghi3uqrg
        qoweifhjoqwiehfoiwqehf
        qweoifhqwoiefghqwieopfghpqwuief
        elrghbnkfejbniuj`,
        type: 'text',
        createAt: 1656927421000,
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 1,
        title: 'Test1',
        text: `舊的的消息
        welrfgjbweoihbrwt
        bertlikbhwroithe
        yrhrtwehrtewbrtwe
        brewbrewbertbrettb
        rebretbrtb`,
        type: 'text',
        createAt: 1656927421000,
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 2,
        title: 'Test2',
        text: '非常舊的消息',
        type: 'text',
        createAt: 1656927421000,
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 3,
        title: 'Test3',
        text: '非常舊的消息',
        type: 'text',
        createAt: 1656927421000,
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 4,
        title: '澳大開放日將改為線上舉行',
        text: '澳門大學開放日多年來深受澳門居民歡迎，也吸引不少訪客參與。因應疫情，澳大於1月16日（星期日）舉行的開放日將改為線上進行，澳門和海內外的學生、家長和朋友可於當天上',
        type: 'event',
        eventDate: 1656927421000,
        createAt: 1656927421000,
        url: 'https://www.um.edu.mo/wp-content/uploads/2022/01/259098-1_resized-scaled.jpeg',
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 6,
        title: '同狗狗玩遊戲',
        text: '好開心咁同狗狗一齊玩遊戲，仲可以賺墊CS point！這隻17歲的中國冠毛犬24日在「世界最醜狗狗比賽」中擊敗了9名參賽者；這場賽事已有數十年歷史，每年在加州貝塔留瑪',
        type: 'event',
        eventDate: 1656927421000,
        createAt: 1656927421000,
        // url: 'https://images.unsplash.com/photo-1532275672750-588761c76ae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
        url: 'https://www.cpsumsu.org/image/slideshow/%E6%B8%B8%E6%88%B2%E8%A8%AD%E8%A8%88%E5%B7%A5%E4%BD%9C%E5%9D%8A.jpg',
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
    {
        _id: 7,
        title: '領養代替購買',
        text: '人確實都是自由可以去選擇領養或是購買，但流浪動物的出現成因的棄養，正正是因為每個購買寵物的人認為自己很自由可以自由選擇各種自己想要規格、品種的商品—犬隻，但卻無法為這個生命負責才導致的，對照前述我們若只聚焦在「棄養」這個行為',
        type: 'event',
        eventDate: 1656927421000,
        createAt: 1656927421000,
        // url: 'https://images.unsplash.com/photo-1597046902504-dfae3612605f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
        url: 'https://www.cpsumsu.org/image/poster/CPSUMSU_UMEF_2022.png',
        user: {
            _id: 1,
            name: '溫迪',
            avatar: 'https://i03piccdn.sogoucdn.com/a04373145d4b4341',
        },
    },
];

// 時間戳轉時間
function timeTrans(date) {
    var date = new Date(date);
    var Y = date.getFullYear();
    var M =
        date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1;
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D + ', ' + h + ':' + m;
}

// 新——舊的不同顏色標題
const COLOR_TITLE_LEVEL = {
    // 最新
    new0: '#212121',
    new1: '#424242',
    new2: '#616161',
    new3: '#757575',
    new4: '#9e9e9e',
};
// 按最新程度來匹配標題顏色
function mapColorByIndex(index) {
    switch (index) {
        case 0:
            return COLOR_TITLE_LEVEL.new0;
            break;
        case 1:
            return COLOR_TITLE_LEVEL.new1;
            break;
        case 2:
            return COLOR_TITLE_LEVEL.new2;
            break;
        case 3:
            return COLOR_TITLE_LEVEL.new3;
            break;
        default:
            return COLOR_TITLE_LEVEL.new4;
            break;
    }
}

class ChatCard extends Component {
    constructor(props) {
        super(props);

        // 獲取上級頁面傳遞的數據
        // console.log(this.props.route.params);

        const host = {
            // 組織用戶的ID
            userID: 1,
            // 頭像鏈接
        };

        this.state = {
            // 最新的消息，數據庫設定返回數組下標0最新，1次新
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            },
        };
    }

    // 渲染該條信息的時間
    // TODO: 今日的消息不加日期，只顯示時間，昨日或更早的消息加上日期
    renderMessageTime = timeStamp => {
        let timePhase = timeTrans(timeStamp);
        return (
            <View style={styles.timeStampWrap}>
                <Text style={{color: COLOR_DIY.black.third}}>{timePhase}</Text>
            </View>
        );
    };

    // 消息內容卡片
    renderMessageCard = (item, index) => {
        // 按最新程度來匹配標題顏色
        let titleColor = mapColorByIndex(index);

        return (
            <View style={styles.message.container}>
                {/* 卡片標題 */}
                <View style={styles.message.titleWrap}>
                    <Text
                        style={[styles.message.title, {color: titleColor}]}
                        numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Ionicons
                        name="chevron-forward-outline"
                        size={pxToDp(14)}
                        color={COLOR_DIY.black.main}></Ionicons>
                </View>
                {/* 卡片內容 */}
                <View style={styles.message.contentWrap}>
                    {/* 文字 */}
                    <Text style={{color: titleColor}}>{item.text}</Text>
                </View>
            </View>
        );
    };

    renderEventCard = item => {
        const window = Dimensions.get('window');
        return (
            /* 活動卡外框 */
            <View style={styles.event.container}>
                {/* 包裝相片與相片模糊部件 */}
                <TouchableOpacity
                    style={styles.event.imageWrap}
                    activeOpacity={0.9}
                    onPress={() => alert('跳轉應用內詳情頁面')}>
                    <Image
                        source={{uri: item.url}}
                        style={{
                            flex: 1,
                            resizeMode: 'cover',
                            width: IMAGE_CARD_WIDTH,
                            height: IMAGE_CARD_HEIGHT,
                        }}
                    />
                    <BlurViewWrapper
                        // 需要虛化圖片的URL
                        url={item.url}
                        // 需要虛化的原圖寬高
                        width={IMAGE_CARD_WIDTH}
                        height={IMAGE_CARD_HEIGHT}
                        blurHeight={'35%'}
                        blurRadius={15}
                        // 模糊層顏色
                        bgColor={'rgba(200,200,200,0.5)'}>
                        <EventDescription
                            item={{
                                ...item,
                                eventDate: timeTrans(item.eventDate),
                            }}
                            style={{padding: 10}}
                        />
                    </BlurViewWrapper>
                </TouchableOpacity>
            </View>
        );
    };

    // 渲染推送的訊息，時間+內容
    renderMessageItem = (item, index) => {
        return (
            <View
                style={{
                    marginVertical: pxToDp(10),
                }}>
                {/* 渲染該條信息的發送時間 */}
                {this.renderMessageTime(item.createAt)}

                {/* 渲染信息卡片 */}
                {item.type === 'text' && this.renderMessageCard(item, index)}

                {/* 渲染活動卡片 */}
                {item.type === 'event' && this.renderEventCard(item, index)}
            </View>
        );
    };

    render() {
        // 解構全局UI樣式
        const {bg_color, black, white} = COLOR_DIY;
        // 解構從message的index傳來的用戶頭像、名字信息
        const {user} = this.props.route.params;
        return (
            <View style={{flex: 1, backgroundColor: COLOR_DIY.bg_color}}>
                <Header
                    backgroundColor={COLOR_DIY.bg_color}
                    leftComponent={
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}>
                            <Ionicons
                                name="chevron-back-outline"
                                size={pxToDp(25)}
                                color={COLOR_DIY.black.main}
                            />
                        </TouchableOpacity>
                    }
                    centerComponent={{
                        text: user.name,
                        style: {
                            color: COLOR_DIY.black.main,
                            fontSize: pxToDp(15),
                        },
                    }}
                    statusBarProps={{
                        backgroundColor: 'transparent',
                        barStyle: 'dark-content',
                    }}
                />

                {/* 通知信息的渲染 */}
                <FlatList
                    data={dataList}
                    renderItem={({item, index}) =>
                        this.renderMessageItem(item, index)
                    }
                    // 翻轉渲染順序，從下往上
                    inverted={true}
                />

                {/* 回復提醒 */}
                <View style={styles.replyReminder}>
                    <Text>您無需回復此消息</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    timeStampWrap: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eaeaea',
        borderRadius: pxToDp(10),
        paddingHorizontal: pxToDp(8),
        paddingVertical: pxToDp(2),
    },
    message: {
        container: {
            flex: 1,
            backgroundColor: COLOR_DIY.bg_color,
            borderRadius: pxToDp(10),
            marginHorizontal: pxToDp(15),
            marginTop: pxToDp(10),
            // 增加陰影
            ...COLOR_DIY.viewShadow,
        },
        titleWrap: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: pxToDp(10),
            paddingVertical: pxToDp(10),
        },
        title: {
            fontSize: pxToDp(12),
            fontWeight: 'bold',
            width: '90%',
        },
        contentWrap: {
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            margin: pxToDp(10),
            marginTop: pxToDp(0),
            flexDirection: 'column',
        },
    },
    event: {
        container: {
            flex: 1,
            backgroundColor: COLOR_DIY.bg_color,
            borderRadius: pxToDp(10),
            marginHorizontal: pxToDp(15),
            marginTop: pxToDp(10),
            // 增加陰影
            ...COLOR_DIY.viewShadow,
        },
        imageWrap: {
            flex: 1,
            overflow: 'hidden',
            borderRadius: pxToDp(10),
        },
    },
    replyReminder: {
        marginVertical: pxToDp(10),
        borderRadius: pxToDp(20),
        marginHorizontal: pxToDp(20),
        backgroundColor: COLOR_DIY.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: pxToDp(10),
        ...COLOR_DIY.viewShadow,
    },
});

export default ChatCard;
