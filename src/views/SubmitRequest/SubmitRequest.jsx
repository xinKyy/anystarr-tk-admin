import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, Popconfirm, message } from 'antd'
import '@/style/view-style/table.less'
import {
    APIgetList,
    APIgetProjectTaskList,
    APIcreateWorkorder,
    APIgetWorkOrderList,
    APIgetWorkOrderDetail,
    APIhandleWorkOrder
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import MemberModal from '@/components/MemberModal'

const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

let handleActionId = -1

//搜索tab
const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        console.log('Received values of form: ', values)
        props.changeSearch(values)
    }

    return (
        <Form form={form} name='advanced_search' className='ant-advanced-search-form' onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='type' label='类型'>
                        <Select>
                            <Option value='receive'>接收</Option>
                            <Option value='send'>发送</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type='primary' htmlType='submit'>
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields()
                        }}>
                        Clear
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
            console.log('zikong')
            form.resetFields()
        }
    }, [])

    const onGenderChange = value => {
        form.setFieldsValue({ Gender: value })
    }

    const onCreateNew = val => {
        console.log('val', val)
        setUser(val)
        setAllMemVisible(false)
        form.setFieldsValue({
            user_id: val.user_id
        })
    }

    return (
        <Modal
            visible={visible}
            title='发起请求'
            okText='保存'
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
            <MemberModal
                visible={allMemVisible}
                value={user}
                onCreateNew={onCreateNew}
                onCancel={() => {
                    setAllMemVisible(false)
                }}
            />
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='user_id' label='用户' rules={[]}>
                    <div
                        onClick={() => {
                            setAllMemVisible(true)
                        }}>
                        <Input value={user ? user.user_name : ''} />
                    </div>
                </Form.Item>
                <Form.Item name='content' label='请求内容' rules={[]}>
                    <TextArea />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const columns = ({ clickDetail, handleTaskStatus, actionVisible, setActionVisible }) => [
    {
        title: '任务id',
        dataIndex: 'id',
        key: 'id',
        render: (text, item) => <Button type='link'>{text}</Button>
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content'
    },
    {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at'
    },
    {
        title: '接收者头像',
        dataIndex: 'receiver_avatar',
        key: 'receiver_avatar'
    },
    {
        title: '接收者',
        dataIndex: 'receiver_id',
        key: 'receiver_id'
    },
    {
        title: '接收者名字',
        dataIndex: 'receiver_name',
        key: 'receiver_name'
    },
    {
        title: '发起人头像',
        dataIndex: 'sender_avatar',
        key: 'sender_avatar'
    },
    {
        title: '发起人名字',
        dataIndex: 'sender_name',
        key: 'sender_name'
    },
    {
        title: '处理状态',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
            <Popconfirm
                visible={record.id === handleActionId && actionVisible}
                title='请确认操作状态'
                onConfirm={() => {
                    setActionVisible(false)
                    handleTaskStatus('pass', record.id)
                }}
                onCancel={() => {
                    setActionVisible(false)
                    handleTaskStatus('reject', record.id)
                }}
                okText='通过'
                cancelText='拒绝'>
                <a
                    href='#'
                    onClick={() => {
                        handleActionId = record.id
                        setActionVisible(true)
                    }}>
                    操作任务
                </a>
            </Popconfirm>
        )
    }
]

const SearchTableView = () => {
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
    const [actionVisible, setActionVisible] = useState(false)

    useEffect(() => {
        // const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }
        console.log('state', state)
        const params = { limit: state.pagination.pageSize, offset: 0 }
        getList(params)
    }, [])

    const handleTaskStatus = async (type, id) => {
        const params = {
            id: id
        }
        APIgetWorkOrderDetail(params)
            .then(resp => {
                console.log('resp', resp)
                let receiver_id = resp.data.receiver_id
                let userId = localStorage.getItem('uid')
                if (userId == receiver_id) {
                    APIhandleWorkOrder({
                        id: id,
                        action: type
                    }).then(resp => {
                        message.success('处理成功')
                        const params = { limit: state.pagination.pageSize, offset: 0 }
                        getList(params)
                    })
                } else {
                    message.error('你没有权限')
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const clickDetail = async data => {
        const detailData = await APIgetWorkOrderDetail({ id: data })
        console.log('detail', data)
        setState({
            ...state,
            visible: true,
            formData: data
        })
    }

    const changeSearch = (searchData, page) => {
        setState({
            search: { ...state.search, ...searchData }
        })
        const params = { ...searchData, limit: state.pagination.pageSize, offset: 0 }
        getList(params)
    }

    const getList = params => {
        console.log('params', params)
        APIgetWorkOrderList(params)
            .then(resp => {
                console.log('resp', resp)
                console.log('ty', getKeyList(resp.data.list))
                setState({
                    ...state,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    visible: false,
                    pagination: {
                        total: resp.data.total,
                        current: params.offset / params.limit + 1,
                        pageSize: params.limit
                        // total: resp.data.total
                        // current: resp.data.pager.start_row + 1,
                        // pageSize: resp.data.pager.page_size
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
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        }
        getList(params)
    }

    const onCreate = data => {
        console.log('data', data)
        const { content, user_id } = data
        const params = {
            area_id: localStorage.getItem('av'),
            user_id,
            content
        }
        APIcreateWorkorder(params)
            .then(resp => {
                message.success('添加成功')
                console.log('state.pagination.pageSize', state.pagination.pageSize)
                const params = { limit: state.pagination.pageSize, offset: 0 }
                setState({
                    ...state,
                    visible: false
                })
                getList(params)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

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
            <div>
                <WebBreadcrumb arr={['我的请求']} />
            </div>
            <div className='base-style'>
                <SearchBar changeSearch={changeSearch} />
            </div>
            <Row>
                <Col span={24}>
                    <div className='base-style'>
                        <Row>
                            <Col span={24} style={{ textAlign: 'left', marginBottom: '15px' }}>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        setState({
                                            ...state,
                                            formData: {},
                                            visible: true
                                        })
                                    }}>
                                    发起请求
                                </Button>
                            </Col>
                        </Row>
                        <Table
                            columns={columns({ clickDetail, handleTaskStatus, actionVisible, setActionVisible })}
                            rowKey={record => record.id}
                            dataSource={state.list}
                            onChange={handleChange}
                            loading={state.loading}
                            pagination={state.pagination}
                        />
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default SearchTableView
