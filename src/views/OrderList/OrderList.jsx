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
    Popconfirm,
    Form,
    DatePicker,
    Select,
    message,
    Switch
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
    APIFindTasks,
    APIGetSkuList,
    APICreateOrModifySku,
    APIDownloadWhiteList,
    APIDeleteSku,
    APIGetShopifyOrder,
    APIDownloadShopifyOrder
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getLendTime, getLendTimeNew, getCleanedParams } from '@/tools/help.js'
import { render } from 'react-dom'
import { search } from '../../tools/host'
import Aset from '@/imgs/aset1.png'
import {
    FormOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    PushpinOutlined,
    DollarCircleOutlined
} from '@ant-design/icons'

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

const columns = (edit, changeShow, confirm) => [
    // {
    //     title: 'Action',
    //     dataIndex: 'edit',
    //     key: 'edit',
    //     width: '100',
    //     align: 'center',
    //     render: (text, item) => (
    //         <div>
    //             <a
    //                 onClick={() => {
    //                     edit(item)
    //                 }}>
    //                 Edit
    //             </a>

    //             <Popconfirm
    //                 title='Are you sure delete this merchant?'
    //                 onConfirm={() => {
    //                     confirm(item)
    //                 }}
    //                 // onCancel={cancel}
    //                 okText='Yes'
    //                 cancelText='No'>
    //                 <a
    //                     onClick={() => {
    //                         // Ondelete(item)
    //                     }}>
    //                     Delete
    //                 </a>
    //             </Popconfirm>
    //         </div>
    //     )
    // },
    {
        title: 'Order numner',
        dataIndex: 'order_name',
        key: 'order_name',
        width: '100',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Date',
        dataIndex: 'order_date',
        key: 'order_date',
        align: 'center'
    },
    {
        title: 'Total amount',
        dataIndex: 'total_amount',
        key: 'total_amount',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-red' style={{ maxWidth: '80px' }}>
                <DollarCircleOutlined style={{ color: '#f85c5a' }} /> {text}
            </span>
        )
    },
    {
        title: 'Payment',
        dataIndex: 'payment',
        key: 'payment',
        width: '100',
        align: 'center'
    },
    {
        title: 'Fullfillment',
        dataIndex: 'fulfillment',
        key: 'fulfillment',
        width: '100',
        align: 'center'
    },
    {
        title: 'Promo Code',
        dataIndex: 'promo_code',
        key: 'promo_code',
        width: '100',
        alignL: 'center'
    },
    {
        title: 'Commission %',
        dataIndex: 'commission_percent',
        key: 'commission_percent',
        width: '100',
        align: 'center'
    },
    {
        title: 'Commission of order',
        dataIndex: 'commission_of_order',
        key: 'commission_of_order',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-green' style={{ maxWidth: '160px' }}>
                <DollarCircleOutlined style={{ color: '#18BFA4' }} /> {text}
            </span>
        )
    },
    // {
    //     title: 'Commission in Total for this promo code',
    //     dataIndex: 'commission_of_order',
    //     key: 'commission_of_order',
    //     width: '100',
    //     align: 'center',
    //     render: (text, item) => (
    //         <span className='table-row-green' style={{ maxWidth: '160px' }}>
    //             <DollarCircleOutlined style={{ color: '#18BFA4' }} /> {text}
    //         </span>
    //     )
    // },
    {
        title: 'Tracking number',
        dataIndex: 'track_num',
        key: 'track_num',
        render: (text, item) => (text ? <span className='table-id'>{text}</span> : '')
    },
    {
        title: 'Parcel status',
        dataIndex: 'parcel_status',
        key: 'parcel_status',
        render: (text, item) => (
            <div style={{ width: '200px' }}>
                <span>
                    {text == 0
                        ? 'Shipped'
                        : text == 10
                        ? 'In transit'
                        : text == 20
                        ? 'Delayed'
                        : text == 30
                        ? 'Ready to collect'
                        : text == 35
                        ? 'Failure'
                        : text == 40
                        ? 'Completed'
                        : text == 50
                        ? 'Abnormal'
                        : ''}
                </span>
            </div>
        )
    },
    {
        title: 'AnyStarr username',
        dataIndex: 'useranme',
        key: 'useranme',
        width: '100',
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
        console.log('values', values)
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
                    <Form.Item name='searchStr' label='Key Word'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='payment' label='Payment Status'>
                        <Select allowClear>
                            <Option value='Paid'>Paid</Option>
                            <Option value='Upload'>Upload</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='withCode' label='With Promo Code'>
                        <Select allowClear>
                            <Option value={1}>Yes</Option>
                            <Option value={0}>No</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='parcelStatus' label='Parcel status '>
                        <Select allowClear>
                            <Option value={1}>Completed</Option>
                            <Option value={0}>In tansit</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type='primary' htmlType='submit' loading={props.loading}>
                        Query
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
        console.log('formdata', formData)
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
            title='sku'
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
                <Form.Item name='id' label='ID'>
                    <Input disabled />
                </Form.Item>
                <Form.Item name='tier_1_cat' label='Tier1 Cat' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='tier_2_cat' label='Tier2 Cat'>
                    <Input />
                </Form.Item>
                <Form.Item name='tier_3_cat' label='Tier3 Cat'>
                    <Input />
                </Form.Item>
                <Form.Item name='shown_name' label='Sku name' rules={[{ required: true }]}>
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
        const params = { current: 1, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        const { pagination, search } = state
        setState({ ...state, loading: true })
        params = {
            ...params,
            limit: params.page_size,
            offset: params.current - 1
        }
        APIGetShopifyOrder(getCleanedParams(params))
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.page && getKeyList(resp.data.page.records),
                    loading: false,
                    search: params.search,
                    pagination: {
                        total: resp.data.page.total,
                        current: params.current,
                        pageSize: params.page_size
                    }
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const handleChange = pagination => {
        console.log('state', state)

        const params = {
            ...state.search,
            page_size: pagination.pageSize,
            current: pagination.current,
            search: state.search
        }

        console.log('ttt', params)

        getList(params)
    }

    const changeSearch = search => {
        const params = { ...search, page_size: 10, start_row: 0, search: search }
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

    const onCreate = data => {
        console.log('data', data)
        data.is_show_app = 1
        APICreateOrModifySku({
            categoryJson: JSON.stringify(data)
        })
            .then(resp => {
                message.success('success')
                const params = { ...state.search, start_row: 0, page_size: 10 }
                getList(params)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const createSku = data => {
        setState({
            ...state,
            visible: true,
            formData: {}
        })
    }

    const edit = data => {
        console.log('data', data)
        setState({
            ...state,
            visible: true,
            formData: data
        })
    }

    const confirm = data => {
        console.log('dataconfirm', data)
        APIDeleteSku({ id: data.id }).then(resp => {
            const { pagination } = state
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const changeShow = data => {
        console.log('data', data)
        APICreateOrModifySku({
            categoryJson: JSON.stringify({
                id: data.id,
                tier_1_cat: data.tier_1_cat,
                shown_name: data.shown_name,
                is_show_app: data.is_show_app == 1 ? 0 : 1
            })
        })
            .then(resp => {
                const params = {
                    ...state.search,
                    page_size: state.pagination.pageSize,
                    start_row: state.pagination.pageSize * (state.pagination.current - 1),
                    search: state.search
                }
                getList(params)
            })
            .catch(err => {
                console.log('err', err)
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
                <WebBreadcrumb arr={['abComo Order List']} />
                <h3>abComo Order List</h3>
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
                                    <a
                                        style={{
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            padding: '8px 15px',
                                            marginLeft: '10px'
                                        }}
                                        type='download'
                                        href={APIDownloadWhiteList(state.id)}>
                                        download white list
                                    </a>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, changeShow, confirm)}
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
