import React, { Component, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";

import tw from "twrnc";
import Ionicons from "react-native-vector-icons/Ionicons";
// 彈出層文檔：https://github.com/react-native-modal/react-native-modal
import Modal from "react-native-modal";
// 用於解析Campus Bus的HTML
var DomParser = require('react-native-html-parser').DOMParser
import {Header} from '@rneui/themed';

// 引入本地工具
import {pxToDp} from '../../utils/stylesKits'
import {COLOR_DIY} from '../../utils/uiMap'

// 定義主題顏色
const themeColor = '#2f3a79'

// 解析campus Bus的HTML
function getBusData(busInfoHtml){
    // 使用第三方插件react-native-html-parser，以使用DomParser（為了懶寫代碼，複用Vue寫的解析邏輯）
    // https://bestofreactjs.com/repo/g6ling-react-native-html-parser-react-native-utilities
    let doc = new DomParser().parseFromString(busInfoHtml,'text/html')

    // 主要的巴士資訊都存放在span內
    var mainInfo    = doc.getElementsByTagName('span');
    var busInfoArr  = new Array();

    // 到站時車牌屬於span（13個span）。未到站時車牌屬於div（12個span）
    // 無車服務時只有0~2的下標為busInfo（11個span）。有車服務時，0~3的下標都是busInfo（至少12個span）
    let infoIndex = mainInfo.length>=12 ? 3 : 2;

    // 分隔車輛運行資訊
    for (let i = 0; i < mainInfo.length; i++) {
        let text = mainInfo[i].textContent;
        if (i<=infoIndex) {
            busInfoArr.push(text)
        } else {break}
    }
    // console.log("busInfoArr為:",    busInfoArr);

    // 車輛和站點都在class=main的div標籤內
    var arriveInfoBuffer    = doc.getElementsByClassName('left', false);
    // console.log("巴士到達資訊HTML節點形式:",arriveInfoBuffer);

    // 將節點文字數據存入Array，用於以車牌判斷巴士到達位置
    var arriveInfoArr = []
    // 解析巴士到站數據
    for (let i = 0; i<arriveInfoBuffer.length; i++){
        let item = arriveInfoBuffer[i].textContent
        // 刪除字符串內的\t \n
        arriveInfoArr.push(  item.replace(/[\t\n]/g,"")  )
    }
    // index 0：PGH 站點
    // 1：PGH ~ E4 路上
    // 2：E4 站點，以此類推
    // 15：S4 下方的虛無站
    // console.log("巴士到站狀態數組為:",arriveInfoArr);

    // 判斷目前有無巴士
    let busPositionArr = []
    for (let i = 0; i<arriveInfoArr.length; i++){
        let item = arriveInfoArr[i];
        if (item.length > 0){
            busPositionArr.push({
                number: item,
                index:  i
            })
        }
    }
    // console.log("Bus車牌、位置總數據：",busPositionArr);

    // console.log('\n\n\n');
    return ({
        busInfoArr,
        busPositionArr
    })
}

// 巴士報站頁 - 畫面佈局與渲染
class BusScreen extends Component {
    // TODO:有兩輛車的情況，不急做
    // 爬蟲campus Bus
    fetchBusInfo=()=>{
        // 訪問campusloop網站
        fetch('https://campusloop.cmdo.um.edu.mo/zh_TW/busstopinfo', {method: "GET"})
        .then(res  => res.text())
        .then(text => getBusData(text) )
        .then(result  => {
            // console.log("爬蟲後的result為", result);
            // TODO: busInfoArr服務正常時，有時length為3，有時為4。為4時缺失“下一班車時間”資訊。
            result.busInfoArr.shift()       // 移除數組第一位的 “澳大環校穿梭巴士報站資訊” 字符串
            console.log("busInfoArr為", result.busInfoArr);
            {/* TODO:不止一輛巴士的情況 */}
            console.log("busPositionArr為", result.busPositionArr[0]);

            // TODO:如果沒有Bus，則觸發提醒
            this.setState({
                busInfoArr      : result.busInfoArr,
                busPositionArr  : result.busPositionArr,
                haveBus         : (result.busPositionArr.length > 0 ? true : false)
            })
            if (this.state.busPositionArr.length==0) {
                alert('當前沒有巴士~')
            }
        })

        .catch((error) => console.error(error))
    }

    // 巴士站點文字渲染
    busStopText=(left, top, text, index )=>{
        return (
            <TouchableOpacity onPress={this.toggleModal.bind(this,index)}
            // TODO: 兩輛巴士情況的到站標識
            style={{ borderColor:themeColor, 
            borderRadius:pxToDp(20), borderWidth:pxToDp(2), 
            position: 'absolute', left:pxToDp(left), top:pxToDp(top), 
            justifyContent:'space-around', alignItems:'center', 
            paddingLeft:pxToDp(5), paddingRight:pxToDp(5), paddingTop:pxToDp(2), paddingBottom:pxToDp(2), }}>
                <Text style={{color:themeColor}} >{text}</Text>
            </TouchableOpacity>
        )
    }

    // 控制彈出層打開 or 關閉
    toggleModal = (index) => {
        this.setState({
            isModalVisible:!this.state.isModalVisible,
            clickStopIndex:index,
        });
    }

    state = {
        busPositionArr:[{index:0}],
        busInfoArr:[''],
        // 彈出層默認關閉
        isModalVisible:false,
        // 彈出層內容
        modalContent:['text', 'stopImage', 'busName'],
        // 點擊站點的數組索引
        clickStopIndex:0,
    }

    constructor(){
        super();
        // 打開Bus頁時直接請求巴士報站的數據
        this.fetchBusInfo();
    }

    render() {
        let busRouteImg = require('../../static/img/Bus/bus_route.png')
        let arrowImg    = require('../../static/img/Bus/direction_left.png')
        let dotImg      = require('../../static/img/Bus/loc_dot.png')
        let stopImgArr  = [
            require('../../static/img/Bus/stopImg/PGH.jpg'),
            require('../../static/img/Bus/stopImg/E4.jpg'),
            require('../../static/img/Bus/stopImg/N2.jpg'),
            require('../../static/img/Bus/stopImg/N6.jpg'),
            require('../../static/img/Bus/stopImg/E11.jpg'),
            require('../../static/img/Bus/stopImg/E21.jpg'),
            require('../../static/img/Bus/stopImg/E32.jpg'),
            require('../../static/img/Bus/stopImg/S4.jpg'),
        ]
        // 樣式代碼
        let s = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: "column"
            },
            arrowSize: {
                width:pxToDp(35),
                height:pxToDp(35),
                resizeMode:"contain",
            },
            dotSize: {
                width:pxToDp(21),
                height:pxToDp(21),
                resizeMode:"contain"
            },
        })
        let busStyleArr = [
            // 巴士到達位置，0為PGH，1為PGH~E4路上，2為E4
            {  position: 'absolute', left: pxToDp(328), top: pxToDp(540)  },    // PGH
            {  position: 'absolute', left: pxToDp(328), top: pxToDp(450)  },    // PGH ~ E4
            {  position: 'absolute', left: pxToDp(328), top: pxToDp(340)  },    // E4
            {  position: 'absolute', left: pxToDp(328), top: pxToDp(200)  },    // E4 ~ N2
            {  position: 'absolute', left: pxToDp(328), top: pxToDp(70)  },     // N2
            {  position: 'absolute', left: pxToDp(160), top: pxToDp(65)  },     // N2 ~ N6
            {  position: 'absolute', left: pxToDp(110), top: pxToDp(110)  },    // N6
            {  position: 'absolute', left: pxToDp(80),  top: pxToDp(180)  },    // N6 ~ E11
            {  position: 'absolute', left: pxToDp(30),  top: pxToDp(235)  },    // E11
            {  position: 'absolute', left: pxToDp(30),  top: pxToDp(270)  },    // E11 ~ E21
            {  position: 'absolute', left: pxToDp(30),  top: pxToDp(310)  },    // N21
            {  position: 'absolute', left: pxToDp(30),  top: pxToDp(400)  },    // N21 ~ E32
            {  position: 'absolute', left: pxToDp(30),  top: pxToDp(483)  },    // E32
            {  position: 'absolute', left: pxToDp(80),  top: pxToDp(570)  },    // E32 ~ S4
            {  position: 'absolute', left: pxToDp(235), top: pxToDp(570)  },    // s4
            {  position: 'absolute', left: pxToDp(280), top: pxToDp(570)  },    // s4 ~ PGH
        ]

        return (
            <View style={{flex:1}}>
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
                        text: '校園巴士',
                        style: {
                            color: COLOR_DIY.black.main,
                            fontSize: pxToDp(15),
                        },
                    }}
                    statusBarProps={{
                        backgroundColor: COLOR_DIY.bg_color,
                        barStyle: 'dark-content',
                    }}
                />

                <ScrollView style={s.container}>
                    {/* 背景的Bus路線圖 */}
                    <Image source={ busRouteImg } style={{width:pxToDp(390), height:pxToDp(670), paddingTop:pxToDp(0)}}/>
                    {/* 彈出層 - 展示站點圖片 */}
                    <Modal isVisible={this.state.isModalVisible} onBackdropPress={this.toggleModal.bind(this,this.state.clickStopIndex)}
                    animationIn='zoomIn' animationOut='zoomOut' animationInTiming={500} animationOutTiming={500}
                    backdropOpacity={0.4} backdropTransitionOutTiming={500} >
                        <View style={{ justifyContent:'center', alignItems:'center' }}>
                            {/* 關閉圖標 - 引導用戶點擊背景關閉彈出層 */}
                            <TouchableOpacity style={{paddingBottom:pxToDp(10), paddingLeft:pxToDp(280)}} onPress={this.toggleModal.bind(this,this.state.clickStopIndex)}>
                                <Ionicons name={"close-circle"} size={pxToDp(50)} color={themeColor} />
                            </TouchableOpacity>
                            <Image source={stopImgArr[this.state.clickStopIndex]} 
                            style={{height:"60%",}} resizeMode='contain' />
                        </View>
                    </Modal>
                    {/* 刷新按鈕 */}
                    <TouchableOpacity
                        style={{
                            position: 'absolute', top:pxToDp(400), right:pxToDp(150),
                            alignItems: "center",
                            backgroundColor: "#DDDDDD",
                            padding: 10,
                            borderRadius: 10,
                        }}
                        onPress={this.fetchBusInfo}
                    >
                        <Text>Refresh</Text>
                    </TouchableOpacity>

                    {/* TODO: 要檢視到站和未到站數組文字是否有變化 */}
                    {/* TODO: 要檢視工作日和非工作日數組文字是否有變化 */}
                    {/* Bus運行信息的渲染 */}
                    <View style={{
                        width:pxToDp(130), height:pxToDp(100),
                        position:"absolute", top:pxToDp(5), left:pxToDp(5),
                        backgroundColor:"#d1d1d1", borderRadius:pxToDp(20),
                        paddingLeft:pxToDp(10), paddingRight:pxToDp(10), paddingTop:pxToDp(3), paddingBottom:pxToDp(3),
                        overflow:'hidden'
                    }}>
                        { this.state.busInfoArr.map((item)=><Text>{item}</Text>) }
                    </View>

                    {/* TODO:在Sketch中修改文字邊框為圓角，使用整張作背景 */}
                    {/* TODO:使用絕對位置在不同分辨率下的問題，尋找適配方法，像素單位等 */}
                    {/* TODO:無Bus的情況，連busPositionArr都為空(undefined)，應隱藏Bus圖標 */}
                    {/* TODO:不止一輛巴士的情況 */}
                    {/* 巴士圖標 */}
                    <View style={  busStyleArr[  (this.state.busPositionArr.length>0) ? (this.state.busPositionArr[0].index) : 0 ]  }>
                        <Ionicons name={"bus"} size={pxToDp(30)} color={themeColor} />
                    </View>

                    {/* 右上箭頭 */}
                    <View style={ {position: 'absolute', left: pxToDp(310), top: pxToDp(25),} }>
                        <Image source={arrowImg} style={s.arrowSize} />
                    </View>
                    {/* 左上箭頭 */}
                    <View style={ {position: 'absolute', left: pxToDp(45), top: pxToDp(140),} }>
                        <Image source={arrowImg} style={[s.arrowSize, {transform: [{rotate:'-90deg'}]} ]} />
                    </View>
                    {/* 左下箭頭 */}
                    <View style={ {position: 'absolute', left: pxToDp(45), top: pxToDp(600),} }>
                        <Image source={arrowImg} style={[s.arrowSize, {transform: [{rotate:'180deg'}]} ]} />
                    </View>
                    {/* 右下箭頭 */}
                    <View style={ {position: 'absolute', left: pxToDp(310), top: pxToDp(600),} }>
                        <Image source={arrowImg} style={[s.arrowSize, {transform: [{rotate:'90deg'}]} ]} />
                    </View>

                    {/* 站點圓點圖標 */}
                    {/* PGH */}
                    <View style={ {position: 'absolute', left: 322, top: 570,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 322, top: 360,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 322, top: 80,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 151, top: 120,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 65, top: 250,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 65, top: 330,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    <View style={ {position: 'absolute', left: 65, top: 510,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>
                    {/* S4 */}
                    <View style={ {position: 'absolute', left: 250, top: 630,} }>
                        <Image source={dotImg} style={s.dotSize} />
                    </View>

                    {/* 巴士站點文字 */}
                    {/* TODO: 修改單位為pxToDp */}
                    {this.busStopText(168,  542,    'PGH 研究生宿舍(起)',      0)}
                    {this.busStopText(218,  341,    'E4 劉少榮樓',             1)}
                    {this.busStopText(216,  75,     'N2 大學會堂',             2)}
                    {this.busStopText(168,  112,    'N6 行政樓',               3)}
                    {this.busStopText(85,   236,    'E11 科技學院',            4)}
                    {this.busStopText(85,   313,    'E21 人文社科樓',          5)}
                    {this.busStopText(85,   485,    'E32 法學院',              6)}
                    {this.busStopText(120,  625,    'S4 研究生宿舍南四座(終)',  7)}

                </ScrollView>
            </View>
        );
    }
}

export default BusScreen;