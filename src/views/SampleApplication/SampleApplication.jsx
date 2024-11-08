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
    Badge,
    Tooltip,
    Upload
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
    APIGetSampleList,
    APIDownloadSample,
    APIUploadTrackNumber,
    APIUploadBatchApprovalSample
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getLendTime, getLendTimeNew, getYearMonthDayNormal } from '@/tools/help.js'
import { render } from 'react-dom'
import { search } from '../../tools/host'
import webhost from '@/tools/webhost.js'
import moment from 'moment'
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

const columns = (edit, changeShow, confirm) => [
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
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
        title: ' Application ID',
        dataIndex: 'id',
        key: 'id',
        width: '101',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Task ID',
        dataIndex: 'task_id',
        key: 'task_id',
        align: 'center',
        width: '100'
    },
    {
        title: 'Campaign ID',
        dataIndex: 'campaign_id',
        key: 'campaign_id',
        align: 'center',
        width: '100'
    },
    {
        title: 'Campaign title',
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
        title: 'Application status',
        dataIndex: 'status',
        key: 'status',
        width: 160,
        align: 'center',
        render: (text, item) => (
            <div>
                <Badge status={text == 4 ? 'default' : 'success'} />
                <span>{text == 1 ? 'New application' : text == 4 ? 'Closed' : text == 3 ? 'Approved' : 'Shipped'}</span>
            </div>
        )
    },
    {
        title: 'Update date',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'center',
        width: 180
        // render: (text, item) => <div>{new Date(text).toLocaleString()}</div>
    },
    {
        title: 'Username',
        dataIndex: 'from_user',
        key: 'from_user',
        width: 100,
        align: 'center'
    },
    {
        title: 'Courier',
        dataIndex: 'courier',
        key: 'courier',
        align: 'center'
    },
    {
        title: 'Tracking number',
        dataIndex: 'tracking_number',
        key: 'tracking_number',
        width: 100,
        align: 'center',
        render: (text, item) => (
            <a href={`https://www.ydhex.com/tools/inquire?number=${text}`} target='_blank'>
                {text}
            </a>
        )
    }
]

const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        console.log('values', values)
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
                <Col span={10}>
                    <Form.Item name='id' label='ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name='user_id' label='User ID'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                    <Form.Item name='from_user' label='User Email'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name='tracking_number' label='Tracking Number'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                    <Form.Item name='status' label='Application status'>
                        <Select allowClear>
                            <Option value={1}>New application</Option>
                            <Option value={2}>Shipped</Option>
                            <Option value={3}>Approved</Option>
                            <Option value={4}>Closed</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name='time' label='time'>
                        <RangePicker
                            ranges={{
                                Today: [moment(), moment()],
                                Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Last 7 days': [moment().subtract(6, 'days'), moment()],
                                'Last 28 days': [moment().subtract(27, 'days'), moment()]
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Form.Item name='campaign_ids' label='Campaign IDs'>
                        <Input placeholder='Separated by English commas' />
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
        setState({ ...state, loading: true })
        if (params.time) {
            params.start_time = getYearMonthDayNormal(params.time[0]._d)
            params.end_time = getYearMonthDayNormal(params.time[1]._d)
        }
        console.log('params.campaign_ids', params.campaign_ids)
        if (params.campaign_ids) {
            let campaigIdArr = params.campaign_ids.split(',')
            let resCam = campaigIdArr.map(item => {
                return JSON.parse(item)
            })
            params.campaign_ids = resCam
        }

        APIGetSampleList({ sampleOrderJson: JSON.stringify(params) })
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
        let url = webhost + '/sample_detail/' + data.id
        let win = window.open(url, '_blank')
        win.focus()
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

    const downloadSample = () => {
        let apiHref = APIDownloadSample()
        let params = { ...state.search }
        if (params.campaign_ids) {
            let campaigIdArr = params.campaign_ids.split(',')
            let resCam = campaigIdArr.map(item => {
                return JSON.parse(item)
            })
            params.campaign_ids = resCam
        }
        let json = JSON.stringify(params)
        let resHref = `${apiHref}?sampleOrderJson=${json}`
        console.log('resHref', resHref)
        return encodeURI(resHref)
    }

    const rowSelection = () => {}

    const uploadFile = ({ file, onSuccess }) => {
        APIUploadTrackNumber({ file: file }).then(resp => {
            onSuccess()
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const uploadSampleResult = ({ file, onSuccess }) => {
        APIUploadBatchApprovalSample({ file: file }).then(resp => {
            onSuccess()
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
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
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['Sample application List']} />
                <h3>Sample application List</h3>
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
                                    <Upload customRequest={uploadSampleResult}>
                                        <Button type='primary'>Upload sample result</Button>
                                    </Upload>
                                    <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                                        <Upload customRequest={uploadFile}>
                                            <Button type='primary'> Upload tracking number</Button>
                                        </Upload>
                                    </div>
                                    <a
                                        style={{
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            padding: '8px 15px',
                                            marginLeft: '10px'
                                        }}
                                        href={downloadSample()}
                                        type='download'>
                                        Download
                                    </a>
                                </Col>
                            </Row>
                            <Table
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                columns={columns(edit, changeShow, confirm)}
                                rowKey={record => record.key}
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
