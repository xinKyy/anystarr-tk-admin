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
    APIDeleteSku,
    APIGetTaskModuleList,
    APICreateTaskModule,
    APIEnableModule,
    APIDisableModule
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getLendTime, getLendTimeNew } from '@/tools/help.js'
import { render } from 'react-dom'
import { search } from '../../tools/host'
import Aset from '@/imgs/aset1.png'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
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

const columns = (edit, changeShow, confirm, changeModuleStatus) => [
    {
        title: 'Effective',
        dataIndex: 'status',
        key: 'status',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <div>
                <Switch
                    defaultChecked={text == 1 ? true : false}
                    onClick={() => {
                        changeModuleStatus(item)
                    }}
                />{' '}
            </div>
        )
    },
    {
        title: 'Module name',
        dataIndex: 'module_name',
        key: 'module_name',
        align: 'center'
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: '100',
        align: 'center',
        render: (text, item) => {
            if (text == 1) {
                return <span>promo code</span>
            } else if (text == 2) {
                return <span>content</span>
            } else if (text == 3) {
                return <span>proof</span>
            } else {
                return <span></span>
            }
        }
    },
    {
        title: 'Update date',
        dataIndex: 'update_time',
        key: 'update_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'Update by',
        dataIndex: 'updated_by',
        key: 'updated_by',
        align: 'center',
        render: (text, item) => (
            <div style={{ width: '100px' }}>
                <HeaderC name={text} style={{ display: 'inline-block' }} />
                <span>{text}</span>
            </div>
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
                    <Form.Item name='is_show_app' label='Show App'>
                        <Select allowClear>
                            <Option value={1}>Yes</Option>
                            <Option value={0}>No</Option>
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
            title='Task module'
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
                <Form.Item name='module_name' label='Module name' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='type' label='Type' rules={[{ required: true }]}>
                    <Select allowClear>
                        <Option value={1}>promo code</Option>
                        <Option value={2}>content</Option>
                        <Option value={3}>proof</Option>
                        <Option value={6}>Apply Promo Link</Option>
                    </Select>
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

    const refreshList = () => {
        const params = { start_row: 0, page_size: state.pagination.pageSize }
        getList(params)
    }

    const getList = params => {
        const { pagination, search } = state
        setState({ ...state, loading: true })
        APIGetTaskModuleList(params)
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.data.records && getKeyList(resp.data.data.records),
                    loading: false,
                    search: params.search,
                    pagination: {
                        total: resp.data.data.total,
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
            .catch((err, status, xhr) => { })
    }

    const onCreate = data => {
        APICreateTaskModule(data).then(resp => {
            message.success('success')
            const params = { ...state.search, start_row: 0, page_size: 10 }
            getList(params)
        })
    }

    const createModule = data => {
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

    const changeModuleStatus = data => {
        console.log('yuyu', data.status)
        if (data.status == 1) {
            APIDisableModule({ id: data.id }).then(resp => {
                const params = { start_row: 0, page_size: state.pagination.pageSize }
                getList(params)
            })
        } else {
            APIEnableModule({ id: data.id }).then(resp => {
                const params = { start_row: 0, page_size: state.pagination.pageSize }
                getList(params)
            })
        }
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

    const rowSelection = () => { }

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
                <WebBreadcrumb arr={['Task modules']} />
                <h3>Task modules</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                {/* <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={state.loading} />
                </div> */}
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Row>
                                <Col span={24} style={{ textAlign: 'right', marginBottom: '15px' }}>
                                    <Button
                                        style={{ marginRight: '10px' }}
                                        type='primary'
                                        onClick={() => {
                                            refreshList()
                                        }}>
                                        Refresh
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={() => {
                                            createModule()
                                        }}>
                                        Create Task Module
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, changeShow, confirm, changeModuleStatus)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                onChange={handleChange}
                                loading={state.loading}
                                bordered
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
