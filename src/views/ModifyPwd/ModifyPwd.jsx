import React from 'react'
import { Layout, Row, Col, Divider, Select, Form, Input, Button, Checkbox, message } from 'antd'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import '@/style/view-style/index.less'
import { APImodifyPwd } from '@/mapi'

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
        offset: 8,
        span: 16
    }
}

const ModifyPwd = () => {
    const onFinish = values => {
        console.log('Success:', values)
        APImodifyPwd({
            crmUserJson:JSON.stringify({
                ...values
            })

        }).then(resp => {
                console.log('resp', resp)
                message.success('success')
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }
    return (
        <Layout className='index animated fadeIn'>
            <div>
                <WebBreadcrumb arr={['change password']} />
            </div>
            <div className='base-style' id='demoline'>
                <Row>
                    <Col span={12}>
                        <Form
                            {...layout}
                            name='basic'
                            initialValues={{
                                remember: true
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <Form.Item
                                label='Old password'
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label='New password'
                                name='new_password'
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label='New password again'
                                name='confirm_password'
                                rules={[
                                    {
                                        required: true,
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve()
                                        }

                                        return Promise.reject(
                                            'The two passwords that you entered do not match!'
                                            // getValue('register.passwordConfirmRegx',language)
                                        )
                                        },
                                    }),
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type='primary' htmlType='submit'>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12}></Col>
                </Row>
            </div>
        </Layout>
    )
}

export default ModifyPwd
