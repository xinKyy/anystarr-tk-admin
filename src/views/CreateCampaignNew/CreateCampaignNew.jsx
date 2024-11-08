import React, { useState, useEffect } from 'react'
import {
    Layout,
    Row,
    Col,
    Divider,
    Select,
    Form,
    Input,
    Button,
    Checkbox,
    message,
    Switch,
    DatePicker,
    Upload,
    List,
    Avatar,
    Spin,
    Alert,
    Radio,
    Space,
    Table,
    Image,
    Card,
    Steps,
    Result,
    InputNumber,
    Popconfirm,
    Progress
} from 'antd'
import moment from 'moment'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import HeaderC from '@/components/HeaderC'
import '@/style/view-style/index.less'
import {
    APIcreateArea,
    APIGetCountryList,
    APICreateModifyCampaign,
    APIUploadFile,
    APIUploadPromoCode,
    APIOnHoldAction,
    APIGetCampaignDetail,
    APIGetAllMerchant,
    APIUploadWhiteList,
    APIDownloadWhiteList,
    APIDownloadpromoCode,
    APICreateOrModifyDraftCampaign,
    APIFindAllCategory,
    APICreateCampaign,
    APIModifyCampaign,
    APIGetProductList,
    APIGetTaskModule,
    APIAddTaskFlow,
    APIEditTaskFlow,
    APICampaignDetailNew,
    APIDeleteTaskFlow,
    APITranslateCampaign
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import {
    UploadOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    EditOutlined,
    MinusCircleOutlined
} from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { query, type } from 'koa/lib/request'
import { getKeyList } from '@/tools/action.js'
import { getYearMonthDayTimeNew, getCleanedParams, getYearMonthDayNormal } from '@/tools/help.js'
import TextArea from 'antd/lib/input/TextArea'
import webhost from '@/tools/webhost.js'
import { set } from 'js-cookie'
import Modal from 'antd/lib/modal/Modal'
import step1 from '../../imgs/step1.png'
import step2 from '../../imgs/step2.png'
import step3 from '../../imgs/step3.png'
import step1Detail from '../../imgs/step1_detail.png'

const { RangePicker } = DatePicker
const { Step } = Steps

const layout = {
    labelCol: {
        span: 12
    },
    wrapperCol: {
        span: 23
    }
}
const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 16
    }
}
const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }]
}
const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!'
        }
    ]
}

const { Option } = Select

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const template2 =
    'step1: apply and receive sample ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const template3 = 'step1: short video ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const channelList = [
    { label: 'Facebook', value: 'Facebook,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/Facebook.svg' },
    { label: 'Instagram', value: 'Instagram,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/instagram.svg' },
    { label: 'Pinterest', value: 'Pinterest,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/pinterest.svg' },
    { label: 'Reddit', value: 'Reddit,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/reddit.svg' },
    { label: 'Snapchat', value: 'Snapchat,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/snapchat.svg' },
    { label: 'Telegram', value: 'Telegram,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/telegram.svg' },
    { label: 'TikTok', value: 'TikTok,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/tiktok.svg' },
    { label: 'Twitter', value: 'Twitter,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/twitter.svg' },
    { label: 'YouTube', value: 'YouTube,https://anystarr.s3.eu-west-3.amazonaws.com/imgs/youtube.svg' },
    { label: 'IG story', value: 'IG story,tt' }
]

const searchLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled, moduleList, setPropsPromoCode, props }) => {
    const [form] = Form.useForm()
    const [promoCode, setPromoCode] = useState([])

    const layout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 23 }
    }
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                message: 'Please select time!'
            }
        ]
    }
    const [state, setState] = useState({
        moduleType: 0,
        selectModule: {},
        taskAvailablePromoCode: [],
        taskJustUploadPromoCode: []
    })

    useEffect(() => {
        console.log('formData', formData)
        let promoCodeList = formData.promo_code_list ? JSON.parse(formData.promo_code_list) : []
        let taskAvailablePromoCode = promoCodeList.filter(item => {
            return item.status == 1
        })
        form.setFieldsValue({
            example: formData.example,
            flow_rule: formData.flow_rule,
            flow_rule_info: formData.flow_rule_info,
            deadline: formData.deadline ? moment(formData.deadline) : '',
            module_id: formData.module_id,
            id: formData.id,
            module_name: formData.module_name,
            post_guidelines: formData.post_guidelines,
            description: formData.description,
            steps: formData.steps,
            type: formData.type,
            post_on_instagram: formData.post_on_instagram == 1 ? true : false,
            allow_skip: formData.allow_skip == 1 ? true : false,
            discount: formData.discount,
            promo_code_rules: formData.promo_code_rules,
            order_requirement: formData.order_requirement
        })
        setState({
            ...state,
            moduleType: formData.module_id,
            taskAvailablePromoCode: taskAvailablePromoCode
        })
        setPromoCode(promoCodeList)
    }, [formData])

    const selectModuleType = data => {
        let selectModule = moduleList.filter(item => {
            return item.id === data
        })
        let resSelectModule = selectModule[0] ? selectModule[0] : {}

        console.log('resSelectModule', resSelectModule)
        console.log('data', data)
        setState({
            ...state,
            moduleType: data,
            selectModule: resSelectModule
        })
        form.setFieldsValue({
            module_id: resSelectModule.id,
            module_name: resSelectModule.module_name
        })
    }

    const downloadPromoCode = () => {
        APIDownloadpromoCode({
            id: props.match.params.id
        }).then(resp => {
            message.success('Sent successfully')
        })
    }

    const uploadPromoCode = ({ file, onSuccess }) => {
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisiblePromo: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisiblePromo: true
                })
            }
        }, 100)
        APIUploadPromoCode({ file: file }).then(resp => {
            // onSuccess()
            setPromoCode(resp.data.data)
            setPropsPromoCode(resp.data.data)
            clearInterval(timer)
            setState({
                ...state,
                uploadProgress: 0,
                uploadProgressVisiblePromo: false,
                taskJustUploadPromoCode: resp.data.data
            })
        })
    }

    const deletePromoCode = () => {
        setPromoCode([])
    }

    return (
        <Modal
            visible={visible}
            width={900}
            title='task module'
            okText='Submit'
            className='task-flow-modal'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        values.promo_code_list = promoCode ? JSON.stringify(promoCode) : '[]'
                        values.description = values.description ? values.description : ''
                        values.discount = values.discount ? values.discount : ''
                        values.order_requirement = values.order_requirement ? values.order_requirement : ''
                        values.promo_code_rules = values.promo_code_rules ? values.promo_code_rules : ''
                        onCreate(values)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form form={form} name='form_in_modal' layout='vertical' {...layout}>
                <Row>
                    <Col span={12}>
                        <Form.Item name='module_id' label='Module type'>
                            <Select onChange={selectModuleType}>
                                {moduleList.map((item, index) => {
                                    return <Option value={item.id}>{item.module_name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className='hide-form'>
                    <Col span={12}>
                        <Form.Item name='module_id' label='Module ID'>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name='id' label='ID'>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
                {
                    state.moduleType == 4 ?
                        <>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='target_url' label='Target Url'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='medium' label='medium'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='campaign_name' label='Campaign Name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </> : null
                }
                <Row>
                    <Col span={12}>
                        <Form.Item name='steps' label='Call for action'>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name='flow_rule' label='Explanation'>
                            <TextArea placeholder='; Wrap' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name='flow_rule_info' label='Explanation detail'>
                            <Input placeholder='; Wrap' />
                        </Form.Item>
                    </Col>
                </Row>
                {state.moduleType == 1 ? null : (
                    <Row>
                        <Col span={12}>
                            <Form.Item name='description' label='File requirement'>
                                <TextArea placeholder='; Wrap' />
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                {state.moduleType == 1 ? (
                    <>
                        <Row>
                            <Col span={7}>
                                <Form.Item name='promo_code_list' label='Promo code list'>
                                    <Upload customRequest={uploadPromoCode}>
                                        <Button icon={<UploadOutlined />}>Click to Upload promo code</Button>
                                    </Upload>
                                </Form.Item>
                                {state.uploadProgressVisiblePromo ? (
                                    <Progress percent={state.uploadProgress} className='file-upload-progress' />
                                ) : null}
                            </Col>
                            <Col span={7} className='task-flow-flex-item'>
                                [# of avaliable promo codes]:{' '}
                                {state.taskAvailablePromoCode && state.taskAvailablePromoCode.length}
                            </Col>
                            <Col span={7} className='task-flow-flex-item'>
                                [# promo code just upload]:
                                {state.taskJustUploadPromoCode && state.taskJustUploadPromoCode.length}
                            </Col>
                            <Col span={3} className='task-flow-flex-item'>
                                <Button type='primary' onClick={downloadPromoCode}>
                                    Download
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={18}>
                                <Form.Item name='promo_code_rules' label='Promo code rules'>
                                    <TextArea placeholder=';Wrap' />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item name='discount' label='Discount'>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='order_requirement' label='Order requirement'>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                ) : null}

                <Row>
                    <Col span={12}>
                        <Form.Item name='deadline' label='Deadline'>
                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={18}>
                        <Form.Item
                            name='allow_skip'
                            label='Skip when sample application rejected'
                            valuePropName='checked'>
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}></Col>
                </Row>

                {state.moduleType == 1 ? (
                    <></>
                ) : state.moduleType == 2 ? null : state.moduleType == 3 ? (
                    <Form.Item name='post_on_instagram' label='fast post on instagram' valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                ) : null}
            </Form>
        </Modal>
    )
}

const TaskFlowColumn = () => [
    {
        title: 'Flow ID',
        dataIndex: 'flow_id',
        key: 'flow_id',
        align: 'center'
    },
    {
        title: 'Module ID',
        dataIndex: 'module_id',
        key: 'module_id',
        align: 'center'
    },
    {
        title: 'Steps',
        dataIndex: 'steps',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
        align: 'center'
    },
    {
        title: 'Flow Rule',
        dataIndex: 'flow_rule',
        key: 'flow_rule',
        align: 'center'
    },
    {
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
        align: 'center'
    },
    {
        title: 'Allow Skip',
        dataIndex: 'allow_skip',
        key: 'allow_skip',
        align: 'center'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Create Time',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center'
    },
    {
        title: 'Update Time',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'center'
    }
]

const ProductColumn = () => [
    // {
    //     title: 'Product id',
    //     dataIndex: 'product_id',
    //     key: 'product_id',
    //     align: 'center'
    // },
    {
        title: 'Product image',
        dataIndex: 'img_url',
        key: 'img_url',
        align: 'center',
        render: (text, item) => <Image src={text} style={{ maxWidth: '30px', marginLeft: '10px' }}></Image>
    },
    {
        title: 'Product title',
        dataIndex: 'product_name',
        key: 'product_name',
        width: '100',
        align: 'center'
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '100',
        align: 'center',
        render: (text, item) => (text == 1 ? <span>in stock</span> : <span> out of stock</span>)
    },
    {
        title: 'Category',
        dataIndex: 'category_name',
        key: 'category_name',
        width: '100',
        align: 'center'
    },
    {
        title: 'Product Link',
        dataIndex: 'product_url',
        key: 'product_url',
        width: '100',
        align: 'center',
        render: (text, item) => (
            <a style={{ width: '140px' }} href={text} target='_blank'>
                open in new web
            </a>
        )
    },
    {
        title: 'Product Code Number',
        dataIndex: 'productCodeNum',
        key: 'productCodeNum',
        align: 'center',
        render: (text, item) =>
            text == 0 ? (
                <span className='table-error-red'>{text}</span>
            ) : (
                <span className='table-normal-green'>{text}</span>
            )
    },
    {
        title: 'Product tag',
        dataIndex: 'tag',
        key: 'tag',
        width: '100',
        align: 'center'
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
                    <Form.Item name='is_show_app' label='Pinned'>
                        <Select allowClear>
                            <Option value={1}>Pinned</Option>
                            <Option value={0}>Non-Pinned</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='category' label='Category'>
                        <Select>
                            <Option value={1}>Pinned</Option>
                            <Option value={0}>Non-Pinned</Option>
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

const SampleModal = ({ visible, onCreate, onCancel, addToSampleList }) => {
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
        },
        getCheckboxProps: record => ({
            disabled: record.productCodeNum == 0,
            // Column configuration not to be checked
            name: record.name
        })
    }

    return (
        <Modal
            visible={visible}
            title='Feature Product'
            okText='Submit'
            width={1000}
            onOk={() => {
                // onCreateNew(selectObj)
                console.log('select', selectObj)
                addToSampleList(selectObj)
            }}
            cancelText='Cancel'
            onCancel={onCancel}>
            <div style={{ marginBottom: '15px' }}>
                <SearchBar changeSearch={changeSearch} loading={state.loading} />
            </div>
            <Table
                size='small'
                columns={ProductColumn()}
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

const CreateCampaignNew = props => {
    const [state, setState] = useState({
        editorState: BraftEditor.createEditorState(''),
        outputHTML: '',
        bannerList: [],
        postExampleList: [],
        imageShareList: [],
        promoCodeList: [],
        operationList: [],
        enableWhiteList: false,
        whiteList: [],
        id: '',
        leftCode: 0,
        sampleList: [],
        withSample: false,
        merchantName: '',
        loading: true,
        sampleModal: false,

        taskFlowExtList: [],
        taskFlowModal: false,
        taskModuleData: {},
        stepCurrent: 0,
        taskFlowId: null,
        rewardsList: [],
        earningsList: [],
        uploadProgress: 0,
        uploadProgressVisible: false,
        uploadProgressVisiblePromo: false,
        uploadProgressVisibleWhite: false,
        uploadProgressVisiblePost: false,
        uploadProgressVisibleShare: false,
        editTaskIndex: -1,
        screenShotsSwitch: false,
        sampleType: 1
    })

    const [moduleListState, setModuleState] = useState([])

    const [stepsState, setStepsState] = useState({
        step1: '',
        step2: '',
        step3: ''
    })

    const [formState, setFormState] = useState({})
    const [form] = Form.useForm()
    const [country, setCountry] = useState([{ name: 'china', value: '1' }])
    const [language, setLanguage] = useState([
        { name: 'English', value: 1 },
        { name: 'French', value: 2 },
        { name: 'Spanish', value: 3 },
        { name: 'Polish', value: 4 },
        { name: 'Portuguese', value: 5 },
        { name: 'Arabic', value: 6 }
    ])
    const [merchant, setMerchant] = useState([])
    const [taskDes, setTaskDes] = useState(' ')
    // const [promoCode, setPromoCode] = useState([])
    const [skuList, setSkuList] = useState([])

    let { editorState, outputHTML } = state

    const submitTaskFlow = values => {
        let queryId = props.match.params.id
        let taskFlowId = state.taskFlowId
        let id = queryId !== '0' ? queryId : state.id
        if (id === '') {
            return message.info('please complate step 1')
        }
        console.log('taskFlowExtList', state.taskFlowExtList)
        console.log('父级promo code', state.promoCodeList)
        let resTaskFlowExtList = state.taskFlowExtList.map((item, index) => {
            item.deadline = item.deadline
                ? item.deadline._isAMomentObject
                    ? item.deadline.format('YYYY-MM-DD HH:mm:ss')
                    : item.deadline
                : ''

            if (item.module_id == 1) {
                item.promo_code_list =
                    state.promoCodeList && state.promoCodeList.length ? JSON.stringify(state.promoCodeList) : null
                return item
            } else {
                return item
            }
        })
        console.log('resTaskFlowExtList submit', resTaskFlowExtList)

        let flowSequence = state.taskFlowExtList.map(item => {
            return item.module_id
        })
        console.log('flowSequence', flowSequence)
        APIEditTaskFlow(
            JSON.stringify({
                id: taskFlowId,
                flow_sequence: JSON.stringify(flowSequence),
                business_id: id ? Number(id) : id,
                taskFlowExtList: state.taskFlowExtList
            })
        ).then(resp => {
            props.history.push('/campaigns_ma/campaigns')
        })
    }

    const onFinish = values => {
        console.log('valussss', values)
        let isCopy = getQueryString('copy')

        console.log('sss', state.stepCurrent)
        if (state.stepCurrent == 1) {
            return submitTaskFlow(values)
        }

        values = {
            ...values,
            start_time: values['start_time'].format('YYYY-MM-DD HH:mm:ss'),
            close_time: values['close_time'].format('YYYY-MM-DD HH:mm:ss'),
            post_start_time: values['post_start_time'] ? values['post_start_time'].format('YYYY-MM-DD HH:mm:ss') : '',
            post_close_time: values['post_close_time'] ? values['post_close_time'].format('YYYY-MM-DD HH:mm:ss') : '',
            task_start_time: values['task_start_time'] ? values['task_start_time'].format('YYYY-MM-DD HH:mm:ss') : '',
            task_close_time: values['task_close_time'] ? values['task_close_time'].format('YYYY-MM-DD HH:mm:ss') : '',
            // content_upload_end: values['content_upload_end'].format('YYYY-MM-DD HH:mm:ss'),
            // social_post_end: values['social_post_end'].format('YYYY-MM-DD HH:mm:ss'),

            banner: JSON.stringify(state.bannerList),
            merchant_name: state.merchantName,
            post_example: JSON.stringify(state.postExampleList),
            image_for_share: JSON.stringify(state.imageShareList),
            rules_description: editorState.toHTML(),
            task_description: taskDes,
            show_merchant: values.show_merchant ? 1 : 0,

            show_sample: values.show_sample ? 1 : 0,
            screen_shots_switch: values.screen_shots_switch ? 1 : 0,
            is_whitelist: values.is_whitelist ? 1 : 0,
            set_top: values.set_top ? 1 : 0,
            allow_app_only: values.allow_app_only ? 1 : 0,
            white_list: JSON.stringify(state.whiteList),
            country_list: values.country_list ? JSON.stringify(values.country_list) : JSON.stringify([]),
            steps: JSON.stringify(stepsState),
            sample_rule: values.sample_rule_cam + ';' + values.sample_rule_task,
            taskFlowReq: {
                taskFlowExtList: state.taskFlowExtList
            }
        }
        if (values.with_sample == 1) {
            values.sample_list = JSON.stringify(state.sampleList)
        }
        if (!values.with_sample) {
            values.with_sample = 0
        }
        values.parent_id = 0
        values.taskFlowReq = {
            flow_swquence: '[]',
            taskFlowExtList: null
        }
        values.rewards = JSON.stringify(state.rewardsList)
        values.earnings = JSON.stringify(state.earningsList)

        if (props.match.params.id == '0') {
            APICreateCampaign(JSON.stringify(values)).then(resp => {
                Modal.confirm({
                    title: 'Create successfully, Go to Step 2 ?',
                    cancelText: 'Stay on this page',
                    onCancel: () => { },
                    onOk: () => {
                        console.log('ok')
                        setState({
                            ...state,
                            stepCurrent: 1,
                            id: resp.data.result.campaignId,
                            taskFlowId: resp.data.result.taskFlowId
                        })
                    }
                })
            })
        } else {
            if (isCopy == 'copy') {
                APICreateCampaign(JSON.stringify(values)).then(resp => {
                    props.history.push('/campaigns_ma/campaigns')
                })
            } else if (isCopy == 'derivation') {
                values.parent_id = props.match.params.id
                APICreateCampaign(JSON.stringify(values)).then(resp => {
                    props.history.push('/campaigns_ma/campaigns')
                })
            } else {
                values.id = Number(props.match.params.id)
                APIModifyCampaign(JSON.stringify(values)).then(resp => {
                    Modal.confirm({
                        title: 'Modify successfully, Go to Step 2 ?',
                        cancelText: 'Stay on this page',
                        onCancel: () => { },
                        onOk: () => {
                            console.log('ok')
                            setState({
                                ...state,
                                stepCurrent: 1
                            })
                        }
                    })
                })
            }
        }
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }

    const normFile = e => {
        console.log('Upload event:', e)

        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    const getCountryList = () => {
        APIGetCountryList().then(resp => {
            setCountry(resp.data.data)
        })
    }

    const getMerchant = () => {
        APIGetAllMerchant().then(resp => {
            setMerchant(resp.data.list)
        })
    }

    const setTaskDescription = () => { }

    const getQueryString = name => {
        var reg = new RegExp('(^|bai&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    }

    const isCopyV = getQueryString('copy')

    const initForm = () => {
        let id = props.match.params.id
        let isCopy = getQueryString('copy')
        if (id && id !== '0') {
            APICampaignDetailNew({ id }).then(resp => {
                let resData = resp.data.data
                let earnings = resData.earnings ? JSON.parse(resData.earnings) : {}
                let rewards = resData.rewards ? JSON.parse(resData.rewards) : {}
                let steps = resData.steps ? JSON.parse(resData.steps) : {}
                let sampleRuleArr = resData.sample_rule ? resData.sample_rule.split(';') : []
                form.setFieldsValue({
                    ...resData,
                    start_time: resData.start_time ? moment(resData.start_time) : '',
                    close_time: resData.close_time ? moment(resData.close_time) : '',
                    post_start_time: resData.post_start_time ? moment(resData.post_start_time) : '',
                    post_close_time: resData.post_close_time ? moment(resData.post_close_time) : '',
                    task_start_time: resData.task_start_time ? moment(resData.task_start_time) : '',
                    task_close_time: resData.task_close_time ? moment(resData.task_close_time) : '',
                    content_upload_end: resData.content_upload_end ? moment(resData.content_upload_end) : '',
                    social_post_end: resData.social_post_end ? moment(resData.social_post_end) : '',
                    qualifications: resData.qualifications ? Number(resData.qualifications) : 1,

                    country_list: resData.country_list ? JSON.parse(resData.country_list) : [],
                    language: isCopyV == 'derivation' ? '' : resData.language,
                    introduction: resData.introduction,
                    type: resData.type + '',
                    show_sample: resData.show_sample == 1 ? true : false,
                    show_merchant: resData.show_merchant == 1 ? true : false,
                    allow_app_only: resData.allow_app_only == 1 ? true : false,
                    screen_shots_switch: resData.screen_shots_switch == 1 ? true : false,
                    with_sample: resData.with_sample + '',
                    set_top: resData.set_top == 1 ? true : false,
                    status: resData.status + '',
                    proof_requirement: resData.proof_requirement + '',
                    id: isCopy ? null : id,
                    sample_rule_cam: sampleRuleArr[0] ? sampleRuleArr[0] : '',
                    sample_rule_task: sampleRuleArr[1] ? sampleRuleArr[1] : '',
                    banner: resData.banner && JSON.parse(resData.banner).length ? resData.banner : null
                })
                let banner = resData.banner ? JSON.parse(resData.banner) : []
                let postExample = resData.post_example ? JSON.parse(resData.post_example) : []
                let imageShare = resData.image_for_share ? JSON.parse(resData.image_for_share) : []

                setState({
                    ...state,
                    bannerList: banner,
                    postExampleList: postExample,
                    imageShareList: imageShare,
                    type: resData.type + '',
                    editorState: BraftEditor.createEditorState(resData.rules_description),
                    operationList: resData.operation_records,
                    enableWhiteList: resData.is_whitelist === 1 ? true : false,
                    whiteList: resData.white_list_detail,
                    id: isCopy ? null : id,
                    taskFlowId: resData.taskFlowRsp.id,
                    leftCode: resData.surplus_code_number,
                    withSample: resData.with_sample ? true : false,
                    sampleList: resData.sample_list ? JSON.parse(resData.sample_list) : [],
                    merchantName: resData.merchant_name,
                    screenShotsSwitch: resData.screen_shots_switch ? true : false,
                    loading: false,
                    taskFlowExtList: resData.taskFlowRsp.flowExtRsps ? resData.taskFlowRsp.flowExtRsps : [],
                    rewardsList: resData.rewards
                        ? JSON.parse(resData.rewards).length
                            ? JSON.parse(resData.rewards)
                            : []
                        : [],
                    earningsList: resData.earnings
                        ? JSON.parse(resData.earnings).length
                            ? JSON.parse(resData.earnings)
                            : []
                        : []
                })
                let description = resData.description ? JSON.parse(resData.description) : {}

                setStepsState({
                    ...stepsState,
                    step1: steps.step1,
                    step2: steps.step2,
                    step3: steps.step3
                })

                if (resData.type == 1 || resData.type == 4) {
                    setTaskDes(template1)
                }
                if (resData.type == 2) {
                    setTaskDes(template2)
                }
                setFormState(resData)
                setFormState({
                    ...resData,
                    id: isCopy ? null : id
                })
            })
            return
        } else {
            setState({
                ...state,
                loading: false
            })
        }
    }

    const setTypeTo = data => {
        console.log('setTypeTo', data)
        if (data == '1') {
            setTaskDes(template1)
        }
        if (data == '2') {
            setTaskDes(template2)
        }
        if (data == '3') {
            setTaskDes(template3)
        }
        if (data == '4') {
            setTaskDes(template1)
        }
        setState({
            ...state,
            type: data
        })
    }

    const uploadProps = {
        name: 'file',
        action: 'http://any.clubchopp.com/any-starr/common/upload/upload_pic',
        withCredentials: true,
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`)
            }
        }
    }

    const setSampleType = data => {
        console.log('data', data)
        setState({
            ...state,
            withSample: data == 1 ? true : false
        })
    }

    const uploadSample = ({ file, onSuccess }) => {
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisiblePost: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisiblePost: true
                })
            }
        }, 100)
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let sampleList = state.sampleList
            let picUrl = resp.data.url
            sampleList.push({ product_name: '', img_url: picUrl, sample_type: 2 })
            clearInterval(timer)
            setState({
                ...state,
                sampleList,
                uploadProgress: 0,
                uploadProgressVisiblePost: false
            })
        })
    }

    const changeSampleName = (index, e) => {
        let sampleList = state.sampleList
        sampleList[index].product_name = e.target.value
        setState({
            ...state,
            sampleList: sampleList
        })
    }

    const changeArticleNum = (index, e) => {
        let sampleList = state.sampleList
        sampleList[index].article_number = e.target.value
        setState({
            ...state,
            sampleList: sampleList
        })
    }

    const changeProductUrl = (index, e) => {
        let sampleList = state.sampleList
        sampleList[index].product_url = e.target.value
        setState({
            ...state,
            sampleList
        })
    }

    const deleteSample = index => {
        let sampleList = state.sampleList
        sampleList.splice(index, 1)
        setState({
            ...state,
            sampleList: sampleList
        })
    }

    const deleteFile = index => {
        let bannerList = state.bannerList
        bannerList.splice(index, 1)
        setState({
            ...state,
            bannerList: bannerList
        })
    }

    const uploadPostExample = ({ file, onSuccess }) => {
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisiblePost: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisiblePost: true
                })
            }
        }, 100)
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let postExampleList = state.postExampleList
            let picUrl = resp.data.url
            postExampleList.push(picUrl)
            clearInterval(timer)
            setState({
                ...state,
                postExampleList,
                uploadProgress: 0,
                uploadProgressVisiblePost: false
            })
        })
    }

    const deleteExample = index => {
        let postExampleList = state.postExampleList
        postExampleList.splice(index, 1)
        setState({
            ...state,
            postExampleList: postExampleList
        })
    }

    const uploadImageShare = ({ file, onSuccess }) => {
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisibleShare: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisibleShare: true
                })
            }
        }, 100)
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let imageShareList = state.imageShareList
            let picUrl = resp.data.url
            imageShareList.push(picUrl)
            clearInterval(timer)
            setState({
                ...state,
                imageShareList,
                uploadProgress: 0,
                uploadProgressVisibleShare: false
            })
        })
    }

    const deleteImageShare = index => {
        let imageShareList = state.imageShareList
        imageShareList.splice(index, 1)
        setState({
            ...state,
            imageShareList
        })
    }

    const uploadFile = ({ file, onSuccess }) => {
        // uid: '-1',
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisible: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisible: true
                })
            }
        }, 100)
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let bannerList = state.bannerList
            let picUrl = resp.data.url
            bannerList.push(picUrl)
            clearInterval(timer)
            setState({
                ...state,
                bannerList,
                uploadProgress: 0,
                uploadProgressVisible: false
            })
            form.setFieldsValue({
                banner: JSON.stringify(bannerList)
            })
        })
    }

    const uploadWhiteList = ({ file, onSuccess }) => {
        let id = props.match.params.id
        let params = {
            file: file
        }
        if (id) {
            params.id = id
        }
        let num = 0
        let timer = setInterval(() => {
            if (num >= 90) {
                setState({
                    ...state,
                    uploadProgress: 99,
                    uploadProgressVisibleWhite: true
                })
            } else {
                num = num + Math.floor(Math.random() * 5)
                setState({
                    ...state,
                    uploadProgress: num,
                    uploadProgressVisibleWhite: true
                })
            }
        }, 100)
        APIUploadWhiteList(params).then(resp => {
            message.success('upload success')
            clearInterval(timer)
            setState({
                ...state,
                whiteList: resp.data.data,
                uploadProgress: 0,
                uploadProgressVisibleWhite: false
            })
        })
    }

    const onHoldAction = status => {
        let id = props.match.params.id
        APIOnHoldAction({ id, status: status }).then(resp => {
            props.history.push('/campaigns_ma/campaigns')
        })
    }

    const setWhitelistMode = data => {
        console.log('data', data)
        setState({
            ...state,
            enableWhiteList: data
        })
    }

    const saveDraft = () => {
        let data = form.getFieldsValue()
        let id = props.match.params.id
        if (id) {
            data.id = id
            data.show_merchant = data.show_merchant ? 1 : 0
        }
        if (!data.type) {
            return message.error('campaign type is require!')
        }
        if (!data.title) {
            return message.error('campaign title is require!')
        }
        data.parent_id = 0
        data.is_whitelist = data.is_whitelist ? 1 : 0
        data.taskFlowReq = {
            flow_swquence: '[]',
            taskFlowExtList: null
        }
        console.log('data。。', data)
        APICreateOrModifyDraftCampaign({
            campaignJson: JSON.stringify(data)
        }).then(resp => {
            message.success('success')
            props.history.push('/campaigns_ma/campaigns')
        })
    }

    const copy = () => {
        var url = webhost + `/createCampaignNew/${props.match.params.id}?copy=copy`
        var win = window.open(url, '_blank')
        win.focus()
    }
    //获取sku
    const getSkuList = () => {
        APIFindAllCategory().then(resp => {
            setSkuList(resp.data.data)
        })
    }

    const changeMerchant = merchantId => {
        console.log('merchant', merchantId)
        let merchantList = merchant
        let resMerchant = merchantList.filter(item => {
            return item.id === merchantId
        })
        setState({
            ...state,
            merchantName: resMerchant.display_name
        })
        form.setFieldsValue({
            show_merchant: true
        })
    }

    const Derivation = () => {
        var url = webhost + `/createCampaignNew/${props.match.params.id}?copy=derivation`
        var win = window.open(url, '_blank')
        win.focus()
    }

    const chooseSample = () => {
        setState({
            ...state,
            sampleModal: true
        })
    }

    const addToSampleList = data => {
        let sampleList = state.sampleList
        data = data.map((item, index) => {
            return {
                id: item.id,
                product_url: item.product_url,
                img_url: item.img_url,
                product_name: item.product_name
            }
        })
        sampleList = sampleList.concat(data)
        console.log('sampleListsampleListsampleList', sampleList)
        setState({
            ...state,
            sampleModal: false,
            sampleList
        })
    }

    const sampleModalClose = () => {
        setState({
            ...state,
            sampleModal: false
        })
    }

    const initSteps = () => {
        setStepsState({
            step1: 'Upload a draft content for review',
            step2: 'Share the campaign on Instagram',
            step3: 'Upload your post statistics'
        })
    }

    const clearSteps = () => {
        setStepsState({
            step1: '',
            step2: '',
            step3: ''
        })
    }

    const taskFlowModalClose = () => {
        setState({
            ...state,
            taskFlowModal: false,
            taskModuleData: {}
        })
    }

    const addTaskModule = () => {
        setState({
            ...state,
            taskFlowModal: true,
            taskModuleData: {},
            editTaskIndex: -1
        })
    }

    const taskModuleCreate = data => {
        console.log('taskmodulesssss', data)
        console.log('taskstatstflowlosy', state.taskFlowExtList)
        // let resIndex = -1
        let resTaskFlowExtList = state.taskFlowExtList
        // for (let i in state.taskFlowExtList) {
        //     if (state.taskFlowExtList[i].id == data.id && data.id != undefined) {
        //         resIndex = i
        //     }
        // }
        console.log('resTaskFlowExtListmm', resTaskFlowExtList)
        data.allow_skip = data.allow_skip ? 1 : 0
        data.post_on_instagram = data.post_on_instagram ? 1 : 0

        if (state.editTaskIndex == -1) {
            resTaskFlowExtList.push(data)
        } else {
            resTaskFlowExtList.splice(state.editTaskIndex, 1, data)
        }

        setState({
            ...state,
            taskFlowModal: false,
            taskModuleData: {},
            taskFlowExtList: resTaskFlowExtList
        })
    }

    const getTaskModule = () => {
        APIGetTaskModule().then(resp => {
            setModuleState(resp.data.data)
        })
    }

    const swapArray = (arr, index1, index2) => {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0]
        return arr
    }

    const gotoLeft = (data, index) => {
        console.log('idnex', index)
        if (index == 0) {
            return message.info("It's already the first one!")
        }
        let resTaskFlowExtList = state.taskFlowExtList
        swapArray(resTaskFlowExtList, index, index - 1)
        setState({
            ...state,
            taskFlowExtList: resTaskFlowExtList
        })
    }

    const gotoRight = (data, index) => {
        console.log('data', data)
        console.log('data000', data.length)
        console.log('index', index)
        if (index == state.taskFlowExtList.length - 1) {
            return message.info("It's the last one!")
        }
        let resTaskFlowExtList = state.taskFlowExtList
        swapArray(resTaskFlowExtList, index, index + 1)
        setState({
            ...state,
            taskFlowExtList: resTaskFlowExtList
        })
    }

    const stepChange = current => {
        if (props.match.params.id == '0') {
            return
        }
        setState({
            ...state,
            stepCurrent: current
        })
    }

    const editModule = (data, index) => {
        setState({
            ...state,
            taskFlowModal: true,
            taskModuleData: data,
            editTaskIndex: index
        })
    }

    const getTaskTypeById = id => {
        console.log('getTaskTypeById', id)
        let taskList = moduleListState
        console.log('taskList', taskList)
        let module = taskList.filter(item => {
            return item.id === id
        })
        let resModule = module[0] ? module[0] : {}
        console.log('resModule', resModule)
        return resModule.module_name
    }

    const deleteTaskModule = (index, data) => {
        console.log('data', data)
        let taskFlowList = state.taskFlowExtList
        if (data.id) {
            APIDeleteTaskFlow({ id: data.id }).then(resp => {
                taskFlowList.splice(index, 1)
                setState({
                    ...state,
                    taskFlowExtList: taskFlowList
                })
            })
        } else {
            taskFlowList.splice(index, 1)
            setState({
                ...state,
                taskFlowExtList: taskFlowList
            })
        }
    }
    // 在父级设置promocode ，方便在父级判断是否需要在传promo code 参数
    const setPropsPromoCode = data => {
        setState({
            ...state,
            promoCodeList: data
        })
    }

    const nextStep = () => {
        setState({
            ...state,
            stepCurrent: state.stepCurrent == 0 ? 1 : 0
        })
    }

    const AddRwardsRow = () => {
        let rewardsList = state.rewardsList
        rewardsList.push([])
        setState({
            ...state,
            rewardsList: rewardsList
        })
    }

    const changeRward = (index1, index2, e) => {
        console.log('e', e)
        e.persist()

        let rewardsList = state.rewardsList
        rewardsList[index1][index2] = e.target.value
        console.log('rewardsList', rewardsList)
        setState({
            ...state,
            rewardsList: rewardsList
        })
    }

    const rowTest = () => {
        console.log('xixixi', state.rewardsList)
    }

    const changeEarnings = (index1, index2, e) => {
        e.persist()
        let earningsList = state.earningsList
        earningsList[index1][index2] = e.target.value
        setState({
            ...state,
            earningsList
        })
    }

    const AddEarningsRow = () => {
        let earningsList = state.earningsList
        earningsList.push([])
        setState({
            ...state,
            earningsList
        })
    }

    const deleteRewardItem = index => {
        let resReward = state.rewardsList
        resReward.splice(index, 1)
        setState({
            ...state,
            rewardsList: resReward
        })
    }

    const changeScreenShotsSwitch = val => {
        setState({
            ...state,
            screenShotsSwitch: val
        })
    }

    const changeSampleType = type => {
        setState({
            ...state,
            sampleType: type
        })
    }

    const TranslateCampaign = () => {
        let id = props.match.params.id
        let language = form.getFieldsValue().language
        let target
        switch (language) {
            case 2:
                target = 'fr'
                break
            case 3:
                target = 'es'
                break
            case 4:
                target = 'pl'
                break
            case 5:
                target = 'pt'
                break
            case 6:
                target = 'ar'
                break
            default:
                target = 'en'
                break
        }
        if (language !== 1) {
            APITranslateCampaign({
                target: target,
                source: 'en',
                campaignId: id
            }).then(resp => {
                let resData = resp.data.data
                let earnings = resData.earnings ? JSON.parse(resData.earnings) : {}
                let rewards = resData.rewards ? JSON.parse(resData.rewards) : {}
                let steps = resData.steps ? JSON.parse(resData.steps) : {}
                let sampleRuleArr = resData.sample_rule ? resData.sample_rule.split(';') : []
                form.setFieldsValue({
                    ...resData,
                    start_time: resData.start_time ? moment(resData.start_time) : '',
                    close_time: resData.close_time ? moment(resData.close_time) : '',
                    post_start_time: resData.post_start_time ? moment(resData.post_start_time) : '',
                    post_close_time: resData.post_close_time ? moment(resData.post_close_time) : '',
                    task_start_time: resData.task_start_time ? moment(resData.task_start_time) : '',
                    task_close_time: resData.task_close_time ? moment(resData.task_close_time) : '',
                    content_upload_end: resData.content_upload_end ? moment(resData.content_upload_end) : '',
                    social_post_end: resData.social_post_end ? moment(resData.social_post_end) : '',
                    qualifications: resData.qualifications ? Number(resData.qualifications) : 1,

                    country_list: resData.country_list ? JSON.parse(resData.country_list) : [],
                    language: isCopyV == 'derivation' ? '' : resData.language,
                    introduction: resData.introduction,
                    type: resData.type + '',
                    show_sample: resData.show_sample == 1 ? true : false,
                    show_merchant: resData.show_merchant == 1 ? true : false,
                    allow_app_only: resData.allow_app_only == 1 ? true : false,
                    screen_shots_switch: resData.screen_shots_switch == 1 ? true : false,
                    with_sample: resData.with_sample + '',
                    set_top: resData.set_top == 1 ? true : false,
                    status: resData.status + '',
                    proof_requirement: resData.proof_requirement + '',
                    id: id,
                    sample_rule_cam: sampleRuleArr[0] ? sampleRuleArr[0] : '',
                    sample_rule_task: sampleRuleArr[1] ? sampleRuleArr[1] : '',
                    banner: resData.banner && JSON.parse(resData.banner).length ? resData.banner : null
                })
                let banner = resData.banner ? JSON.parse(resData.banner) : []
                let postExample = resData.post_example ? JSON.parse(resData.post_example) : []
                let imageShare = resData.image_for_share ? JSON.parse(resData.image_for_share) : []

                setState({
                    ...state,
                    bannerList: banner,
                    postExampleList: postExample,
                    imageShareList: imageShare,
                    type: resData.type + '',
                    editorState: BraftEditor.createEditorState(resData.rules_description),
                    operationList: resData.operation_records,
                    enableWhiteList: resData.is_whitelist === 1 ? true : false,
                    whiteList: resData.white_list_detail,
                    id: id,
                    taskFlowId: resData.taskFlowRsp.id,
                    leftCode: resData.surplus_code_number,
                    withSample: resData.with_sample ? true : false,
                    sampleList: resData.sample_list ? JSON.parse(resData.sample_list) : [],
                    merchantName: resData.merchant_name,
                    screenShotsSwitch: resData.screen_shots_switch ? true : false,
                    loading: false,
                    taskFlowExtList: resData.taskFlowRsp.flowExtRsps ? resData.taskFlowRsp.flowExtRsps : [],
                    rewardsList: resData.rewards
                        ? JSON.parse(resData.rewards).length
                            ? JSON.parse(resData.rewards)
                            : []
                        : [],
                    earningsList: resData.earnings
                        ? JSON.parse(resData.earnings).length
                            ? JSON.parse(resData.earnings)
                            : []
                        : []
                })
                let description = resData.description ? JSON.parse(resData.description) : {}

                setStepsState({
                    ...stepsState,
                    step1: steps.step1,
                    step2: steps.step2,
                    step3: steps.step3
                })

                if (resData.type == 1 || resData.type == 4) {
                    setTaskDes(template1)
                }
                if (resData.type == 2) {
                    setTaskDes(template2)
                }
                setFormState(resData)
                setFormState({
                    ...resData,
                    id: id
                })
            })
        } else {
            message.success('Please choose other language!')
        }
    }

    useEffect(() => {
        getCountryList()
        getMerchant()
        getSkuList()
        initForm()
        getTaskModule()
    }, [])

    return (
        <Layout className='animated fadeIn campaign-detail campaign-detail-new'>
            <WebBreadcrumbNew title='New Campaign 2.0' />
            {props.match.params.id && props.match.params.id !== '0' ? (
                <div style={{ padding: '20px 0 0 20px' }}>
                    <Button type='primary' onClick={TranslateCampaign}>
                        Translate
                    </Button>
                </div>
            ) : null}
            <DetailModal
                props={props}
                visible={state.taskFlowModal}
                formData={state.taskModuleData}
                onCancel={taskFlowModalClose}
                onCreate={taskModuleCreate}
                moduleList={moduleListState}
                setPropsPromoCode={setPropsPromoCode}
            />
            <SampleModal visible={state.sampleModal} addToSampleList={addToSampleList} onCancel={sampleModalClose} />
            <div id='demoline'>
                <Row>
                    <Col offset={12}>
                        <Spin spinning={state.loading} />
                    </Col>
                </Row>
                <Row className={state.loading ? 'filter-blur' : ''}>
                    <Col span={24}>
                        <Steps current={state.stepCurrent} onChange={stepChange} className='campaign-step base-wrapper'>
                            <Step title='Basic information' />
                            <Step title='Task module' />
                        </Steps>
                        <Form
                            {...layout}
                            name='basic'
                            initialValues={{
                                remember: true
                            }}
                            layout='vertical'
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            {/* <div className='block-title'>Campaign information</div> */}
                            {state.stepCurrent == 0 ? (
                                <div className='base-form-wrapper'>
                                    <Card title='Campaign information(Required)'>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Campaign Title'
                                                    name='title'
                                                    rules={[
                                                        {
                                                            required: true
                                                        },
                                                        ({ getFieldsValue }) => ({
                                                            validator(rule, value) {
                                                                if (!/^\S.{0,30}/.test(value)) {
                                                                    return Promise.reject(
                                                                        'Content cannot start with spaces'
                                                                    )
                                                                }
                                                                return Promise.resolve()
                                                            }
                                                        })
                                                    ]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Language'
                                                    name='language'
                                                    rules={[{ required: true }]}>
                                                    <Select allowClear>
                                                        {language.map(item => {
                                                            return (
                                                                <Option
                                                                    key={item.value}
                                                                    value={item.value}
                                                                    disabled={
                                                                        (item.value == 1 && isCopyV == 'derivation') ||
                                                                        (item.value !== 1 && isCopyV !== 'derivation')
                                                                    }>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item label='Campaign Start' name='start_time' {...config}>
                                                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Campaign End' name='close_time' {...config}>
                                                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item label='Post start' name='post_start_time' {...config}>
                                                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Post end' name='post_close_time' {...config}>
                                                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Merchant'
                                                    name='merchant_id'
                                                    rules={[{ required: true }]}>
                                                    <Select allowClear onChange={changeMerchant}>
                                                        {merchant.map(item => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>
                                                                    {item.display_name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    rules={[{ required: true }]}
                                                    label='Show in campaign detail page'
                                                    name='show_merchant'
                                                    valuePropName='checked'>
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Rewards Description'
                                                    name='campaign_desc'
                                                    rules={[{ required: true }]}>
                                                    <Input placeholder='Full customization,  cpa: Average earnings:$10,  branding: as per agreed, abcomo: up to $30K                 ' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Brief Introduction'
                                                    name='introduction'
                                                    rules={[{ required: true }]}>
                                                    <TextArea />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Task Deadline' name='task_close_time' {...config}>
                                                    <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                {/* <Form.Item label='Top' name='set_top'>
                                                <Select>
                                                    <Option value='1'>true</Option>
                                                    <Option value='0'>false</Option>
                                                </Select>
                                            </Form.Item> */}
                                                <Form.Item label='Pin' name='set_top' valuePropName='checked'>
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card title='Campaign Requirement(Optional)' className='mt-card'>
                                        <div className='mb-10'>Profile Requirement (if have)</div>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item label='Sku' name='sku'>
                                                    <Select>
                                                        {skuList.map(item => {
                                                            return (
                                                                <Option key={item} value={item}>
                                                                    {item}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Country(Region)' name='country_list'>
                                                    <Select mode='multiple' allowClear>
                                                        {country.map(item => {
                                                            return (
                                                                <Option key={item.id} value={item.name}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item label='social channel' name='channel'>
                                                    <Select>
                                                        {channelList.map((item, index) => {
                                                            return (
                                                                <Option key={item.value} value={item.value}>
                                                                    {item.label}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item name='min_follower_num' label='Min follower no'>
                                                    <InputNumber placeholder='' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <div className='mb-10'>Content Requirement (if have)</div>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item name='caption' label='Caption'>
                                                    <TextArea rows={4} placeholder=';Wrap' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Requirement' name='requirement'>
                                                    <TextArea rows={4} placeholder=';Wrap' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item name='post_example' label='Post example'>
                                                    <Upload customRequest={uploadPostExample} multiple={true}>
                                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                    </Upload>
                                                    {state.uploadProgressVisiblePost ? (
                                                        <Progress
                                                            percent={state.uploadProgress}
                                                            className='file-upload-progress'
                                                        />
                                                    ) : null}
                                                    <div className='file-list'>
                                                        {state.postExampleList.map((item, index) => {
                                                            return (
                                                                <div key={item} className='file-item'>
                                                                    <div className='item-body'>
                                                                        <img className='item-img' src={item} />
                                                                        <DeleteOutlined
                                                                            className='delete-icon'
                                                                            onClick={() => {
                                                                                deleteExample(index)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item name='image_for_share' label='Image for share'>
                                                    <Upload customRequest={uploadImageShare} multiple={true}>
                                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                    </Upload>
                                                    {state.uploadProgressVisibleShare ? (
                                                        <Progress
                                                            percent={state.uploadProgress}
                                                            className='file-upload-progress'
                                                        />
                                                    ) : null}
                                                    <div className='file-list'>
                                                        {state.imageShareList.map((item, index) => {
                                                            return (
                                                                <div key={item} className='file-item'>
                                                                    <div className='item-body'>
                                                                        <img className='item-img' src={item} />
                                                                        <DeleteOutlined
                                                                            className='delete-icon'
                                                                            onClick={() => {
                                                                                deleteImageShare(index)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card className='mt-card' title='Earnings'>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Campaign Type'
                                                    name='type'
                                                    rules={[{ required: true }]}>
                                                    <Select onChange={setTypeTo}>
                                                        <Option value='1'>CPA</Option>
                                                        <Option value='3'>Branding</Option>
                                                        <Option value='4'>abComo</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item name='rewards_update_rules' label='Rewards update rules'>
                                                    <TextArea placeholder=';Wrap' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {state.type == 1 ? (
                                            <>
                                                <Row>
                                                    <Col span={12}>
                                                        <Form.Item label='Average earnings' name='earning'>
                                                            <Input placeholder='US$' />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Button type='primary' onClick={AddRwardsRow}>
                                                    Add row
                                                </Button>
                                                <div className='form-name'>Rewards:</div>
                                                <div className='campaign-des'>
                                                    <div className='form-content'>
                                                        {state.rewardsList.map((item, index) => {
                                                            return (
                                                                <div className='campaign-des' key={index}>
                                                                    <div className='form-name-n'>Code usage</div>
                                                                    <div className='form-input-w'>
                                                                        <Input
                                                                            value={state.rewardsList[index][0]}
                                                                            onChange={event => {
                                                                                changeRward(index, 0, event)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className='form-name-n'>US $</div>
                                                                    <div className='form-input-w'>
                                                                        <Input
                                                                            value={state.rewardsList[index][1]}
                                                                            onChange={event => {
                                                                                changeRward(index, 1, event)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className='form-name-n'>per usage</div>
                                                                    <MinusCircleOutlined
                                                                        onClick={() => {
                                                                            deleteRewardItem(index)
                                                                        }}
                                                                        style={{
                                                                            color: '#f85c5a',
                                                                            cursor: 'pointer',
                                                                            marginLeft: '10px'
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        ) : state.type == 4 ? (
                                            <Row>
                                                <Col span={12}>
                                                    <Form.Item label='Commission' name='commission'>
                                                        <Input placeholder='' addonAfter='%' />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        ) : state.type == 3 ? (
                                            <>
                                                <Button type='primary' onClick={AddEarningsRow}>
                                                    Add row
                                                </Button>
                                                <div className='form-name'>Earnings:</div>
                                                <div className='campaign-des'>
                                                    <div className='form-content'>
                                                        {state.earningsList &&
                                                            state.earningsList.length &&
                                                            state.earningsList.map((item, index) => {
                                                                return (
                                                                    <div className='campaign-des' key={index}>
                                                                        <div className='form-name-n'>
                                                                            Follower number
                                                                        </div>
                                                                        <div className='form-input-w'>
                                                                            <Input
                                                                                value={state.earningsList[index][0]}
                                                                                onChange={event => {
                                                                                    changeEarnings(index, 0, event)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className='form-name-n'>US $</div>
                                                                        <div className='form-input-w'>
                                                                            <Input
                                                                                value={state.earningsList[index][1]}
                                                                                onChange={event => {
                                                                                    changeEarnings(index, 1, event)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className='form-name-n'>per usage</div>
                                                                    </div>
                                                                )
                                                            })}
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </Card>

                                    <Card className='mt-card' title='Whitelist mode'>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Enable whitelist mode'
                                                    name='is_whitelist'
                                                    valuePropName='checked'>
                                                    <Switch onChange={setWhitelistMode} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        {state.enableWhiteList ? (
                                            <div
                                                style={{
                                                    marginBottom: '10px',
                                                    padding: '10px',
                                                    border: '2px solid #eee'
                                                }}>
                                                <Upload customRequest={uploadWhiteList}>
                                                    <Button icon={<UploadOutlined />}>Click to Upload whitelist</Button>
                                                </Upload>
                                                {state.uploadProgressVisibleWhite ? (
                                                    <Progress
                                                        percent={state.uploadProgress}
                                                        className='file-upload-progress'
                                                    />
                                                ) : null}

                                                {/* <Button style={{ marginLeft:'10px' }} type="primary">download white list </Button> */}
                                                <a
                                                    style={{
                                                        backgroundColor: '#1890ff',
                                                        color: '#fff',
                                                        padding: '8px 15px',
                                                        marginLeft: '10px'
                                                    }}
                                                    type='download'
                                                    href={APIDownloadWhiteList(state.id)}>
                                                    download whitelist
                                                </a>
                                                <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                                                    {state.whiteList &&
                                                        state.whiteList.map((item, index) => {
                                                            return (
                                                                <div
                                                                    style={{ marginBottom: '6px' }}
                                                                    key={index}
                                                                    className='cam-promo-code'>
                                                                    <div>Email: {item.from_user} </div>
                                                                    <div>User ID: {item.user_id} </div>
                                                                </div>
                                                            )
                                                        })}
                                                </div>
                                            </div>
                                        ) : null}
                                    </Card>

                                    <Card className='mt-card' title='Banner'>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    name='banner'
                                                    label='Banner(554*366px)'
                                                    rules={[{ required: true }]}>
                                                    <Input style={{ visibility: 'hidden' }} />
                                                </Form.Item>
                                                <Upload customRequest={uploadFile} multiple={true}>
                                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                                </Upload>
                                                {state.uploadProgressVisible ? (
                                                    <Progress
                                                        percent={state.uploadProgress}
                                                        className='file-upload-progress'
                                                    />
                                                ) : null}

                                                <div className='file-list'>
                                                    {state.bannerList.map((item, index) => {
                                                        return (
                                                            <div key={item} className='file-item'>
                                                                <div className='item-body'>
                                                                    <img className='item-img' src={item} />
                                                                    <DeleteOutlined
                                                                        className='delete-icon'
                                                                        onClick={() => {
                                                                            deleteFile(index)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>

                                    <Card className='mt-card' title='Sample'>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Show in campaign detail page'
                                                    name='show_sample'
                                                    valuePropName='checked'>
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label='Allow in mobile App only'
                                                    name='allow_app_only'
                                                    valuePropName='checked'>
                                                    <Switch />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item label='With sample' name='with_sample'>
                                                    <Select onChange={setSampleType}>
                                                        <Option value='1'>YES</Option>
                                                        <Option value='0'>NO</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label='Sample type' name='sample_type'>
                                                    <Select onChange={changeSampleType}>
                                                        <Option value={1}>abComo sample</Option>
                                                        <Option value={2}>other sample</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                {state.withSample ? (
                                                    <div>
                                                        <div
                                                            style={{
                                                                marginTop: '10px',
                                                                marginBottom: '20px'
                                                            }}>
                                                            {state.sampleType == 1 ? (
                                                                <Button type='primary' onClick={chooseSample}>
                                                                    Choose Sample
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Upload
                                                                        customRequest={uploadSample}
                                                                        multiple={true}
                                                                        style={{ marginLeft: '15px' }}>
                                                                        <Button icon={<UploadOutlined />}>
                                                                            add Other Sample
                                                                        </Button>
                                                                    </Upload>
                                                                    {state.uploadProgressVisiblePost ? (
                                                                        <Progress
                                                                            percent={state.uploadProgress}
                                                                            className='file-upload-progress'
                                                                        />
                                                                    ) : null}
                                                                </>
                                                            )}

                                                            <div className='file-list'>
                                                                {state.sampleList.map((item, index) => {
                                                                    return (
                                                                        <div key={item.img_url} className='file-item'>
                                                                            <div className='item-body'>
                                                                                <img
                                                                                    className='item-img'
                                                                                    src={item.img_url}
                                                                                />
                                                                                <Input
                                                                                    onChange={e => {
                                                                                        changeSampleName(index, e)
                                                                                    }}
                                                                                    style={{
                                                                                        width: '260px',
                                                                                        marginLeft: '20px'
                                                                                    }}
                                                                                    value={item.product_name}
                                                                                />
                                                                                <Input
                                                                                    style={{ width: '260px' }}
                                                                                    onChange={e => {
                                                                                        changeProductUrl(index, e)
                                                                                    }}
                                                                                    addonBefore='https://'
                                                                                    value={item.product_url}
                                                                                />
                                                                                <Input
                                                                                    style={{
                                                                                        width: '260px',
                                                                                        marginLeft: '20px'
                                                                                    }}
                                                                                    value={item.article_number}
                                                                                    placeholder='article number'
                                                                                    onChange={e => {
                                                                                        changeArticleNum(index, e)
                                                                                    }}
                                                                                />
                                                                                <DeleteOutlined
                                                                                    className='delete-icon'
                                                                                    onClick={() => {
                                                                                        deleteSample(index)
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label='Sample rules in campaign'
                                                                    name='sample_rule_cam'>
                                                                    <TextArea placeholder='Sample rules in campaign ' />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label='Sample rules in task'
                                                                    name='sample_rule_task'>
                                                                    <TextArea placeholder='Sample rules in task' />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label='Sample apply rules'
                                                                    name='sample_apply_rule'>
                                                                    <TextArea placeholder='Sample apply rule ; Wrap' />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    label='Upload insights'
                                                                    name='screen_shots_switch'
                                                                    valuePropName='checked'>
                                                                    <Switch onChange={changeScreenShotsSwitch} />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        {state.screenShotsSwitch ? (
                                                            <Row>
                                                                <Col span={12}>
                                                                    <Form.Item
                                                                        label='Explanation'
                                                                        name='screen_shots_name'>
                                                                        <TextArea placeholder='Explanation' />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        ) : null}
                                                        <Row>
                                                            <Col span={12}>
                                                                <Form.Item label='Qualifications' name='qualifications'>
                                                                    <Radio.Group>
                                                                        <Space direction='vertical'>
                                                                            <Radio value={1}>
                                                                                {' '}
                                                                                Fill in (Instagram)
                                                                            </Radio>
                                                                            <Radio value={2}>
                                                                                {' '}
                                                                                Connect (Instagram)
                                                                            </Radio>
                                                                            <Radio disabled value={3}>
                                                                                {' '}
                                                                                Fill in (YouTube)
                                                                            </Radio>
                                                                            <Radio disabled value={4}>
                                                                                {' '}
                                                                                Connect (YouTube)
                                                                            </Radio>
                                                                            <Radio disabled value={5}>
                                                                                {' '}
                                                                                Fill in (TikTok)
                                                                            </Radio>
                                                                            <Radio disabled value={6}>
                                                                                {' '}
                                                                                Connect (TikTok)
                                                                            </Radio>
                                                                        </Space>
                                                                    </Radio.Group>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            ) : state.stepCurrent == 1 ? (
                                <div className='base-form-wrapper'>
                                    <Card className='mt-card' title='Task flow'>
                                        <div className='block-title'>task flow</div>
                                        <div className='mb-10'>
                                            <Button type='primary' onClick={addTaskModule}>
                                                Add task module
                                            </Button>
                                        </div>
                                        <div className='flex-row flex-wrapper'>
                                            {state.taskFlowExtList &&
                                                state.taskFlowExtList.map((item, index) => {
                                                    return (
                                                        <Card
                                                            style={{ width: 320, margin: '0 10px 10px 0' }}
                                                            key={item.module_id}
                                                            hoverable
                                                            actions={[
                                                                <ArrowLeftOutlined
                                                                    key='left'
                                                                    onClick={() => {
                                                                        gotoLeft(item, index)
                                                                    }}
                                                                />,
                                                                <EditOutlined
                                                                    key='edit'
                                                                    onClick={() => {
                                                                        editModule(item, index)
                                                                    }}
                                                                />,
                                                                <Popconfirm
                                                                    title='Sure to delete?'
                                                                    onConfirm={() => {
                                                                        deleteTaskModule(index, item)
                                                                    }}>
                                                                    <DeleteOutlined key='delete' />
                                                                </Popconfirm>,
                                                                <ArrowRightOutlined
                                                                    key='right'
                                                                    onClick={() => {
                                                                        gotoRight(item, index)
                                                                    }}
                                                                />
                                                            ]}>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>Type</span>{' '}
                                                                <span className='card-form-value'>
                                                                    {getTaskTypeById(item.module_id)}
                                                                </span>{' '}
                                                            </p>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>Call for action</span>{' '}
                                                                <span className='card-form-value'>{item.steps}</span>{' '}
                                                            </p>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>Explanation</span>{' '}
                                                                <span className='card-form-value'>
                                                                    {item.flow_rule}
                                                                </span>
                                                            </p>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>
                                                                    Explanation detail
                                                                </span>{' '}
                                                                <span className='card-form-value'>
                                                                    {item.flow_rule_info}
                                                                </span>
                                                            </p>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>requirements</span>{' '}
                                                                <span className='card-form-value'>
                                                                    {item.description}
                                                                </span>
                                                            </p>
                                                            <p className='card-form-p'>
                                                                <span className='card-form-label'>Deadline</span>
                                                                <span className='card-form-value'>
                                                                    {item.deadline
                                                                        ? getYearMonthDayNormal(item.deadline)
                                                                        : ''}
                                                                </span>
                                                            </p>
                                                            {item.module_id == 1 ? (
                                                                <>
                                                                    <p className='card-form-p'>
                                                                        <span className='card-form-label'>
                                                                            discount
                                                                        </span>{' '}
                                                                        <span className='card-form-value'>
                                                                            {item.discount}
                                                                        </span>
                                                                    </p>
                                                                    <p className='card-form-p'>
                                                                        <span className='card-form-label'>
                                                                            order requirement
                                                                        </span>{' '}
                                                                        <span className='card-form-value'>
                                                                            {item.order_requirement}
                                                                        </span>
                                                                    </p>
                                                                </>
                                                            ) : null}
                                                        </Card>
                                                    )
                                                })}
                                        </div>
                                    </Card>
                                </div>
                            ) : (
                                <div className='base-form-wrapper white-bg'>
                                    <Result
                                        status='success'
                                        title='Successfully '
                                        subTitle='successfully'
                                        extra={[
                                            <Button type='primary' key='console'>
                                                create again
                                            </Button>,
                                            <Button key='buy'>View</Button>
                                        ]}
                                    />
                                </div>
                            )}

                            <Form.Item {...tailLayout} className='action-bar'>
                                <div style={{ marginTop: '20px' }}>
                                    <Button type='primary' htmlType='submit' style={{ marginLeft: '30px' }}>
                                        Submit
                                    </Button>
                                    <Button type='primary' onClick={saveDraft} style={{ marginLeft: '30px' }}>
                                        Save as draft
                                    </Button>
                                    {formState.id ? (
                                        <Button
                                            type='primary'
                                            style={{ marginLeft: '30px' }}
                                            onClick={() => {
                                                onHoldAction(5)
                                            }}>
                                            Offline
                                        </Button>
                                    ) : null}
                                    {formState.id ? (
                                        <Button
                                            type='primary'
                                            style={{ marginLeft: '30px' }}
                                            onClick={() => {
                                                onHoldAction(2)
                                            }}>
                                            Go online
                                        </Button>
                                    ) : null}
                                    {formState.id ? (
                                        <Button
                                            type='primary'
                                            style={{ marginLeft: '30px' }}
                                            onClick={() => {
                                                copy()
                                            }}>
                                            Copy
                                        </Button>
                                    ) : null}
                                    {formState.id && formState.parent_id == '0' ? (
                                        <Button
                                            type='primary'
                                            style={{ marginLeft: '30px' }}
                                            onClick={() => {
                                                Derivation()
                                            }}>
                                            Derivation
                                        </Button>
                                    ) : null}
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

            {/* <div>
                <Button type='primary' onClick={nextStep} style={{ marginLeft: '30px' }}>
                    {state.stepCurrent == 0 ? 'Next step' : 'Prev step'}
                </Button>
            </div> */}

            <div className='base-style base-detail'>
                <h3 className='block-title'>Action List</h3>
                <Row>
                    <Col span={23} offset={1}>
                        {state.operationList && state.operationList.length ? (
                            <div className='now-promo-code'>
                                <List
                                    itemLayout='horizontal'
                                    dataSource={state.operationList}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<HeaderC name={item.action_by} />}
                                                title={item.action_by + '    did    ' + item.update}
                                                description={getYearMonthDayTimeNew(item.create_time)}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default CreateCampaignNew
