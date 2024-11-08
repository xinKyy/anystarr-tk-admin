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
    APIGetCrmUserDetail,
    APICreateOrModifyCrmUser,
    APIGetUserNeedRole
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

    const [roleListState, setRoleListState] = useState({
        roleList: []
    })

    const onFinish = values => {
        let id = props.match.params.id
        let params = {
            nickname: values.nickname,
            email: values.email,
            role_ids: values.role_ids
        }
        if (id != 0) {
            params.id = id
        }
        APICreateOrModifyCrmUser({
            crmUserJson: JSON.stringify(params)
        }).then(resp => {
            props.history.push('/permissions/system_user')
        })
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }

    const initForm = () => {
        // let query = props.location.query || (sessionStorage.getItem('query')?JSON.parse(sessionStorage.getItem('query')):{})
        // console.log('query', query)
        // if (query) {
        //     form.setFieldsValue({
        //         ...query,
        //         id: query.id,
        //         fullName: query.fullName,
        //         displayName: query.displayName,
        //     })
        //     setState({
        //         ...state,
        //         logo: query.logo
        //     })
        // }
        let id = props.match.params.id
        if (id == 0) {
            return
        }
        APIGetCrmUserDetail({ id: id }).then(resp => {
            let roleList = resp.data.data.user_role_list
            let roleIds = []
            roleList.map(item => {
                roleIds.push(item.id)
            })

            form.setFieldsValue({
                nickname: resp.data.data.nickname,
                email: resp.data.data.email,
                id: resp.data.data.id,
                role_ids: roleIds
            })
        })
    }

    const getRoleList = () => {
        APIGetUserNeedRole().then(resp => {
            setRoleListState({
                roleList: resp.data.data
            })
        })
    }

    useEffect(() => {
        initForm()
        getRoleList()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <WebBreadcrumbNew title='System user info' />
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
                                    <Form.Item label='System User ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
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
                                    <Form.Item
                                        label='Name'
                                        name='nickname'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Instagram is missing'
                                            }
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Role'
                                        name='role_ids'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Instagram is missing'
                                            }
                                        ]}>
                                        <Select mode='multiple'>
                                            {roleListState.roleList.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
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
