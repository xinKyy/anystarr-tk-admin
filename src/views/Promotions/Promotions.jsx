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
    Switch,
    Image,
    Badge
} from 'antd'
import '@/style/view-style/table.less'
import {
    APIexportRewardRecord,
    APICreateOrModifySku,
    APIDeleteSku,
    APIModifyCrmUserStatus,
    APIGetCrmUser,
    APIGetPromotionList,
    APIGetProductList
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getLendTime, getLendTimeNew, getCleanedParams } from '@/tools/help.js'
import { render } from 'react-dom'
import { search } from '../../tools/host'
import Aset from '@/imgs/aset1.png'
import $ from 'jquery'
import { FormOutlined, MinusCircleOutlined, CheckCircleOutlined, PushpinOutlined } from '@ant-design/icons'
import HeaderC from '@/components/HeaderC'

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

const columns = (edit, changeShow, confirm, onChangeStatus) => [
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
                    <FormOutlined />
                    <span style={{ marginLeft: '4px' }}>Edit</span>
                </a>

                {/* <Popconfirm
                    title='Are you sure delete this merchant?'
                    onConfirm={() => {
                        confirm(item)
                    }}
                    // onCancel={cancel}
                    okText='Yes'
                    cancelText='No'>
                    <a
                        onClick={() => {
                            // Ondelete(item)
                        }}>
                        Delete
                    </a>
                </Popconfirm> */}
            </div>
        )
    },
    {
        title: 'Promotion ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        align: 'center',
        render: (text, item) => (
            <>
                {text == 1
                    ? 'Top banner'
                    : text == 2
                    ? 'abComo selection banner'
                    : text == 3
                    ? 'Rewarded task -sigle'
                    : text == 4
                    ? 'Rewarded task -dual'
                    : ''}
            </>
        )
    },
    {
        title: 'Promotion Title',
        dataIndex: 'title',
        key: 'title',
        width: '100',
        align: 'center'
    },
    // {
    //     title: 'Banner',
    //     dataIndex: 'banner',
    //     key: 'banner',
    //     align: 'center',
    //     render: (text, item) => (
    //         <div style={{ display: 'flex' }}>
    //             {text && text !='1' &&
    //                 JSON.parse(text).map((url, index) => {
    //                     console.log('urlll,', url)
    //                     return (
    //                         <Image src={url} />
    //                     )
    //                 })}
    //         </div>
    //     )
    // },
    {
        title: 'Post start time',
        dataIndex: 'post_start_time',
        key: 'post_start_time',
        align: 'center'
    },
    {
        title: 'Post end time',
        dataIndex: 'post_end_time',
        key: 'post_end_time',
        align: 'center'
    },
    {
        title: 'Posted by',
        dataIndex: 'operator_name',
        key: 'operator_name',
        align: 'left',
        render: (text, item) => (
            <div style={{ width: '120px' }}>
                <HeaderC name={text} style={{ display: 'inline-block' }} />
                <span>{text}</span>
            </div>
        )
    },
    {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, item) => (
            <div style={{ width: '120px' }}>
                <Badge status={text == 2 ? 'success' : text == 1 ? 'processing' : text == 0 ? 'error' : 'default'} />
                {text == 0 ? 'Ended' : text == 1 ? 'Pending to post' : text == 2 ? 'Posting' : ''}
            </div>
        )
    },
    {
        title: 'Show to all',
        dataIndex: 'is_whitelist',
        key: 'is_whitelist',
        align: 'center',
        render: (text, item) => <>{text == 0 ? 'All users' : text == 1 ? 'Customize' : ''}</>
    },
    {
        title: 'Update date',
        dataIndex: 'update_time',
        key: 'update_time',
        width: '100',
        align: 'center'
    }
]

const campaignColumn = () => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
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

const SampleCamModal = ({ visible, onCreate, onCancel, addToCampaignList }) => {
    const [state, setState] = useState({
        list: [],
        loading: false,
        pagination: {
            current: 1,
            pageSize: 10
        },
        search: {}
    })
    const [selectObj, setSelectObj] = useState({})
    const getList = params => {
        const { pagination, search } = state
        setState({ ...state, loading: true })
        APIGetProductList(JSON.stringify(getCleanedParams(params)))
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    search: params.search,
                    pagination: {
                        total: resp.data.pager.total,
                        current: params.start_row / params.page_size + 1,
                        pageSize: params.page_size
                    }
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        const { pagination } = state
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }, [visible])

    const changeSearch = search => {
        const params = { ...search, page_size: 10, start_row: 0, search: search }
        setState({
            ...state,
            search: search
        })
        getList(params)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            setSelectObj(selectedRows)
        }
    }

    return (
        <Modal
            visible={visible}
            title='Feature Product'
            okText='Submit'
            width={900}
            onOk={() => {
                // onCreateNew(selectObj)
                console.log('select', selectObj)
                addToCampaignList(selectObj)
            }}
            cancelText='Cancel'
            onCancel={onCancel}>
            <div style={{ marginBottom: '15px' }}>
                <SearchBar changeSearch={changeSearch} loading={state.loading} />
            </div>
            <Table
                size='small'
                columns={campaignColumn()}
                pagination={state.pagination}
                rowKey={record => record.key}
                dataSource={state.list}
                border
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
            />
        </Modal>
    )
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
                    <Form.Item name='id' label='ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='category' label='Category'>
                        <Select allowClear>
                            <Option value={1}>Top banner</Option>
                            <Option value={2}>abComo selection banner</Option>
                            <Option value={3}>Rewarded task -sigle</Option>
                            <Option value={4}>Rewarded task -dual</Option>
                            <Option value={5}>Feature Product</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='title' label='Title'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                {/* <Col span={8}>
                    <Form.Item name='title' label='Title'>
                        <Input />
                    </Form.Item>
                </Col> */}
                <Col span={8}>
                    <Form.Item name='link_type' label='Link type'>
                        <Select allowClear>
                            <Option value={1}>Internal Link</Option>
                            <Option value={2}>External Link</Option>
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
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }, [])

    const getList = params => {
        const { pagination, search } = state
        console.log('role', params)
        setState({ ...state, loading: true })

        APIGetPromotionList(JSON.stringify(params))
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    search: params.search,
                    pagination: {
                        total: resp.data.pager.total,
                        current: params.start_row / params.page_size + 1,
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
            start_row: pagination.pageSize * (pagination.current - 1),
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
        props.history.push('/mobile_app_management/promotion_detail/' + data.id)
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

    const addPromotion = () => {
        props.history.push('/mobile_app_management/promotion_detail/0')
    }

    const onChangeStatus = data => {
        console.log('onChangeStatus', data)
        APIModifyCrmUserStatus({
            crmUserJson: JSON.stringify({
                id: data.id,
                status: data.status == 1 ? 0 : 1
            })
        })
            .then(resp => {})
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
                <WebBreadcrumb arr={['Promotions  List']} />
                <h3>Promotions List</h3>
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
                                    <Button
                                        type='primary'
                                        onClick={() => {
                                            addPromotion()
                                        }}>
                                        Add promotion
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, changeShow, confirm, onChangeStatus)}
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
