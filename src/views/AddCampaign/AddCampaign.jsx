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
    Image
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
    APIGetProductList
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { query, type } from 'koa/lib/request'
import { getKeyList } from '@/tools/action.js'
import { getYearMonthDayTimeNew, getCleanedParams } from '@/tools/help.js'
import TextArea from 'antd/lib/input/TextArea'
import webhost from '@/tools/webhost.js'
import { set } from 'js-cookie'
import Modal from 'antd/lib/modal/Modal'
const { RangePicker } = DatePicker

const layout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
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

const ProductColumn = () => [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Product id',
        dataIndex: 'product_id',
        key: 'product_id',
        width: '100',
        align: 'center'
    },
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
        alignL: 'center',
        render: (text, item) => <div style={{ width: '140px' }}>{text}</div>
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

const AddCampaign = props => {
    const [state, setState] = useState({
        editorState: BraftEditor.createEditorState(''),
        outputHTML: '',
        bannerList: [],
        postExampleList: [],
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
        sampleModal: false
    })

    const [desState, setDesState] = useState({
        rewardTitle1: '',
        rewardTitle2: '',
        rewardTitle3: '',
        rewardContent: '',
        requireTitle1: '',
        requireTitle2: '',
        requireTitle3: '',
        requireContent: '',
        postTitle1: '',
        postTitle2: '',
        postTitle3: '',
        postContent: ''
    })

    // rewards 数据和 earnings 数据 状态
    const [rewardState, setRewardState] = useState({
        range1: null,
        value1: null,
        range2: null,
        value2: null,
        range3: null,
        value3: null,

        earnRange1: '',
        earnRange2: '',
        earnRange3: '',
        earnValue1: '',
        earnValue2: '',
        earnValue3: ''
    })

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
        { name: 'Portuguese', value: 5 }
    ])
    const [merchant, setMerchant] = useState([])
    const [taskDes, setTaskDes] = useState(' ')
    const [promoCode, setPromoCode] = useState([])
    const [skuList, setSkuList] = useState([])

    let { editorState, outputHTML } = state

    let editorChange = editorState => {
        setState(prevState => {
            return { ...prevState, editorState, outputHTML: editorState.toHTML() }
        })
        console.log('21')
    }

    const onFinish = values => {
        console.log('valussss', values)
        let isCopy = getQueryString('copy')
        if (
            !(
                (stepsState.step1 === '' && stepsState.step2 === '' && stepsState.step3 === '') ||
                (stepsState.step1 !== '' && stepsState.step2 !== '' && stepsState.step3 !== '')
            )
        ) {
            return message.error('steps error')
        }

        let description = {
            rewardT1: desState.rewardTitle1,
            rewardT2: desState.rewardTitle2,
            rewardT3: desState.rewardTitle3,
            rewardContent: desState.rewardContent,
            requireT1: desState.requireTitle1,
            requireT2: desState.requireTitle2,
            requireT3: desState.requireTitle3,
            requireContent: desState.requireContent,
            postT1: desState.postTitle1,
            postT2: desState.postTitle2,
            postT3: desState.postTitle3,
            postContent: desState.postContent
        }

        let earnings = {
            earnRange1: rewardState.earnRange1,
            earnRange2: rewardState.earnRange2,
            earnRange3: rewardState.earnRange3,
            earnValue1: rewardState.earnValue1,
            earnValue2: rewardState.earnValue2,
            earnValue3: rewardState.earnValue3
        }

        let rewards = {
            range1: rewardState.range1,
            range2: rewardState.range2,
            range3: rewardState.range3,
            value1: rewardState.value1,
            value2: rewardState.value2,
            value3: rewardState.value3
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
            rules_description: editorState.toHTML(),
            promo_code_list: JSON.stringify(promoCode),
            task_description: taskDes,
            show_merchant: values.show_merchant ? 1 : 0,

            show_sample: values.show_sample ? 1 : 0,
            is_whitelist: values.is_whitelist ? 1 : 0,
            allow_app_only: values.allow_app_only ? 1 : 0,
            is_open_share: values.is_open_share ? 1 : 0,
            white_list: JSON.stringify(state.whiteList),
            description: JSON.stringify(description),
            earnings: JSON.stringify(earnings),
            rewards: JSON.stringify(rewards),
            country_list: values.country_list ? JSON.stringify(values.country_list) : JSON.stringify([]),
            steps: JSON.stringify(stepsState),
            sample_rule: values.sample_rule_cam + ';' + values.sample_rule_task

            // earning:'22'
        }

        if (values.with_sample == 1) {
            values.sample_list = JSON.stringify(state.sampleList)
        }
        if (!values.with_sample) {
            values.with_sample = 0
        }

        if (state.type == '3') {
            values.content_upload_end = values['content_upload_end'].format('YYYY-MM-DD HH:mm:ss')
            values.social_post_end = values['social_post_end'].format('YYYY-MM-DD HH:mm:ss')
        }

        if (!promoCode.length) {
            delete values.promo_code_list
        }
        values.parent_id = 0

        if (props.match.params.id == '0') {
            APICreateCampaign(JSON.stringify(values)).then(resp => {
                props.history.push('/campaigns_ma/campaigns')
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
                APIModifyCampaign(JSON.stringify(values)).then(resp => {
                    props.history.push('/campaigns_ma/campaigns')
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

    const setTaskDescription = () => {}

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
            APIGetCampaignDetail({ id }).then(resp => {
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
                    is_open_share: resData.is_open_share == 1 ? true : false,
                    with_sample: resData.with_sample + '',
                    set_top: resData.set_top + '',
                    status: resData.status + '',
                    proof_requirement: resData.proof_requirement + '',
                    id: isCopy ? null : id,
                    sample_rule_cam: sampleRuleArr[0],
                    sample_rule_task: sampleRuleArr[1]
                })
                let banner = resData.banner ? JSON.parse(resData.banner) : []
                let postExample = resData.post_example ? JSON.parse(resData.post_example) : []

                console.log('postExampleyyysbsbbs', postExample)

                setState({
                    ...state,
                    bannerList: banner,
                    postExampleList: postExample,
                    type: resData.type + '',
                    editorState: BraftEditor.createEditorState(resData.rules_description),
                    promoCodeList: resData.promo_code,
                    operationList: resData.operation_records,
                    enableWhiteList: resData.is_whitelist === 1 ? true : false,
                    whiteList: resData.white_list_detail,
                    id: isCopy ? null : id,
                    leftCode: resData.surplus_code_number,
                    withSample: resData.with_sample ? true : false,
                    sampleList: resData.sample_list ? JSON.parse(resData.sample_list) : [],
                    merchantName: resData.merchant_name,
                    loading: false
                })
                let description = resData.description ? JSON.parse(resData.description) : {}

                setRewardState({
                    ...rewardState,
                    range1: rewards.range1,
                    range2: rewards.range2,
                    range3: rewards.range3,
                    value1: rewards.value1,
                    value2: rewards.value2,
                    value3: rewards.value3,
                    earnRange1: earnings.earnRange1,
                    earnRange2: earnings.earnRange2,
                    earnRange3: earnings.earnRange3,
                    earnValue1: earnings.earnValue1,
                    earnValue2: earnings.earnValue2,
                    earnValue3: earnings.earnValue3
                })

                setDesState({
                    ...desState,
                    rewardTitle1: description.rewardT1,
                    rewardTitle2: description.rewardT2,
                    rewardTitle3: description.rewardT3,
                    rewardContent: description.rewardContent,

                    requireTitle1: description.requireT1,
                    requireTitle2: description.requireT2,
                    requireTitle3: description.requireT3,
                    requireContent: description.requireContent,

                    postTitle1: description.postT1,
                    postTitle2: description.postT2,
                    postTitle3: description.postT3,
                    postContent: description.postContent
                })

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
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let sampleList = state.sampleList
            let picUrl = resp.data.url
            sampleList.push({ product_name: '', img_url: picUrl })
            setState({
                ...state,
                sampleList
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
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let postExampleList = state.postExampleList
            let picUrl = resp.data.url
            postExampleList.push(picUrl)
            setState({
                ...state,
                postExampleList
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

    const uploadFile = ({ file, onSuccess }) => {
        // uid: '-1',
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let bannerList = state.bannerList
            let picUrl = resp.data.url
            bannerList.push(picUrl)
            setState({
                ...state,
                bannerList
            })
        })
    }

    const uploadWhiteList = ({ file, onSuccess }) => {
        let id = props.match.params.id
        let params = {
            file: file
        }
        if (id && id !== '0') {
            params.id = id
        }
        console.log('paramsmsssss', params)
        APIUploadWhiteList(params).then(resp => {
            message.success('upload success')
            setState({
                ...state,
                whiteList: resp.data.data
            })
        })
    }

    const downloadPromoCode = () => {
        APIDownloadpromoCode({
            id: state.id
        }).then(resp => {
            message.success('Sent successfully')
        })
    }

    const uploadPromoCode = ({ file, onSuccess }) => {
        APIUploadPromoCode({ file: file }).then(resp => {
            // onSuccess()
            setPromoCode(resp.data.data)
        })
    }

    const deletePromoCode = () => {
        setPromoCode([])
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

    const changeRequireT1 = e => {
        setDesState({
            ...desState,
            requireTitle1: e.target.value
        })
    }
    const changeRequireT2 = e => {
        setDesState({
            ...desState,
            requireTitle2: e.target.value
        })
    }
    const changeRequireT3 = e => {
        setDesState({
            ...desState,
            requireTitle3: e.target.value
        })
    }
    const changeRequireContent = e => {
        setDesState({
            ...desState,
            requireContent: e.target.value
        })
    }

    const changeRewardT1 = e => {
        setDesState({
            ...desState,
            rewardTitle1: e.target.value
        })
    }
    const changeRewardT2 = e => {
        setDesState({
            ...desState,
            rewardTitle2: e.target.value
        })
    }
    const changeRewardT3 = e => {
        setDesState({
            ...desState,
            rewardTitle3: e.target.value
        })
    }
    const changeRewardContent = e => {
        setDesState({
            ...desState,
            rewardContent: e.target.value
        })
    }

    const changePostT1 = e => {
        setDesState({
            ...desState,
            postTitle1: e.target.value
        })
    }
    const changePostT2 = e => {
        setDesState({
            ...desState,
            postTitle2: e.target.value
        })
    }
    const changePostT3 = e => {
        setDesState({
            ...desState,
            postTitle3: e.target.value
        })
    }
    const changePostContent = e => {
        setDesState({
            ...desState,
            postContent: e.target.value
        })
    }
    const changeRange1 = e => {
        setRewardState({
            ...rewardState,
            range1: e.target.value
        })
    }
    const changeRange2 = e => {
        setRewardState({
            ...rewardState,
            range2: e.target.value
        })
    }
    const changeRange3 = e => {
        setRewardState({
            ...rewardState,
            range3: e.target.value
        })
    }
    const changeValue1 = e => {
        setRewardState({
            ...rewardState,
            value1: e.target.value
        })
    }
    const changeValue2 = e => {
        setRewardState({
            ...rewardState,
            value2: e.target.value
        })
    }
    const changeValue3 = e => {
        setRewardState({
            ...rewardState,
            value3: e.target.value
        })
    }

    const changeERange1 = e => {
        setRewardState({
            ...rewardState,
            earnRange1: e.target.value
        })
    }
    const changeERange2 = e => {
        setRewardState({
            ...rewardState,
            earnRange2: e.target.value
        })
    }
    const changeERange3 = e => {
        setRewardState({
            ...rewardState,
            earnRange3: e.target.value
        })
    }
    const changeEValue1 = e => {
        setRewardState({
            ...rewardState,
            earnValue1: e.target.value
        })
    }
    const changeEValue2 = e => {
        setRewardState({
            ...rewardState,
            earnValue2: e.target.value
        })
    }
    const changeEValue3 = e => {
        setRewardState({
            ...rewardState,
            earnValue3: e.target.value
        })
    }
    const changeStep1 = e => {
        setStepsState({
            ...stepsState,
            step1: e.target.value
        })
    }
    const changeStep2 = e => {
        setStepsState({
            ...stepsState,
            step2: e.target.value
        })
    }
    const changeStep3 = e => {
        setStepsState({
            ...stepsState,
            step3: e.target.value
        })
    }

    const saveDraft = () => {
        let data = form.getFieldsValue()
        let id = props.match.params.id
        if (id) {
            data.id = id
            data.show_merchant = data.show_merchant ? 1 : 0
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
        var url = webhost + `/createCampaign/${props.match.params.id}?copy=copy`
        var win = window.open(url, '_blank')
        win.focus()
    }
    //获取sku
    const getSkuList = () => {
        APIFindAllCategory().then(resp => {
            setSkuList(resp.data.data)
        })
    }

    const changeReward = (str, e) => {
        setRewardState({
            ...rewardState
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
    }

    const Derivation = () => {
        var url = webhost + `/createCampaign/${props.match.params.id}?copy=derivation`
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

    useEffect(() => {
        getCountryList()
        getMerchant()
        getSkuList()
        initForm()
    }, [])

    return (
        <Layout className='animated fadeIn'>
            <WebBreadcrumbNew title='New Campaign' />
            <SampleModal visible={state.sampleModal} addToSampleList={addToSampleList} onCancel={sampleModalClose} />
            <div className='base-style base-detail ' id='demoline'>
                <Row>
                    <Col offset={12}>
                        <Spin spinning={state.loading} />
                    </Col>
                </Row>
                <Row className={state.loading ? 'filter-blur' : ''}>
                    <Col span={24}>
                        <Form
                            {...layout}
                            name='basic'
                            initialValues={{
                                remember: true
                            }}
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <div className='block-title'>Campaign information</div>
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
                                                        return Promise.reject('Content cannot start with spaces')
                                                    }
                                                    return Promise.resolve()
                                                }
                                            })
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Language' name='language' rules={[{ required: true }]}>
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
                                    <Form.Item label='Campaign Type' name='type'>
                                        <Select onChange={setTypeTo}>
                                            <Option value='1'>CPA</Option>
                                            <Option value='3'>Branding</Option>
                                            <Option value='4'>abComo</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.type == '1' || state.type == '4' ? (
                                <div
                                    style={{
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px dashed #eee'
                                    }}>
                                    {taskDes !== '' &&
                                        taskDes.split(';').map((item, index) => {
                                            return (
                                                <div style={{ marginBottom: '6px' }} key={index}>
                                                    {item}
                                                </div>
                                            )
                                        })}
                                </div>
                            ) : null}
                            {state.type == '2' ? (
                                <div
                                    style={{
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px dashed #eee'
                                    }}>
                                    {taskDes !== '' &&
                                        taskDes.split(';').map((item, index) => {
                                            return (
                                                <div style={{ marginBottom: '6px' }} key={index}>
                                                    {item}
                                                </div>
                                            )
                                        })}
                                </div>
                            ) : null}
                            {state.type == '3' ? (
                                <div
                                    style={{
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px dashed #eee'
                                    }}>
                                    {taskDes !== '' &&
                                        taskDes.split(';').map((item, index) => {
                                            return (
                                                <div style={{ marginBottom: '6px' }} key={index}>
                                                    {item}
                                                </div>
                                            )
                                        })}
                                </div>
                            ) : null}
                            {state.type == '1' ? null : (
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
                                </Row>
                            )}
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Country' name='country_list'>
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
                                <Col span={12}>
                                    <Form.Item label='Campaign ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Start' name='start_time' {...config}>
                                        <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='End' name='close_time' {...config}>
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
                                    <Form.Item label='Merchant' name='merchant_id'>
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
                                        label='Show in campaign detail page'
                                        name='show_merchant'
                                        valuePropName='checked'>
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Alert
                                style={{ marginLeft: '16.5%', marginBottom: '10px' }}
                                message={`Commission Description and (Commission or Average earnings or Earnings) are tow options, Commission Description proority is higher `}
                                type='info'
                                showIcon
                            />
                            {state.type == 1 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Commission Description' name='campaign_desc'>
                                            <Input placeholder='' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Average earnings' name='earning'>
                                            <Input placeholder='US$' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : state.type == 4 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Commission Description' name='campaign_desc'>
                                            <Input placeholder='' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Commission' name='commission'>
                                            <Input placeholder='' addonAfter='%' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Commission Description' name='campaign_desc'>
                                                <Input placeholder='' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div className='campaign-des'>
                                        <div className='form-name'>Earnings:</div>
                                        <div className='form-content'>
                                            <div className='campaign-des'>
                                                <div className='form-name-n'>Follower number</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnRange1} onChange={changeERange1} />
                                                </div>
                                                <div className='form-name-n'>US $</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnValue1} onChange={changeEValue1} />
                                                </div>
                                                <div className='form-name-n'>per usage</div>
                                            </div>
                                            <div className='campaign-des'>
                                                <div className='form-name-n'>Follower number</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnRange2} onChange={changeERange2} />
                                                </div>
                                                <div className='form-name-n'>US $</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnValue2} onChange={changeEValue2} />
                                                </div>
                                                <div className='form-name-n'>per usage</div>
                                            </div>
                                            <div className='campaign-des'>
                                                <div className='form-name-n'>Follower number</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnRange3} onChange={changeERange3} />
                                                </div>
                                                <div className='form-name-n'>US $</div>
                                                <div className='form-input-w'>
                                                    <Input value={rewardState.earnValue3} onChange={changeEValue3} />
                                                </div>
                                                <div className='form-name-n'>per usage</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Pin' name='set_top'>
                                        <Select>
                                            <Option value='1'>true</Option>
                                            <Option value='0'>false</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.type == '3' ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Task start time' name='task_start_time' {...config}>
                                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Briefing' name='introduction'>
                                        <TextArea />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Task close time' name='task_close_time' {...config}>
                                        <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.type == 3 ? (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Channel' name='channel'>
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
                                            <Form.Item label='Requirement' name='requirement'>
                                                <TextArea rows={4} placeholder=';division' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            ) : null}

                            {state.type == 3 || state.type == 4 ? (
                                <>
                                    <div className='division-line'></div>
                                    <div className='block-title'>Sample</div>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item
                                                label='Show in campaign detail page'
                                                name='show_sample'
                                                valuePropName='checked'>
                                                <Switch />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
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
                                            {state.withSample ? (
                                                <div
                                                    style={{
                                                        marginTop: '10px',
                                                        marginLeft: '33.3%',
                                                        marginBottom: '20px',
                                                        width: '800px'
                                                    }}>
                                                    {/* <Upload customRequest={uploadSample}>
                                                        <Button icon={<UploadOutlined />}>Click to Upload </Button>
                                                    </Upload> */}
                                                    <Button type='primary' onClick={chooseSample}>
                                                        Choose Sample
                                                    </Button>
                                                    <div className='file-list'>
                                                        {state.sampleList.map((item, index) => {
                                                            return (
                                                                <div key={item.img_url} className='file-item'>
                                                                    <div className='item-body'>
                                                                        <img className='item-img' src={item.img_url} />
                                                                        <Input
                                                                            onChange={e => {
                                                                                changeSampleName(index, e)
                                                                            }}
                                                                            style={{
                                                                                width: '200px',
                                                                                marginLeft: '20px'
                                                                            }}
                                                                            value={item.product_name}
                                                                        />
                                                                        <Input
                                                                            style={{ width: '200px' }}
                                                                            onChange={e => {
                                                                                changeProductUrl(index, e)
                                                                            }}
                                                                            addonBefore='https://'
                                                                            value={item.product_url}
                                                                        />
                                                                        <Input
                                                                            style={{
                                                                                width: '200px',
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
                                            ) : null}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Sample rules in campaign' name='sample_rule_cam'>
                                                <TextArea placeholder='Sample rules in campaign ' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Sample rules in task' name='sample_rule_task'>
                                                <TextArea placeholder='Sample rules in task' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Sample apply rules' name='sample_apply_rule'>
                                                <TextArea placeholder='Sample apply rule ; division' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Qualifications' name='qualifications' required>
                                                <Radio.Group>
                                                    <Space direction='vertical'>
                                                        <Radio value={1}> Fill in (Instagram)</Radio>
                                                        <Radio value={2}> Connect (Instagram)</Radio>
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
                                </>
                            ) : null}

                            <div className='division-line'></div>
                            <div className='block-title'>White list mode</div>
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
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px solid #eee'
                                    }}>
                                    <Upload customRequest={uploadWhiteList}>
                                        <Button icon={<UploadOutlined />}>Click to Upload white list</Button>
                                    </Upload>

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
                                        download white list
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

                            <div className='division-line'></div>
                            <div className='block-title'>Banner</div>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='banner' label='Banner'>
                                        <Upload customRequest={uploadFile}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
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
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className='division-line'></div>
                            <div className='block-title'>Step 1</div>
                            {state.type == 3 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Content upload end' name='content_upload_end' {...config}>
                                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}

                            <div className='campaign-des'>
                                <div className='form-name'>Steps:</div>
                                <div className='form-content'>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>step 1</div>
                                        <div className='form-input-w'>
                                            <Input value={stepsState.step1} onChange={changeStep1} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>step 2</div>
                                        <div className='form-input-w'>
                                            <Input value={stepsState.step2} onChange={changeStep2} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>step 3</div>
                                        <div className='form-input-w'>
                                            <Input value={stepsState.step3} onChange={changeStep3} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='campaign-des'>
                                <div className='form-name'>Step-1:</div>
                                <div className='form-content'>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title1</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.rewardTitle1} onChange={changeRewardT1} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title2</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.rewardTitle2} onChange={changeRewardT2} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title3</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.rewardTitle3} onChange={changeRewardT3} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>content</div>
                                        <div className='form-input-w'>
                                            <TextArea
                                                rows={5}
                                                placeholder='; division'
                                                value={desState.rewardContent}
                                                onChange={changeRewardContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {state.type == 1 || state.type == 4 ? (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item name='promo_code_rules' label='Promo code rules'>
                                                <TextArea placeholder=';division' />
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
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item name='rewards_update_rules' label='Rewards update rules'>
                                                <TextArea placeholder=';division' />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item label='Code left' name='surplus_code_number'>
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {state.type == 1 ? (
                                        <>
                                            <div className='campaign-des'>
                                                <div className='form-name'>Rewards:</div>
                                                <div className='form-content'>
                                                    <div className='campaign-des'>
                                                        <div className='form-name-n'>Code usage</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.range1} onChange={changeRange1} />
                                                        </div>
                                                        <div className='form-name-n'>US $</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.value1} onChange={changeValue1} />
                                                        </div>
                                                        <div className='form-name-n'>per usage</div>
                                                    </div>
                                                    <div className='campaign-des'>
                                                        <div className='form-name-n'>Code usage</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.range2} onChange={changeRange2} />
                                                        </div>
                                                        <div className='form-name-n'>US $</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.value2} onChange={changeValue2} />
                                                        </div>
                                                        <div className='form-name-n'>per usage</div>
                                                    </div>
                                                    <div className='campaign-des'>
                                                        <div className='form-name-n'>Code usage</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.range3} onChange={changeRange3} />
                                                        </div>
                                                        <div className='form-name-n'>US $</div>
                                                        <div className='form-input-w'>
                                                            <Input value={rewardState.value3} onChange={changeValue3} />
                                                        </div>
                                                        <div className='form-name-n'>per usage</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                    <Row>
                                        <Col span={12}>
                                            <Form.Item name='promo_code_list' label='Promo code list'>
                                                <Upload customRequest={uploadPromoCode}>
                                                    <Button icon={<UploadOutlined />}>
                                                        Click to Upload promo code
                                                    </Button>
                                                </Upload>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Button type='primary' onClick={deletePromoCode}>
                                                Delete code
                                            </Button>
                                        </Col>
                                    </Row>
                                    {promoCode ? (
                                        <div
                                            style={{
                                                marginLeft: '16.8%',
                                                marginBottom: '10px',
                                                padding: '10px',
                                                border: '2px dashed #eee'
                                            }}>
                                            {promoCode.map((item, index) => {
                                                return (
                                                    <div style={{ marginBottom: '6px' }} key={index}>
                                                        {item.code}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : null}

                                    {state.promoCodeList && state.promoCodeList.length ? (
                                        <div
                                            className='now-promo-code'
                                            style={{
                                                border: '2px dashed rgb(238,238,238)',
                                                marginLeft: '16.8%',
                                                marginBottom: '20px',
                                                maxHeight: '1000px',
                                                overflowY: 'scroll'
                                            }}>
                                            <div className='cam-promo-code'>
                                                <div style={{ color: '#3f8600' }}>
                                                    Total Code: {state.promoCodeList.length}
                                                </div>
                                                <div style={{ color: '#cf1322' }}>
                                                    Used: {state.promoCodeList.length - state.leftCode}{' '}
                                                </div>
                                                <div style={{ color: '#1890ff' }}>left: {state.leftCode} </div>
                                                <Button type='primary' onClick={downloadPromoCode}>
                                                    download promo code
                                                </Button>
                                            </div>
                                            {state.promoCodeList.map((item, index) => {
                                                return (
                                                    <div className='cam-promo-code' key={index}>
                                                        <div> Status: {item.status == 1 ? 'not used' : 'used'} </div>
                                                        <div>Campaig ID: {item.campaign_id} </div>
                                                        <div>Code: {item.code} </div>
                                                        <div className='user-name-l'> User Name: {item.from_user} </div>
                                                        <div> Task ID: {item.task_id} </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : null}
                                </>
                            ) : state.type == 2 ? (
                                <></>
                            ) : state.type == 3 ? (
                                <></>
                            ) : null}

                            <div className='division-line'></div>
                            <div className='block-title'>Step 2</div>
                            {state.type == '3' ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Social post end' name='social_post_end' {...config}>
                                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}

                            <Row>
                                <Col span={12}>
                                    <Form.Item name='post_guidelines' label='Post Guidelines'>
                                        <TextArea placeholder='; division' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='post_example' label='Post example'>
                                        <Upload customRequest={uploadPostExample}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
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
                                    <Form.Item name='is_open_share' label='Images for share' valuePropName='checked'>
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className='campaign-des'>
                                <div className='form-name'>Step-2:</div>
                                <div className='form-content'>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title1</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.requireTitle1} onChange={changeRequireT1} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title2</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.requireTitle2} onChange={changeRequireT2} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title3</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.requireTitle3} onChange={changeRequireT3} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>content</div>
                                        <div className='form-input-w'>
                                            <TextArea
                                                rows={5}
                                                placeholder='; division'
                                                value={desState.requireContent}
                                                onChange={changeRequireContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='division-line'></div>
                            <div className='block-title'>Step 3</div>
                            {/* {state.type == '3' ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item
                                            label='Task registration end'
                                            name='task_close_time'
                                            rules={[{ required: state.type == 3 ? true : false }]}>
                                            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null} */}

                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Proof requirement' name='proof_requirement'>
                                        {/* <Input  /> */}
                                        <TextArea rows={10} placeholder=';division' />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className='campaign-des'>
                                <div className='form-name'>Step-3:</div>
                                <div className='form-content'>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title1</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.postTitle1} onChange={changePostT1} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title2</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.postTitle2} onChange={changePostT2} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>title3</div>
                                        <div className='form-input-w'>
                                            <Input value={desState.postTitle3} onChange={changePostT3} />
                                        </div>
                                    </div>
                                    <div className='campaign-des'>
                                        <div className='form-name-n'>content</div>
                                        <div className='form-input-w'>
                                            <TextArea
                                                rows={5}
                                                placeholder='; division'
                                                value={desState.postContent}
                                                onChange={changePostContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className='division-line'></div>
                            <div className='block-title'>Action List</div>

                            {state.operationList && state.operationList.length ? (
                                <div
                                    className='now-promo-code'
                                    style={{
                                        // border: '2px dashed rgb(238,238,238)',
                                        marginLeft: '16.8%',
                                        marginBottom: '20px',
                                        maxHeight: '300px',
                                        overflowY: 'scroll'
                                    }}>

                                    <List
                                                itemLayout="horizontal"
                                                dataSource={state.operationList}
                                                renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                    title={ item.action_by + '    did    ' +  item.update}
                                                    description={getYearMonthDayTimeNew(item.create_time)}
                                                    />
                                                </List.Item>
                                                )}
                                            />    
                                        
                                </div>
                            ) : null} */}

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
export default AddCampaign
