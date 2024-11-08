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
    Upload,
    Select,
    message,
    Popconfirm,
    Tooltip
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
    APIGetMessages,
    APIGetCodeCommission,
    APIUploadCodeCommission,
    APIDeleteCodeCommission,
    APIDownloadCodeCommission
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getYearMonthDayNormal, getCleanedParams } from '@/tools/help.js'
import { render } from 'react-dom'
import Aset from '@/imgs/aset1.png'
import moment from 'moment'
import HeaderC from '@/components/HeaderC'
import { DollarCircleOutlined } from '@ant-design/icons'
import webhost from '@/tools/webhost.js'

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

const columns = (edit, gotoUser, gotoTask) => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
    },
    {
        title: 'Upload time',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'Upload by',
        dataIndex: 'update_by',
        key: 'update_by',
        align: 'center',
        render: (text, item) => (
            <div style={{ width: '120px' }}>
                <HeaderC name={text} style={{ display: 'inline-block' }} />
                <span>{text}</span>
            </div>
        )
    },
    {
        title: 'Promo Code',
        dataIndex: 'promo_code',
        key: 'promo_code',
        width: '100',
        align: 'center'
    },
    {
        title: 'Commission Amount',
        dataIndex: 'commission_amount',
        key: 'commission_amount',
        width: '100',
        align: 'center',
        // render: (text, item) => <div>{`$${text}`}</div>
        render: (text, item) => (
            <span className='table-row-red' style={{ maxWidth: '160px' }}>
                <DollarCircleOutlined style={{ color: '#f85c5a' }} /> {text}
            </span>
        )
    },
    {
        title: 'Reward this month',
        dataIndex: 'reword_this_month',
        key: 'reword_this_month',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-green' style={{ maxWidth: '160px' }}>
                <DollarCircleOutlined style={{ color: '#18BFA4' }} /> {text}
            </span>
        )
    },
    {
        title: 'Commission in Total for this promo code',
        dataIndex: 'total_commission',
        key: 'total_commission',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span className='table-row-p' style={{ maxWidth: '160px' }}>
                <DollarCircleOutlined style={{ color: '#868AF6' }} /> {text}
            </span>
        )
    },
    {
        title: 'AnyStarr username',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <span
                className='table-id pointer'
                onClick={() => {
                    gotoUser(item)
                }}>
                {text}
            </span>
        )
    },
    {
        title: 'Task from',
        dataIndex: 'title',
        key: 'title',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <Tooltip title={text}>
                <div
                    className='pointer'
                    onClick={() => {
                        gotoTask(item)
                    }}>
                    {text}
                </div>
            </Tooltip>
        )
    },
    {
        title: 'User Balance',
        dataIndex: 'user_balance',
        key: 'user_balance',
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
                    <Form.Item name='promo_code' label='Promo code'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='user_name' label='User name'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
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
        formData: {},
        rowSelect: [],
        downloadUrl: ''
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
        if (params.time) {
            params.begin_date = getYearMonthDayNormal(params.time[0])
            params.end_date = getYearMonthDayNormal(params.time[1])
        }
        const { pagination, search } = state
        setState({ ...state, loading: true })
        let apiHref = APIDownloadCodeCommission()
        let json = JSON.stringify({ ...params })
        let resHref = `${apiHref}?codeCommissionJson=${json}`
        // return  encodeURI(resHref)

        APIGetCodeCommission({ codeCommissionJson: JSON.stringify(getCleanedParams(params)) })
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    pagination: {
                        // ...state.pagination,
                        total: resp.data.pager.total
                    },
                    downloadUrl: encodeURI(resHref)
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

    const gotoUser = item => {
        var url = webhost + '/userDetail/' + item.user_id
        var win = window.open(url, '_blank')
        win.focus()
    }

    const gotoTask = item => {
        var url = webhost + '/taskDetail/' + item.task_id
        var win = window.open(url, '_blank')
        win.focus()
    }

    const edit = data => {
        console.log('data', data)
        props.history.push({
            pathname: '/messageDetail',
            query: { ...data }
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            let resArr = selectedRows.map(item => {
                return item.id
            })
            console.log('resArr', resArr)
            setState({
                ...state,
                rowSelect: resArr
            })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    }

    const uploadFile = ({ file, onSuccess }) => {
        // uid: '-1',
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        APIUploadCodeCommission({ file: file }).then(resp => {
            onSuccess()
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const deleteCodeCommission = () => {
        APIDeleteCodeCommission({
            idsJson: JSON.stringify(state.rowSelect)
        }).then(resp => {
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const downloadCodeCommission = () => {
        let apiHref = APIDownloadCodeCommission()
        let json = JSON.stringify({ ...state.search })
        console.log('json', json)
        let resHref = `${apiHref}?codeCommissionJson=${json}`
        return encodeURI(resHref)
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
                <WebBreadcrumb arr={['Code commission List']} />
                <h3>Code commission List</h3>
                <img src={Aset} className='aset' alt='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={state.loading} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
                                <Upload customRequest={uploadFile}>
                                    <Button type='primary'> Upload income history</Button>
                                </Upload>

                                <Popconfirm
                                    title='Are you sure delete this task?'
                                    onConfirm={deleteCodeCommission}
                                    okText='Yes'
                                    cancelText='No'>
                                    {/* <a href="#">Delete</a> */}
                                    <Button type='primary' style={{ marginLeft: '10px' }}>
                                        Delete Code Commission
                                    </Button>
                                </Popconfirm>

                                <a
                                    style={{
                                        backgroundColor: '#1890ff',
                                        color: '#fff',
                                        padding: '8px 15px',
                                        marginLeft: '10px'
                                    }}
                                    href={state.downloadUrl}
                                    type='download'>
                                    Download Code Commission
                                </a>
                            </div>
                            <Table
                                rowSelection={{
                                    ...rowSelection
                                }}
                                columns={columns(edit, gotoUser, gotoTask)}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                bordered
                                onChange={handleChange}
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
