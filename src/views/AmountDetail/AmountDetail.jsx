import React, { useState, useEffect, useRef } from 'react'
import { Layout, Row, Col, Divider, Select, Form, Input, notification, Button, Modal, message } from 'antd'
import '@/style/view-style/index.less'
import { Line, Pie } from '@ant-design/charts'
import './amountDetail.less'
import { APIgetFiatOverview, APIgetRuleDetail, APIrewardApplication } from '@/mapi'
import { get } from 'echarts/lib/CoordinateSystem'
import './amountDetail.less'

const DemoPie = props => {
    const { fiatState } = props

    const getRightAmount = type => {
        let distribution = fiatState.distribution
        for (let i = 0; i < distribution.length; i++) {
            if (type === distribution[i].type) {
                return distribution[i].amount
            }
        }
        return 0
    }

    const data = [
        {
            type: '任务',
            value: getRightAmount('task')
        },
        {
            type: '积分兑换',
            value: getRightAmount('score_convert')
        },
        {
            type: '系统奖励',
            value: getRightAmount('sys')
        },
        {
            type: '提现',
            value: getRightAmount('convert')
        }
    ]
    const config = {
        forceFit: true,
        title: {
            visible: true,
            text: ''
        },
        description: {
            visible: true,
            text: ''
        },
        radius: 0.8,
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            visible: true,
            type: 'spider'
        }
    }
    return <Pie {...config} />
}

const AmountDetailList = props => {
    const [componentSize, setComponentSize] = useState('default')
    const { fiatState } = props

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size)
    }

    const getRightAmount = type => {
        let distribution = fiatState.distribution
        for (let i = 0; i < distribution.length; i++) {
            if (type === distribution[i].type) {
                return distribution[i].amount
            }
        }
        return 0
    }

    return (
        <div className='amount-detail-list'>
            <Form
                labelCol={{
                    span: 4
                }}
                wrapperCol={{
                    span: 14
                }}
                layout='horizontal'
                initialValues={{
                    size: componentSize
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}>
                <Form.Item label='来源'>
                    <div>金额</div>
                </Form.Item>
                <Form.Item label='余额'>
                    <div>{fiatState.balance}</div>
                </Form.Item>
                <Form.Item label='任务'>
                    <div>{getRightAmount('task')}</div>
                </Form.Item>
                <Form.Item label='积分兑现'>
                    <div>{getRightAmount('score_convert')}</div>
                </Form.Item>
                <Form.Item label='系统奖励'>
                    <div>{getRightAmount('sys')}</div>
                </Form.Item>
                <Form.Item label='提现'>
                    <div>{getRightAmount('convert')}</div>
                </Form.Item>
            </Form>
        </div>
    )
}

const FiatWithdraw = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }

    return (
        <Modal
            visible={visible}
            title='法币提现'
            okText='保存'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onCreate(values)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='amount' label='法币' rules={[]}>
                    <Input type='number' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const AmountDetail = () => {
    const [visible, SetVisible] = useState(false)
    const [componentSize, setComponentSize] = useState('default')
    const [fiatState, setFiatState] = useState({
        balance: 0,
        distribution: []
    })
    const [rule, setRule] = useState({
        content: '',
        title: '',
        type: 'reward_fiat'
    })

    const getFiatData = () => {
        APIgetFiatOverview()
            .then(resp => {
                setFiatState({
                    ...resp.data
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size)
    }

    const close = () => {
        console.log('Notification was closed. Either the close button was clicked or duration time elapsed.')
    }

    const getFiatRule = () => {
        const params = {
            type: 'reward_fiat'
        }
        APIgetRuleDetail(params)
            .then(resp => {
                console.log('resp', resp)
                setRule(resp.data)
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const ruleForm = (
        <Form
            labelCol={{
                span: 2
            }}
            wrapperCol={{
                span: 22
            }}
            layout='horizontal'
            initialValues={{
                size: componentSize
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}>
            <Form.Item label=''>
                <div>{rule.content}</div>
            </Form.Item>
        </Form>
    )

    const fiatRule = () => {
        const key = `open${Date.now()}`
        notification.open({
            message: rule.title,
            key,
            description: ruleForm,
            duration: null,
            onClose: close
        })
    }

    const fiatWithdraw = val => {
        console.log('val', val)
        SetVisible(false)
        APIrewardApplication(val)
            .then(res => {
                message.success('提现成功')
                getFiatData()
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        getFiatRule()
        getFiatData()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <FiatWithdraw
                visible={visible}
                onCreate={fiatWithdraw}
                onCancel={() => {
                    SetVisible(false)
                }}
            />
            <div className='base-style' id='demoline'>
                <Row>
                    <Col span={12}>
                        <AmountDetailList fiatState={fiatState} />
                    </Col>
                    <Col span={12}>
                        <DemoPie fiatState={fiatState} />
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={8}>
                        <div className='integral-rule'>
                            <Button type='primary' onClick={fiatRule}>
                                人民币奖励规则
                            </Button>
                            <Button onClick={SetVisible} type='primary'>
                                人民币提现
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default AmountDetail
