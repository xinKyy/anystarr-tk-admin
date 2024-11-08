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
    APIGetRoleNeedPermissions,
    APICreateOrModifyRole,
    APIGetRoleDetail
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
        logo: '',

        allPermissionsList: [],
        selectPermissions: []
    })
    const [form] = Form.useForm()

    const onFinish = values => {
        let id = props.match.params.id
        let params = {
            name: values.name,
            admin: values.name === 'Super admin' ? 1 : 0,
            descrption: values.description,
            permission_ids: state.selectPermissions
        }
        if (id != 0) {
            params.id = id
        }
        APICreateOrModifyRole({
            roleJson: JSON.stringify(params)
        }).then(resp => {
            props.history.push('/permissions/role')
        })
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }

    const initForm = allPermissionsList => {
        let id = props.match.params.id
        if (id == 0) {
            setState({
                ...state,
                allPermissionsList: allPermissionsList
            })
            return
        }

        APIGetRoleDetail({ id: id }).then(resp => {
            form.setFieldsValue({
                name: resp.data.data.name,
                description: resp.data.data.descrption
            })
            let rolePermissionList = resp.data.data.role_permission_list ? resp.data.data.role_permission_list : []
            let rolePList = []
            rolePermissionList.map(item => {
                return item.permission_list.map(itemm => {
                    rolePList.push(itemm.id)
                })
            })

            setState({
                ...state,
                allPermissionsList: allPermissionsList,
                selectPermissions: rolePList
            })
            console.log('rolePList', rolePList)
        })
    }

    const getRoleNeedPermissions = () => {
        APIGetRoleNeedPermissions().then(resp => {
            let allPermissionsList = resp.data.data
            // setState({
            //     ...state,
            //     allPermissionsList: resp.data.data
            // })
            initForm(allPermissionsList)
        })
    }

    const checkFeature = data => {
        console.log('data', data)
        let selectPermissions = state.selectPermissions
        let selectId = data.id
        if (selectPermissions.includes(selectId)) {
            console.log('1')

            let index = selectPermissions.indexOf(selectId)
            selectPermissions.splice(index, 1)
            setState({
                ...state,
                selectPermissions: selectPermissions
            })
        } else {
            console.log('2')
            selectPermissions.push(selectId)
            setState({
                ...state,
                selectPermissions: selectPermissions
            })
        }
    }

    useEffect(() => {
        // getCountryList()

        getRoleNeedPermissions()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <WebBreadcrumbNew title='Role info' />
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
                                    <Form.Item label='Role Name' name='name'>
                                        <Select>
                                            <Option key='Super admin' value='Super admin'>
                                                Super admin
                                            </Option>
                                            <Option key='Operation Manager' value='Operation Manager'>
                                                Operation Manager
                                            </Option>
                                            <Option key='Operation' value='Operation'>
                                                Operation
                                            </Option>
                                            <Option key='Marketing' value='Marketing'>
                                                Marketing
                                            </Option>
                                            <Option key='Customer service' value='Customer service'>
                                                Customer service
                                            </Option>
                                            <Option key='Accountant' value='Accountant'>
                                                Accountant
                                            </Option>
                                            <Option key='Product' value='Product'>
                                                Product
                                            </Option>
                                            <Option key='Logistic' value='Logistic'>
                                                Logistic
                                            </Option>
                                            <Option key='Intern' value='Intern'>
                                                Intern
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Description' name='description'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col
                                    style={{
                                        width: '79%',
                                        margin: '0 auto',
                                        border: '2px dashed #eee',
                                        padding: '30px'
                                    }}>
                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                marginBottom: '20px',
                                                backgroundColor: '#eee',
                                                padding: '10px 0 10px 0'
                                            }}>
                                            <div style={{ minWidth: '400px', textAlign: 'center' }}>
                                                Function module
                                            </div>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    paddingLeft: '40px',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'center'
                                                }}>
                                                Features
                                            </div>
                                        </div>
                                        {state.allPermissionsList.map((item, index) => {
                                            return (
                                                <div style={{ display: 'flex', marginBottom: '20px' }} key={index}>
                                                    {/* <div className="module" style={{minWidth:'400px' }}><Checkbox>{item.modular}</Checkbox> </div> */}
                                                    <div
                                                        className='module'
                                                        style={{ minWidth: '400px', textAlign: 'center' }}>
                                                        {item.modular}
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            paddingLeft: '40px',
                                                            display: 'flex',
                                                            flexWrap: 'wrap'
                                                        }}
                                                        className='feature'>
                                                        {item.permission_list.map((itemm, indexm) => {
                                                            return (
                                                                <div key={indexm} style={{ minWidth: '230px' }}>
                                                                    <Checkbox
                                                                        onChange={() => {
                                                                            checkFeature(itemm)
                                                                        }}
                                                                        checked={state.selectPermissions.includes(
                                                                            itemm.id
                                                                        )}>
                                                                        {itemm.descrption}
                                                                    </Checkbox>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Col>
                            </Row>

                            <Form.Item {...tailLayout}>
                                <div>
                                    <Button type='primary' htmlType='submit' style={{ marginTop: '30px' }}>
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
