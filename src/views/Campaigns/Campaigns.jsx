import React, { useEffect, useState } from 'react'
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
    Badge,
    Image,
    Tooltip,
    Tabs
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
    APIModifyCampaignContent,
    APIGetCampaignContent
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { render } from 'react-dom'
import { getYearMonthDayTimeNew, getCleanedParams } from '@/tools/help.js'
import Aset from '@/imgs/aset1.png'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import webhost from '@/tools/webhost.js'
import { FormOutlined, MinusCircleOutlined, CheckCircleOutlined, PushpinOutlined } from '@ant-design/icons'
import HeaderC from '@/components/HeaderC'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

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

const columns = (edit, rtfEdit) => [
    {
        title: 'Action',
        dataIndex: 'edit',
        key: 'edit',
        width: 100,
        align: 'center',
        render: (text, item) => (
            <>
                <a
                    className='action-btn'
                    onClick={() => {
                        edit(item)
                    }}>
                    <FormOutlined />
                    <span style={{ marginLeft: '4px' }}>Edit</span>
                </a>
                <a
                    className='action-btn'
                    onClick={() => {
                        rtfEdit(item)
                    }}>
                    <FormOutlined />
                    <span style={{ marginLeft: '4px' }}>Ref Edit</span>
                </a>
            </>
        )
    },
    {
        title: 'Campaign ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        align: 'center',
        render: (text, item) => <span className='table-id'>{text}</span>
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
        title: 'Language',
        dataIndex: 'language',
        key: 'language',
        align: 'center',
        render: (text, item) => (
            <span>
                {text == 1
                    ? 'English'
                    : text == 2
                    ? 'French'
                    : text == 3
                    ? 'Spanish'
                    : text == 4
                    ? 'Polish'
                    : text == 5
                    ? 'Portuguese'
                    : ''}
            </span>
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
        title: 'Banner',
        dataIndex: 'banner',
        key: 'banner',
        align: 'center',
        render: (text, item) => (
            <div style={{ display: 'flex' }}>
                {text &&
                    JSON.parse(text).map((url, index) => {
                        return (
                            <a href={url} target='_blank'>
                                <img src={url} key={index} className='table-img' />
                            </a>
                        )
                    })}
            </div>
        )
    },
    {
        title: 'Campaign status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, item) => (
            <div style={{ width: '200px' }}>
                <Badge
                    status={
                        text == 1 || text == 2 ? 'success' : text == 4 ? 'processing' : text == 0 ? 'error' : 'default'
                    }
                />
                <span>
                    {text == 0
                        ? 'Campaign expired'
                        : text == 1
                        ? 'Campaign Posting'
                        : text == 2
                        ? 'Campaign Onging'
                        : text == 3
                        ? 'Campaign Created'
                        : text == 4
                        ? 'Campaign Draft'
                        : text == 5
                        ? 'Campaign on hold'
                        : ''}
                </span>
            </div>
        )
    },
    {
        title: 'Created by',
        dataIndex: 'created_by',
        key: 'created_by',
        align: 'center',
        render: (text, item) => (
            <div style={{ width: '150px' }}>
                <HeaderC name={text} style={{ display: 'inline-block' }} />
                <span>{text}</span>
            </div>
        )
    },

    {
        title: 'Code left',
        dataIndex: 'surplus_code_number',
        key: 'surplus_code_number',
        align: 'center',
        render: (text, item) =>
            text < 10 && item.language == 1 ? (
                <span style={{ color: 'rgb(232,18,18)' }}>!{text}</span>
            ) : (
                <span>{text}</span>
            )
    },
    {
        title: 'With Sample',
        dataIndex: 'with_sample',
        key: 'with_sample',
        width: '100',
        align: 'center',
        render: (text, item) =>
            text == 1 ? (
                <span className='table-row-no'>
                    <MinusCircleOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    no
                </span>
            ) : (
                <span className='table-row-yes'>
                    <CheckCircleOutlined style={{ color: '#33d6bb', fontSize: '13px', marginRight: '3px' }} />
                    yes
                </span>
            )
    },
    {
        title: 'Pin',
        dataIndex: 'set_top',
        key: 'set_top',
        align: 'center',
        width: '100',
        render: (text, item) =>
            text == 1 ? (
                <span className='table-row-no'>
                    <MinusCircleOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                    no
                </span>
            ) : (
                <span className='table-row-yes'>
                    <CheckCircleOutlined style={{ color: '#33d6bb', fontSize: '13px', marginRight: '3px' }} />
                    yes
                </span>
            )
    },
    {
        title: 'Country',
        dataIndex: 'country_list',
        key: 'country_list',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <>
                {text &&
                    JSON.parse(text).map((tag, index) => (
                        <span className='table-id-block' key={index}>
                            {tag.toUpperCase()}
                        </span>
                    ))}
            </>
        )
    },
    {
        title: 'Start',
        dataIndex: 'start_time',
        key: 'start_time',
        align: 'center',
        width: 170
        // render: (text, item) => <div>{text ? getYearMonthDayTimeNew(text) : ''}</div>
    },
    {
        title: 'End',
        dataIndex: 'close_time',
        key: 'close_time',
        align: 'center',
        width: 170
        // render: (text, item) => <div>{text ? getYearMonthDayTimeNew(text) : ''}</div>
    },
    {
        title: 'Merchant',
        dataIndex: 'merchant_name',
        key: 'merchant_name',
        align: 'center',
        width: 100,
        render: (text, item) => (
            <div>
                <Image src={item.merchant} style={{ maxHeight: 60, overflow: 'hidden' }} />
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
        props.changeSearch(values)
    }

    const [language, setLanguage] = useState([
        { name: 'English', value: 'English' },
        { name: 'French', value: 'French' },
        { name: 'Spanish', value: 'Spanish' },
        { name: 'Polish', value: 'Polish' },
        { name: 'Portuguese', value: 'Portuguese' }
    ])

    return (
        <Form
            {...searchLayout}
            form={form}
            name='advanced_search'
            className='ant-advanced-search-form'
            onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={10}>
                    <Form.Item name='title' label='Campaign title'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={11}>
                    <Form.Item name='status' label='Campaign status'>
                        <Select allowClear>
                            <Option value='0'>expired</Option>
                            <Option value='1'>posting</Option>
                            <Option value='2'>onging</Option>
                            <Option value='3'>created</Option>
                            <Option value='4'>draft</Option>
                            <Option value='5'>on hold</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                    <Form.Item name='type' label='Campaign type'>
                        <Select allowClear>
                            <Option value='1'>CPA</Option>
                            <Option value='3'>Branding</Option>
                            <Option value='4'>abComo</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={11}>
                    <Form.Item name='language' label='Campaign language'>
                        <Select allowClear>
                            {language.map(item => {
                                return (
                                    <Option key={item.value} value={item.name}>
                                        {item.name}
                                    </Option>
                                )
                            })}
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

    const [state, setState] = useState({
        editorState: BraftEditor.createEditorState(''),
        outputHTML: ''
    })

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
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
        // if (Object.keys(formData).length) {
        //     form.setFieldsValue(formData)
        // } else {
        //     form.resetFields()
        // }
        console.log('formData', formData)
        let campaignId = formData.id
        if (campaignId) {
            APIGetCampaignContent({ campaignId: campaignId }).then(resp => {
                console.log('xixixix')
                setState({
                    ...state,
                    editorState: BraftEditor.createEditorState(resp.data.Campaign_content)
                })
            })
        }
    }, [formData])

    const editorChange = editorState => {
        setState(prevState => {
            return { ...prevState, editorState, outputHTML: editorState.toHTML() }
        })
    }

    return (
        <Modal
            visible={visible}
            title='Campaign content  rtf'
            okText='Submit'
            width={1100}
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onCreate({
                            id: formData.id,
                            campaign_content: state.outputHTML
                        })
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item label='Campaign Content' rules={[{ required: true }]}>
                    <BraftEditor value={state.editorState} onChange={editorChange} />
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
        console.log('params', params)
        setState({
            ...state,
            loading: true
        })
        APIGetCampaignsList({ campaignJson: JSON.stringify(getCleanedParams(params)) })
            .then(resp => {
                setState({
                    ...state,
                    visible: false,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    search: params.search,
                    pagination: {
                        // ...state.pagination,
                        current: params.start_row / params.page_size + 1,
                        pageSize: params.page_size,
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
            search: state.search,
            page_size: pagination.pageSize,
            start_row: pagination.pageSize * (pagination.current - 1)
        }
        console.log('changepaams', params)
        getList(params)
    }

    const changeSearch = search => {
        const params = { ...search, page_size: 10, start_row: 0, search }
        getList(params)
        // setState({
        //     ...state,
        //     ...search
        // })
    }

    const exportRecord = () => {
        APIexportRewardRecord()
            .then(xhr => {
                return
            })
            .catch((err, status, xhr) => {})
    }

    const onCreate = data => {
        console.log('data....', data)
        data.campaign_content =
            "<div style=' padding: 60px;background-color: #fff;color: #666;'>" + data.campaign_content + '</div>'
        APIModifyCampaignContent({
            campaignId: data.id,
            content: data.campaign_content
        }).then(resp => {
            message.success('success')
            const params = { start_row: 0, page_size: state.pagination.pageSize }
            getList(params)
        })
    }

    const createCampaigns = () => {
        props.history.push({
            pathname: '/createCampaign/0',
            query: {}
        })
        sessionStorage.setItem('query', JSON.stringify({}))
    }

    const createCampaignsNew = () => {
        props.history.push({
            pathname: '/createCampaignNew/0',
            query: {}
        })
        sessionStorage.setItem('query', JSON.stringify({}))
    }

    const edit = data => {
        let url
        console.log('data.is_new_campaign', data.is_new_campaign)
        if (data.is_new_campaign) {
            url = webhost + '/createCampaignNew/' + data.id
        } else {
            url = webhost + '/createCampaign/' + data.id
        }
        var win = window.open(url, '_blank')
        win.focus()
    }

    const rtfEdit = data => {
        // data.campaign_content = "<div style=' padding: 0 20px;background: #fff;'>"+data.campaign_content+"</div>"
        // console.log('datat',data)

        setState({
            ...state,
            visible: true,
            formData: data
        })
    }

    const rowSelection = () => {}

    const expandedRowRender = data => {
        console.log('expandedRowRender', data)
        const columns = edit => [
            {
                title: 'Action',
                dataIndex: 'edit',
                key: 'edit',
                width: 100,
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
                title: 'Campaign ID',
                dataIndex: 'id',
                key: 'id',
                width: 100,
                align: 'center',
                render: (text, item) => <span className='table-id'>{text}</span>
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
                title: 'Language',
                dataIndex: 'language',
                key: 'language',
                align: 'center',
                render: (text, item) => (
                    <span>
                        {text == 1
                            ? 'English'
                            : text == 2
                            ? 'French'
                            : text == 3
                            ? 'Spanish'
                            : text == 4
                            ? 'Polish'
                            : text == 5
                            ? 'Portuguese'
                            : ''}
                    </span>
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
                title: 'Banner',
                dataIndex: 'banner',
                key: 'banner',
                align: 'center',
                render: (text, item) => (
                    <div style={{ display: 'flex' }}>
                        {text &&
                            JSON.parse(text).map((url, index) => {
                                return (
                                    <a href={url} target='_blank'>
                                        <img src={url} key={index} style={{ width: '60px', marginLeft: '5px' }} />
                                    </a>
                                )
                            })}
                    </div>
                )
            },
            {
                title: 'Campaign status',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text, item) => (
                    <div style={{ width: '200px' }}>
                        <Badge
                            status={
                                text == 1 || text == 2
                                    ? 'success'
                                    : text == 4
                                    ? 'processing'
                                    : text == 0
                                    ? 'error'
                                    : 'default'
                            }
                        />
                        <span>
                            {text == 0
                                ? 'Campaign expired'
                                : text == 1
                                ? 'Campaign Posting'
                                : text == 2
                                ? 'Campaign Onging'
                                : text == 3
                                ? 'Campaign Created'
                                : text == 4
                                ? 'Campaign Draft'
                                : text == 5
                                ? 'Campaign on hold'
                                : ''}
                        </span>
                    </div>
                )
            },
            {
                title: 'Created by',
                dataIndex: 'created_by',
                key: 'created_by',
                align: 'center',
                render: (text, item) => (
                    <div style={{ width: '150px' }}>
                        <HeaderC name={text} style={{ display: 'inline-block' }} />
                        <span>{text}</span>
                    </div>
                )
            },

            {
                title: 'Code left',
                dataIndex: 'surplus_code_number',
                key: 'surplus_code_number',
                align: 'center',
                render: (text, item) =>
                    text < 10 && item.language == 1 ? (
                        <span style={{ color: 'rgb(232,18,18)' }}>!{text}</span>
                    ) : (
                        <span>{text}</span>
                    )
            },
            {
                title: 'With Sample',
                dataIndex: 'with_sample',
                key: 'with_sample',
                width: '100',
                align: 'center',
                render: (text, item) =>
                    text == 1 ? (
                        <span className='table-row-no'>
                            <MinusCircleOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                            no
                        </span>
                    ) : (
                        <span className='table-row-yes'>
                            <CheckCircleOutlined style={{ color: '#33d6bb', fontSize: '13px', marginRight: '3px' }} />
                            yes
                        </span>
                    )
            },
            {
                title: 'Pin',
                dataIndex: 'set_top',
                key: 'set_top',
                align: 'center',
                width: '100',
                render: (text, item) =>
                    text == 1 ? (
                        <span className='table-row-no'>
                            <MinusCircleOutlined style={{ color: '#f85c5a', fontSize: '13px', marginRight: '3px' }} />
                            no
                        </span>
                    ) : (
                        <span className='table-row-yes'>
                            <CheckCircleOutlined style={{ color: '#33d6bb', fontSize: '13px', marginRight: '3px' }} />
                            yes
                        </span>
                    )
            },
            {
                title: 'Country',
                dataIndex: 'country_list',
                key: 'country_list',
                width: '100',
                align: 'center',
                render: (text, item) => (
                    <>
                        {text &&
                            JSON.parse(text).map((tag, index) => {
                                return (
                                    <span className='table-id' key={index}>
                                        {tag.toUpperCase()}
                                    </span>
                                )
                            })}
                    </>
                )
            },
            {
                title: 'Start',
                dataIndex: 'start_time',
                key: 'start_time',
                align: 'center'
                // render: (text, item) => <div>{text ? getYearMonthDayTimeNew(text) : ''}</div>
            },
            {
                title: 'End',
                dataIndex: 'close_time',
                key: 'close_time',
                align: 'center'
                // render: (text, item) => <div>{text ? getYearMonthDayTimeNew(text) : ''}</div>
            },
            {
                title: 'Merchant',
                dataIndex: 'merchant_name',
                key: 'merchant_name',
                align: 'center',
                width: 100,
                render: (text, item) => (
                    <div>
                        <Image src={item.merchant} style={{ maxHeight: 60, overflow: 'hidden' }} />
                        <span>{text}</span>
                    </div>
                )
            }
        ]

        const edit = data => {
            // console.log('data', data)
            // props.history.push({
            //     pathname: '/createCampaign',
            //     query: { ...data }
            // })
            // sessionStorage.setItem('query', JSON.stringify(data))
            let url
            console.log('data.is_new_campaign', data.is_new_campaign)
            if (data.is_new_campaign) {
                url = webhost + '/createCampaignNew/' + data.id
            } else {
                url = webhost + '/createCampaign/' + data.id
            }
            var win = window.open(url, '_blank')
            win.focus()
        }

        return <Table columns={columns(edit)} dataSource={data.childCampaignList} pagination={false} bordered />
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
            <WebBreadcrumbNew title='Campaign List' />
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
                                            createCampaigns()
                                        }}>
                                        New Campaign
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={() => {
                                            createCampaignsNew()
                                        }}>
                                        New Campaign 2.0
                                    </Button>
                                </Col>
                            </Row>
                            <Table
                                columns={columns(edit, rtfEdit)}
                                expandable={{ expandedRowRender }}
                                rowKey={record => record.key}
                                dataSource={state.list}
                                bordered
                                size='small'
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
