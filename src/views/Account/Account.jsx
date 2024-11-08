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
    Badge
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

const columns = (edit, changeStatus, sendEmail, emailLoading) => [
    {
        title: 'Action',
        dataIndex: 'id1',
        key: 'id1',
        align: 'center',
        render: (text, item) => (
            <a
                className='action-btn'
                onClick={() => {
                    edit(item)
                }}>
                <FormOutlined />
                <span style={{ marginLeft: '4px' }}>Edit</span>
            </a>
        )
    },
    {
        title: 'User ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'send active email',
        dataIndex: 'sendEmail',
        key: 'sendEmail',
        align: 'center',
        render: (text, item) =>
            item.status == 6 ? (
                <Button
                    type='primary'
                    size='small'
                    loading={emailLoading.loading && emailLoading.id === item.id}
                    onClick={() => {
                        sendEmail(item.id)
                    }}>
                    send
                </Button>
            ) : null
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        align: 'center'
    },
    {
        title: 'Invitation code',
        dataIndex: 'invitation_code',
        key: 'invitation_code',
        align: 'center'
    },
    {
        title: 'User status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, item) => (
            <div
                style={{ cursor: 'pointer', width: '120px' }}
                onClick={() => {
                    changeStatus(item)
                }}>
                <Badge status={text == 1 ? 'success' : text == 6 ? 'processing' : text == 3 ? 'error' : 'default'} />
                <span>
                    {text == 1
                        ? 'Active'
                        : text == 2
                        ? 'Banne'
                        : text == 3
                        ? 'DELETED'
                        : text == 4
                        ? 'INACTIVE'
                        : text == 5
                        ? 'LOCKED'
                        : text == 6
                        ? 'Created'
                        : ''}
                </span>
            </div>
        )
    },
    {
        title: 'Created on',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center'
        // render: (text, item) => <span>{getLocalTime(item.create_time)}</span>
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
                    <Form.Item name='email' label='Email'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='id' label='User ID'>
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
        startRow: 0,
        userId: '',
        downloadUserUrl: ''
    })
    const [handleState, setHandleState] = useState({
        visible: false,
        data: {}
    })

    const [emailLoading, setEmailLoading] = useState({
        loading: false,
        id: -1
    })

    useEffect(() => {
        const { pagination } = state
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        const { pagination, search } = state
        console.log('paramslist', params)
        let apiHref = APIDownloadUserNew()
        let json = JSON.stringify({ ...state.search })
        let resHref = `${apiHref}?userJson=${json}`
        setState({
            ...state,
            loading: true
        })
        APIGetUserList({ userJson: JSON.stringify(getCleanedParams(params)) })
            .then(resp => {
                setState({
                    ...state,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    startRow: resp.data.pager.start_row,
                    visible: false,
                    pagination: {
                        // ...state.pagination,
                        total: resp.data.pager.total
                    },
                    downloadUserUrl: encodeURI(resHref)
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
        const params = { ...search, page_size: state.pagination.pageSize, start_row: 0 }
        setState({
            ...state,
            ...search
        })
        getList(params)
    }

    const exportRecord = () => {
        APIexportRewardRecord()
            .then(xhr => {
                return
            })
            .catch((err, status, xhr) => {})
    }

    const edit = data => {
        // console.log('data', data)
        // props.history.push({
        //     pathname: '/userDetail',
        //     query: { ...data }
        // })
        // sessionStorage.setItem('query', JSON.stringify(data))

        var url = webhost + '/userDetail/' + data.id
        var win = window.open(url, '_blank')
        win.focus()
    }

    const changeStatus = data => {
        console.log('changeStatus', data)
        setState({
            ...state,
            visible: true,
            userId: data.id
        })
    }

    const sendEmail = id => {
        console.log('id', id)
        console.log('state', state)
        setEmailLoading({
            loading: true,
            id
        })
        APISendActiveEmail({ id }).then(resp => {
            message.success('success')
            const params = { page_size: 10, start_row: state.startRow }
            getList(params)
            setEmailLoading({
                ...emailLoading,
                loading: false
            })
        })
    }

    const downloadUser = () => {
        const params = {
            start_row: state.startRow,
            page_size: state.pagination.pageSize || 10,
            ...state.search
        }
        console.log('paams', params)
        APIDownloadUser({ userJson: JSON.stringify(params), type: 'export' }).then(resp => {})
    }

    const onCreate = data => {
        console.log('data', data)
        let userId = state.userId
        APIModifyUserStatus({
            userJson: JSON.stringify({
                id: userId,
                status: data.status
            })
        })
            .then(resp => {
                const params = { page_size: 10, start_row: 0, status: data.prevStatus }
                getList(params)
            })
            .catch(err => {
                console.log('err', err)
            })
        // APIModifyPaymentStatus({paymentJson: JSON.stringify(data)})
        //     .then(resp => {
        //         const params = { page_size: 10, start_row: 0, status: data.prevStatus }
        //         getList(params)
        //     })
        //     .catch(err => {
        //         console.log('err', err)
        //     })
    }

    const createAccount = () => {
        props.history.push('/add_user')
    }

    const batchUploadUserList = ({ file, onSuccess }) => {
        let confirmModal = window.confirm('Please confirm info is correct')
        if (confirmModal) {
            APIbatchUploadUserList({ file: file }).then(resp => {
                message.success('success')
                const params = { start_row: 0, page_size: state.pagination.pageSize }
                getList(params)
            })
        }
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
            />
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['User List']} />
                <h3>User List</h3>
                <img src={Aset} className='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={state.loading} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right', marginBottom: '15px' }}>
                                    <a
                                        style={{
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            padding: '8px 15px',
                                            marginLeft: '10px'
                                        }}
                                        href={state.downloadUserUrl}
                                        type='download'>
                                        <CloudDownloadOutlined />
                                        <span style={{ marginLeft: '5px' }}>Download User</span>
                                    </a>

                                    <Button type='primary' onClick={createAccount} style={{ marginLeft: '10px' }}>
                                        + Create Account
                                    </Button>
                                    <Upload customRequest={batchUploadUserList}>
                                        <Button style={{ marginLeft: '10px' }} icon={<UploadOutlined />}>
                                            Click to Upload File To Create
                                        </Button>
                                    </Upload>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, changeStatus, sendEmail, emailLoading)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                onChange={handleChange}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                bordered
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
