import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import {
    Layout,
    Row,
    Col,
    Tag,
    Table,
    Button,
    Modal,
    Input,
    Form,
    DatePicker,
    Select,
    message,
    Upload,
    Badge,
    Image
} from 'antd'
import '@/style/view-style/table.less'
import {
    APIexportRewardRecord,
    APIGetUserList,
    APIDownloadUser,
    APIModifyUserStatus,
    APIbatchUploadUserList,
    APIDownloadUserNew,
    APISendActiveEmail
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { UploadOutlined, FormOutlined, CloudDownloadOutlined, SearchOutlined } from '@ant-design/icons'
import webhost from '@/tools/webhost.js'
import Aset from '@/imgs/aset1.png'
import { getYearMonthDayTimeNew, getCleanedParams } from '@/tools/help.js'
import { APIDeleteByUid, APIGetTikTokUserList, APIGetTikTokUserSumInfo } from '../../mapi'
import { newHost } from '../../tools/new_host'
const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select

const statusList = [
    { label: 'Active', value: '1' },
    { label: 'Banned', value: '2' },
    { label: 'Locked', value: '5' }
]

const StatusOptions = statusList.map((option, index) => {
    return (
        <Option key={index} value={option.value}>
            {option.label}
        </Option>
    )
})

const getLocalTime = nS => {
    return new Date(Date.parse(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
}

function formatToBeijingTime(utcString) {
    try {
        // 检查传入是否为有效的字符串
        if (typeof utcString !== 'string' || !utcString.trim()) {
            throw new Error('Invalid input: Expected a non-empty string.')
        }

        // 尝试解析日期
        const utcDate = new Date(utcString)
        if (isNaN(utcDate.getTime())) {
            throw new Error('Invalid input: Unable to parse date string.')
        }

        // 格式化为北京时间
        const options = {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }

        const formatter = new Intl.DateTimeFormat('zh-CN', options)
        const formattedDate = formatter.format(utcDate)

        // 转换为 YYYY-MM-DD hh:mm:ss 格式
        const [date, time] = formattedDate.split(' ')
        return `${date.replace(/\//g, '-')} ${time}`
    } catch (error) {
        console.error('Error formatting date:', error.message)
        return null // 返回 null 表示无法格式化
    }
} // null

const columns = deleteById => [
    {
        title: 'Avatar',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        align: 'center',
        render: (avatarUrl, item) =>
            avatarUrl ? (
                <Image
                    style={{
                        width: '60px',
                        height: '60px'
                    }}
                    src={avatarUrl}></Image>
            ) : null
    },
    {
        title: 'Nick Name',
        dataIndex: 'displayName',
        key: 'displayName',
        align: 'center'
    },
    {
        title: 'Profile DeepLink',
        dataIndex: 'profileDeepLink',
        key: 'profileDeepLink',
        align: 'center',
        render: (v, item) => {
            return v ? (
                <a href={v} target={'_blank'}>
                    Profile
                </a>
            ) : null
        }
    },
    {
        title: 'Registered Time',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (v, item) => {
            return formatToBeijingTime(v)
        }
    },
    {
        title: 'Followers',
        dataIndex: 'followerCount',
        key: 'followerCount',
        align: 'center'
        // render: (text, item) => <span>{getLocalTime(item.create_time)}</span>
    },
    {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (v, item) => {
            return <Button onClick={() => deleteById(v)}>Delete</Button>
        }
    }
]

const searchLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        props.changeSearch(values)
    }

    return (
        <Form
            {...searchLayout}
            form={form}
            name='advanced_search'
            className='ant-advanced-search-form'
            onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='searchName' label='Nick Name'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button icon={<SearchOutlined />} type='primary' htmlType='submit' loading={props.loading}>
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields()
                        }}>
                        Reset
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

const DetailModal = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    const [user, setUser] = useState({})
    const [allMemVisible, setAllMemVisible] = useState(false)

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                message: 'Please select time!'
            }
        ]
    }

    useEffect(() => {}, [])

    return (
        <Modal
            visible={visible}
            title=''
            okText='Submit'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onCreate(values)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='status' label='status' rules={[{ required: true }]}>
                    <Select>{StatusOptions}</Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const SearchTableView = props => {
    const [dataSource, setDataSource] = useState([])
    const [state, setState] = useState({
        list: [],
        search: {},
        loading: true,
        visible: false,
        disabled: false,
        formData: {},
        startRow: 0,
        userId: '',
        downloadUserUrl: ''
    })
    const [loading, setLoading] = useState(false)
    const [all, setAll] = useState(0)
    const [todayAdd, setTodayAdd] = useState(0)
    const [allAddKitchen, setAllAddKitchen] = useState(0)
    const [todayAddKitchen, setTodayAddKitchen] = useState(0)

    const [result, setResult] = useState()

    const [pageI, setPageI] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    })

    useEffect(() => {
        getList(1, 20)
        getUser()
    }, [])

    const getList = (page, pageSize, searchValue) => {
        setLoading(true)
        APIGetTikTokUserList(
            JSON.stringify({
                page,
                pageSize,
                ...searchValue
            })
        )
            .then(resp => {
                console.log(resp.data.result, 'USER DATA')
                if (resp.data.result) {
                    setDataSource(resp.data.result.records)
                    setPageI({
                        page: resp.data.result.current,
                        pageSize: pageSize,
                        total: resp.data.result.total
                    })
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getUser = () => {
        APIGetTikTokUserSumInfo().then(resp => {
            if (resp.data.result) {
                setAll(resp.data.result.all)
                setTodayAdd(resp.data.result.today)
                setAllAddKitchen(resp.data.result.allAddKitchen)
                setTodayAddKitchen(resp.data.result.todayAddKitchen)
                setResult(resp.data.result)
            }
        })
    }

    const deleteById = uid => {
        setLoading(true)
        APIDeleteByUid({
            uid: uid
        })
            .then(resp => {
                if (resp.data.result) {
                    message.success('Delete success!')
                }
            })
            .finally(() => {
                setLoading(false)
                getList(pageI.current, pageI.pageSize, state.search)
            })
    }

    const handleChange = pagination => {
        console.log(pagination, 'currentcurrentcurrent')
        getList(pagination.current, pagination.pageSize, state.search)
    }

    const changeSearch = search => {
        setState({
            ...state,
            search: {
                ...search
            }
        })
        getList(1, pageI.pageSize, search)
    }

    return (
        <Layout className='animated fadeIn'>
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['User List']} />
                <h3>User List</h3>
                <img src={Aset} className='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={loading} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: '16px',
                                    marginBottom: '10px',
                                    justifyContent: 'space-between'
                                }}>
                                <div>
                                    <div
                                        style={{
                                            display: 'flex'
                                        }}>
                                        <div>总用户数：{all}</div>
                                        <div style={{ width: '20px' }}></div>
                                        <div>昨日新增：{todayAdd}</div>
                                        <div style={{ width: '20px' }}></div>
                                        <div>总二次授权：{result?.v2All ?? '-'}</div>
                                        <div style={{ width: '20px' }}></div>
                                        <div>昨日二次授权：{result?.v2Today ?? '-'}</div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex'
                                        }}>
                                        <div>总加橱：{allAddKitchen}</div>
                                        <div style={{ width: '20px' }}></div>
                                        <div>昨日加橱：{todayAddKitchen}</div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex'
                                        }}>
                                        <div>总申样：{result?.allSample ?? '-'}</div>
                                        <div style={{ width: '20px' }}></div>
                                        <div>昨日申样：{result?.todaySample ?? '-'}</div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        fontSize: '14px'
                                    }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadYesterday`}>
                                            <Button>导出新增用户名单</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadAll`}>
                                            <Button>导出全部用户名单</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadV2Yesterday`}>
                                            <Button>导出新增授权用户</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadV2All`}>
                                            <Button>导出全部授权用户</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadOfflineSampleAll`}>
                                            <Button>导出申样记录</Button>
                                        </a>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex'
                                        }}>
                                        <div style={{ flex: 1 }}></div>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadKitchenYesterday`}>
                                            <Button>导出新增用户加橱</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadKitchenAll`}>
                                            <Button>导出全部用户加橱</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downShowCaseProduct`}>
                                            <Button>导出橱窗商品</Button>
                                        </a>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap'
                                        }}>
                                        <div style={{ flex: 1 }}></div>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadSampleYesterday`}>
                                            <Button>导出新增申样</Button>
                                        </a>
                                        <a href={`${newHost}/admin/api/v1/user/downLoadSampleAll`}>
                                            <Button>导出全部申样</Button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <Table
                                columns={columns(deleteById)}
                                rowKey={record => record.key}
                                dataSource={dataSource}
                                onChange={handleChange}
                                bordered
                                loading={loading}
                                pagination={pageI}
                                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default SearchTableView
