import React, {Component} from 'react';
import {View, Image, Text, ImageBackground, TouchableOpacity, Dimensions} from 'react-native';

import {COLOR_DIY} from '../../../../utils/uiMap'
import {pxToDp} from '../../../../utils/stylesKits'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {NavigationContext} from '@react-navigation/native'

class EventCard extends Component {
    // NavigationContext組件可以在非基頁面拿到路由信息
    // this.context === this.props.navigation 等同效果
    static contextType = NavigationContext;

	state = {
        data : this.props.data,
    }

	render() {
        // 解構this.state數據
        const {data} = this.state;
        // 解構dataList數據
        const {imgUrl, name, tag} = data;
        // 當前點擊的數組下標，對應響應的組織
        const {index} = this.props;
        // 解構全局ui設計顏色
        const {white, black, viewShadow, themeColor} = COLOR_DIY;
        return (
			<TouchableOpacity style={{...this.props.style}} activeOpacity={0.8} 
                onPress={()=>{
                    // alert(`進入下標為 ${index} 組織詳情頁`)
                    this.context.navigate('ClubDetail', {
                        name,
                        index,
                    })
                }
            }>
                <View style={{
                    backgroundColor:white, borderRadius:pxToDp(8),
                    justifyContent:'space-around', alignItems:'center', 
                    marginTop:pxToDp(2),
                    padding:pxToDp(10), paddingLeft:pxToDp(4), paddingRight:pxToDp(4), 
                    ...viewShadow
                }}>
                    {/* 社團 / 組織 Logo */}
                    <View>
                        <Image source={{uri:imgUrl}} style={{width:pxToDp(70),height:pxToDp(70), borderRadius:50}} resizeMode={'contain'} />
                    </View>

                    {/* 組織名 */}
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:pxToDp(5)}}>
                        <Text style={{color:black.main, fontSize:pxToDp(12)}} numberOfLines={1}>{name}</Text>
                    </View>

                    {/* 組織標籤 */}
                    <Text style={{color:themeColor, fontSize:pxToDp(10), marginTop:pxToDp(5)}}>#{tag}</Text>
                </View>
			</TouchableOpacity>
		);
	}
}

export default EventCard;