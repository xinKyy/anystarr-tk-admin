import React from 'react'
import { Layout, Row, Col, Divider, Select, Form, Input, Button, Checkbox, message } from 'antd'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import '@/style/view-style/index.less'
import { APIAddAccount, APIcreateAccount } from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'

const { Option } = Select

const isAccount = JSON.parse(localStorage.getItem('u')).permission.account

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

const AddAccount = () => {
    const onFinish = values => {
        if (!isAccount) {
            return message.error('你没有权限')
        }
        console.log('Success:', values)
        if (values.permissions) {
            values.permissions = values.permissions.toString()
        }
        APIcreateAccount(values)
            .then(resp => {
                console.log('resp', resp)
                message.success('创建成功')
            })
            .catch(err => {
                console.log('err', err)
            })
        // axios
        //     .post(`${API}/account/create2`, { ...values })
        //     .then(res => {
        //         if (res.data.code === 0) {
        //         } else {
        //         }
        //     })
        //     .catch(err => {})
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    const permissionArr = [
        { label: '账号', value: 'account' },
        { label: '经济', value: 'finance' },
        { label: '数据', value: 'data' },
        { label: '配置', value: 'config' }
    ]

    const handleChange = val => {
        console.log('val', val)
    }

    return (
        <Layout className='index animated fadeIn'>
            <WebBreadcrumbNew title='新增账号' />
            <div className='base-style base-detail' id='demoline'>
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
                                label='手机号'
                                name='account'
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机号'
                                    }
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label='密码'
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码'
                                    }
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label='用户名'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名'
                                    }
                                ]}>
                                <Input />
                            </Form.Item>
                            {localStorage.getItem('u') && JSON.parse(localStorage.getItem('u')).permission.account ? (
                                <Form.Item label='用户权限' name='permissions'>
                                    <Select
                                        mode='multiple'
                                        style={{ width: '100%' }}
                                        placeholder='请选择'
                                        onChange={handleChange}>
                                        {permissionArr &&
                                            permissionArr.map((option, index) => {
                                                return (
                                                    <Option key={index} value={option.value}>
                                                        {option.label}
                                                    </Option>
                                                )
                                            })}
                                    </Select>
                                </Form.Item>
                            ) : null}
                            <Form.Item {...tailLayout}>
                                <Button type='primary' htmlType='submit'>
                                    保存
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12} />
                </Row>
            </div>
        </Layout>
    )
}

export default AddAccount
