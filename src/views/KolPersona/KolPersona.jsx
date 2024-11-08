import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message, Upload } from 'antd'
import '@/style/view-style/table.less'
import {
    APIgetList,
    APIrewardApplicationList,
    APIrewardApplicationHandle,
    APIexportRewardRecord,
    APIGetUserList,
    APIGetInvitecodeList,
    APICreateInvitecode,
    APIBatchCreateInvitecode,
    APIDownloadInvitecode,
    APIGetReferralCode,
    APIGetKolPersona
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import moment from 'moment'
import Aset from '@/imgs/aset1.png'
import { MinusCircleOutlined, CheckCircleOutlined, SearchOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import HeaderC from '@/components/HeaderC'
import webhost from '@/tools/webhost.js'
import { search } from 'koa/lib/request'

const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select

const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!'
        }
    ]
}
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

const columns = edit => [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, item) => (
            <span
                className='table-id pointer'
                onClick={() => {
                    edit(item.user_id)
                }}>
                {text}
            </span>
        )
    },
    {
        title: 'Account Type',
        dataIndex: 'account_type',
        key: 'account_type',
        align: 'center'
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        align: 'center'
    },
    {
        title: 'language',
        dataIndex: 'language',
        key: 'language',
        align: 'center',
        render: (text, item) => <span>{item.externalInfo.language}</span>
    },
    {
        title: 'ins handle',
        dataIndex: 'app_name',
        key: 'app_name',
        align: 'center',
        render: (text, item) => <span>{item.app_name}</span>
    },
    // {
    //     title: 'App Name',
    //     dataIndex: 'app_name',
    //     key: 'app_name',
    //     align: 'center'
    // },
    // {
    //     title: 'Edge Count',
    //     dataIndex: 'app_name',
    //     key: 'app_name',
    //     align: 'center'
    // },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        align: 'center'
    },
    {
        title: 'Followers',
        dataIndex: 'followed',
        key: 'followed',
        align: 'center'
    },
    {
        title: 'Following',
        dataIndex: 'following',
        key: 'following',
        align: 'center'
    },
    {
        title: 'Full name',
        dataIndex: 'full_name',
        key: 'full_name',
        align: 'center'
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        align: 'center'
    },
    {
        title: 'Ins Category',
        dataIndex: 'ins_category',
        key: 'ins_category',
        align: 'center'
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
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
                    <Form.Item name='nickName' label='ins handle'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='email' label='Email'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='minNum' label='Minimum Followers'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='maxNum' label='Maximum Followers'>
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

const DownloadModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
    const [form] = Form.useForm()
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

    return (
        <Modal
            visible={visible}
            title='download '
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
                <Form.Item label='User Name' name='user_name'>
                    <Input />
                </Form.Item>
                <Form.Item label='Type' name='type'>
                    <Select>
                        <Option value={1}>Email</Option>
                        <Option value={2}>Ins</Option>
                        <Option value={3}>facebook</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='begin_date' label='Begin Time' {...config}>
                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                </Form.Item>
                <Form.Item name='end_date' label='End Time' {...config}>
                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                </Form.Item>
            </Form>
        </Modal>
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
            title='Generate Referral code'
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
                <Form.Item name='type' label='Type'>
                    <Select>
                        <Option value='email'>email</Option>
                        <Option value='ins'>ins</Option>
                        <Option value='fb'>fb</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='user_name' label='User Name' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

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
        formData: {},
        aVisible: false,
        aFormData: {},
        bVisible: false,
        bFormData: {},

        dVisible: false,
        dFormData: {}
    })
    const [handleState, setHandleState] = useState({
        visible: false,
        data: {}
    })
    useEffect(() => {
        const { pagination } = state
        const params = { current: 1, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        console.log('params getList', params)
        const { pagination, search } = state
        params = {
            ...params,
            limit: params.page_size,
            offset: params.current
        }
        setState({
            ...state,
            loading: true
        })
        APIGetKolPersona(params)
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.page.records && getKeyList(resp.data.page.records),
                    loading: false,
                    search: params.search,
                    pagination: {
                        current: params.offset,
                        pageSize: params.limit,
                        total: resp.data.page.total
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
            current: pagination.current,
            search: state.search
        }
        getList(params)
    }

    const changeSearch = search => {
        const params = { ...search, page_size: 10, current: 1, search: search }
        setState({
            ...state,
            search: search
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

    const createInvitecode = () => {
        setState({
            ...state,
            formData: {},
            visible: true
        })
    }
    const onCreate = data => {
        console.log('data', data)
        APICreateInvitecode({
            ReferralCodeJson: JSON.stringify(data)
        })
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

    const onCreateDownload = values => {
        console.log('values', values)

        let params = {
            ...values,
            begin_date: values['begin_date'].format('YYYY-MM-DD HH:mm:ss'),
            end_date: values['end_date'].format('YYYY-MM-DD HH:mm:ss')
        }
        APIDownloadInvitecode({
            Referral_code_json: JSON.stringify(params)
        }).then(res => {
            message.success('success')
            setState({
                ...state,
                dVisible: false
            })
        })
    }

    const createInvitecodeNew = () => {}

    const batchCreateInvitecode = () => {}

    const batchUploadFile = ({ file, onSuccess }) => {
        APIBatchCreateInvitecode({ file, file }).then(resp => {
            onSuccess()
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const downloadInvitecode = () => {
        setState({
            dVisible: true
        })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            name: record.name
        })
    }

    const edit = data => {
        console.log('edit', data)
        let url = webhost + '/account/referral_user?user_id=' + data
        let win = window.open(url, '_blank')
        win.focus()
    }

    return (
        <Layout className='animated fadeIn'>
            <DownloadModal
                visible={state.dVisible}
                onCreate={onCreateDownload}
                onCancel={() => {
                    setState({ ...state, dVisible: false })
                }}
                formData={state.formData}
            />

            <DetailModal
                visible={state.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setState({ ...state, visible: false })
                }}
                formData={state.formData}
                disabled={state.disabled}
            />
            {/* <div>
                <WebBreadcrumb arr={['Referral Management']} />
            </div> */}
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['Kol Persona']} />
                <h3>Kol Persona</h3>
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
                                    {/* <Button
                                        icon={<CloudDownloadOutlined />}
                                        style={{ marginLeft: '10px' }}
                                        type='primary'
                                        onClick={downloadInvitecode}>
                                        Download Referral code
                                    </Button>
                                    <Button
                                        style={{ marginRight: '10px', marginLeft: '10px' }}
                                        type='primary'
                                        onClick={() => {
                                            createInvitecode()
                                        }}>
                                        + Generate Referral code
                                    </Button>
                                    <Upload customRequest={batchUploadFile}>
                                        <Button type='primary'> + Generate a batch of Referral code</Button>
                                    </Upload> */}
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit)}
                                bordered
                                rowKey={record => record.key}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                                dataSource={state.list}
                                onChange={handleChange}
                                loading={state.loading}
                                pagination={state.pagination}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default SearchTableView
