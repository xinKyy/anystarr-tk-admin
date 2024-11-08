import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message, Badge } from 'antd'
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
    APIGetMessages
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { render } from 'react-dom'
import webhost from '@/tools/webhost.js'
import Aset from '@/imgs/aset1.png'
import { FormOutlined, MinusCircleOutlined, PushpinOutlined } from '@ant-design/icons'
import { getYearMonthDayTimeNew, getCleanedParams } from '@/tools/help.js'

const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select

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

const columns = edit => [
    {
        title: 'operation',
        dataIndex: 'edit',
        key: 'edit',
        width: '100',
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
        title: 'Ticket Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        align: 'center',
        render: (text, item) =>
            text == '1' ? (
                <span className='table-row-p'>
                    <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                    Contact anyStarr
                </span>
            ) : (
                <span className='table-row-green'>
                    <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} /> Contact
                    abcomo
                </span>
            )
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: '100',
        render: (text, item) => (
            <div>
                <Badge status={text == 9 ? 'success' : text == 10 ? 'processing' : text == 0 ? 'default' : 'default'} />
                <span>
                    {item.status == 10
                        ? 'Waiting for reply'
                        : item.status == 9
                        ? 'Replied'
                        : item.status == 0
                        ? 'Close'
                        : ''}
                </span>
            </div>
        )
    },
    {
        title: 'Ticket created time',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'Ticket from(email)',
        dataIndex: 'from_user',
        key: 'from_user',
        align: 'center'
    },
    {
        title: 'Name',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center'
    },
    {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-green'>
                <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} /> {text}
            </span>
        )
    },
    {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        width: '100',
        align: 'center',
        render: (text, item) => <Tag color='geekblue'>{text}</Tag>
    }
]

const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        props.changeSearch(values)
    }

    return (
        <Form
            {...formItemLayout}
            form={form}
            name='advanced_search'
            className='ant-advanced-search-form'
            onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='status' label='Ticket status'>
                        <Select>
                            <Option value='0'>closed</Option>
                            <Option value='10'>Waiting for reply</Option>
                            <Option value='9'>Replied</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='from_user' label='From'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='topic' label='Topic'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='country' label='Country'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='type' label='Ticket Type'>
                        <Select>
                            <Option value='1'>anyStarr</Option>
                            <Option value='2'>abcomo</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='operator_name' label='Operator name'>
                        <Input />
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
        APIGetMessages({ messageJson: JSON.stringify(getCleanedParams(params)) })
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
                message.success('success')
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
        var url = webhost + '/messageDetail/' + data.id
        var win = window.open(url, '_blank')
        win.focus()
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
                <WebBreadcrumb arr={['Ticket List']} />
                <h3>Ticket List</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={state.loading} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Table
                                columns={columns(edit)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                onChange={handleChange}
                                loading={state.loading}
                                bordered
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
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
