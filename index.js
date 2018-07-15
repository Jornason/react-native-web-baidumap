/**
 * Created by womkim on 2017/11/6.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { View, WebView, Platform } from 'react-native'

const renderChart = ({ center, points, option, zoom }) => `
    let center = ${JSON.stringify(center)};
    let points = ${JSON.stringify(points)};
    let option = ${JSON.stringify(option)};
    let zoom = ${zoom};

    // 百度地图API功能
    let _points = []
    for (var i=0;i<points.length;i++)
    {
        _points.push(new BMap.Point(points[i]["lng"],points[i]["lat"]))
    }
    
     var map = new BMap.Map("container");
     map.centerAndZoom(new BMap.Point(center["lng"],center["lat"]), zoom);
     map.enableScrollWheelZoom();
     var curve = new BMapLib.CurveLine(_points, option); //创建弧线对象
     map.addOverlay(curve); //添加到地图中    
  `

export default class BaiduMap extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (JSON.stringify(this.props.option) !== JSON.stringify(nextProps.option) 
      || JSON.stringify(this.props.center) !== JSON.stringify(nextProps.center) 
      || JSON.stringify(this.props.points) !== JSON.stringify(nextProps.points) 
      || this.props.zoom !== nextProps.zoom) {
      const chart = renderChart(
        { 
          center: nextProps.center, 
          option: nextProps.option, 
          points: nextProps.points,
          zoom  : nextProps.zoom,        
        })
      console.log(chart)
      this.baiduMap.injectJavaScript(chart)
    }
  }

  render () {
    const { height, width, style, source, option, onLoadStart, onLoad, onError, onLoadEnd, onMessage, renderLoading, renderError,accessToken,center, points, zoom } = this.props
    const chart = renderChart(
      { 
        center: center, 
        option: option, 
        points: points,
        zoom  : zoom,        
      })
    console.log(chart)

    return <View style={{width, height}}>
      <WebView
        ref={node => { this.baiduMap = node }}
        style={[style, {height, width, backgroundColor: 'transparent'}]}
        injectedJavaScript={chart}
        source={source ? source : Platform.OS === 'android' && !__DEV__ ? { uri:'file:///android_asset/baidumap.html' } : require('./baidumap.html')}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        startInLoadingState={false}
        decelerationRate="normal"
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onError={onError}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
        renderLoading={renderLoading}
        renderError={renderError}
        scrollEnabled={false}
      />
    </View>
  }
}

BaiduMap.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  style:  PropTypes.object,
  source: PropTypes.object,
  option: PropTypes.object.isRequired,
  center: PropTypes.object,
  points: PropTypes.array,
  zoom:   PropTypes.number,
  onLoadStart: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onLoadEnd: PropTypes.func,
  onMessage: PropTypes.func,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func
}

BaiduMap.defaultProps = {
  width: 300,
  height: 300,
  zoom: 6,
}
