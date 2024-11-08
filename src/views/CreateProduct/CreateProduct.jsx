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
    APIGetSkuList,
    APIUploadProductCode,
    APICreateProduct,
    APIGetProductDetail,
    APIEditProduct,
    APIDownloadProductCode
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
import { withRouter } from 'react-router-dom'
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
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

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const CreateProduct = props => {
    const [state, setState] = useState({
        id: '12',
        fullName: 'hhh',
        displayName: 'display',
        img_url: '',
        isPinned: false
    })

    const [productCodeList, setProductCodetList] = useState([])

    const [categoryList, setCategoryList] = useState([])

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
        let id = props.match.params.id
        values = {
            ...values,
            img_url: state.img_url,
            productCodeList: productCodeList,
            is_pinned: values.is_pinned ? 1 : 0
        }

        if (id && id != '0') {
            values.id = id
            APIEditProduct(JSON.stringify(values)).then(resp => {
                message.success('success')
                props.history.push('/order_management/sample_list')
            })
        } else {
            APICreateProduct(JSON.stringify(values)).then(resp => {
                message.success('success')
                props.history.push('/order_management/sample_list')
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
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        console.log('query', query)
        let id = props.match.params.id
        if (id && id !== '0') {
            APIGetProductDetail({ id: id }).then(resp => {
                let proDetail = resp.data.productDetail
                form.setFieldsValue({
                    ...proDetail
                })
                setState({
                    ...state,
                    ...proDetail,
                    isPinned: proDetail.is_pinned == 1 ? true : false
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
                img_url: resp.data.url
            })
        })
    }

    const uploadProductCode = ({ file, onSuccess }) => {
        APIUploadProductCode({ file: file }).then(resp => {
            onSuccess()
            setProductCodetList(resp.data.productCodeList)
        })
    }

    const deleteProductCode = () => {
        setProductCodetList([])
    }

    const getSku = () => {
        APIGetSkuList({ categoryJson: JSON.stringify({ page_size: 100 }) }).then(resp => {
            let list = resp.data.list
            setCategoryList(list)
        })
    }

    const changePinn = data => {
        console.log('data', data)
        setState({
            ...state,
            isPinned: data
        })
    }

    useEffect(() => {
        // getCountryList()
        initForm()
        getSku()
    }, [])

    return (
        <Layout className='animated fadeIn'>
            <WebBreadcrumbNew title='Product detail' />
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
                                    <Form.Item label='Product ID' name='product_id'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Product Name' name='product_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Category' name='category'>
                                        <Select>
                                            {categoryList.map((item, index) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.shown_name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item name='img_url' label='Product Photo'>
                                        <Upload customRequest={uploadFile}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                        {state.img_url ? (
                                            <img
                                                alt='img_url'
                                                style={{ width: '240px', display: 'block', margin: '10px 0 0 0' }}
                                                src={state.img_url}
                                            />
                                        ) : null}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Product Link' name='product_url'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Status' name='status'>
                                        <Select>
                                            <Option value={1}>in stock</Option>
                                            <Option value={0}>out of stock</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Pin to homepage' name='is_pinned' valuePropName='checked'>
                                        <Switch onChange={changePinn} />
                                    </Form.Item>
                                </Col>
                                {state.isPinned ? (
                                    <Col span={12}>
                                        <Form.Item label='Tag' name='tag'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                ) : null}
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name='productCodeList' label='Product code list'>
                                        <Upload customRequest={uploadProductCode}>
                                            <Button icon={<UploadOutlined />}>Click to Upload product code</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Button type='primary' onClick={deleteProductCode}>
                                        Delete code
                                    </Button>
                                </Col>
                            </Row>
                            {productCodeList ? (
                                <div
                                    style={{
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px dashed #eee'
                                    }}>
                                    {productCodeList.map((item, index) => {
                                        return (
                                            <div style={{ marginBottom: '6px' }} key={index}>
                                                {item.code}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : null}

                            {state.productCodeList && state.productCodeList.length ? (
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
                                            Total Code: {state.productCodeList.length}
                                        </div>
                                        <a
                                            style={{
                                                backgroundColor: '#1890ff',
                                                color: '#fff',
                                                padding: '8px 15px',
                                                marginLeft: '10px'
                                            }}
                                            href={APIDownloadProductCode(props.match.params.id)}
                                            type='download'>
                                            download product code
                                        </a>
                                    </div>
                                    {state.productCodeList.map((item, index) => {
                                        return (
                                            <div className='cam-promo-code' key={index}>
                                                <div> Code: {item.code} </div>
                                                <div>Product ID: {item.product_id} </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : null}

                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Description' name='descrption'>
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Ext info' name='ext_info'>
                                        <TextArea rows={3} />
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

export default withRouter(CreateProduct)
