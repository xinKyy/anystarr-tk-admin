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
    Radio,
    List,
    Image
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
    APIGetUserNeedRole,
    APIDownloadWhiteList,
    APICreatePromotion,
    APIEditPromotion,
    APIGetPromotionDetail,
    APIGetPromotionLog,
    APIPromotionUploadWhiteList,
    APIPromotionDownloadWhiteList,
    APIGetCampaignsList,
    APIPromotionWhiteList
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { getYearMonthDayTimeNew, getYearMonthDayNormal } from '@/tools/help.js'
import HeaderC from '@/components/HeaderC'
import TopBannerPre from '@/imgs/top_banner_pre.jpeg'
import AbcomoSelection from '@/imgs/abcomo_selection.jpeg'
import RewardTask from '@/imgs/reward_task.jpeg'
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

const PromotionDetail = props => {
    const [state, setState] = useState({
        whiteList: [],
        linkType: 1, // 1代表url 2 代表 campaign
        showType: 0, // 1代表全部 2 代表白名单
        bannerList: [],
        category: 0,
        sampleList: []
    })

    const [campaignList, setCampaignList] = useState([])

    const [form] = Form.useForm()

    const [roleListState, setRoleListState] = useState({
        roleList: []
    })

    const [operationList, setOperationList] = useState([])

    const onFinish = values => {
        console.log('values', values)
        console.log('bannerList', state.bannerList)
        let id = props.match.params.id
        let params = {
            ...values,
            post_end_time: getYearMonthDayNormal(values.post_end_time._d),
            post_start_time: getYearMonthDayNormal(values.post_start_time._d),
            bannerList: state.bannerList,
            promotionWhiteList: state.whiteList
        }
        if (id && id !== '0') {
            params.id = id
            APIEditPromotion(JSON.stringify(params)).then(resp => {
                props.history.push('/mobile_app_management/promotions')
            })
        } else {
            APICreatePromotion(JSON.stringify(params)).then(resp => {
                props.history.push('/mobile_app_management/promotions')
            })
        }
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }

    const changeTitle = (index, e) => {
        let bannerList = state.bannerList
        bannerList[index].title = e.target.value
        setState({
            ...state,
            bannerList
        })
    }

    const uploadBanner = ({ file, onSuccess }, index) => {
        let category = form.getFieldValue('category')
        let bannerLength = state.bannerList.length
        // if (category == 3 && bannerLength >= 1) {
        //     return message.error('Rewarded task -sigle banner is not allow more than one')
        // }

        // if (category == 3 && bannerLength >= 2) {
        //     return message.error('Rewarded task -dual banner is not allow more than one')
        // }

        APIUploadFile({ file: file }).then(resp => {
            onSuccess()
            let bannerList = state.bannerList
            let picUrl = resp.data.url
            // bannerList.push({ banner: picUrl, link_type: 1, link_url: '' })
            bannerList[index].banner = picUrl
            setState({
                ...state,
                bannerList
            })
        })
    }

    const initForm = () => {
        let id = props.match.params.id
        if (id == 0) {
            form.setFieldsValue({
                is_whitelist: 0
            })
            return
        }
        APIGetPromotionDetail({ id: id }).then(resp => {
            let promotionInfo = resp.data.promotionInfo
            form.setFieldsValue({
                ...promotionInfo,
                post_start_time: moment(promotionInfo.post_start_time),
                post_end_time: moment(promotionInfo.post_end_time)
            })
            APIPromotionWhiteList({
                id: promotionInfo.id
            }).then(res => {
                setState({
                    ...state,
                    bannerList: promotionInfo.bannerList,
                    whiteList: res.data.whiteListSet,
                    showType: promotionInfo.is_whitelist ? 1 : 0,
                    category: promotionInfo.category
                })
            })
            APIGetPromotionLog({
                id: promotionInfo.id
            }).then(res => {
                console.log('res.data.messageLogs', res.data.messageLogs)
                setOperationList(res.data.messageLogs)
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

    const onLinkChange = e => {
        setState({
            ...state,
            linkType: e.target.value
        })
    }

    const onShowChange = e => {
        setState({
            ...state,
            showType: e.target.value
        })
    }

    const uploadWhiteList = ({ file, onSuccess }) => {
        let id = props.match.params.id
        let params = {
            file: file
        }
        if (id && id !== '0') {
            params.id = id
        }
        APIPromotionUploadWhiteList(params).then(resp => {
            message.success('upload success')
            setState({
                ...state,
                whiteList: resp.data.whiteListSet
            })
        })
    }

    const downloadWhiteList = () => {
        APIPromotionDownloadWhiteList({ id: props.match.params.id }).then(resp => {})
    }

    const changeLink = (index, e, type) => {
        console.log('e', e)
        let bannerList = state.bannerList
        bannerList[index].link_url = type === 1 ? e.target.value : e
        setState({
            ...state,
            bannerList
        })
    }

    const onLinkTypeChange = (index, e) => {
        let bannerList = state.bannerList
        bannerList[index].link_type = e.target.value
        setState({
            ...state,
            bannerList
        })
    }

    const getCampaignList = () => {
        APIGetCampaignsList({ campaignJson: JSON.stringify({ start_row: 0, page_size: 999 }) }).then(resp => {
            setCampaignList(resp.data.list)
        })
    }

    const deleteBanner = index => {
        let bannerList = state.bannerList
        bannerList.splice(index, 1)
        setState({
            ...state,
            bannerList
        })
    }

    const onAddBanner = () => {
        //bannerList.push({ banner: picUrl, link_type: 1, link_url: '' })
        let bannerList = state.bannerList ? state.bannerList : []
        bannerList.push({ key: Math.random(10), banner: '', link_type: 1, link_url: '' })
        setState({
            ...state,
            bannerList
        })
    }

    const changeCategory = e => {
        console.log('e', e)
        if (e == 1 || e == 2) {
            setState({
                ...state,
                category: e
            })
            return
        }
        if (e == 3) {
            setState({
                ...state,
                category: e,
                bannerList: [{ banner: '', key: 1, link_type: 1, link_url: '' }]
            })
            return
        }
        if (e == 4) {
            setState({
                ...state,
                category: e,
                bannerList: [
                    { banner: '', key: 1, link_type: 1, link_url: '' },
                    { banner: '', key: 2, link_type: 1, link_url: '' }
                ]
            })
        }
        if (e == 5) {
            setState({
                ...state,
                category: e
            })
        }
    }

    useEffect(() => {
        initForm()
        getRoleList()
        getCampaignList()
    }, [])

    return (
        <Layout className='index animated fadeIn'>
            <WebBreadcrumbNew title='Promotion Detail' />
            <div className='base-style base-detail' id='demoline'>
                <div className='preview-wrapper'>
                    {state.category == 1 ? (
                        <div className='relative-wr'>
                            <img src={TopBannerPre} className='bg-img' />
                            <img
                                src={state.bannerList && state.bannerList[0] && state.bannerList[0].banner}
                                className='top-banner-img'
                            />
                        </div>
                    ) : state.category == 2 ? (
                        <div className='relative-wr'>
                            <img src={AbcomoSelection} className='bg-img' />
                            <img
                                src={state.bannerList && state.bannerList[0] && state.bannerList[0].banner}
                                className='abcomo-selection-img'
                            />
                        </div>
                    ) : state.category == 3 ? (
                        <div className='relative-wr'>
                            <img src={RewardTask} className='bg-img' />
                            <img
                                src={state.bannerList && state.bannerList[0] && state.bannerList[0].banner}
                                className='reward-task-img'
                            />
                        </div>
                    ) : state.category == 4 ? (
                        <div className='relative-wr'>
                            <img src={RewardTask} className='bg-img' />
                            <img
                                src={state.bannerList && state.bannerList[0] && state.bannerList[0].banner}
                                className='reward-task-img-left'
                            />
                            <img
                                src={state.bannerList && state.bannerList[1] && state.bannerList[1].banner}
                                className='reward-task-img-right'
                            />
                        </div>
                    ) : null}
                </div>
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
                                    <Form.Item label='Promotion ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Title'
                                        name='title'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Email is missing'
                                            }
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Category'
                                        name='category'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Category is missing'
                                            }
                                        ]}>
                                        <Select onChange={changeCategory}>
                                            <Option value={1}>Top banner</Option>
                                            <Option value={2}>abComo selection banner</Option>
                                            <Option value={3}>Rewarded task -sigle</Option>
                                            <Option value={4}>Rewarded task -dual</Option>
                                            <Option value={5}>Feature Product</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Start' name='post_start_time' {...config}>
                                        <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item label='End' name='post_end_time' {...config}>
                                        <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {state.category == 52 ? null : (
                                <Row>
                                    <Col span={24}>
                                        <div>
                                            <div style={{ marginTop: '60px' }}>
                                                <span>Banner List:</span>
                                                {state.category == 1 || state.category == 2 || state.category == 5 ? (
                                                    <Button type='primary' onClick={onAddBanner}>
                                                        Add+
                                                    </Button>
                                                ) : (
                                                    <Button></Button>
                                                )}
                                            </div>
                                            <div className='file-list' style={{ marginTop: '30px' }}>
                                                {state.bannerList &&
                                                    state.bannerList.map((item, index) => {
                                                        return (
                                                            <div
                                                                key={item.url ? item.url : item.key}
                                                                className='file-item'
                                                                style={{ height: 'unset' }}>
                                                                <div className='item-body'>
                                                                    <Upload
                                                                        customRequest={e => {
                                                                            uploadBanner(e, index)
                                                                        }}>
                                                                        <Button icon={<UploadOutlined />}>
                                                                            Click to Upload{' '}
                                                                        </Button>
                                                                    </Upload>

                                                                    <Image
                                                                        className='item-img'
                                                                        style={{ marginLeft: '10px' }}
                                                                        src={item.banner}
                                                                        width={60}
                                                                    />

                                                                    <Radio.Group
                                                                        value={item.link_type}
                                                                        onChange={e => {
                                                                            onLinkTypeChange(index, e)
                                                                        }}
                                                                        style={{ marginLeft: '20px' }}>
                                                                        <Radio value={1}>URL</Radio>
                                                                        <Radio value={2}>Campaign</Radio>
                                                                    </Radio.Group>

                                                                    {item.link_type == 1 ? (
                                                                        <Input
                                                                            style={{
                                                                                width: '150px',
                                                                                verticalAlign: 'middle'
                                                                            }}
                                                                            onChange={e => {
                                                                                changeLink(index, e, 1)
                                                                            }}
                                                                            placeholder='please add http://'
                                                                            value={item.link_url}
                                                                        />
                                                                    ) : (
                                                                        <Select
                                                                            value={item.link_url}
                                                                            onChange={e => {
                                                                                changeLink(index, e, 2)
                                                                            }}>
                                                                            {campaignList.map(item_c => {
                                                                                return (
                                                                                    <Option
                                                                                        key={item_c.id}
                                                                                        value={item_c.id}>
                                                                                        {item_c.title}
                                                                                    </Option>
                                                                                )
                                                                            })}
                                                                        </Select>
                                                                    )}

                                                                    <div>
                                                                        <Input
                                                                            placeholder='title'
                                                                            style={{
                                                                                width: '330px'
                                                                            }}
                                                                            value={item.title}
                                                                            onChange={e => {
                                                                                changeTitle(index, e)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <DeleteOutlined
                                                                        className='delete-icon'
                                                                        onClick={() => {
                                                                            deleteBanner(index)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label='Show to'
                                        name='is_whitelist'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Email is missing'
                                            }
                                        ]}>
                                        <Radio.Group onChange={onShowChange}>
                                            <Radio value={0}>All users</Radio>
                                            <Radio value={1}>Customize</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {state.showType == 0 ? null : (
                                <div
                                    style={{
                                        marginLeft: '16.8%',
                                        marginBottom: '10px',
                                        padding: '10px',
                                        border: '2px solid #eee'
                                    }}>
                                    <Upload customRequest={uploadWhiteList}>
                                        <Button icon={<UploadOutlined />}>Click to Upload white list</Button>
                                    </Upload>

                                    {/* <Button style={{ marginLeft:'10px' }} type="primary">download white list </Button> */}
                                    <a
                                        href={APIPromotionDownloadWhiteList(props.match.params.id)}
                                        style={{
                                            backgroundColor: '#1890ff',
                                            color: '#fff',
                                            padding: '8px 15px',
                                            marginLeft: '10px'
                                        }}
                                        type='download'>
                                        Download white List
                                    </a>
                                    <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                                        {state.whiteList &&
                                            state.whiteList.map((item, index) => {
                                                return (
                                                    <div
                                                        style={{ marginBottom: '6px' }}
                                                        key={index}
                                                        className='cam-promo-code'>
                                                        <div>Email: {item.from_user} </div>
                                                        <div>User ID: {item.user_id} </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            )}

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
            <div className='base-style base-detail'>
                <h3 className='block-title'>Action List</h3>
                <Row>
                    <Col span={23} offset={1}>
                        {operationList.length ? (
                            <div className='now-promo-code'>
                                <List
                                    itemLayout='horizontal'
                                    dataSource={operationList}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<HeaderC name={item.action_by} />}
                                                title={item.action_by + '    did    ' + item.update}
                                                description={getYearMonthDayTimeNew(item.create_time)}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default PromotionDetail
