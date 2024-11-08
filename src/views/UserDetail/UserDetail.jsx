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
    Upload,
    Table,
    Image,
    Popconfirm,
    Modal,
    Cascader,
    Descriptions,
    Tag,
    Badge,
    Card
} from 'antd'
import moment from 'moment'
import WebBreadcrumbNew from '@/components/WebBreadcrumbNew'
import '@/style/view-style/index.less'
import {
    APIUploadFile,
    APIExamineTask,
    APIGetUserDetail,
    APISetSocial,
    APIChangePassword,
    APIDelectPayAccount,
    APIDeleteAddress,
    APICreateOrModifyAddress,
    APICreateOrModifyAccount,
    APIgetBankList,
    APIGetCountryList,
    APIFindTasks,
    APIGetSampleList
} from '@/mapi'
import webhost from '@/tools/webhost.js'
// import { withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { getLendTime, getLendTimeNew, isJSON } from '@/tools/help.js'
import 'braft-editor/dist/index.css'
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

const isVideo = str => {
    return /^.+(\.mp4|\.avi|video|\.mov|\.rmvb|.flv)$/.test(str)
}

const { Option } = Select

const template1 =
    'step1: apply and receive exclusion discount code ; step2:share on social ; step3:Upload proof(Screenshots and links) to AnyStarr'

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'Update Time',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (text, item) => new Date(text).toLocaleString()
    },
    {
        title: 'Action by',
        dataIndex: 'action_by',
        key: 'action_by',
        align: 'center'
    },
    {
        title: 'What is updated',
        dataIndex: 'update',
        key: 'update',
        align: 'center'
    }
]

const sampleColumns = [
    {
        title: 'Task ID',
        dataIndex: 'task_id',
        key: 'task_id',
        align: 'center',
        width: '100'
    },
    {
        title: 'Campaign title',
        dataIndex: 'title',
        key: 'title',
        align: 'center'
    },
    {
        title: 'Update date',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'center'
        // render: (text, item) => <div>{new Date(text).toLocaleString()}</div>
    },
    {
        title: 'Username',
        dataIndex: 'from_user',
        key: 'from_user',
        width: 100,
        align: 'center'
    },
    {
        title: 'Courier',
        dataIndex: 'courier',
        key: 'courier',
        align: 'center'
    },
    {
        title: 'Tracking number',
        dataIndex: 'tracking_number',
        key: 'tracking_number',
        width: 100,
        align: 'center',
        render: (text, item) => (
            <a href={`https://www.ydhex.com/tools/inquire?number=${text}`} target='_blank'>
                {text}
            </a>
        )
    },
    {
        title: 'Application status',
        dataIndex: 'status',
        key: 'status',
        width: 160,
        align: 'left',
        render: (text, item) => (
            <div>
                <Badge status={text == 4 ? 'default' : 'success'} />
                <span>{text == 1 ? 'New application' : text == 4 ? 'Closed' : text == 3 ? 'Approved' : 'Shipped'}</span>
            </div>
        )
    }
]

const taskColumns = [
    {
        title: 'Campaign title',
        dataIndex: 'title',
        key: 'title',
        align: 'center'
    },
    {
        title: 'Username',
        dataIndex: 'user',
        key: 'user',
        width: '100',
        align: 'center'
    },
    {
        title: 'Application date',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '100',
        align: 'center'
    },
    {
        title: 'Leading time ',
        dataIndex: 'update_time',
        key: 'update_time',
        width: '100',
        align: 'center',
        render: (text, item) => <div>{getLendTimeNew(item.submit_time, item.review_time)}</div>
    },
    {
        title: '# of upload images',
        dataIndex: 'images',
        key: 'images',
        align: 'center',
        render: (text, item) => (
            <div style={{ display: 'flex' }}>
                {text &&
                    JSON.parse(text).map((url, index) => {
                        console.log('urlll,', url)
                        if (isVideo(url)) {
                            return (
                                <video src={url} controls='controls' style={{ width: '100px', marginLeft: '10px' }}>
                                    您的浏览器不支持 video 标签。
                                </video>
                            )
                        } else {
                            return <Image src={url} style={{ maxWidth: '70px', marginLeft: '10px' }} />
                        }
                    })}
            </div>
        )
    },
    {
        title: 'Link',
        dataIndex: 'linkes',
        key: 'linkes',
        align: 'center',
        width: '100',
        render: (text, item) => (
            <div>
                {isJSON(text)
                    ? JSON.parse(text).map((url, index) => {
                          return (
                              <a href={url} target='_blank'>
                                  {url}
                              </a>
                          )
                      })
                    : text}
            </div>
        )
    },
    {
        title: 'Task status',
        dataIndex: 'status',
        width: 200,
        key: 'status',
        align: 'left',
        render: (text, item) => (
            <div>
                <Badge status={text == 0 ? 'default' : 'success'} />
                <span>
                    {text == 0
                        ? 'Task closed'
                        : text == 1
                        ? 'New Task'
                        : text == 2
                        ? 'Pending proof upload'
                        : text == 3
                        ? 'Pending for Review'
                        : text == 4
                        ? 'Resubmit evidence'
                        : text == 5
                        ? 'Task Approved'
                        : text == 7
                        ? 'Pending for Content Review'
                        : text == 8
                        ? 'Resubmit Content'
                        : text == 9
                        ? 'Pending proof upload'
                        : ''}
                </span>
            </div>
        )
    }
]

const DetailModalAddress = ({ visible, onCreate, onCancel, formDataAddress, disabled }) => {
    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }

    const [state, setState] = useState({
        countryList: []
    })

    const initForm = () => {
        form.setFieldsValue({
            id: formDataAddress.id,
            name: formDataAddress.name,
            contact_number: formDataAddress.contact_number,
            address: formDataAddress.address,
            country: formDataAddress.country,
            post_code: formDataAddress.post_code
        })
    }

    const getCountry = () => {
        APIGetCountryList().then(resp => {
            setState({
                ...state,
                countryList: resp.data.data
            })
        })
    }

    useEffect(() => {
        getCountry()
        initForm()
    }, [visible])

    const options = state.countryList.map((item, index) => {
        return (
            <Option key={item.id} value={item.name}>
                {item.name}
            </Option>
        )
    })

    return (
        <Modal
            visible={visible}
            title='pay account detail'
            okText='Submit'
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
                <Form.Item label='ID' name='id'>
                    <Input disabled />
                </Form.Item>
                <Form.Item label='Name' name='name'>
                    <Input />
                </Form.Item>
                <Form.Item label='Contact Number' name='contact_number'>
                    <Input />
                </Form.Item>
                <Form.Item label='Address' name='address'>
                    <TextArea />
                </Form.Item>
                <Form.Item label='Country' name='country'>
                    <Select showSearch>{options}</Select>
                </Form.Item>
                <Form.Item label='Post code' name='post_code'>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    }
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                message: 'Please select time!'
            }
        ]
    }

    const [state, setState] = useState({
        type: 2,
        bankOptions: [],
        id: null,
        otherBank: false
    })

    const changeType = e => {
        console.log('e', e)
        setState({
            type: e
        })
    }

    const getBanks = () => {
        APIgetBankList().then(resp => {
            let resBank = transCountryBank(resp.data.data)
            initForm(resBank)
        })
    }

    const initForm = resBank => {
        console.log('resbank', resBank)
        console.log('formData', formData)
        let countryBank = formData.country_bank ? JSON.parse(formData.country_bank) : []
        if (!formData.type) {
            formData.type = 2
        }
        form.setFieldsValue({
            id: formData.id,
            type: formData.type,
            account_address: formData.account_address,
            full_name: formData.full_name,
            country_bank: formData.country_bank ? JSON.parse(formData.country_bank) : [],
            swift_code: formData.swift_code,
            other_bank: countryBank[0] === 0 ? countryBank[1] : ''
        })

        setState({
            ...state,
            bankOptions: resBank,
            type: formData.type,
            id: formData.id ? formData.id : null,
            otherBank: countryBank[0] === 0 ? true : false
        })
    }

    const transCountryBank = list => {
        return list.map(item => {
            if (item.bank_list) {
                return {
                    label: item.country_name,
                    value: item.country_id,
                    children: transCountryBank(item.bank_list)
                }
            } else {
                return {
                    label: item.name,
                    value: item.name
                }
            }
        })
    }

    const changeBank = values => {
        if (values[0] === 0) {
            setState({
                ...state,
                otherBank: true
            })
        } else {
            setState({
                ...state,
                otherBank: false
            })
        }
    }

    useEffect(() => {
        getBanks()
    }, [visible])

    return (
        <Modal
            visible={visible}
            title='pay account detail'
            okText='Submit'
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
                <Form.Item name='id' label='ID' rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name='type' label='Type' rules={[{ required: true }]}>
                    <Select onChange={changeType}>
                        <Option value={1}>PayPal</Option>
                        <Option value={2}>Bank</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='account_address' label='Account' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                {state.type == 2 ? (
                    <div>
                        <Form.Item label='Full Name' name='full_name'>
                            <Input />
                        </Form.Item>

                        <Form.Item label='Country Bank' name='country_bank' className='bank-name'>
                            <Cascader
                                options={state.bankOptions}
                                onChange={changeBank}
                                // placeholder="Please select"
                            />
                        </Form.Item>
                        {state.otherBank ? (
                            <Form.Item label='Other Bank' name='other_bank'>
                                <Input />
                            </Form.Item>
                        ) : null}

                        <Form.Item label='Swift Code' name='swift_code'>
                            <Input />
                        </Form.Item>
                    </div>
                ) : null}
            </Form>
        </Modal>
    )
}

const UserDetail = props => {
    const [state, setState] = useState({
        reviewContent: {},
        taskRecordList: [],
        visible: false,
        formData: {},
        userAddress: {},
        userPayAccount: {},
        password: '',
        actionLog: [],
        userID: '',

        visibleAddress: false,
        formDataAddress: {}
    })
    const [form] = Form.useForm()

    const [taskList, setTaskList] = useState([])

    const [sampleList, setSampleList] = useState([])

    const onReset = () => {
        form.resetFields()
    }

    const onFinish = values => {
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        console.log('valuess', values)
        console.log('query', query)
        let userID = props.match.params.id
        APISetSocial({
            userSocialJson: JSON.stringify({
                user_id: userID,
                ins_name: values.ins_name,
                fb_name: values.fb_name,
                tiktok_name: values.tiktok_name
            })
        }).then(resp => {
            message.success('success')
            props.history.push('/account/account')
        })
    }

    const initForm = () => {
        let id = props.match.params.id
        console.log('iddd', id)
        APIGetUserDetail({ id: id }).then(resp => {
            console.log('resp', resp)

            form.setFieldsValue({
                id: resp.data.data.user.id,
                invitation_code: resp.data.data.user.invitation_code,
                email: resp.data.data.user.email,
                country_list: resp.data.data.user.country_list,
                nickname: resp.data.data.user.nickname,
                gender: resp.data.data.user.gender,
                language: resp.data.data.user.language,

                status: resp.data.data.user.status,
                password: resp.data.data.user.password,
                fb_name: resp.data.data.user_social.fb_name,
                ins_name: resp.data.data.user_social.ins_name,
                tiktok_name: resp.data.data.user_social.tiktok_name
            })
            setState({
                ...state,
                userPayAccount: resp.data.data.user_pay_account.length ? resp.data.data.user_pay_account[0] : {},
                userAddress: resp.data.data.user_address.length ? resp.data.data.user_address[0] : {},
                actionLog: resp.data.data.action_log,
                userID: resp.data.data.user.id,
                formData: resp.data.data
            })
        })
    }

    const setTaskDesValueTo = data => {
        console.log('大医院', data)
        let resArr = data.split(';')
        console.log('resArrrrrr', resArr)
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
            let bannerList = state.bannerList
            let picUrl = resp.data.url
            bannerList.push(picUrl)
            setState({
                ...state,
                bannerList
            })
        })
    }

    const onCreateAddress = values => {
        console.log('valuesss', values)

        APICreateOrModifyAddress({
            userAddressJson: JSON.stringify({
                id: values.id,
                user_id: state.userID,
                name: values.name,
                contact_number: values.contact_number,
                address: values.address,
                country: values.country,
                post_code: values.post_code
            })
        }).then(resp => {
            message.success('success')
            props.history.push('/account/account')
        })
    }

    const onCreate = values => {
        console.log('values', values)
        let params = {
            id: values.id,
            type: values.type,
            user_id: state.userID,
            account_address: values.account_address,
            full_name: values.full_name,
            bank_name: values.country_bank ? values.country_bank[1] : '',
            swift_code: values.swift_code,
            country_bank: values.country_bank
        }
        if (values.other_bank) {
            params.bank_name = values.other_bank
            params.country_bank = [0, values.otherBank]
        }
        APICreateOrModifyAccount({
            payAccountJson: JSON.stringify(params)
        }).then(resp => {
            message.success('success')
            props.history.push('/account/account')
        })
    }

    const agreeExamClick = (state, status) => {
        let params = {
            id: state.reviewContent.id,
            task_id: state.reviewContent.task_id,
            status: status
        }
        APIExamineTask({ taskRecordJson: JSON.stringify(params) }).then(resp => {
            message.success('success')
            setState({
                ...state,
                visible: false
            })
            props.history.push('/tasks')
        })
    }

    const examClick = (state, status) => {
        console.log('state', state)
        console.log('status', status)
        setState({
            ...state,
            visible: true,
            formData: {
                id: state.reviewContent.id,
                task_id: state.reviewContent.task_id,
                status: status
            }
        })
    }

    const changePassword = () => {
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        console.log('query', query)
        APIChangePassword({
            userJson: JSON.stringify({
                id: query.id,
                password: state.password
            })
        }).then(resp => {
            message.success('修改成功')
            props.history.push('/account/account')
        })
    }

    const changePwd = e => {
        console.log('e', e)
        setState({
            ...state,
            password: e.target.value
        })
    }

    const modifyPayAccount = data => {
        console.log('data', data)
        setState({
            ...state,
            visible: true,
            formData: data
        })
    }

    const deletePayAccount = data => {
        console.log('data', data)
        APIDelectPayAccount({
            id: data.id
        }).then(resp => {
            props.history.push('/account/account')
        })
    }

    const editUserAddress = data => {
        setState({
            ...state,
            visibleAddress: true,
            formDataAddress: data
        })
    }

    const deleteUserAddress = data => {
        APIDeleteAddress({
            id: data.id
        }).then(resp => {
            props.history.push('/account/account')
        })
    }

    const getTaskList = () => {
        let params = {
            start_row: 0,
            page_size: 100,
            user_id: props.match.params.id
        }
        APIFindTasks({ taskJson: JSON.stringify(params) }).then(res => {
            setTaskList(res.data.list)
        })
    }

    const getSampleList = () => {
        let params = {
            start_row: 0,
            page_size: 100,
            user_id: props.match.params.id
        }
        APIGetSampleList({ sampleOrderJson: JSON.stringify(params) }).then(resp => {
            setSampleList(resp.data.list)
        })
    }

    useEffect(() => {
        // getCountryList()
        initForm()
        getTaskList()
        getSampleList()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <DetailModal
                visible={state.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setState({ ...state, visible: false })
                }}
                formData={state.formData}
                disabled={state.disabled}
            />
            <DetailModalAddress
                visible={state.visibleAddress}
                onCreate={onCreateAddress}
                onCancel={() => {
                    setState({ ...state, visibleAddress: false })
                }}
                formDataAddress={state.formDataAddress}
            />
            <WebBreadcrumbNew title='User Detail' />
            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Descriptions title='User Info'>
                            <Descriptions.Item label='User ID'>{state.userID}</Descriptions.Item>
                            <Descriptions.Item label='Invitation code'>
                                {state.formData.user && state.formData.user.invitation_code}
                            </Descriptions.Item>
                            <Descriptions.Item label='Username(email)'>
                                {state.formData.user && state.formData.user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label='Distribution countries'>
                                {state.formData.user &&
                                    state.formData.user.country_list &&
                                    JSON.parse(state.formData.user.country_list).map((item, index) => {
                                        return (
                                            <Tag color='geekblue' key={item}>
                                                {item}
                                            </Tag>
                                        )
                                    })}
                            </Descriptions.Item>
                            <Descriptions.Item label='Name'>
                                {state.formData.user && state.formData.user.nickname}
                            </Descriptions.Item>
                            <Descriptions.Item label='Gender'>
                                {state.formData.user && state.formData.user.gender == 1
                                    ? 'Male'
                                    : state.formData.user && state.formData.user.gender == 2
                                    ? 'Female'
                                    : state.formData.user && state.formData.user.gender == 0
                                    ? 'Perfer not to say'
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='Language'>
                                {state.formData.user && state.formData.user.language}
                            </Descriptions.Item>
                            <Descriptions.Item label='Acquisition channel'>
                                {state.formData.user && state.formData.user.hear_about_us}
                            </Descriptions.Item>
                            <Descriptions.Item label='User status'>
                                {state.formData.user ? (
                                    <div>
                                        <Badge
                                            status={
                                                state.formData.user.status == 1
                                                    ? 'success'
                                                    : state.formData.user.status == 6
                                                    ? 'processing'
                                                    : state.formData.user.status == 3
                                                    ? 'error'
                                                    : 'default'
                                            }
                                        />
                                        <span>
                                            {state.formData.user.status == 1
                                                ? 'Active'
                                                : state.formData.user.status == 2
                                                ? 'Banne'
                                                : state.formData.user.status == 3
                                                ? 'DELETED'
                                                : state.formData.user.status == 4
                                                ? 'INACTIVE'
                                                : state.formData.user.status == 5
                                                ? 'LOCKED'
                                                : state.formData.user.status == 6
                                                ? 'Created'
                                                : ''}
                                        </span>
                                    </div>
                                ) : null}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail' style={{ paddingTop: '60px' }}>
                <Row>
                    <Col span={24}>
                        <Form
                            {...layout}
                            name='basic'
                            initialValues={{
                                remember: true
                            }}
                            onFinish={onFinish}
                            form={form}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Username in Facebook' name='fb_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Username in Instagram' name='ins_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Username in Tiktok' name='tiktok_name'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item {...tailLayout}>
                                <div>
                                    <Button type='primary' htmlType='submit' style={{ marginLeft: '30px' }}>
                                        Save
                                    </Button>
                                    <Button htmlType='button' onClick={onReset} style={{ marginLeft: '30px' }}>
                                        Reset
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail'>
                <div className='task-review-content'>
                    <h3 style={{ width: 180 }}>password:</h3>
                    <Input style={{ width: '300px', marginLeft: '30px' }} onChange={changePwd} />
                    <Button type='primary' onClick={changePassword} style={{ marginLeft: '30px' }}>
                        Save
                    </Button>
                </div>
            </div>

            <div className='base-style base-detail'>
                <div className='task-review-content'>
                    <h3 style={{ width: 180 }}>user pay acount:</h3>
                    {state.userPayAccount.bank_name ? (
                        <Card
                            style={{ width: 300, marginLeft: 30 }}
                            hoverable
                            actions={[
                                <Popconfirm
                                    title='Are you sure to delete ?'
                                    onConfirm={() => {
                                        deletePayAccount(state.userPayAccount)
                                    }}
                                    // onCancel={cancel}
                                    okText='Yes'
                                    cancelText='No'>
                                    <DeleteOutlined key='delete' />
                                </Popconfirm>,
                                <EditOutlined
                                    key='edit'
                                    onClick={() => {
                                        modifyPayAccount(state.userPayAccount)
                                    }}
                                />
                            ]}>
                            <div>Bank name: {state.userPayAccount.bank_name}</div>
                            <div>Your account: {state.userPayAccount.account_address}</div>
                        </Card>
                    ) : null}
                </div>
            </div>
            <div className='base-style base-detail'>
                <div className='task-review-content'>
                    <h3 style={{ width: 180 }}>user address:</h3>
                    {state.userAddress.address ? (
                        <Card
                            style={{ width: 300, marginLeft: 30 }}
                            hoverable
                            actions={[
                                <Popconfirm
                                    title='Are you sure to delete ?'
                                    onConfirm={() => {
                                        deleteUserAddress(state.userAddress)
                                    }}
                                    // onCancel={cancel}
                                    okText='Yes'
                                    cancelText='No'>
                                    <DeleteOutlined key='delete' />
                                </Popconfirm>,
                                <EditOutlined
                                    key='edit'
                                    onClick={() => {
                                        editUserAddress(state.userAddress)
                                    }}
                                />
                            ]}>
                            <div>address:{state.userAddress.address}</div>
                            <div>contact number:{state.userAddress.contact_number}</div>
                            <div>country:{state.userAddress.country}</div>
                            <div>user name:{state.userAddress.name}</div>
                            <div>post code:{state.userAddress.post_code}</div>
                        </Card>
                    ) : null}
                </div>
            </div>

            <div className='base-style base-detail' id='demoline'>
                <h3 style={{ marginBottom: '10px' }}>action logs</h3>
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={state.actionLog} />
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail' id='demoline'>
                <h3 style={{ marginBottom: '10px' }}>sample list</h3>
                <Row>
                    <Col span={24}>
                        <Table columns={sampleColumns} dataSource={sampleList} />
                    </Col>
                </Row>
            </div>

            <div className='base-style base-detail' id='demoline'>
                <h3 style={{ marginBottom: '10px' }}>task list</h3>
                <Row>
                    <Col span={24}>
                        <Table columns={taskColumns} dataSource={taskList} />
                    </Col>
                </Row>
            </div>

            {state.reviewContent && state.reviewContent.status == 3 ? (
                <div className='base-style' id='demoline'>
                    <div className='task-review-content'>
                        <div>upload imgs:</div>
                        <div style={{ marginLeft: '20px' }}>
                            {/* {state.reviewContent && state.reviewContent.review_images} */}
                            {state.reviewContent &&
                                state.reviewContent.review_images &&
                                state.reviewContent.review_images.map((item, index) => {
                                    return <Image key={index} width={200} src={item} />
                                })}
                        </div>
                    </div>
                    <div className='task-review-content'>
                        <div>links:</div>
                        <div style={{ marginLeft: '20px' }}>
                            {/* {state.reviewContent && state.reviewContent.review_linkes} */}
                            {state.reviewContent &&
                                state.reviewContent.review_linkes &&
                                state.reviewContent.review_linkes.map((item, index) => {
                                    return (
                                        <a key={index} href={item} target='_blank'>
                                            {item}
                                        </a>
                                    )
                                })}
                        </div>
                    </div>
                    {state.reviewContent.status == '4' || state.reviewContent.status == '5' ? null : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Button
                                type='primary'
                                onClick={() => {
                                    agreeExamClick(state, '5')
                                }}>
                                Approve
                            </Button>
                            <Button
                                type='dashed'
                                onClick={() => {
                                    examClick(state, '4')
                                }}
                                style={{ marginLeft: '20px' }}>
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            ) : null}

            {/* <div className='base-style' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={state.taskRecordList} />
                    </Col>
                </Row>
            </div> */}
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default UserDetail
