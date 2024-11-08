import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message, Popconfirm } from 'antd'
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
    APIGetMerchantList,
    APIDeleteMerchant
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { render } from 'react-dom'
import Aset from '@/imgs/aset1.png'
import { FormOutlined, MinusCircleOutlined, CheckCircleOutlined, PushpinOutlined } from '@ant-design/icons'

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

const columns = (edit, Ondelete, confirm) => [
    {
        title: 'Action',
        dataIndex: 'edit',
        key: 'edit',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <div>
                <a
                    className='action-btn'
                    onClick={() => {
                        edit(item)
                    }}>
                    Edit
                </a>

                <Popconfirm
                    title='Are you sure delete this merchant?'
                    onConfirm={() => {
                        confirm(item)
                    }}
                    // onCancel={cancel}
                    okText='Yes'
                    cancelText='No'>
                    {/* <a href="#">Delete</a> */}
                    <a
                        className='action-btn'
                        onClick={() => {
                            // Ondelete(item)
                        }}>
                        Delete
                    </a>
                </Popconfirm>
            </div>
        )
    },
    {
        title: 'Merchant ID',
        dataIndex: 'id',
        key: 'id',
        width: '100',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },

    {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        align: 'center',
        render: (text, item) => (
            <div>
                <img src={text} style={{ width: '60px', marginLeft: '5px' }} />
            </div>
        )
    },
    {
        title: 'Merchant name(dispaly name)',
        dataIndex: 'display_name',
        key: 'display_name',
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
        title: 'Merchant name(full name)',
        dataIndex: 'full_name',
        key: 'full_name',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-green'>
                <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} />
                {text}
            </span>
        )
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
                    <Form.Item name='id' label='Merchant ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='full_name' label='Full name'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='display_name' label='Display name'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='status' label='status'>
                        <Select>
                            <Option value={1}>Effective</Option>
                            <Option value={0}>invalid</Option>
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
        APIGetMerchantList({ merchantJson: JSON.stringify(params) })
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

    const createMerchant = () => {
        props.history.push({
            pathname: '/merchantDetail',
            query: {}
        })
        sessionStorage.setItem('query', JSON.stringify({}))
    }

    const edit = data => {
        console.log('data', data)
        props.history.push({
            pathname: '/merchantDetail',
            query: { ...data }
        })
        sessionStorage.setItem('query', JSON.stringify(data))
    }

    const Ondelete = data => {}

    const confirm = data => {
        console.log('dataconfirm', data)
        APIDeleteMerchant({ id: data.id }).then(resp => {
            const { pagination } = state
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
                <WebBreadcrumb arr={['Merchant List']} />
                <h3>Merchant List</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right', marginBottom: '15px' }}>
                                    <Button
                                        type='primary'
                                        onClick={() => {
                                            createMerchant()
                                        }}>
                                        New Merchant
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, Ondelete, confirm)}
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
