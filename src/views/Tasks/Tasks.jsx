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
    Select,
    message,
    Image,
    Badge,
    Tooltip,
    Menu,
    Dropdown,
    Popconfirm
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
    APIModifyRewardAmount,
    APICloseTask
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { getLendTime, getLendTimeNew, isJSON, getCleanedParams } from '@/tools/help.js'
import { render } from 'react-dom'
import webhost from '@/tools/webhost.js'
import Aset from '@/imgs/aset1.png'

import {
    FormOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    PushpinOutlined,
    DownOutlined,
    MoreOutlined,
    PlaySquareOutlined,
    StepForwardOutlined,
    DiffOutlined,
    DeleteOutlined
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

const isVideo = str => {
    return /^.+(\.mp4|\.avi|video|\.mov|\.rmvb|.flv)$/.test(str)
}

const columns = (edit, closeTask, ModifyRewardAmount) => [
    {
        title: 'operation',
        dataIndex: 'edit',
        key: 'edit',
        width: '100',
        align: 'center',
        render: (text, item) => {
            const menu = (
                <Menu>
                    <Menu.Item>
                        <Popconfirm
                            title='Are you sure to close this task'
                            onConfirm={() => {
                                closeTask(item)
                            }}
                            // onCancel={cancel}
                            okText='Yes'
                            cancelText='No'>
                            <a>
                                <DeleteOutlined />
                                <span style={{ marginLeft: '4px' }}>Close Task</span>
                            </a>
                        </Popconfirm>
                    </Menu.Item>
                    <Menu.Item>
                        <a
                            onClick={() => {
                                ModifyRewardAmount(item)
                            }}>
                            <DiffOutlined />
                            <span style={{ marginLeft: '4px' }}>Modify Reward Amount</span>
                        </a>
                    </Menu.Item>
                </Menu>
            )

            return (
                <Dropdown overlay={menu} style={{ width: '150px' }}>
                    <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                        <MoreOutlined style={{ fontSize: '25px', color: '#000' }} />
                    </a>
                </Dropdown>
            )
        }
    },
    {
        title: 'Application ID',
        dataIndex: 'id',
        key: 'id',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <a
                className='action-btn'
                onClick={() => {
                    edit(item)
                }}>
                {text}
            </a>
        )
    },
    {
        title: 'Campaign title',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
        width: 300,
        render: (text, item) => (
            <Tooltip title={text}>
                <div style={{ width: '300px' }}>{text}</div>
            </Tooltip>
        )
    },
    {
        title: 'Campaign type',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, item) =>
            text == 1 ? (
                <span className='table-row-p'>
                    <PushpinOutlined style={{ color: '#868AF6', fontSize: '13px', marginRight: '3px' }} />
                    CPA
                </span>
            ) : text == 3 ? (
                <span className='table-row-green'>
                    <PushpinOutlined style={{ color: '#18BFA4', fontSize: '13px', marginRight: '3px' }} />
                    Branding
                </span>
            ) : text == 4 ? (
                <span className='table-row-red'>
                    <PushpinOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    abComo
                </span>
            ) : null
    },
    {
        title: 'Username',
        dataIndex: 'user',
        key: 'user',
        width: '100',
        align: 'center'
    },
    {
        title: 'Application date',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 160,
        align: 'center'
    },
    {
        title: 'commission',
        dataIndex: 'commission',
        key: 'commission',
        width: '100',
        align: 'center'
    },
    {
        title: 'Leading time ',
        dataIndex: 'update_time',
        key: 'update_time',
        width: '100',
        align: 'center',
        render: (text, item) => <div>{getLendTimeNew(item.submit_time, item.review_time)}</div>
    },
    {
        title: 'Task status',
        dataIndex: 'status',
        width: 200,
        key: 'status',
        align: 'left',
        render: (text, item) => (
            <div style={{ width: '160px' }}>
                <Badge status={text == 0 ? 'default' : 'success'} />
                <span>
                    {text == 0
                        ? 'Task closed'
                        : text == 1
                        ? 'New Task'
                        : text == 2
                        ? 'Pending proof upload'
                        : text == 3
                        ? 'Pending for Review'
                        : text == 4
                        ? 'Resubmit evidence'
                        : text == 5
                        ? 'Task Approved'
                        : text == 7
                        ? 'Pending for Content Review'
                        : text == 8
                        ? 'Resubmit Content'
                        : text == 9
                        ? 'Pending proof upload'
                        : ''}
                </span>
            </div>
        )
    },
    {
        title: '# of upload images',
        dataIndex: 'images',
        key: 'images',
        align: 'center',
        render: (text, item) => (
            <div style={{ display: 'flex' }}>
                {text &&
                    JSON.parse(text).map((url, index) => {
                        console.log('urlll,', url)
                        if (isVideo(url)) {
                            return (
                                <video src={url} controls='controls' style={{ width: '100px', marginLeft: '10px' }}>
                                    您的浏览器不支持 video 标签。
                                </video>
                            )
                        } else {
                            return <Image src={url} style={{ maxWidth: '70px', marginLeft: '10px' }} />
                        }
                    })}
            </div>
        )
    },
    {
        title: 'Link',
        dataIndex: 'linkes',
        key: 'linkes',
        align: 'center',
        width: '100',
        render: (text, item) => (
            <div>
                {isJSON(text)
                    ? JSON.parse(text).map((url, index) => {
                          return (
                              <a href={url} target='_blank'>
                                  {url}
                              </a>
                          )
                      })
                    : text}
            </div>
        )
    }
    // {
    //     title: 'postStartTime',
    //     dataIndex: 'post_start_time',
    //     key: 'post_start_time',
    //     align: 'center'
    // },
    // {
    //     title: 'postCloseTime',
    //     dataIndex: 'post_close_time',
    //     key: 'post_close_time',
    //     align: 'center'
    // }
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
                    <Form.Item name='key' label='Key'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='status' label='Task status'>
                        <Select allowClear>
                            <Option value='0'>closed</Option>
                            <Option value='1'>new task</Option>
                            <Option value='3'>pending for review</Option>
                            <Option value='4'>resubmit evidence</Option>
                            <Option value='5'>task approved</Option>
                            <Option value='7'>pending for content review</Option>
                            <Option value='8'>resubmit content</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='user' label='User'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='campaign_id' label='Campaign ID'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='type' label='Campaign type'>
                        <Select allowClear>
                            <Option value='1'>CPA</Option>
                            <Option value='3'>Branding</Option>
                            <Option value='4'>abComo</Option>
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
            title='Modify Reward Amount'
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
                <Form.Item name='amount' label='reward amount' rules={[{ required: true }]}>
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
        taskId: null
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
        console.log('parasm')
        const { pagination, search } = state
        setState({ ...state, loading: true })
        APIFindTasks({ taskJson: JSON.stringify(getCleanedParams(params)) })
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
        console.log('datammm', data)
        let taskId = state.taskId
        console.log('taskId', taskId)
        let params = {
            id: taskId,
            amount: data.amount
        }
        APIModifyRewardAmount(params).then(resp => {
            message.success('success')
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const edit = data => {
        console.log('data', data)
        var url = webhost + '/taskDetail/' + data.id
        var win = window.open(url, '_blank')
        win.focus()
    }

    const rowSelection = () => {}

    const closeTask = data => {
        console.log('close task', data)
        APICloseTask({ id: data.id }).then(resp => {
            message.success('close success')
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const ModifyRewardAmount = item => {
        setState({
            ...state,
            visible: true,
            taskId: item.id
        })
    }

    const gotoNewEdition = () => {
        props.history.push('/tasks_ma/tasks_new')
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
                <WebBreadcrumb arr={['Task List']} />
                <h3>Task List</h3>
                <a onClick={gotoNewEdition}>Go to new edition</a>
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
                                columns={columns(edit, closeTask, ModifyRewardAmount)}
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
