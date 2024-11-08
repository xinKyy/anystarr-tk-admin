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
    Badge,
    Dropdown,
    Menu,
    Tooltip,
    Tabs,
    Progress
} from 'antd'
import '@/style/view-style/table.less'
import {
    APIexportRewardRecord,
    APICreateInvitecode,
    APIGetMessages,
    APIGetPostList,
    APIDeletePost,
    APIModifyPostStatus
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getYearMonthDayTime, getYearMonthDayNormal, getCleanedParams } from '@/tools/help.js'
import { render } from 'react-dom'
import Aset from '@/imgs/aset1.png'
import {
    FormOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    PushpinOutlined,
    DownOutlined,
    MoreOutlined,
    PlaySquareOutlined,
    StepForwardOutlined,
    DiffOutlined,
    DeleteOutlined
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

const columns = (edit, deletePost, ModifyPostStatus) => [
    {
        title: 'operation',
        dataIndex: 'edit',
        key: 'edit',
        width: '100',
        align: 'center',
        render: (text, item) => {
            const menu = (
                <Menu>
                    <Menu.Item>
                        <a
                            onClick={() => {
                                edit(item)
                            }}>
                            <DiffOutlined />
                            <span style={{ marginLeft: '4px' }}>detail</span>
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a
                            onClick={() => {
                                ModifyPostStatus(item, '2')
                            }}>
                            <StepForwardOutlined />
                            <span style={{ marginLeft: '4px' }}>Start</span>
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a
                            onClick={() => {
                                ModifyPostStatus(item, '3')
                            }}>
                            <PlaySquareOutlined />
                            <span style={{ marginLeft: '4px' }}>Paused</span>
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <a
                            onClick={() => {
                                ModifyPostStatus(item, '5')
                            }}>
                            <DeleteOutlined />
                            <span style={{ marginLeft: '4px' }}>Cancel</span>
                        </a>
                    </Menu.Item>
                </Menu>
            )

            return (
                <Dropdown overlay={menu} style={{ width: '150px' }}>
                    <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                        <MoreOutlined style={{ fontSize: '25px', color: '#000' }} />
                    </a>
                </Dropdown>
            )
        }
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-p'>
                <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                {text}
            </span>
        )
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-red'>
                <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                {text}
            </span>
        )
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        render: (text, item) => (
            <Tooltip title={text}>
                <div style={{ width: '300px' }}>{text}</div>
            </Tooltip>
        )
    },
    {
        title: 'Source File',
        dataIndex: 'source_file',
        key: 'source_file',
        width: 200,
        align: 'left',
        render: (text, item) => <a href={text}>{text}</a>
    },
    {
        title: 'Create Time',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 200,
        align: 'center',
        render: (text, item) => <span>{getYearMonthDayNormal(text)}</span>
    },
    {
        title: 'Update Time',
        dataIndex: 'update_time',
        key: 'update_time',
        width: 200,
        align: 'center',
        render: (text, item) => <span>{getYearMonthDayNormal(text)}</span>
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: '100',
        render: (text, item) => (
            <div>
                <Badge status={text == 4 || text == 5 ? 'default' : text == 4 ? 'error' : 'success'} />
                <span>
                    {text == 0
                        ? 'TASK CREATED'
                        : text == 1
                        ? 'TASK IN SCHEDULE'
                        : text == 2
                        ? 'TASK IN PROGRESS'
                        : text == 3
                        ? 'TASK PAUSED'
                        : text == 4
                        ? 'TASK ERROR'
                        : text == 5
                        ? 'TASK CANCELLED'
                        : 'TASK COMPLETED'}
                </span>
            </div>
        )
    },
    {
        title: 'Progress (%)',
        dataIndex: 'progress',
        key: 'progress',
        align: 'center',
        width: 180,
        render: (text, item) => <Progress />
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
                    <Form.Item name='id' label='ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='title' label='Title'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='category' label='Category'>
                        <Input />
                    </Form.Item>
                </Col>
                {/* <Col span={8}>
                    <Form.Item name='status' label='status'>
                        <Select>
                            <Option value='0'>过期</Option>
                            <Option value='1'>已发布</Option>
                            <Option value='2'>进行中</Option>
                            <Option value='3'>发布排队</Option>
                            <Option value='4'>草稿</Option>
                        </Select>
                    </Form.Item>
                </Col> */}
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='language' label='Language'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='created_by' label='Created by'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='status' label='Status'>
                        <Select>
                            <Option value={0}>TASK CREATED</Option>
                            <Option value={1}>TASK IN SCHEDULE</Option>
                            <Option value={2}>TASK IN PROGRESS</Option>
                            <Option value={3}>TASK PAUSED</Option>
                            <Option value={4}>TASK ERROR</Option>
                            <Option value={5}>TASK CANCELLED</Option>
                            <Option value={6}>TASK COMPLETED</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type='primary' htmlType='submit' loading={props.loading}>
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
        if (Object.keys(formData).length) {
            form.setFieldsValue(formData)
        } else {
            form.resetFields()
        }
    }, [])

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
            title='创建邀请码'
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
                <Form.Item name='email' label='email' rules={[{ required: true }]}>
                    <Input />
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
        formData: {}
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
        APIGetPostList({ postTaskJson: JSON.stringify(getCleanedParams(params)) })
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    pagination: {
                        // ...state.pagination,
                        total: resp.data.pager.total
                    }
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
        const params = { ...search, page_size: 10, start_row: 0 }
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

    const onCreate = data => {
        console.log('data', data)
        APICreateInvitecode(data)
            .then(resp => {
                message.success('创建成功')
                const params = { ...state.search }
                // setState({
                //     ...state,
                //     visible: false
                // })
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
            pathname: '/postManagement/create_post/' + data.id,
            query: { ...data }
        })
        sessionStorage.setItem('query', JSON.stringify(data))
    }

    const CreatePost = () => {
        props.history.push({
            pathname: '/postManagement/create_post/0',
            query: {}
        })
    }

    const deletePost = data => {
        APIDeletePost({ id: data.id }).then(res => {
            message.success('success')
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const ModifyPostStatus = (data, status) => {
        let id = data.id
        APIModifyPostStatus({
            postTaskJson: JSON.stringify({
                id: id,
                status: status
            })
        }).then(res => {
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
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
                disabled={state.disabled}
            />
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['Post List']} />
                <h3>Post List</h3>
                <img src={Aset} className='aset' alt='aset' />
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
                                    <Button onClick={CreatePost} type='primary'>
                                        Create Post
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, deletePost, ModifyPostStatus)}
                                dataSource={state.list}
                                onChange={handleChange}
                                bordered
                                size='small'
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
