import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Input, Form, Button, Divider, message, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { APILogin } from '@/mapi'
// import axios from '@/api'
// import { API } from '@/api/config'
import '@/style/view-style/login.less'

const Login = props => {
    const [loading, setLoading] = useState(false)

    const handleSubmitFinish = values => {
        console.log('Success:', values)
        APILogin(values).then(resp => {
            localStorage.setItem('userInfo', JSON.stringify(resp.data.data))
            props.history.push('/index')
        })

        // 这里可以做权限校验 模拟接口返回用户权限标识
        // props.history.push('/')

        // APIlogin(values)
        //     .then(resp => {
        //         values.auth = 0
        //         console.log('resp', resp)
        //         message.success('登录成功!')
        //         localStorage.setItem('token', resp.data.token)
        //         localStorage.setItem('uid', resp.data.user_id)
        //         localStorage.setItem('user', JSON.stringify(values))

        //         // props.history.push("/");
        //     })
        //     .then(() => {
        //         APIgetUserInfo().then(res => {
        //             console.log('res', res)
        //             localStorage.setItem('u', JSON.stringify(res.data))
        //             props.history.push('/')
        //         })
        //     })
    }

    const handleSubmitFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }

    useEffect(() => {}, [])

    return (
        <Layout className='login animated fadeIn'>
            <div className='model'>
                <div className='login-form'>
                    <h3 style={{ textAlign:'center' }}>anyStarr admin portal</h3>
                    <Divider />
                    <Form onFinish={handleSubmitFinish} onFinishFailed={handleSubmitFinishFailed}>
                        <Form.Item
                            // label="Username"
                            name='account'
                            rules={[{ required: true, message: 'Email' }]}>
                            <Input placeholder='Email' prefix={<UserOutlined className='site-form-item-icon' />} />
                        </Form.Item>
                        <Form.Item
                            // label="Password"
                            name='password'
                            rules={[{ required: true, message: 'Password' }]}>
                            <Input.Password
                                type='password'
                                placeholder='Password'
                                prefix={<LockOutlined className='site-form-item-icon' />}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' className='login-form-button' loading={loading}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Layout>
    )
}

export default withRouter(Login)
