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
    APIDeleteMerchant,
    APIGetEmailTem,
    APIGetEmailTemDetail,
    APIGetTemplateType
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

const columns = (edit, Ondelete, confirm, temType) => [
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

                {/* <Popconfirm
                    title='Are you sure delete this merchant?'
                    onConfirm={() => {
                        confirm(item)
                    }}
                    okText='Yes'
                    cancelText='No'>
                    <a
                        className='action-btn'
                        onClick={() => {
                        }}>
                        Delete
                    </a>
                </Popconfirm> */}
            </div>
        )
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '100',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: '160',
        render: (text, item) =>
            text == 1 ? (
                <span className='table-row-p'>
                    <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                    Verification code email
                </span>
            ) : text == 2 ? (
                <span className='table-row-green'>
                    <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} />
                    welcome email
                </span>
            ) : text == 3 ? (
                <span className='table-row-red'>
                    <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    activation email
                </span>
            ) : text == 4 ? (
                <span className='table-row-red'>
                    <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    Customer service reply email
                </span>
            ) : (
                <span className='table-row-green'>
                    <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} />
                    {temType[text]}
                </span>
            )
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
        align: 'center',
        render: (text, item) =>
            text == 1 ? (
                <span className='table-row-p'>
                    <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                    English
                </span>
            ) : text == 2 ? (
                <span className='table-row-green'>
                    <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} />
                    French
                </span>
            ) : text == 3 ? (
                <span className='table-row-red'>
                    <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    Spanish
                </span>
            ) : text == 4 ? (
                <span className='table-row-red'>
                    <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    Polish
                </span>
            ) : text == 5 ? (
                <span className='table-row-p'>
                    <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                    Portuguese
                </span>
            ) : null
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        align: 'center'
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
                    <Form.Item name='id' label=' ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='type' label='Type'>
                        <Select>
                            {/* <Option value={1}>Verification code email</Option>
                            <Option value={2}>welcome email</Option>
                            <Option value={3}>activation email</Option>
                            <Option value={4}>Customer service reply email</Option> */}
                            {Object.keys(props.temType) &&
                                Object.keys(props.temType).map((item, index) => {
                                    return <Option value={item}>{props.temType[item]}</Option>
                                })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='language' label='Language'>
                        <Select>
                            <Option value={1}>English</Option>
                            <Option value={2}>French</Option>
                            <Option value={3}>Spanish</Option>
                            <Option value={4}>Polish</Option>
                            <Option value={5}>Portuguese</Option>
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
            pageSize: 20
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

    const [temType, setTemType] = useState({})

    const getTemplateType = () => {
        APIGetTemplateType().then(resp => {
            setTemType(resp.data.messageTypes)
            console.log(resp.data.messageTypes)
        })
    }

    useEffect(() => {
        const { pagination } = state
        getTemplateType()
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        const { pagination, search } = state
        setState({ ...state, loading: true })
        APIGetEmailTem(JSON.stringify(params))
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

    const createEmailTem = () => {
        props.history.push('/email_tem_detail/0')
    }

    const edit = data => {
        props.history.push('/email_tem_detail/' + data.id)
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
                <WebBreadcrumb arr={['Email Template']} />
                <h3>Email Template</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} temType={temType} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right', marginBottom: '15px' }}>
                                    <Button
                                        type='primary'
                                        onClick={() => {
                                            createEmailTem()
                                        }}>
                                        New Email Tempalte
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, Ondelete, confirm, temType)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                onChange={handleChange}
                                loading={state.loading}
                                expandable={{
                                    expandedRowRender: record => <p style={{ margin: 0 }}>{record.content}</p>,
                                    rowExpandable: record => record.name !== 'Not Expandable'
                                }}
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
