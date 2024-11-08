import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Select, Form, Input, Button, Radio } from 'antd'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import '@/style/view-style/index.less'
import { APICreateUser } from '@/mapi'
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
const { Option } = Select

const MerchantDetail = props => {
    const [state, setState] = useState({
        id: '12',
        fullName: 'hhh',
        displayName: 'display',
        logo: '',
        socialType: 1
    })
    const [form] = Form.useForm()
    const [language, setLanguage] = useState([
        { name: 'English', value: 'English' },
        { name: 'French', value: 'French' },
        { name: 'Spanish', value: 'Spanish' },
        { name: 'Polish', value: 'Polish' },
        { name: 'Portuguese', value: 'Portuguese' }
    ])

    const onFinish = values => {
        let confirmModal = window.confirm('Please confirm info is correct')
        let params = {
            // instagram: values.instagram,
            email: values.email,
            language: values.language,
            ...values
        }
        if (confirmModal == true) {
            APICreateUser({
                userJson: JSON.stringify(params)
            }).then(resp => {
                props.history.push('/account/account')
            })
        }
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }
    const setTypeTo = value => {
        setState({
            ...state,
            socialType: value.target.value
        })
    }

    useEffect(() => {}, [])

    return (
        <Layout className='index animated fadeIn'>
            <div>
                <WebBreadcrumbNew title='Create account ' />
            </div>
            <div className='base-style base-detail' id='demoline' style={{ paddingTop: '50px' }}>
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
                                    <Form.Item
                                        label='Email'
                                        name='email'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Email is missing'
                                            },
                                            {
                                                type: 'email',
                                                message: 'Email is not validate email!'
                                            }
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Social account type' name='social_account_type'>
                                        <Radio.Group onChange={setTypeTo} defaultValue={state.socialType}>
                                            <Radio value={1}>Instagram</Radio>
                                            <Radio value={2}>Tik Tok</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.socialType == 1 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item rules={[{ required: true }]} label='Instagram' name='instagram'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : state.socialType == 2 ? (
                                <Row>
                                    <Col span={12}>
                                        <Form.Item rules={[{ required: true }]} label='TikTok' name='tiktok'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}
                            <Col span={12}>
                                <Form.Item label='Language' name='language' rules={[{ required: true }]}>
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

                            <Form.Item {...tailLayout}>
                                <div>
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

export default MerchantDetail
