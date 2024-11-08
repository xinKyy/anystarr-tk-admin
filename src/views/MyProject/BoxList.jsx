import React, { Component, useEffect, useState } from 'react'
import {
    Layout,
    Row,
    Col,
    Tag,
    Table,
    Button,
    Modal,
    Input,
    Form,
    DatePicker,
    Select,
    Progress,
    InputNumber,
    message
} from 'antd'
import './boxList.less'
import { ProfileOutlined, SettingOutlined } from '@ant-design/icons'
import { APIgetProjectDetail, APIEditProject, APIhandleProject } from '@/mapi'
// import { APIgetProjectTaskList } from "../../mapi";

const { Option } = Select

const getLocalTime = nS => {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
}
const userId = localStorage.getItem('uid')

const HandleModal = ({ visible, onHandleCreate, onHandleCancel, data }) => {
    const [form] = Form.useForm()
    console.log('yuyudata', data)

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }

    return (
        <Modal
            visible={visible}
            title='处理项目'
            okText='保存'
            cancelText='Cancel'
            onCancel={onHandleCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onHandleCreate(values, data)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal_1'>
                <Form.Item name='action' label='操作' rules={[]}>
                    {userId == data.publisher ? (
                        <Select>
                            <Option value='cancel'>Cancel</Option>
                            <Option value='pass'>通过</Option>
                        </Select>
                    ) : (
                        <Select>
                            <Option value='finish'>结束</Option>
                        </Select>
                    )}
                </Form.Item>
                {data.state === 'audited' ? (
                    <div>
                        <Form.Item name='fiat_percent' label='法币奖励度'>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name='score_percent' label='积分奖励度'>
                            <InputNumber />
                        </Form.Item>
                    </div>
                ) : null}
            </Form>
        </Modal>
    )
}

const ProgressModal = ({ visible, onCreate, onCancel, data }) => {
    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }

    const onProgressChange = val => {
        console.log('val', val)
        form.setFieldsValue({
            progress: val
        })
    }

    useEffect(() => {
        console.log('data', data)
        form.setFieldsValue({
            progress: data.progress
        })
    })

    return (
        <Modal
            visible={visible}
            title='修改项目'
            okText='保存'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onCreate(values, data)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='progress' label='进度' rules={[]}>
                    <InputNumber
                        min={0}
                        max={100}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        onChange={onProgressChange}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const BoxList = props => {
    const { dataSource } = props
    console.log('props', props)

    const [detailState, setDetailState] = useState({
        visible: false,
        data: {}
    })

    const [handleState, setHandleState] = useState({
        visible: false,
        data: {}
    })

    const editProgress = data => {
        console.log('data', data)
        let id = data.id
        let params = { id: id }
        APIgetProjectDetail(params)
            .then(resp => {
                console.log('resp', resp)
                let publisher = resp.data.publisher
                let executor = resp.data.executor
                let userId = localStorage.getItem('uid')
                if (userId == publisher || userId == executor) {
                    setDetailState({
                        data: resp.data,
                        visible: true
                    })
                } else {
                    message.error('你没有权限修改')
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const handleProject = data => {
        console.log('data..', data)
        console.log('data', data)
        let id = data.id
        let params = { id: id }
        APIgetProjectDetail(params)
            .then(resp => {
                console.log('resp', resp)
                let publisher = resp.data.publisher
                let executor = resp.data.executor
                let userId = localStorage.getItem('uid')
                if (userId == publisher || userId == executor) {
                    console.log('handle')
                    setHandleState({
                        data: resp.data,
                        visible: true
                    })
                } else {
                    message.error('你没有权限修改')
                }
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const onCreate = (data, oldData) => {
        console.log('aa', data)
        console.log('oldData', oldData)
        let params = {
            id: oldData.id,
            progress: data.progress
        }

        APIEditProject(params)
            .then(resp => {
                message.success('修改成功')
                setDetailState({
                    ...detailState,
                    visible: false
                })
                props.loadList()
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const onHandleCreate = (data, oldData) => {
        console.log('dtdtdt', data)
        data.id = oldData.id
        APIhandleProject(data)
            .then(resp => {
                message.success('处理成功')
                setHandleState({
                    ...handleState,
                    visible: false
                })
                props.loadList()
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    return (
        <div id='boxList'>
            <ProgressModal
                visible={detailState.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setDetailState({
                        ...detailState,
                        visible: false,
                        data: {}
                    })
                }}
                data={detailState.data}
            />
            <HandleModal
                visible={handleState.visible}
                onHandleCreate={onHandleCreate}
                onHandleCancel={() => {
                    setHandleState({
                        ...handleState,
                        visible: false,
                        data: {}
                    })
                }}
                data={handleState.data}
            />
            <div className='box-flex'>
                {dataSource.map(item => {
                    return (
                        <div className='box-block' key={item.key}>
                            <div className='box-border-solid'>
                                <div style={{ height: '40px', lineHeight: '40px' }}>
                                    <div className='box-block-inline'>
                                        <div className='box-title-icon'>
                                            <ProfileOutlined />
                                        </div>
                                    </div>
                                    <div className='box-block-right'>
                                        <SettingOutlined
                                            style={{ fontSize: '20px' }}
                                            rotate='30'
                                            onClick={() => {
                                                // props.clickDetail(item);
                                                handleProject(item)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div
                                    className='box-block-50'
                                    style={{
                                        marginBottom: '10px',
                                        marginLeft: '20%'
                                    }}>
                                    {/* <p style={{ color: '#999', marginBottom: 0, fontSize: '12px' }}>负责人：测试</p> */}
                                </div>
                                <div className='box-block-50'>
                                    <div
                                        className='circle-chart'
                                        onClick={() => {
                                            editProgress(item)
                                        }}>
                                        <Progress
                                            width={85}
                                            type='circle'
                                            percent={item.progress}
                                            format={percent => ` 进行中 ${item.progress}%`}
                                        />
                                    </div>
                                </div>
                                <div className='box-block-50'>
                                    <div className='box-mission-text'>
                                        <p>项目：{item.name}</p>
                                        <p style={{ color: '#339966' }}>负责人：{item.executor_name}</p>
                                        <p style={{ color: '#cc3300', lineHeight: '20px' }}>
                                            到期时间：{getLocalTime(item.due_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BoxList
