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
    Upload,
    message,
    Tabs,
    Badge,
    Radio
} from 'antd'
import '@/style/view-style/table.less'
import {
    APIgetList,
    APIrewardApplicationList,
    APIrewardApplicationHandle,
    APIexportRewardRecord,
    APIGetUserList,
    APIGetInvitecodeList,
    APICreateInvitecode,
    APIGetCampaignsList,
    APIGetMessages,
    APIGetPayments,
    APIModifyPaymentStatus,
    APIUploadPayoutResult
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { render } from 'react-dom'
import Aset from '@/imgs/aset1.png'
import webhost from '@/tools/webhost.js'
import {
    FormOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    PushpinOutlined,
    DollarCircleOutlined
} from '@ant-design/icons'

const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select
const { TabPane } = Tabs
const typeList = [
    { label: '待处理', value: 'to_handle' },
    { label: '已处理', value: 'handled' }
]

const TypeOptions = typeList.map((option, index) => {
    return (
        <Option key={index} value={option.value}>
            {option.label}
        </Option>
    )
})

const getLocalTime = nS => {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
}

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 8
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 16
        }
    }
}

const handleChange = () => {
    console.log('')
}

const columns = (onHold, approve, gotoUser) => [
    {
        title: 'Action',
        dataIndex: 'edit',
        key: 'edit',
        width: '200',
        align: 'center',
        render: (text, item) =>
            item.status == '1' ? (
                <div>
                    <a
                        className='action-btn'
                        onClick={() => {
                            onHold(item, '3')
                        }}>
                        <CheckCircleOutlined style={{ marginRight: '2px' }} />
                        On hold
                    </a>
                    <a
                        className='action-btn'
                        onClick={() => {
                            approve(item, '2')
                        }}
                        style={{ marginLeft: '5px' }}>
                        <MinusCircleOutlined style={{ marginRight: '2px' }} />
                        Approve
                    </a>
                </div>
            ) : item.status == '2' ? (
                <div>
                    {/* <a onClick={() => {
                   onHold(item, '3')   
                }}>On hold</a> */}
                    {/* <a onClick={() => {onHold(item, '2')}} >Approve</a> */}
                </div>
            ) : item.status == '3' ? (
                <div>
                    <a
                        onClick={() => {
                            onHold(item, '5')
                        }}>
                        Cancel
                    </a>
                    {/* <a style={{ marginLeft:'5px' }} onClick={() => {onHold(item, '3')}}>On hold</a> */}
                </div>
            ) : null
    },
    {
        title: 'Payout ID',
        dataIndex: 'id',
        key: 'id',
        width: '100',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Applied from',
        dataIndex: 'applied_from',
        key: 'applied_from',
        align: 'center',
        render: (text, item) => (
            <span
                className='table-id pointer'
                onClick={() => {
                    gotoUser(item)
                }}>
                {text}
            </span>
        )
    },
    {
        title: 'Requested payout $',
        dataIndex: 'requested_payout',
        key: 'requested_payout',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-red' style={{ maxWidth: '80px' }}>
                <DollarCircleOutlined style={{ color: '#f85c5a' }} /> {text}
            </span>
        )
    },
    {
        title: 'Applied time',
        dataIndex: 'applied_time',
        key: 'applied_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'status updated time',
        dataIndex: 'update_time',
        key: 'update_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'User bank account',
        dataIndex: 'pay_account',
        key: 'pay_account',
        width: '100',
        align: 'center'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 200,
        render: (text, item) => (
            <div>
                <Badge
                    status={text == 1 || text == 2 || text == 3 ? 'processing' : text == 4 ? 'success' : 'default'}
                />
                {text == 1
                    ? 'Requested(for review)'
                    : text == 2
                    ? ' In progress '
                    : text == 3
                    ? 'Pending(for further review)'
                    : text == 4
                    ? 'Completed(send out successfully)'
                    : text == 5
                    ? 'cancelled'
                    : null}
            </div>
        )
    },
    {
        title: 'Pending reason',
        dataIndex: 'reason',
        key: 'reason',
        align: 'center',
        width: '100'
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

    const changeType = type => {
        console.log('tyoe', type)
        props.changeSearch({ status: type.target.value })
    }

    return (
        <Form
            {...searchLayout}
            form={form}
            name='advanced_search'
            className='ant-advanced-search-form'
            onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item name='status' label=''>
                        <Radio.Group onChange={changeType} defaultValue={1}>
                            <Radio.Button value={1}>Requested</Radio.Button>
                            <Radio.Button value={2}>In progress</Radio.Button>
                            <Radio.Button value={3}>Pending</Radio.Button>
                            <Radio.Button value={4}>Completed</Radio.Button>
                            <Radio.Button value={5}>Cancelled</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                {/* <Col span={16}>
                    <Form.Item name="time" label="time">
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                </Col> */}
            </Row>

            {/* <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type='primary' htmlType='submit'>
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
            </Row> */}
        </Form>
    )
}

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
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

    useEffect(() => {
        console.log('formData', formData)
        if (Object.keys(formData).length) {
            form.setFieldsValue(formData)
        } else {
            form.resetFields()
        }
    }, [formData])

    const onGenderChange = value => {
        form.setFieldsValue({ Gender: value })
    }

    const onCreateNew = val => {
        setUser(val)
        setAllMemVisible(false)
        form.setFieldsValue({
            user_id: val.user_id
        })
    }

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
                <Form.Item name='reason' label='reason' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='id' label='id' rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item className='hide-item' name='status' label='status' rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item className='hide-item' name='prevStatus' label='prevStatus' rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const SearchTableView = props => {
    const [state, setState] = useState({
        list: [],
        pagination: {
            current: 1,
            pageSize: 10
        },
        search: {},
        loading: true,
        visible: false,
        disabled: false,
        formData: {},
        status: '1'
    })
    const [handleState, setHandleState] = useState({
        visible: false,
        data: {}
    })
    useEffect(() => {
        const { pagination } = state
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        const { pagination, search } = state
        setState({ ...state, loading: true })
        if (!params.status) {
            params.status = '1'
        }
        APIGetPayments({ paymentJson: JSON.stringify(params) })
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    pagination: {
                        // ...state.pagination,
                        total: resp.data.pager.total
                    },
                    status: params.status
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const handleChange = pagination => {
        const params = {
            ...state.search,
            page_size: pagination.pageSize,
            start_row: pagination.pageSize * (pagination.current - 1)
        }
        getList(params)
    }

    const changeSearch = search => {
        console.log('search', search)
        const params = { ...search, page_size: 10, start_row: 0 }
        getList(params)
        setState({
            ...state,
            ...search
        })
    }

    const exportRecord = () => {
        APIexportRewardRecord()
            .then(xhr => {
                return
            })
            .catch((err, status, xhr) => {})
    }

    const onCreate = data => {
        console.log('data', data)
        APIModifyPaymentStatus({ paymentJson: JSON.stringify(data) })
            .then(resp => {
                const params = { page_size: 10, start_row: 0, status: data.prevStatus }
                getList(params)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const createCampaigns = () => {
        props.history.push({
            pathname: '/createCampaign'
        })
    }

    const edit = data => {
        console.log('data', data)
        props.history.push({
            pathname: '/messageDetail',
            query: { ...data }
        })
    }

    const gotoUser = item => {
        console.log('gotoUser', item)
        var url = webhost + '/userDetail/' + item.user_id
        var win = window.open(url, '_blank')
        win.focus()
    }

    const onHold = (item, status) => {
        setState({
            ...state,
            visible: true,
            formData: {
                id: item.id,
                prevStatus: item.status,
                status: status
            }
        })
    }

    const approve = (item, status) => {
        console.log('status', status)
        APIModifyPaymentStatus({
            paymentJson: JSON.stringify({ id: item.id, status: status })
        }).then(res => {
            const params = { page_size: 10, start_row: 0, status: item.status }
            getList(params)
        })
    }

    const uploadFile = ({ file, onSuccess }) => {
        APIUploadPayoutResult({ file: file }).then(resp => {
            onSuccess()
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const downlaod = () => {
        APIGetPayments({
            paymentJson: JSON.stringify({ status: state.status }),
            type: 'export'
        }).then(res => {
            message.success('success')
        })
    }

    const rowSelection = () => {}

    return (
        <Layout className='animated fadeIn'>
            <DetailModal
                visible={state.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setState({ ...state, visible: false })
                }}
                formData={state.formData}
            />
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['Payout List']} />
                <h3>Payout List</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            {state.status == '2' ? (
                                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                    <Button style={{ marginRight: '10px' }} type='primary' onClick={downlaod}>
                                        Download
                                    </Button>
                                    <Upload style={{ marginRight: '10px' }} customRequest={uploadFile}>
                                        <Button type='primary'> Upload</Button>
                                    </Upload>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'right', marginBottom: '10px', marginRight: '10px' }}>
                                    <Button type='primary' onClick={downlaod}>
                                        Download
                                    </Button>
                                </div>
                            )}
                            <Table
                                columns={columns(onHold, approve, gotoUser)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                bordered
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                onChange={handleChange}
                                loading={state.loading}
                                pagination={state.pagination}
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
