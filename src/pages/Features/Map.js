// 使用WebView組件
// https://juejin.cn/post/6978299338795532302
import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import {COLOR_DIY} from '../../utils/uiMap';
import {pxToDp} from '../../utils/stylesKits';

import {WebView} from 'react-native-webview';
import {Header} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Map extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    backgroundColor={'#ffffff'}
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
                        text: '校園地圖',
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

                <WebView
                    source={{uri: 'https://maps.um.edu.mo/'}}
                    startInLoadingState={true}
                />
            </View>
        );
    }
}

export default Map;
