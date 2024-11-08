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
    Table,
    Image,
    Modal,
    Descriptions,
    Tag
} from 'antd'
import moment from 'moment'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import '@/style/view-style/index.less'
import {
    APIcreateArea,
    APIGetCountryList,
    APICreateModifyCampaign,
    APIUploadFile,
    APIUploadPromoCode,
    APIGetTaskDetail,
    APIExamineTask,
    APILikeMessage,
    APICloseTicket,
    APIGetMessageDetail,
    APIMessageReply
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
import TextArea from 'antd/lib/input/TextArea'
import { now } from 'jquery'
import Cookies, { set } from 'js-cookie'
import webhost from '@/tools/webhost.js'
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
        offset: 10,
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

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Update Time',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (text, item) => new Date(text).toLocaleString()
    },
    {
        title: 'Action by',
        dataIndex: 'action_by',
        key: 'action_by',
        align: 'center'
    },
    {
        title: 'What is updated',
        dataIndex: 'update',
        key: 'update',
        align: 'center'
    }
]

const contatcColumn = [
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
        align: 'center'
    },
    {
        title: 'from',
        dataIndex: 'from_user',
        key: 'from_user',
        align: 'center'
    },
    {
        title: 'User read ',
        dataIndex: 'read_status',
        key: 'read_status',
        render: (text, item) => {
            return text == '0' ? 'Yes' : 'No'
        }
    },
    {
        title: 'images',
        dataIndex: 'images',
        key: 'images',
        align: 'center',
        render: (text, item) => (
            <div style={{ display: 'flex' }}>
                {text &&
                    JSON.parse(text).map((url, index) => {
                        console.log('urlll,', url)
                        return (
                            // <a href={url} target='_blank'>
                            //     <img src={url} key={index} style={{ width: '60px', marginLeft: '5px' }} />
                            // </a>
                            <Image src={url} key={url} width={60} style={{ marginLeft: '5px' }} />
                        )
                    })}
            </div>
        )
    },
    {
        title: 'update_time',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (text, item) => new Date(text).toLocaleString()
    }
]

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
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

    useEffect(() => {}, [])

    return (
        <Modal
            visible={visible}
            title='审核任务'
            okText='Submit'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        values.id = formData.id
                        values.task_id = formData.task_id
                        values.status = formData.status
                        onCreate(values)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='review_reason' label='review_reason' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const MessageDetail = props => {
    const [state, setState] = useState({
        logList: [],
        description: '',
        visible: false,
        formData: {},
        images: [],
        contactList: [],
        bannerList: []
    })
    const [form] = Form.useForm()
    const [country, setCountry] = useState([{ name: 'china', value: '1' }])
    const [language, setLanguage] = useState([
        { name: 'Chinese', value: '1' },
        { name: 'English', value: '2' }
    ])
    const [merchant, setMerchant] = useState([{ name: 'merchant1', value: '1' }])
    const [taskDes, setTaskDes] = useState(' ')
    const [promoCode, setPromoCode] = useState([])

    const userInfo = JSON.parse(Cookies.get('crm_user_info'))
    const nickName = decodeURI(userInfo.c_nk)

    let { editorState, outputHTML } = state

    let editorChange = editorState => {
        setState(prevState => {
            return { ...prevState, editorState, outputHTML: editorState.toHTML() }
        })
    }

    const saveDraft = () => {
        console.log('saveDraft')
    }

    const onFinish = values => {
        let query = props.location.query
        values = {
            ...values,
            start_time: values['start_time'].format('YYYY-MM-DD HH:mm:ss'),
            close_time: values['close_time'].format('YYYY-MM-DD HH:mm:ss'),
            post_start_time: values['post_start_time'].format('YYYY-MM-DD HH:mm:ss'),
            post_close_time: values['post_close_time'].format('YYYY-MM-DD HH:mm:ss'),
            task_start_time: values['task_start_time'].format('YYYY-MM-DD HH:mm:ss'),
            task_close_time: values['task_close_time'].format('YYYY-MM-DD HH:mm:ss'),
            banner: state.bannerList,
            rules_description: editorState.toHTML(),
            promo_code_list: promoCode,
            task_description: taskDes
        }
        if (!promoCode.length) {
            delete values.promo_code_list
        }
        if (query) {
            values.id = query.id
        }
        console.log('Received values of form: ', values)
        APICreateModifyCampaign({ campaignJson: JSON.stringify(values) }).then(resp => {
            props.history.push('/campaigns')
        })
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

    const setTaskDescription = () => {}

    const initForm = () => {
        let id = props.match.params.id

        console.log('idddd', id)

        APIGetMessageDetail({ id: id }).then(resp => {
            let query = resp.data.data
            let nowTime = new Date().getTime()
            let closeTime = !query.close_time ? nowTime : new Date(query.close_time).getTime()
            let createTime = new Date(query.create_time).getTime()
            let timeCha = Math.floor((closeTime - createTime) / (3600 * 24 * 1000))
            let lead_time = timeCha + 'day ago'

            let images = JSON.parse(query.images)

            // let Status = query.status == 10? 'Wait': query.status == 2? 'Ticket In Progress': 'Ticket Closed'
            let Status =
                query.read_status === null
                    ? 'New ticket'
                    : query.status == 10
                    ? 'Waiting for reply'
                    : query.status == 9
                    ? 'Replied'
                    : query.status == 0
                    ? 'Close'
                    : ''
            form.setFieldsValue({
                id: query.id,
                from_user: query.from_user,
                status: Status,
                create_time: new Date(query.create_time).toLocaleString(),
                topic: query.topic,
                lead_time: lead_time,
                country: query.country
            })
            setState({
                ...state,
                description: '',
                logList: query.messageLog_list,
                formData: query,
                images: images,
                contactList: query.message_reply_record_list,
                id: query.id
            })
        })
    }

    const setTaskDesValueTo = data => {
        console.log('大医院', data)
        let resArr = data.split(';')
        console.log('resArrrrrr', resArr)
    }

    const setTypeTo = data => {
        console.log('setTypeTo', data)
        if (data == '1') {
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

    const deleteFile = index => {
        let bannerList = state.bannerList
        bannerList.splice(index, 1)
        setState({
            ...state,
            bannerList: bannerList
        })
    }

    const uploadPromoCode = ({ file, onSuccess }) => {
        APIUploadPromoCode({ file: file }).then(resp => {
            onSuccess()
            setPromoCode(resp.data.data)
        })
    }

    const onCreate = values => {
        console.log('valuessss', values)
        APIExamineTask({ taskRecordJson: JSON.stringify(values) }).then(resp => {
            message.success('success')
            setState({
                ...state,
                visible: false
            })
            props.history.push('/task')
        })
    }

    const examClick = (state, status) => {
        console.log('state', state)
        console.log('status', status)
        setState({
            ...state,
            visible: true,
            formData: {
                id: state.reviewContent.id,
                task_id: state.reviewContent.task_id,
                status: status
            }
        })
    }

    const actionClick = () => {
        console.log('xiix')
        let id = state.formData.id
        if (state.formData.status == 1) {
            APILikeMessage({ id: id }).then(resp => {
                props.history.push('/messages')
            })
        }
        if (state.formData.status == 2) {
            APICloseTicket({ id: id }).then(resp => {
                props.history.push('/messages')
            })
        }
    }

    const sendAsk = () => {
        console.log('statedescr', state.description)
        APIMessageReply({
            messageReplyJson: JSON.stringify({
                ticket_id: state.id,
                description: state.description,
                images: state.bannerList
            })
        }).then(resp => {
            message.success('success')
            initForm()
            setState({
                ...state,
                bannerList: []
            })
        })
    }

    const desChange = e => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const uploadFile = ({ file, onSuccess }) => {
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

    useEffect(() => {
        getCountryList()
        initForm()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <DetailModal
                visible={state.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setState({ ...state, visible: false })
                }}
                formData={state.formData}
                disabled={state.disabled}
            />
            <WebBreadcrumbNew title='Ticket detail' />
            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Descriptions title='Ticket info'>
                            <Descriptions.Item label='Ticket ID'>{state.formData.id}</Descriptions.Item>
                            <Descriptions.Item label='From'>
                                <a href={webhost + '/userDetail/' + state.formData.user_id} target='_blank'>
                                    {state.formData.from_user}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label='Status'>{state.formData.status}</Descriptions.Item>
                            <Descriptions.Item label='Ticket created at'>
                                {state.formData.create_time}
                            </Descriptions.Item>
                            <Descriptions.Item label='Topic'>{state.formData.topic}</Descriptions.Item>
                            <Descriptions.Item label='Lead time'>{state.formData.lead_time}</Descriptions.Item>
                            {/* <Descriptions.Item label='Address'>{state.formData.address}</Descriptions.Item> */}
                            <Descriptions.Item label='Country'>
                                <Tag color='geekblue'>{state.formData.country}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail'>
                <h3 style={{ marginBottom: '10px' }}>contact history</h3>
                <Row>
                    <Col span={24}>
                        <Table columns={contatcColumn} dataSource={state.contactList} />
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail'>
                <h3 style={{ marginBottom: '10px' }}>reply</h3>
                <Row>
                    <Col span={8} offset={1}>
                        <TextArea onChange={desChange} value={state.description} rows={6} />
                    </Col>
                </Row>
                <h3 style={{ marginBottom: '10px' }}>images</h3>
                <Row>
                    <Col span={8} offset={1}>
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
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Button onClick={sendAsk} type='primary' style={{ float: 'right', marginTop: '10px' }}>
                            send
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail' id='demoline'>
                <h3 style={{ marginBottom: '10px' }}>Review history</h3>
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={state.logList} />
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default MessageDetail
