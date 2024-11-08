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
    Radio,
    Progress
} from 'antd'
import moment from 'moment'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import '@/style/view-style/index.less'
import {
    APIcreateArea,
    APIGetCountryList,
    APICreateModifyCampaign,
    APIUploadFile,
    APICreateOrModify,
    APIUploadReceiver,
    APIDownloadReceiver,
    APIPostTaskDetail
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
import { post } from 'jquery'
import TextArea from 'antd/lib/input/TextArea'
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
const channelOption = [
    { label: 'In App messaging', value: 1 },
    { label: 'Push notification', value: 2 }
]

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const CreatePost = props => {
    const [state, setState] = useState({
        receiveList: [],
        type: '1',
        sourceType: '2',
        sourceFile: '',
        category: '',
        uploadProgress: 0,
        uploadProgressVisible: false
    })
    const [formState, setFormState] = useState({})
    const [form] = Form.useForm()
    const [country, setCountry] = useState([{ name: 'china', value: '1' }])
    const [language, setLanguage] = useState([
        { name: 'English', value: 'English' },
        { name: 'French', value: 'French' },
        { name: 'Spanish', value: 'Spanish' }
    ])
    const [merchant, setMerchant] = useState([{ name: 'merchant1', value: '1' }])
    const [taskDes, setTaskDes] = useState(' ')
    const [promoCode, setPromoCode] = useState([])

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
        console.log('value', values)
        let id = props.match.params.id
        let taskSchedule = new Date(values['task_schedule'].format('YYYY-MM-DD HH:mm:ss')).getTime()
        values.source_file = state.sourceFile
        values.channel = JSON.stringify(values.channel)

        values = {
            ...values,
            task_schedule: taskSchedule
        }
        if (values.source_file_type == 1) {
            values.source_file = state.sourceFile
        }
        if (id && id !== '0') {
            values.id = id
        } else {
            values.receiver_list = JSON.stringify(state.receiveList)
        }

        console.log('Received values of form: ', values)
        APICreateOrModify({ postTaskJson: JSON.stringify(values) }).then(resp => {
            props.history.push('/postManagement/postList')
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

    const initForm = () => {
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        console.log('query', query)
        if (query.id && query.id !== '0') {
            APIPostTaskDetail({ id: query.id }).then(resp => {
                let postTaskInfo = resp.data.postTaskInfo
                form.setFieldsValue({
                    ...postTaskInfo,
                    task_schedule: moment(postTaskInfo.task_schedule)
                })
                setState({
                    ...state,
                    receiveList: postTaskInfo.receiver_list ? JSON.parse(postTaskInfo.receiver_list) : [],
                    type: postTaskInfo.type,
                    sourceType: postTaskInfo.source_file_type,
                    sourceFile: postTaskInfo.source_file,
                    category: postTaskInfo.category
                })
            })
        } else {
            console.log('新增')
            form.setFieldsValue({
                type: 1,
                source_file_type: '2'
            })
            setState({
                ...state,
                receiveList: query.receiver_list ? JSON.parse(query.receiver_list) : [],
                source_file_type: '2',
                type: 1
            })
        }
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

    const ReceiverUploadFile = ({ file, onSuccess }) => {
        let id = props.match.params.id
        let params = { file: file }
        if (id && id !== '0') {
            params.id = id
        }
        APIUploadReceiver(params).then(resp => {
            onSuccess()
            setState({
                ...state,
                receiveList: resp.data.data
            })
        })
    }

    const downloadReceiver = () => {
        let id = props.location.query.id
        APIDownloadReceiver({ id: id }).then(resp => {
            message.success('had send your email')
        })
    }

    const setTypeTo = value => {
        setState({
            ...state,
            sourceType: value.target.value
        })
    }

    const typeChange = e => {
        console.log('tttype', e.target.value)
        setState({
            ...state,
            type: e.target.value
        })
    }

    const categoryChange = category => {
        setState({
            ...state,
            category: category
        })
    }

    const uploadPic = ({ file, onSuccess }) => {
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
        APIUploadFile({ file, file }).then(resp => {
            onSuccess()
            let picUrl = resp.data.url
            clearInterval(timer)
            setState({
                ...state,
                sourceFile: picUrl
            })
        })
    }

    const changeSourceFile = e => {
        console.log('data', e.target.value)
        setState({
            ...state,
            sourceFile: e.target.value
        })
    }

    useEffect(() => {
        initForm()
        console.log('propp', props.location)
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <div>
                <WebBreadcrumbNew title='Post Info' />
            </div>
            <div className='base-style base-detail' id='demoline'>
                <Row>
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
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Title' name='title' rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Language' name='language' rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Content' name='content' rules={[{ required: true }]}>
                                        <TextArea />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Category' name='category'>
                                        <Select onChange={categoryChange}>
                                            <Option value='Promotions'>anyStarr Promotions</Option>
                                            <Option value='Updates'>anyStarr Updates</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Task Schedule' name='task_schedule' {...config}>
                                        <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Source file type'
                                        name='source_file_type'
                                        rules={[{ required: true }]}>
                                        <Radio.Group onChange={setTypeTo} value={state.sourceType}>
                                            <Radio value='1'>Html link</Radio>
                                            <Radio value='2'>Upload image</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label=' Source file ' name='source_file'>
                                        {state.sourceType == '1' ? (
                                            <Input onChange={changeSourceFile} value={state.sourceFile} />
                                        ) : (
                                            <div>
                                                <Upload customRequest={uploadPic}>
                                                    <Button icon={<UploadOutlined />}>Click to Upload </Button>
                                                </Upload>
                                                {state.uploadProgressVisible ? (
                                                    <Progress
                                                        percent={state.uploadProgress}
                                                        className='file-upload-progress'
                                                    />
                                                ) : null}
                                                <img
                                                    style={{
                                                        width: '300px',
                                                        display: 'block',
                                                        margin: '10px 0 10px 0'
                                                    }}
                                                    src={state.sourceFile}
                                                />
                                                <Input value={state.sourceFile} onChange={changeSourceFile} />
                                            </div>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Channel' name='channel' rules={[{ required: true }]}>
                                        <Checkbox.Group options={channelOption}></Checkbox.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Post to all user' name='type'>
                                        <Radio.Group onChange={typeChange}>
                                            <Radio value={1}>Yes</Radio>
                                            <Radio value={2}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.type != '1' ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item name='receiver_list' label='Receiver list'>
                                            <Upload customRequest={ReceiverUploadFile}>
                                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                            </Upload>
                                            <div className='file-list'>
                                                {state.receiveList.map((item, index) => {
                                                    return (
                                                        <div key={item} className='file-item'>
                                                            <div className='item-body'>
                                                                <span>User Name {item.user_name}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}

                            <Row>
                                <Col span={12} offset={2}>
                                    {props.location.query && props.location.query.id ? (
                                        <Button onClick={downloadReceiver} style={{ marginTop: '30px' }}>
                                            Download Receiver
                                        </Button>
                                    ) : null}
                                </Col>
                            </Row>

                            <Form.Item {...tailLayout}>
                                <div style={{ marginTop: '20px' }}>
                                    <Button type='primary' htmlType='submit' style={{ marginLeft: '30px' }}>
                                        Submit
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default CreatePost
