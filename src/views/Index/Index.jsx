import React, { useEffect, useState } from 'react'
import { Layout, Row, Col, Divider } from 'antd'
import {
    WechatOutlined,
    QqOutlined,
    DingdingOutlined,
    WeiboCircleOutlined,
    FullscreenOutlined
} from '@ant-design/icons'
import screenfull from 'screenfull'
import '@/style/view-style/index.less'
import BarEcharts from './bar.jsx'
import PieEcharts from './pie.jsx'
import LineEcharts from './line.jsx'
import ScatterEcharts from './scatter.jsx'
import PictorialBarEcharts from './pictorialBar.jsx'
import { APIgetSysConfig } from '@/mapi'
import { render } from 'react-dom'

const Mouse = props => {
    const [state, setState] = useState({
        x: 0,
        y: 0
    })

    const handleMouseMove = event => {
        console.log('22')
        setState({
            x: event.clientX,
            y: event.clientY
        })
    }

    return (
        <div style={{ height: '100%', backgroundColor: 'red' }} onMouseMove={handleMouseMove}>
            {' '}
            {props.render(state)}{' '}
        </div>
    )
}

const Index = () => {
    const fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('bar'))
        }
    }

    const [str, setStr] = useState('')

    const showhtml = htmlString => {
        var html = { __html: htmlString }
        return <div dangerouslySetInnerHTML={html} />
    }

    const getHomeConfig = () => {
        APIgetSysConfig({
            limit: 10,
            offset: 0
        })
            .then(res => {
                let config = res.data.filter(item => {
                    return item.key === 'system_title'
                })
                setStr(config[0].value)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        // getHomeConfig()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <Row>
                {/* <Col span={24}><div className="base-style">{showhtml(str)}</div></Col> */}
                <Col span={24}>
                    <p style={{ textAlign: 'center', fontSize: '16px' }}>Welcome to anyStarr </p>
                    {/* <Mouse render={({x, y}) => (<h1>the mouse position is ({x},{y})</h1>)} /> */}
                </Col>
            </Row>
        </Layout>
    )
}

export default Index
