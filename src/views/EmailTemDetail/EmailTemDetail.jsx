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
    Upload
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
    APICreateOrModifyMerchant,
    APIGetEmailTemDetail,
    APICreateEmailTem,
    APIModifyEmailTem,
    APIMessageTemType
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
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

const { TextArea } = Input

const { Option } = Select

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const MerchantDetail = props => {
    const [state, setState] = useState({
        id: '12',
        fullName: 'hhh',
        displayName: 'display',
        logo: '',
        category: 1,
        typeTemplate: []
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
        values = {
            ...values
        }
        console.log('props.match.params.id', props.match.params.id)
        if (props.match.params.id !== '0') {
            console.log('edit')
            APIModifyEmailTem(JSON.stringify(values)).then(resp => {
                props.history.push('/campaigns_ma/email_tem')
            })
        } else {
            APICreateEmailTem(JSON.stringify(values)).then(resp => {
                props.history.push('/campaigns_ma/email_tem')
            })
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

    const setTaskDescription = () => {}

    const initForm = () => {
        if (props.match.params.id) {
            APIGetEmailTemDetail({ id: props.match.params.id }).then(resp => {
                form.setFieldsValue({
                    ...resp.data.messageTemplate
                })
            })
        }
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

    const uploadFile = ({ file, onSuccess }) => {
        // uid: '-1',
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            setState({
                logo: resp.data.url
            })
        })
    }

    const uploadPromoCode = ({ file, onSuccess }) => {
        APIUploadPromoCode({ file: file }).then(resp => {
            onSuccess()
            setPromoCode(resp.data.data)
        })
    }
    const getTemplateType = val => {
        APIMessageTemType(val).then(resp => {
            let resTypeTemplate = []
            for (let i in resp.data.messageTypes) {
                resTypeTemplate.push({
                    label: resp.data.messageTypes[i],
                    value: Number(i)
                })
            }
            console.log('typeTemplate', resTypeTemplate)
            setState({
                ...state,
                typeTemplate: resTypeTemplate
            })
        })
    }

    const changeCategory = val => {
        setState({
            ...state,
            category: val
        })
        getTemplateType({ type: val })
    }

    useEffect(() => {
        // getCountryList()
        getTemplateType()
        initForm()
    }, [])

    return (
        <Layout className='animated fadeIn'>
            <WebBreadcrumbNew title='Email Template detail' />
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
                                <Col span={18}>
                                    <Form.Item label='Merchant ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item label='Category' name='category'>
                                        <Select
                                            onChange={changeCategory}
                                            disabled={props.match.params.id !== '0' ? true : false}>
                                            <Option value={1}>Email Template</Option>
                                            <Option value={2}>Notification Template</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item label='Type' name='type'>
                                        <Select>
                                            {/* <Option value={1}>Verification code email</Option>
                                            <Option value={2}>welcome email</Option>
                                            <Option value={3}>activation email</Option>
                                            <Option value={4}>Customer service reply email</Option>
                                            <Option value={5}>xixi</Option> */}
                                            {state.typeTemplate.length &&
                                                state.typeTemplate.map((item, index) => {
                                                    return (
                                                        <Option key={item.label} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    )
                                                })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item label='Language' name='language'>
                                        <Select>
                                            <Option value={1}>English</Option>
                                            <Option value={2}>French</Option>
                                            <Option value={3}>Spanish</Option>
                                            <Option value={4}>Polish</Option>
                                            <Option value={5}>Portuguese</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item label='Title' name='title'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item label='Content' name='content'>
                                        <TextArea rows={10} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item {...tailLayout}>
                                <div>
                                    <Button type='primary' htmlType='submit' style={{ marginLeft: '30px' }}>
                                        Save
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

export default MerchantDetail
