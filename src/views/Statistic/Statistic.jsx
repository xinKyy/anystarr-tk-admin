import React, { useEffect, useState } from 'react'
import { Layout, Row, Col, Divider, Statistic, Button, Card, DatePicker, Select, Table, Tag, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import '@/style/view-style/index.less'
import {
    APIGetUserAcquisition,
    APIGetKolDemInfl,
    APGetCampaignPerformance,
    APIGetPendingTasks,
    APIDownloadCampaign,
    APIGetUserRetention,
    APIGetTaskRetention
} from '@/mapi'
import moment from 'moment'
// import { FunnelChart, Tooltip, Funnel, LabelList  } from 'recharts'
import { Line } from '@ant-design/charts'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/funnel'

const { RangePicker } = DatePicker
const { Option } = Select

const dateFormat = 'YYYY-MM-DD HH:mm:ss'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const UserAcquisition = props => {
    const [state, setState] = useState({
        acquisitionData: {}
    })
    const [dState, setDState] = useState({
        range: [moment('2020-10-10 10:00:00'), moment('2020-10-11 12:00:00')]
    })

    const getUserAcquisition = (begin, end) => {
        if (begin && end) {
            begin = `${begin} 00:00:00`
            end = `${end} 23:59:59`
        }
        APIGetUserAcquisition({
            begin: begin,
            end: end
        }).then(resp => {
            setState({
                acquisitionData: resp.data.data
            })
        })
    }

    useEffect(() => {
        getUserAcquisition()
        getTodayTime()
    }, [])

    const onChange = (value, dateString) => {
        console.log('dState rang', dState)

        console.log('value', value)
        console.log('dateString', dateString)
        if (dateString) {
            getUserAcquisition(dateString[0], dateString[1])
        }
        let resRange = [moment(dateString[0]), moment(dateString[1])]
        setDState({
            range: resRange
        })
    }

    const getTodayTime = () => {
        let timeStamp = new Date()
        let YY = new Date(timeStamp).getFullYear()
        let MM =
            new Date(timeStamp).getMonth() < 9
                ? '0' + (new Date(timeStamp).getMonth() + 1)
                : new Date(timeStamp).getMonth() + 1
        let DD =
            new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh =
            new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm =
            new Date(timeStamp).getMinutes() < 10
                ? '0' + new Date(timeStamp).getMinutes()
                : new Date(timeStamp).getMinutes()
        let ss =
            new Date(timeStamp).getSeconds() < 10
                ? '0' + new Date(timeStamp).getSeconds()
                : new Date(timeStamp).getSeconds()
        let todayStart = `${YY}-${MM}-${DD} 00:00:00`
        let todayNow = `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
        console.log('todayStart', todayStart)
        console.log('todayNow', todayNow)
        console.log('type', typeof todayStart)
        let res = [moment(todayStart), moment(todayNow)]
        console.log('resssss', res)

        let ress = [moment('2020-10-20 10:00:00'), moment('2020-10-21 12:00:00')]
        setDState({
            ...dState,
            range: res
        })
    }

    const onOk = value => {
        console.log('okValue', value)
    }

    return (
        <div className='user-acquisition'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', flex: 2 }}>User Acquisition</div>
                <div style={{ flex: 1, paddingLeft: '50px' }}>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 days': [moment().subtract(6, 'days'), moment()],
                            'Last 28 days': [moment().subtract(27, 'days'), moment()]
                        }}
                        // showTime={{ format: 'HH:mm:ss' }}
                        // format="YYYY-MM-DD HH:mm:ss"
                        onChange={onChange}
                        onOk={onOk}
                        value={dState.range}
                    />
                </div>
            </div>

            <div style={{ padding: '20px 0 20px 40px' }} className='site-statistic-demo-card'>
                <Row gutter={24} style={{ marginBottom: '10px' }}>
                    <Col span={8}>
                        <Statistic
                            valueStyle={{ color: '#3f8600' }}
                            title='Total user'
                            value={state.acquisitionData.total_kol}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='New user'
                            value={state.acquisitionData.today_kol}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='New user with invitation code'
                            value={state.acquisitionData.today_invited_kol}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '10px' }}>
                    <Col span={8}>
                        <Statistic title='DAU' value={state.acquisitionData.dau} valueStyle={{ color: '#cf1322' }} />
                    </Col>
                    <Col span={8}>
                        <Statistic title='MAU' value={state.acquisitionData.mau} valueStyle={{ color: '#cf1322' }} />
                    </Col>
                    <Col span={8}>
                        <Statistic title='AAU' value={state.acquisitionData.aau} valueStyle={{ color: '#cf1322' }} />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Statistic
                            title='Invitation code generated'
                            value={state.acquisitionData.total_invited_number}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='Invitation code conversion'
                            value={
                                state.acquisitionData.conversion_rate
                                    ? (state.acquisitionData.conversion_rate * 100).toFixed(0) + '%'
                                    : '0%'
                            }
                            precision={2}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='Invitation code used daily'
                            value={state.acquisitionData.use_invited_number}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Statistic
                            title='User Created'
                            value={state.acquisitionData.user_created}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='User activated'
                            value={state.acquisitionData.user_activated}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='Activated Rate'
                            value={
                                state.acquisitionData.activated_rate
                                    ? (state.acquisitionData.activated_rate * 100).toFixed(0) + '%'
                                    : '0%'
                            }
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Statistic
                            title='Total Admin User Created'
                            value={state.acquisitionData.total_user_created}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='Total Admin User Activated'
                            value={state.acquisitionData.total_user_activated}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title='Total Activated Rate'
                            value={
                                state.acquisitionData.total_activated_rate
                                    ? (state.acquisitionData.total_activated_rate * 100).toFixed(0) + '%'
                                    : '0%'
                            }
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <UserLine data={state.acquisitionData.kol_curve} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const KolDemInfl = props => {
    const [state, setState] = useState({
        kolDemInfl: {}
    })

    const getKolDemInfl = () => {
        APIGetKolDemInfl().then(resp => {
            setState({
                kolDemInfl: resp.data.data
            })
        })
    }

    useEffect(() => {
        getKolDemInfl()
    }, [])

    return (
        <div className='kol-dem-infl'>
            <div style={{ fontSize: '18px' }}>Kol Demographic & influential</div>
            <Row gutter={24} style={{ marginBottom: '10px' }}>
                <Col span={8} style={{ padding: '0 0 0 30px' }}>
                    <div>
                        <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>
                            Gender disclosed {state.kolDemInfl.gender_disclosed_users} users
                        </div>
                        {state.kolDemInfl.sex_ratio &&
                            state.kolDemInfl.sex_ratio.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            paddingLeft: '15px',
                                            borderBottom: ' 1px solid #eee',
                                            width: '200px',
                                            display: 'flex',
                                            padding: '3px 0 3px 0'
                                        }}>
                                        <span style={{ width: '100px' }}>{item.key}</span>
                                        <span style={{ marginLeft: '5px', color: '#1890ff', flex: '1' }}>
                                            {(item.percentage * 100).toFixed(0) + '%'}
                                        </span>
                                    </div>
                                )
                            })}
                    </div>
                    <div>
                        <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>
                            Language disclosed {state.kolDemInfl.language_disclosed_users} users{' '}
                        </div>
                        {state.kolDemInfl.language_ratio &&
                            state.kolDemInfl.language_ratio.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            borderBottom: ' 1px solid #eee',
                                            width: '200px',
                                            display: 'flex',
                                            padding: '3px 0 3px 0'
                                        }}>
                                        <span style={{ width: '100px' }}>{item.key}</span>
                                        <span style={{ marginLeft: '5px', color: '#cf1322', flex: '1' }}>
                                            {(item.percentage * 100).toFixed(0) + '%'}
                                        </span>
                                    </div>
                                )
                            })}
                    </div>
                </Col>
                <Col span={8} style={{ padding: '0 0 0 30px' }}>
                    <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>
                        Follower's top location
                    </div>
                    {state.kolDemInfl.country_ratio &&
                        state.kolDemInfl.country_ratio.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '3px 0 3px 0',
                                        borderBottom: ' 1px solid #eee',
                                        width: '200px',
                                        display: 'flex'
                                    }}>
                                    <span style={{ width: '100px' }}>{item.key}</span>
                                    <span style={{ marginLeft: '5px', color: '#3f8600', flex: '1' }}>
                                        {(item.percentage * 100).toFixed(0) + '%'}
                                    </span>
                                </div>
                            )
                        })}
                </Col>
                <Col span={8} style={{ padding: '0 0 0 30px' }}>
                    <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>SKU Category</div>
                    {state.kolDemInfl.category_ratio &&
                        state.kolDemInfl.category_ratio.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '3px 0 3px 0',
                                        borderBottom: ' 1px solid #eee',
                                        width: '200px',
                                        display: 'flex'
                                    }}>
                                    <span style={{ width: '100px' }}>{item.key}</span>
                                    <span style={{ marginLeft: '5px', color: '#1890ff', flex: '1' }}>
                                        {item.percentage * 100 + '%'}
                                    </span>
                                </div>
                            )
                        })}
                </Col>
            </Row>
        </div>
    )
}

const UserLine = props => {
    const [state, setState] = useState({
        data: []
    })

    const transData = data => {
        console.log('数据啊', data)

        let resArr = []

        for (let i in data) {
            // resArr.concat({year:data[i].key, value:data[i].user_number, name:'user number'}, {year:data[i].key, value:data[i].activated_number, name:'activated number'})
            resArr.push(
                { year: data[i].key, value: data[i].user_number, name: 'new user ' },
                // { year: data[i].key, value: data[i].create_number, name: 'create number' },
                { year: data[i].key, value: data[i].activated_number, name: 'new active user' }
            )
        }
        console.log('resArr...', resArr)
        return resArr
        // setState({
        //     data: resArr
        // })
    }

    const data = transData(props.data)

    const config = {
        title: {
            visible: true,
            text: 'User growth'
        },
        description: {
            visible: true,
            text: 'Growth over time'
        },
        padding: 'auto',
        forceFit: true,
        data: data,
        xField: 'year',
        yField: 'value',
        seriesField: 'name',
        label: {
            visible: true,
            type: 'point'
        },
        color: ['#3f8600', '#FAA219'],
        point: {
            visible: true,
            size: 5,
            shape: 'diamond'
            // style: {
            //     fill: 'white',
            //     stroke: '#2593fc',
            //     lineWidth: 2
            // }
        },
        legend: { position: 'top' },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000
            }
        }
    }

    useEffect(() => {
        // transData(props.data)
    }, [])

    return <Line {...config} />
}

const FunnelC = props => {
    useEffect(() => {
        console.log('props..', props)

        let myChart = echarts.init(document.getElementById('funnel'))
        let resData =
            props.data &&
            props.data.map(item => {
                return {
                    value: item.number,
                    name: item.key
                }
            })
        console.log('resData', resData)
        // resData = [
        //     {value: 100, name: "Total Task"},
        //     {value: 48, name: "Activated"},
        //     {value: 39, name: "Proof"},
        //     {value: 11, name: "Complete"}
        // ]
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}  : {c}'
            },
            toolbox: {
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            // legend: {
            //     data: ['展现','点击','访问','咨询','订单']
            // },

            series: [
                {
                    name: '漏斗图',
                    type: 'funnel',
                    left: '10%',
                    top: 60,
                    bottom: 60,
                    width: '80%',
                    min: 0,
                    // max:  resData?resData[0].value:1000,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    labelLine: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            fontSize: 20
                        }
                    },
                    data: resData
                }
            ]
        })
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    }, [props])
    return <div id='funnel' style={{ height: 300, width: 300, background: '#fff' }}></div>
}

const CampaignPerformance = () => {
    const [state, setState] = useState({
        campaignPerformance: {},
        defaultId: '',
        selectCampaign: {}
    })

    const [dState, setDState] = useState({
        range: [moment('2020-10-10 10:00:00'), moment('2020-10-11 12:00:00')]
    })
    const getCampaignPerformance = (begin, end) => {
        if (begin && end) {
            begin = `${begin} 00:00:00`
            end = `${end} 23:59:59`
        }
        APGetCampaignPerformance({
            begin: begin,
            end: end
        }).then(resp => {
            let de = resp.data.data.campaign_task_rate[0].campaign_id
            console.log('de', de)
            setState({
                ...state,
                campaignPerformance: resp.data.data,
                defaultId: de
            })
        })
    }

    const changeCampaign = (val, index) => {
        console.log('val', val)
        console.log('index', index)
        let selectIndex = Number(index.key)
        console.log('selectIndex', selectIndex)
        console.log('tyty', state.campaignPerformance)
        console.log('rrr', state.campaignPerformance.campaign_task_rate[selectIndex])
        //    return
        setState({
            ...state,
            selectCampaign: state.campaignPerformance.campaign_task_rate[selectIndex]
        })
    }

    useEffect(() => {
        getCampaignPerformance()
        getTodayTime()
    }, [])

    const getTodayTime = () => {
        let timeStamp = new Date()
        let YY = new Date(timeStamp).getFullYear()
        let MM =
            new Date(timeStamp).getMonth() < 9
                ? '0' + (new Date(timeStamp).getMonth() + 1)
                : new Date(timeStamp).getMonth() + 1
        let DD =
            new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh =
            new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm =
            new Date(timeStamp).getMinutes() < 10
                ? '0' + new Date(timeStamp).getMinutes()
                : new Date(timeStamp).getMinutes()
        let ss =
            new Date(timeStamp).getSeconds() < 10
                ? '0' + new Date(timeStamp).getSeconds()
                : new Date(timeStamp).getSeconds()
        let todayStart = `${YY}-${MM}-${DD} 00:00:00`
        let todayNow = `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
        console.log('todayStart', todayStart)
        console.log('todayNow', todayNow)
        console.log('type', typeof todayStart)
        let res = [moment(todayStart), moment(todayNow)]
        console.log('resssss', res)

        let ress = [moment('2020-10-20 10:00:00'), moment('2020-10-21 12:00:00')]
        setDState({
            ...dState,
            range: res
        })
    }

    const getAPIDownloadCampaign = () => {
        let apiHref = APIDownloadCampaign()
        let resHref = `${apiHref}?id=${state.selectCampaign.campaign_id}`
        return resHref
    }

    const campaignOption =
        state.campaignPerformance.campaign_task_rate &&
        state.campaignPerformance.campaign_task_rate.map((item, index) => {
            return (
                <Option key={index} value={item.campaign_id}>
                    {item.campaign_id},{item.title}
                </Option>
            )
        })

    const onOk = value => {
        console.log('okValue', value)
    }

    const onChange = (value, dateString) => {
        console.log('value', value)
        console.log('dateString', dateString)
        if (dateString) {
            getCampaignPerformance(dateString[0], dateString[1])
        }
    }

    return (
        <div className=''>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', flex: 1 }}>Campaign performance</div>
                <div style={{ flex: 1, paddingLeft: '50px' }}>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 days': [moment().subtract(6, 'days'), moment()],
                            'Last 28 days': [moment().subtract(27, 'days'), moment()]
                        }}
                        onChange={onChange}
                        onOk={onOk}
                        value={dState.range}
                    />
                </div>
            </div>
            <Row gutter={24} style={{ marginBottom: '10px', marginTop: '10px' }}>
                <Col span={12} style={{ padding: '0 0 0 30px' }}>
                    <Statistic
                        valueStyle={{ color: '#3f8600' }}
                        title='Total number of task'
                        value={state.campaignPerformance.total_number_task}
                    />
                    <Statistic
                        valueStyle={{ color: '#3f8600' }}
                        title='Completion rate'
                        value={
                            state.campaignPerformance.completion_rate
                                ? (state.campaignPerformance.completion_rate * 100).toFixed(0) + '%'
                                : '0%'
                        }
                    />
                    {state.campaignPerformance.task_rate &&
                        state.campaignPerformance.task_rate.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '3px 0 3px 0',
                                        borderBottom: ' 1px solid #eee',
                                        width: '200px',
                                        display: 'flex'
                                    }}>
                                    <span style={{ width: '100px' }}>{item.key}</span>
                                    <span style={{ marginLeft: '5px', color: '#3f8600', flex: '1' }}>
                                        {item.key == 'Total Task' ? item.number : item.number}
                                    </span>
                                    <span style={{ marginLeft: '5px', color: '#3f8600', flex: '1' }}>
                                        {item.key == 'Total Task' ? '' : (item.percentage * 100).toFixed(0) + '%'}
                                    </span>
                                </div>
                            )
                        })}
                    <FunnelC data={state.campaignPerformance.task_rate} />

                    {/* <FunnelChart width={730} height={250}>
                        <Tooltip />
                        <Funnel
                            dataKey="number"
                            data={state.campaignPerformance.task_rate}
                            isAnimationActive
                        >
                            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                        </Funnel>
                    </FunnelChart> */}
                </Col>
                <Col span={12} style={{ padding: '0 0 0 30px' }}>
                    <Select
                        style={{ width: '200px', marginBottom: '10px' }}
                        defaultValue={state.defaultId}
                        onChange={changeCampaign}>
                        {campaignOption}
                    </Select>
                    <a
                        style={{ backgroundColor: '#1890ff', color: '#fff', padding: '8px 15px', marginLeft: '10px' }}
                        type='download'
                        href={getAPIDownloadCampaign()}>
                        download
                    </a>

                    <Statistic
                        valueStyle={{ color: '#1890ff' }}
                        title='Time to complete(day)'
                        value={state.selectCampaign.time_to_conplete ? state.selectCampaign.time_to_conplete : 0}
                    />
                    {state.selectCampaign.task_rate &&
                        state.selectCampaign.task_rate.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '3px 0 3px 0',
                                        borderBottom: ' 1px solid #eee',
                                        width: '200px',
                                        display: 'flex'
                                    }}>
                                    <span style={{ width: '100px' }}>{item.key}</span>
                                    <span style={{ marginLeft: '5px', color: '#1890ff', flex: '1' }}>
                                        {item.number}
                                    </span>
                                    <span style={{ marginLeft: '5px', color: '#1890ff', flex: '1' }}>
                                        {(item.percentage * 100).toFixed(0) + '%'}
                                    </span>
                                    {/* <span style={{ marginLeft: '5px', color: '#1890ff', flex: '1' }}>
                                        {item.key == 'Total Task'
                                            ? item.number
                                            : (item.percentage * 100).toFixed(0) + '%'}
                                    </span> */}
                                </div>
                            )
                        })}
                </Col>
            </Row>
        </div>
    )
}

const PendingTasks = props => {
    const getPendingTasks = () => {
        APIGetPendingTasks().then(resp => {
            setState({
                pendingTasks: resp.data.data
            })
        })
    }

    const [state, setState] = useState({
        pendingTasks: []
    })

    useEffect(() => {
        getPendingTasks()
    }, [])

    return (
        <div className='pending-tasks'>
            <div style={{ fontSize: '18px' }}>Pending tasks</div>
            <div style={{ padding: '20px 0 0 30px' }}>
                {state.pendingTasks &&
                    state.pendingTasks.map((item, index) => {
                        return (
                            <div key={index}>
                                {/* <span>{item.key}</span>
                                <span style={{ marginLeft:'5px' }}>{item.number}</span>
                                <span style={{marginLeft:'10px'}}>Lending time</span>
                                <span>{item.average_time}hours</span> */}

                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col span={12}>
                                        <Statistic
                                            valueStyle={{ color: '#3f8600' }}
                                            title={item.key}
                                            value={item.number}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        {item.average_time ? (
                                            <Statistic
                                                title='Leading time(hours)'
                                                value={item.average_time}
                                                valueStyle={{ color: '#1890ff' }}
                                            />
                                        ) : null}
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

const columns = () => [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
    },
    {
        title: 'Region',
        dataIndex: 'region',
        key: 'region',
        align: 'center',
        render: (text, item) => (
            <>
                {text &&
                    JSON.parse(text).map((tag, index) => {
                        let color = index == 1 ? 'volcano' : index == 2 ? 'volcano' : 'yellow'
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        )
                    })}
            </>
        )
    },
    {
        title: 'Count ID',
        dataIndex: 'countId',
        key: 'countId',
        align: 'center'
    },
    {
        title: 'Approved sum',
        dataIndex: 'approvedSum',
        key: 'approvedSum',
        align: 'center'
    },
    {
        title: 'Rejected sum',
        dataIndex: 'rejectedSum',
        key: 'rejectedSum',
        align: 'center'
    }
]

const expandedRowRender = data => {
    const columns = edit => [
        {
            title: 'Campaign ID',
            dataIndex: 'campaign_id',
            key: 'campaign_id',
            align: 'center'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: 'center'
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            align: 'center'
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            align: 'center'
        },
        {
            title: 'Like',
            dataIndex: 'like',
            key: 'like',
            align: 'center'
        },
        {
            title: 'Count ID',
            dataIndex: 'countId',
            key: 'countId',
            align: 'center'
        },
        {
            title: 'Approved sum',
            dataIndex: 'approvedSum',
            key: 'approvedSum',
            align: 'center'
        },
        {
            title: 'Rejected sum',
            dataIndex: 'rejectedSum',
            key: 'rejectedSum',
            align: 'center'
        }
    ]

    return <Table columns={columns()} dataSource={data.child} bordered pagination={false} />
}

const MuseAffliate = props => {
    const [dState, setDState] = useState({
        range: [moment('2020-10-10 10:00:00'), moment('2020-10-11 12:00:00')]
    })
    const [state, setState] = useState({
        list: [
            {
                name: 'Muse Affliate',
                count_id: 50,
                approved_sum: 10,
                rejected_sum: 10,
                child: [
                    {
                        campaign_id: 10101,
                        category: 'Jewelry',
                        language: 'english',
                        Brand: 'abcomo',
                        like: '1',
                        count_id: 50,
                        approved_sum: 10,
                        rejected_sum: 10
                    },
                    {
                        campaign_id: 10102,
                        category: 'Jewelry',
                        language: 'english',
                        Brand: 'abcomo',
                        like: '1',
                        count_id: 50,
                        approved_sum: 10,
                        rejected_sum: 10
                    }
                ]
            }
        ]
    })

    const onOk = value => {
        console.log('okValue', value)
    }

    const getTaskRetention = (begin, end) => {
        if (begin && end) {
            begin = `${begin} 00:00:00`
            end = `${end} 23:59:59`
        }
        APIGetTaskRetention({
            beginStr: begin,
            endStr: end
        }).then(resp => {
            setState({
                list: resp.data.data
            })
        })
    }

    const getTodayTime = () => {
        let timeStamp = new Date()
        let YY = new Date(timeStamp).getFullYear()
        let MM =
            new Date(timeStamp).getMonth() < 9
                ? '0' + (new Date(timeStamp).getMonth() + 1)
                : new Date(timeStamp).getMonth() + 1
        let DD =
            new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh =
            new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm =
            new Date(timeStamp).getMinutes() < 10
                ? '0' + new Date(timeStamp).getMinutes()
                : new Date(timeStamp).getMinutes()
        let ss =
            new Date(timeStamp).getSeconds() < 10
                ? '0' + new Date(timeStamp).getSeconds()
                : new Date(timeStamp).getSeconds()
        let todayStart = `${YY}-${MM}-${DD} 00:00:00`
        let todayNow = `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
        console.log('todayStart', todayStart)
        console.log('todayNow', todayNow)
        console.log('type', typeof todayStart)
        let res = [moment(todayStart), moment(todayNow)]
        console.log('resssss', res)

        let ress = [moment('2020-10-20 10:00:00'), moment('2020-10-21 12:00:00')]
        setDState({
            ...dState,
            range: res
        })
    }

    const onChange = (value, dateString) => {
        console.log('value', value)
        console.log('dateString', dateString)
        if (dateString) {
            getTaskRetention(dateString[0], dateString[1])
        }
        let resRange = [moment(dateString[0]), moment(dateString[1])]
        setDState({
            range: resRange
        })
    }

    useEffect(() => {
        // getTaskRetention()
        getTodayTime()
    }, [])

    return (
        <div className='muse-affliate'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', flex: 1, marginBottom: '20px' }}>Task operation report</div>
                <div style={{ paddingLeft: '50px' }}>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 days': [moment().subtract(6, 'days'), moment()],
                            'Last 28 days': [moment().subtract(27, 'days'), moment()]
                        }}
                        onChange={onChange}
                        onOk={onOk}
                        value={dState.range}
                    />
                </div>
            </div>
            <Table
                columns={columns()}
                expandable={{ expandedRowRender }}
                dataSource={state.list}
                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                bordered
            />
        </div>
    )
}

const UserRetention = props => {
    const [state, setState] = useState({
        userRetention: {}
    })

    const [dState, setDState] = useState({
        range: [moment('2020-10-10 10:00:00'), moment('2020-10-11 12:00:00')]
    })

    const getUserRetention = (begin, end) => {
        if (begin && end) {
            begin = `${begin} 00:00:00`
            end = `${end} 23:59:59`
        }
        APIGetUserRetention({
            begin: begin,
            end: end
        }).then(resp => {
            setState({
                userRetention: resp.data.data
            })
        })
    }

    const onOk = value => {
        console.log('okValue', value)
    }

    const onChange = (value, dateString) => {
        console.log('value', value)
        console.log('dateString', dateString)
        if (dateString) {
            getUserRetention(dateString[0], dateString[1])
        }
        let resRange = [moment(dateString[0]), moment(dateString[1])]
        setDState({
            range: resRange
        })
    }

    const getTodayTime = () => {
        let timeStamp = new Date()
        let YY = new Date(timeStamp).getFullYear()
        let MM =
            new Date(timeStamp).getMonth() < 9
                ? '0' + (new Date(timeStamp).getMonth() + 1)
                : new Date(timeStamp).getMonth() + 1
        let DD =
            new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
        let hh =
            new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
        let mm =
            new Date(timeStamp).getMinutes() < 10
                ? '0' + new Date(timeStamp).getMinutes()
                : new Date(timeStamp).getMinutes()
        let ss =
            new Date(timeStamp).getSeconds() < 10
                ? '0' + new Date(timeStamp).getSeconds()
                : new Date(timeStamp).getSeconds()
        let todayStart = `${YY}-${MM}-${DD} 00:00:00`
        let todayNow = `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
        console.log('todayStart', todayStart)
        console.log('todayNow', todayNow)
        console.log('type', typeof todayStart)
        let res = [moment(todayStart), moment(todayNow)]
        console.log('resssss', res)

        let ress = [moment('2020-10-20 10:00:00'), moment('2020-10-21 12:00:00')]
        setDState({
            ...dState,
            range: res
        })
    }

    useEffect(() => {
        getUserRetention()
        getTodayTime()
    }, [])

    return (
        <div className='user-retention'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '18px', flex: 1 }}>User Retention</div>
                <div style={{ flex: 1, paddingLeft: '50px' }}>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Last 7 days': [moment().subtract(6, 'days'), moment()],
                            'Last 28 days': [moment().subtract(27, 'days'), moment()]
                        }}
                        onChange={onChange}
                        onOk={onOk}
                        value={dState.range}
                    />
                </div>
            </div>
            <Row gutter={24} style={{ marginBottom: '10px' }}>
                <Col span={12} style={{ padding: '0 0 0 30px' }}>
                    <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>
                        Repeated campaign paticipant{' '}
                    </div>
                    {state.userRetention.repeated_campain_paticipant &&
                        state.userRetention.repeated_campain_paticipant.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        paddingLeft: '15px',
                                        borderBottom: ' 1px solid #eee',
                                        width: '280px',
                                        display: 'flex',
                                        padding: '3px 0 3px 0'
                                    }}>
                                    <span style={{ width: '130px' }}>{item.key}</span>
                                    <span style={{ marginLeft: '5px', color: '#3f8600', flex: '1' }}>
                                        {item.number}
                                    </span>
                                    {/* <span style={{ marginLeft:'5px',color:'#1890ff',flex:'1' }}>{(item.percentage*100).toFixed(0) + '%'}</span> */}
                                </div>
                            )
                        })}
                </Col>
                <Col span={12} style={{ padding: '0 0 0 30px' }}>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <Statistic
                            valueStyle={{ color: '#3f8600' }}
                            title='Campaign viewed'
                            value={state.userRetention.campaign_viewed_today}
                        />
                        <Statistic
                            style={{ marginLeft: '10px' }}
                            title='Task created'
                            value={state.userRetention.task_created_today}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </div>
                    <div style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#00000073' }}>
                        Campaign task conversion{' '}
                    </div>
                    <div
                        style={{
                            paddingLeft: '15px',
                            borderBottom: ' 1px solid #eee',
                            width: '380px',
                            display: 'flex',
                            padding: '3px 0 3px 0'
                        }}>
                        <span style={{ width: '130px' }}>Campaign title</span>
                        <span style={{ marginLeft: '5px', flex: '1' }}>Viewed number</span>
                        <span style={{ marginLeft: '5px', flex: '1' }}>Task number</span>
                    </div>
                    <div style={{ maxHeight: '160px', overflowY: 'scroll' }}>
                        {state.userRetention.campaign_task_conversion &&
                            state.userRetention.campaign_task_conversion.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            paddingLeft: '15px',
                                            borderBottom: ' 1px solid #eee',
                                            width: '380px',
                                            display: 'flex',
                                            padding: '3px 0 3px 0'
                                        }}>
                                        <span style={{ width: '130px' }}>{item.campaign_title}</span>
                                        <span
                                            style={{
                                                marginLeft: '5px',
                                                color: '#3f8600',
                                                flex: '1',
                                                textAlign: 'center'
                                            }}>
                                            {item.viewed_number}
                                        </span>
                                        <span
                                            style={{
                                                marginLeft: '5px',
                                                color: '#1890ff',
                                                flex: '1',
                                                textAlign: 'center'
                                            }}>
                                            {item.task_number}
                                        </span>
                                    </div>
                                )
                            })}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const Index = props => {
    const [state, setState] = useState({
        loading: true
    })

    useEffect(() => {
        console.log('xixi')
        var iframe = document.getElementById('commandIframe')
        if (iframe.attachEvent) {
            // 兼容IE写法
            iframe.attachEvent('onload', function() {
                // iframe加载完成后要进行的操作
                setState({
                    loading: false
                })
            })
        } else {
            iframe.onload = function() {
                // iframe加载完成后要进行的操作
                setState({
                    loading: false
                })
            }
        }
    })

    return (
        <Layout className='index animated fadeIn'>
            {state.loading ? <Spin indicator={antIcon} style={{ marginTop: '200px' }} /> : null}
            <iframe
                id='commandIframe'
                style={{ minHeight: '1700px', border: 'none' }}
                src='https://anystarr.s3.eu-west-3.amazonaws.com/admin_h5/AdminLTE-3.1.0/pages/examples/blank.html'></iframe>
            {/* <div className='base-style-new'>
                <UserAcquisition />
            </div>
            <div className='base-style-new'>
                <KolDemInfl />
            </div>
            <div className='base-style-new'>
                <CampaignPerformance />
            </div>
            <div className='base-style-new'>
                <PendingTasks />
            </div>
            <div className='base-style-new'>
                <UserRetention />
            </div>
            <div className='base-style-new'>
                <MuseAffliate />
            </div> */}
        </Layout>
    )
}

export default Index
