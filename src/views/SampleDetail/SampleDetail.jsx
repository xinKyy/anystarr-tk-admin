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
    Modal,
    Descriptions,
    Tag,
    Card,
    Badge,
    Empty
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
    APIGetTaskDetail,
    APIExamineTask,
    APIGetSampleDetail,
    APIBindTrackingNumber,
    APIReviewSampleOrder
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
import TextArea from 'antd/lib/input/TextArea'
import webhost from '@/tools/webhost.js'
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

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
    },
    {
        title: 'user',
        dataIndex: 'action_by',
        key: 'action_by',
        align: 'center'
    },
    {
        title: 'Action',
        dataIndex: 'update',
        key: 'key',
        align: 'center'
    },
    {
        title: 'Action time',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: (text, item) => {
            return <div>{text ? new Date(text).toLocaleString() : '--'}</div>
        }
    }
]

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

    const reasonTem = [
        { label: 'Location issue - English', value: 1 },
        { label: 'Location issue - Spanish', value: 3 },
        { label: 'Location issue - French', value: 2 },
        { label: 'Location issue - Polish', value: 4 },
        { label: 'Duplicate applications - English', value: 5 },
        { label: 'Duplicate applications - Spanish', value: 7 },
        { label: 'Duplicate applications - French', value: 6 },
        { label: 'Duplicate applications - Polish', value: 8 },
        { label: 'No Instagram account - English', value: 9 },
        { label: 'No Instagram account - Spanish', value: 11 },
        { label: 'No Instagram account - French', value: 10 },
        { label: 'No Instagram account - Polish', value: 12 },
        { label: 'Instagram does not match the brand: - English', value: 13 },
        { label: 'Instagram does not match the brand: - Spanish', value: 15 },
        { label: 'Instagram does not match the brand: - French', value: 14 },
        { label: 'Instagram does not match the brand: - Polish', value: 16 },
        { label: 'other', value: 0 }
    ]

    const reasonTempalte = new Map([
        [
            1,
            'Thank you so much for your submission! Unfortunately, at the moment we cannot deliver the sample to your area. Once we are in your area, we will definitely notify you! For now, you can still earn commissions by sharing the product and generating sales with your promo code.'
        ],
        [
            2,
            "Malheureusement, nous n'avons pas pu livrer l'échantillon dans votre région. Mais vous pouvez toujours gagner des commissions en partageant le produit et en générant des ventes avec votre code promo."
        ],
        [
            3,
            'Muchas gracias por su envío. Lamentablemente, por el momento no podemos entregar la muestra en su zona. Una vez que lleguemos a su zona, se lo notificaremos. Por ahora, puedes seguir ganando comisiones compartiendo el producto y generando ventas con tu código promocional.'
        ],
        [
            4,
            'Bardzo dziękujemy za zgłoszenie! Niestety, w tej chwili nie możemy dostarczyć próbki do Twojej okolicy. Gdy tylko będziemy w Twojej okolicy, na pewno Cię o tym poinformujemy! Na razie nadal możesz zarabiać prowizje poprzez udostępnianie produktu i generowanie sprzedaży z wykorzystaniem kodu promocyjnego.'
        ],
        [5, 'Thank you for your submission! Sorry, you could not join two campaigns at the same time.'],
        [6, 'Merci pour votre inscription ! Désolé, vous ne pouviez pas rejoindre deux campagnes en même temps.'],
        [7, 'Gracias por su presentación. Lo sentimos, no ha podido unirse a dos campañas al mismo tiempo.'],
        [8, 'Dziękujemy za zgłoszenie! Przepraszamy, nie mogłeś dołączyć do dwóch kampanii jednocześnie.'],
        [
            9,
            'Thank you for your submission! Unfortunately, your provided social media page can not be found. It would be appreciated if you could double check your Instagram name and re-submit. '
        ],
        [
            10,
            'Merci pour votre inscription ! Malheureusement, la page de médias sociaux que vous avez fournie est introuvable. Nous vous serions reconnaissants de bien vouloir vérifier votre nom Instagram et de soumettre à nouveau votre candidature. '
        ],
        [
            11,
            'Gracias por su envío. Lamentablemente, no se puede encontrar la página de medios sociales que has proporcionado. Le agradeceríamos que volviera a comprobar su nombre de Instagram y que volviera a enviarlo.'
        ],
        [
            12,
            'Dziękujemy za zgłoszenie! Niestety, nie możemy znaleźć podanej przez Ciebie strony w mediach społecznościowych. Byłoby miło, gdybyś mógł sprawdzić swoją nazwę na Instagramie i przesłać ją ponownie.'
        ],
        [
            13,
            "Thank you for your submission! We're sorry, your social media page doesn't match the current brand's requirements. But you can still earn commissions by sharing the product and generate sales with your promo code."
        ],
        [
            14,
            'Merci pour votre soumission ! Nous sommes désolés, votre page de médias sociaux ne correspond pas aux exigences de la marque actuelle. Mais vous pouvez toujours gagner des commissions en partageant le produit et générer des ventes avec votre code promo.'
        ],
        [
            15,
            'Gracias por su envío. Lo sentimos, tu página en las redes sociales no se ajusta a los requisitos actuales de la marca. Pero aún puedes ganar comisiones compartiendo el producto y generando ventas con tu código promocional.'
        ],
        [
            16,
            'Dziękujemy za zgłoszenie! Przykro nam, ale Twoja strona w mediach społecznościowych nie spełnia aktualnych wymagań marki. Ale nadal możesz zarabiać prowizje, dzieląc się produktem i generując sprzedaż za pomocą kodu promocyjnego.'
        ]
    ])

    useEffect(() => {
        form.setFieldsValue({
            reason: ''
        })
    }, [])

    const changeTempalte = value => {
        console.log('valuesssss', value)
        let str = ''
        if (!value) {
            form.resetFields()
            return
        }
        console.log('reasonTempalte.get(value)', reasonTempalte.get(value))
        form.setFieldsValue({
            reason: reasonTempalte.get(value)
        })
    }

    return (
        <Modal
            visible={visible}
            title='Sample reject'
            okText='Submit'
            cancelText='Cancel'
            onCancel={onCancel}
            width={900}
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
                <Form.Item name='reason_tempalte' label='Reason Template'>
                    <Select defaultValue={0} onChange={changeTempalte}>
                        {reasonTem.map(item => {
                            return (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name='reason' label='Reject reason' rules={[{ required: true }]}>
                    <TextArea rows={6} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const TaskDetail = props => {
    const [state, setState] = useState({
        actionLog: [],
        status: '',
        formData: {},
        type: 1,
        screenshots: []
    })

    const [form] = Form.useForm()

    const changeType = type => {
        setState({
            ...state,
            type
        })
    }

    const initForm = () => {
        let id = props.match.params.id
        APIGetSampleDetail({ id: id }).then(resp => {
            form.setFieldsValue({
                ...resp.data.data,
                instagram_handle: 'https://www.instagram.com/' + resp.data.data.instagram_handle
            })

            setState({
                ...state,
                formData: resp.data.data,
                status: resp.data.data.status,
                actionLog: resp.data.data.action_log,
                type: resp.data.data.type,
                visible: false,
                screenshots: resp.data.data.screen_shots ? JSON.parse(resp.data.data.screen_shots) : []
            })
        })
    }

    const onCreate = values => {
        console.log('valuessss', values)
        let id = props.match.params.id
        APIReviewSampleOrder({
            sampleOrderJson: JSON.stringify({
                status: 4,
                id,
                reason: values.reason
            })
        }).then(resp => {
            message.success('success')
            initForm()
        })
    }

    const cancelClick = () => {}

    const onFinish = values => {
        console.log('values', values)
        APIBindTrackingNumber({
            sampleOrderJson: JSON.stringify({
                id: props.match.params.id,
                type: values.type,
                tracking_number: values.tracking_number,
                coupon: values.coupon,
                item_link: values.item_link,
                courier: values.courier,
                various: values.various,
                order_number: values.order_number
            })
        }).then(resp => {
            message.success('success')
            initForm()
        })
    }

    const approveClick = () => {
        let id = props.match.params.id
        APIReviewSampleOrder({
            sampleOrderJson: JSON.stringify({
                status: 3,
                id
            })
        }).then(resp => {
            message.success('success')
            initForm()
        })
    }

    const RejectClick = () => {
        let id = props.match.params.id
        setState({
            ...state,
            visible: true
        })
        return

        APIReviewSampleOrder({
            sampleOrderJson: JSON.stringify({
                status: 4,
                id
            })
        }).then(resp => {
            message.success('success')
            initForm()
        })
    }

    useEffect(() => {
        initForm()
    }, [])

    return (
        <Layout className='index animated fadeIn sample-detail'>
            <DetailModal
                visible={state.visible}
                onCreate={onCreate}
                onCancel={() => {
                    setState({ ...state, visible: false })
                }}
                formData={state.formData}
                disabled={state.disabled}
            />
            <WebBreadcrumbNew title='sample detail' />
            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Descriptions title='Sample request information'>
                            <Descriptions.Item label='Application ID'>{state.formData.id}</Descriptions.Item>
                            <Descriptions.Item label='Campaign ID'>{state.formData.campaign_id}</Descriptions.Item>
                            <Descriptions.Item label='Task ID'>{state.formData.task_id}</Descriptions.Item>
                            <Descriptions.Item label='Campaign Title'>{state.formData.title}</Descriptions.Item>
                            <Descriptions.Item label='User name'>
                                <a href={webhost + '/userDetail/' + state.formData.user_id} target='_blank'>
                                    {state.formData.from_user}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label='Application time'>{state.formData.create_time}</Descriptions.Item>
                            {/* <Descriptions.Item label='Address'>{state.formData.address}</Descriptions.Item> */}
                            <Descriptions.Item label='Your Instagram' span={3}>
                                {state.formData.instagram_handle}
                            </Descriptions.Item>
                            <Descriptions.Item label='Product name' span={3}>
                                {state.formData.product_name}
                            </Descriptions.Item>
                            <Descriptions.Item label='Product sku' span={3}>
                                {state.formData.product_sku}
                            </Descriptions.Item>
                            <Descriptions.Item label='Product url' span={3}>
                                <a target='_blank' href={state.formData.product_url}>
                                    {state.formData.product_url}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label='Sample type' span={1}>
                                {state.formData.sample_type ? 'abcomo sample' : 'other sample'}
                            </Descriptions.Item>
                        </Descriptions>
                        <Row>
                            <Col span={8}>
                                <Card title='User address' style={{ width: 300 }} hoverable>
                                    {!state.formData.address ||
                                    state.formData.address == '' ||
                                    state.formData.address == 'null' ? (
                                        <Empty />
                                    ) : (
                                        <>
                                            <div>
                                                address:
                                                {state.formData.address && JSON.parse(state.formData.address).address}
                                            </div>
                                            <div>
                                                contact number:
                                                {state.formData.address &&
                                                    JSON.parse(state.formData.address).contact_number}
                                            </div>
                                            <div>
                                                country:
                                                {state.formData.address && JSON.parse(state.formData.address).country}
                                            </div>
                                            <div>
                                                user name:
                                                {state.formData.address && JSON.parse(state.formData.address).name}
                                            </div>
                                            <div>
                                                post code:
                                                {state.formData.address && JSON.parse(state.formData.address).post_code}
                                            </div>
                                        </>
                                    )}
                                </Card>
                            </Col>
                            <Col span={8}>
                                {state.screenshots.length ? (
                                    <Card title='screenshot upload' hoverable>
                                        {state.screenshots.map((item, index) => {
                                            return <Image src={item} />
                                        })}
                                    </Card>
                                ) : null}
                            </Col>
                        </Row>

                        <Form
                            {...layout}
                            name='basic'
                            initialValues={{
                                remember: true
                            }}
                            form={form}>
                            {/* <Row>
                                <Col span={12}>
                                    <Form.Item label='Application ID' name='id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Campaign ID' name='campaign_id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Task ID' name='task_id'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Campaign Title' name='title'>
                                        <TextArea disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Username ' name='from_user'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Application time' name='create_time'>
                                        <TextArea disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Address' name='address'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Your Instagram' name='instagram_handle'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label='Product name' name='product_name'>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Form.Item {...tailLayout}>
                                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                    <Button type='primary' onClick={approveClick} style={{ marginLeft: '30px' }}>
                                        Approved
                                    </Button>
                                    <Button type='primary' onClick={RejectClick} style={{ marginLeft: '30px' }}>
                                        Reject
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

            {state.status == 3 || state.status == 2 ? (
                <div className='base-style base-detail' id='demoline'>
                    <div>Order information</div>
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
                                        <Form.Item label='Item link' name='item_link'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Various' name='various'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Order number' name='order_number'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Courier' name='courier'>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label='Sample Type' name='type'>
                                            <Select onChange={changeType}>
                                                <Option value={1}>Tracking number</Option>
                                                <Option value={2}>Coupon</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        {state.type == 1 ? (
                                            <Form.Item label='Tracking number ' name='tracking_number'>
                                                <Input />
                                            </Form.Item>
                                        ) : (
                                            <Form.Item
                                                label='Coupon'
                                                name='coupon'
                                                rules={[
                                                    {
                                                        type: 'url',
                                                        message: 'Please fill in the HTTPS link'
                                                    }
                                                ]}>
                                                <Input placeholder='Please fill in the HTTPS link' />
                                            </Form.Item>
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label='Remarks' name='remarks'>
                                            <TextArea />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {state.status == 3 || state.status == 2 ? (
                                    <Form.Item {...tailLayout}>
                                        <div style={{ marginTop: '20px' }}>
                                            <Button type='primary' htmlType='submit' style={{ marginLeft: '30px' }}>
                                                Save
                                            </Button>
                                            <Button type='primary' onClick={cancelClick} style={{ marginLeft: '30px' }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </Col>
                    </Row>
                </div>
            ) : null}

            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={state.actionLog} />
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default TaskDetail
