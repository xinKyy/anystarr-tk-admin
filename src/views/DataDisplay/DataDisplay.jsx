import React from 'react'
import { Layout, Row, Col, Divider, Select } from 'antd'
import screenfull from 'screenfull'
import '@/style/view-style/index.less'
import { Line } from '@ant-design/charts'
import { FullscreenOutlined } from '@ant-design/icons'

const { Option } = Select

const DemoLine = () => {
    const data = [
        {
            year: '1991',
            value: 3
        },
        {
            year: '1992',
            value: 4
        },
        {
            year: '1993',
            value: 3.5
        },
        {
            year: '1994',
            value: 5
        },
        {
            year: '1995',
            value: 4.9
        },
        {
            year: '1996',
            value: 6
        },
        {
            year: '1997',
            value: 7
        },
        {
            year: '1998',
            value: 9
        },
        {
            year: '1999',
            value: 13
        }
    ]
    const config = {
        title: {
            visible: true,
            text: '配置折线数据点样式'
        },
        description: {
            visible: true,
            text: '自定义配置趋势线上数据点的样式'
        },
        padding: 'auto',
        forceFit: true,
        data,
        xField: 'year',
        yField: 'value',
        label: {
            visible: true,
            type: 'point'
        },
        point: {
            visible: true,
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#2593fc',
                lineWidth: 2
            }
        }
    }
    return <Line {...config} />
}

const DataDisplay = () => {
    const fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('demoline'))
        }
    }

    const onGenderChange = value => {}
    return (
        <Layout className='index animated fadeIn'>
            <Row gutter={24} className='index-header'>
                <Col span={6}>
                    <div style={{ marginBottom: '10px' }}>
                        <Select placeholder='请选择项目' onChange={onGenderChange} allowClear>
                            <Option value='male'>male</Option>
                            <Option value='female'>female</Option>
                            <Option value='other'>other</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div className='base-style' id='demoline'>
                        <div className='bar-header'>
                            <div>图形全屏展示</div>
                            <FullscreenOutlined style={{ cursor: 'pointer' }} onClick={fullToggle} />
                        </div>
                        <Divider />
                        <DemoLine />
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default DataDisplay
