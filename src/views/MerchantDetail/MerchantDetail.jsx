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
    APICreateOrModifyMerchant
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

const { Option } = Select

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const MerchantDetail = props => {
    const [state, setState] = useState({
        id: '12',
        fullName: 'hhh',
        displayName: 'display',
        logo: ''
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
        let query = props.location.query
        values = {
            ...values,
            logo: state.logo
        }
        if (query) {
            values.id = query.id
        }
        console.log('Received values of form: ', values)
        APICreateOrModifyMerchant({ merchantJson: JSON.stringify(values) }).then(resp => {
            props.history.push('/campaigns_ma/merchant')
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
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        console.log('query', query)
        if (query) {
            form.setFieldsValue({
                ...query,
                id: query.id,
                fullName: query.fullName,
                displayName: query.displayName
            })
            setState({
                ...state,
                logo: query.logo
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

    useEffect(() => {
        // getCountryList()
        initForm()
    }, [])

    return (
        <Layout className='animated fadeIn'>
            <WebBreadcrumbNew title='merchant detail' />
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
                                    <Form.Item label='Merchant ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Merchant full name' name='full_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Merchant display name' name='display_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item name='logo' label='Upload merchant logo'>
                                        <Upload customRequest={uploadFile}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                        {state.logo ? (
                                            <img
                                                alt='logo'
                                                style={{ width: '240px', display: 'block', margin: '10px 0 0 0' }}
                                                src={state.logo}
                                            />
                                        ) : null}
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
