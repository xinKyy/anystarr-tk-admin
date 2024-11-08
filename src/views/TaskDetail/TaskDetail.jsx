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
    Badge
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
    APIExamineTask
} from '@/mapi'
import axios from '@/api'
import { API } from '@/api/config'
// import { withRouter } from "react-router-dom";
import { UploadOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { type } from 'koa/lib/request'
import TextArea from 'antd/lib/input/TextArea'
import { getLendTime, getLendTimeNew, isJSON } from '@/tools/help.js'
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

const isVideo = str => {
    return /^.+(\.mp4|\.avi|video|\.mov|\.MOV|\.rmvb|.flv)$/i.test(str)
}

const columns = [
    {
        title: 'Task id',
        dataIndex: 'task_id',
        key: 'task_id',
        align: 'center'
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
        align: 'center'
    },
    {
        title: 'Review time',
        dataIndex: 'review_time',
        key: 'review_time',
        align: 'center',
        render: (text, item) => {
            return <div>{text ? new Date(text).toLocaleString() : '--'}</div>
        }
    },
    {
        title: 'Review images',
        dataIndex: 'review_images',
        key: 'review_images',
        align: 'center',
        className: 'img-video-table-cell',
        width: '100',
        render: (text, item) => {
            let imgs = item.type == 2 ? item.draft_images : item.review_images
            return (
                imgs &&
                JSON.parse(imgs).map((iitem, index) => {
                    return (
                        <span style={{ maxWidth: '100px', overflow: 'hidden' }}>
                            {isVideo(iitem) ? (
                                <span className='marginleft5'>
                                    <video src={iitem} controls='controls' style={{ width: '100px' }}>
                                        您的浏览器不支持 video 标签。
                                    </video>
                                </span>
                            ) : (
                                <span className='marginleft5'>
                                    {/* <a href={iitem} target='_blank'>
                                        <img style={{ width: '100px' }} src={iitem} key={index} />{' '}
                                    </a> */}
                                    <Image src={iitem} key={iitem} />
                                </span>
                            )}
                        </span>
                    )
                })
            )
        }
    },
    {
        title: 'Review linkes',
        dataIndex: 'review_linkes',
        key: 'review_linkes',
        align: 'center',
        render: (text, item) => {
            return isJSON(text)
                ? JSON.parse(text).map((iitem, index) => {
                      return (
                          <div key={index}>
                              <a href={iitem} key={index} target='_blank'>
                                  {iitem}
                              </a>
                          </div>
                      )
                  })
                : text
        }
    },
    {
        title: 'Reviewed by',
        dataIndex: 'reviewed_by',
        key: 'reviewed_by',
        align: 'center'
    },
    {
        title: 'Reviewed decision',
        dataIndex: 'review_reason',
        key: 'review_reason',
        align: 'center',
        render: (text, item) =>
            item.review_reason == null ? '' : item.review_reason == 'Approved' ? 'Approved' : 'Rejected'
    },
    {
        title: 'Reason for not-approved',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (text, item) =>
            item.review_reason == null ? '' : item.review_reason == 'Approved' ? 'Approved' : item.review_reason
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
        { label: 'no promo code shown - English', value: 17 },
        { label: 'no promo code shown - Spanish', value: 18 },
        { label: 'no promo code shown - French', value: 19 },
        { label: 'no promo code shown - Polish', value: 20 },
        { label: 'no promo code shown - Brazil', value: 25 },
        { label: 'Promo code shown is wrong, no uppercase - English', value: 21 },
        { label: 'Promo code shown is wrong, no uppercase - Spanish', value: 22 },
        { label: 'Promo code shown is wrong, no uppercase - French', value: 23 },
        { label: 'Promo code shown is wrong, no uppercase - Polish', value: 24 },
        { label: 'Promo code shown is wrong, no uppercase - Brazil', value: 26 },
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
        ],
        [
            17,
            'Thanks for your participation. Unfortunately, the promo code isn’t shown in your post. Please add the promo code and resubmit again.'
        ],
        [
            18,
            'Gracias por tu participación. Lamentablemente, el código promocional no aparece en tu post. Por favor, añade el código de promoción y vuelve a enviarlo.'
        ],
        [
            19,
            "Merci pour votre participation. Malheureusement, le code promo n'apparaît pas dans votre message. Veuillez ajouter le code promotionnel et soumettre à nouveau votre message."
        ],
        [
            20,
            'Dziękujemy za udział. Niestety, kod promocyjny nie jest widoczny w Twoim poście. Proszę dodaj kod promocyjny i wyślij go ponownie.'
        ],
        [
            21,
            'Thanks for your participation. Unfortunately, the promo code you input is wrong. Please change to this XXXX and resubmit.'
        ],
        [
            22,
            'Gracias por su participación. Lamentablemente, el código de promoción que has introducido es incorrecto. Por favor, cámbialo por este XXXX y vuelve a enviarlo.'
        ],
        [
            23,
            'Merci de votre participation. Malheureusement, le code promo que vous avez entré est incorrect. Veuillez le remplacer par ce XXXX et le soumettre à nouveau.'
        ],
        [
            24,
            'Dziękujemy za udział. Niestety, kod promocyjny, który wprowadziłeś jest nieprawidłowy. Proszę zmienić go na ten XXXX i przesłać ponownie.'
        ],
        [
            25,
            'Obrigado por sua participação. Infelizmente, o código promocional não é mostrado em seu posto. Por favor, adicione o código promocional e volte a enviar novamente.'
        ],
        [
            26,
            'Obrigado por sua participação. Infelizmente, o código promocional que você inseriu está errado. Por favor, mude para este XXXX e reapresente.'
        ]
    ])

    const changeTempalte = value => {
        console.log('valuesssss', value)
        let str = ''
        if (!value) {
            form.resetFields()
            return
        }
        console.log('reasonTempalte.get(value)', reasonTempalte.get(value))
        form.setFieldsValue({
            review_reason: reasonTempalte.get(value)
        })
    }

    useEffect(() => {}, [])

    return (
        <Modal
            visible={visible}
            title='Task review'
            okText='Submit'
            cancelText='Cancel'
            width={800}
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        values.id = formData.id
                        values.task_id = formData.task_id
                        values.status = formData.status
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
                <Form.Item name='review_reason' label='review_reason' rules={[{ required: true }]}>
                    <TextArea rows={6} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const TaskDetail = props => {
    const [state, setState] = useState({
        reviewContent: {},
        taskRecordList: [],
        visible: false,
        formData: {},
        user: '',
        userID: ''
    })
    const [form] = Form.useForm()
    const [country, setCountry] = useState([{ name: 'china', value: '1' }])
    const [language, setLanguage] = useState([
        { name: 'Chinese', value: '1' },
        { name: 'English', value: '2' }
    ])
    const [merchant, setMerchant] = useState([{ name: 'merchant1', value: '1' }])
    const [taskDes, setTaskDes] = useState(' ')
    const [promoCode, setPromoCode] = useState([])

    let { editorState, outputHTML } = state

    let editorChange = editorState => {
        setState(prevState => {
            return { ...prevState, editorState, outputHTML: editorState.toHTML() }
        })
    }

    const saveDraft = () => {
        console.log('saveDraft')
    }

    const onFinish = values => {
        let query = props.location.query
        values = {
            ...values,
            start_time: values['start_time'].format('YYYY-MM-DD HH:mm:ss'),
            close_time: values['close_time'].format('YYYY-MM-DD HH:mm:ss'),
            post_start_time: values['post_start_time'].format('YYYY-MM-DD HH:mm:ss'),
            post_close_time: values['post_close_time'].format('YYYY-MM-DD HH:mm:ss'),
            task_start_time: values['task_start_time'].format('YYYY-MM-DD HH:mm:ss'),
            task_close_time: values['task_close_time'].format('YYYY-MM-DD HH:mm:ss'),
            banner: state.bannerList,
            rules_description: editorState.toHTML(),
            promo_code_list: promoCode,
            task_description: taskDes
        }
        if (!promoCode.length) {
            delete values.promo_code_list
        }
        if (query) {
            values.id = query.id
        }
        console.log('Received values of form: ', values)
        APICreateModifyCampaign({ campaignJson: JSON.stringify(values) }).then(resp => {
            props.history.push('/campaigns')
        })
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
        // this.props.history.push("/index");
    }

    const normFile = e => {
        console.log('Upload event:', e)

        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    const getCountryList = () => {
        APIGetCountryList().then(resp => {
            setCountry(resp.data.data)
        })
    }

    const setTaskDescription = () => {}

    const initForm = () => {
        let query =
            props.location.query || (sessionStorage.getItem('query') ? JSON.parse(sessionStorage.getItem('query')) : {})
        let id = props.match.params.id
        APIGetTaskDetail({ id: id }).then(resp => {
            console.log('resp', resp)

            // setState(resp.data.data)
            let reviewContent = resp.data.data.review_content ? resp.data.data.review_content : {}

            reviewContent.review_images = reviewContent.review_images ? JSON.parse(reviewContent.review_images) : []
            reviewContent.review_linkes = isJSON(reviewContent.review_linkes)
                ? JSON.parse(reviewContent.review_linkes)
                : [reviewContent.review_linkes]

            reviewContent.draft_images = reviewContent.draft_images ? JSON.parse(reviewContent.draft_images) : []
            reviewContent.draft_content = isJSON(reviewContent.draft_content)
                ? JSON.parse(reviewContent.draft_content)
                : [reviewContent.draft_content]

            // form.setFieldsValue({
            //     id: resp.data.data.id,
            //     campaign_id: resp.data.data.campaign_id,
            //     user: resp.data.data.user,
            //     title: resp.data.data.title,
            //     update_time: resp.data.data.update_time,
            //     commit_number: resp.data.data.commit_number,
            //     promo_code: resp.data.data.promo_code,
            //     submit_time: resp.data.data.review_content ? resp.data.data.review_content.create_time : ''
            // })

            setState({
                ...state,
                reviewContent: reviewContent,
                taskRecordList: resp.data.data.task_record_list,
                user: resp.data.data.user,
                userID: resp.data.data.user_id,
                formData: resp.data.data
            })
        })
    }

    const setTaskDesValueTo = data => {
        console.log('大医院', data)
        let resArr = data.split(';')
        console.log('resArrrrrr', resArr)
    }

    const setTypeTo = data => {
        console.log('setTypeTo', data)
        if (data == '1') {
            setTaskDes(template1)
        }
        setState({
            ...state,
            type: data
        })
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

    const uploadPromoCode = ({ file, onSuccess }) => {
        APIUploadPromoCode({ file: file }).then(resp => {
            onSuccess()
            setPromoCode(resp.data.data)
        })
    }

    const onCreate = values => {
        console.log('valuessss', values)
        APIExamineTask({ taskRecordJson: JSON.stringify(values) }).then(resp => {
            message.success('success')
            setState({
                ...state,
                visible: false
            })
            props.history.push('/tasks_ma/tasks')
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
            initForm()
            // props.history.push('/tasks')
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

    const gotoUser = userID => {
        let url = webhost + '/userDetail/' + userID
        let win = window.open(url, '_blank')
        win.focus()
    }

    useEffect(() => {
        getCountryList()
        initForm()
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
            <WebBreadcrumbNew title='task Detail' />
            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <Descriptions title='Task Info'>
                            <Descriptions.Item label='Task ID'>{state.formData.id}</Descriptions.Item>
                            <Descriptions.Item label='Campaign ID'>
                                <a href={webhost + '/createCampaign/' + state.formData.campaign_id} target='_blank'>
                                    {state.formData.campaign_id}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label='Submitted form'>
                                <a href={webhost + '/userDetail/' + state.formData.user_id} target='_blank'>
                                    {state.formData.user}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label='Campaign Title' span={3}>
                                {state.formData.title}
                            </Descriptions.Item>
                            <Descriptions.Item label='Submitted time'>{state.formData.update_time}</Descriptions.Item>
                            <Descriptions.Item label='Attempt'>{state.formData.commit_number}</Descriptions.Item>
                            <Descriptions.Item label='Code applied'>{state.formData.promo_code}</Descriptions.Item>
                            <Descriptions.Item label='Task status' span={3}>
                                <Badge status={state.formData.status == 0 ? 'default' : 'success'} />
                                {state.formData.status == 0
                                    ? 'Task closed'
                                    : state.formData.status == 1
                                    ? 'New Task'
                                    : state.formData.status == 2
                                    ? 'Pending proof upload'
                                    : state.formData.status == 3
                                    ? 'Pending for Review'
                                    : state.formData.status == 4
                                    ? 'Resubmit evidence'
                                    : state.formData.status == 5
                                    ? 'Task Approved'
                                    : state.formData.status == 7
                                    ? 'Pending for Content Review'
                                    : state.formData.status == 8
                                    ? 'Resubmit Content'
                                    : state.formData.status == 9
                                    ? 'Pending proof upload'
                                    : ''}
                            </Descriptions.Item>
                            <Descriptions.Item label='Sample application ID' span={3}>
                                {state.formData.sample_id ? state.formData.sample_id : '--'}
                            </Descriptions.Item>
                            <Descriptions.Item label='Sample Status' span={3}>
                                {!state.formData.sample_status
                                    ? '--'
                                    : state.formData.status == 1
                                    ? 'New application'
                                    : state.formData.status == 4
                                    ? 'Closed'
                                    : state.formData.status == 3
                                    ? 'Approved'
                                    : 'Shipped'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </div>
            {state.reviewContent && (state.reviewContent.status == 3 || state.reviewContent.status == 7) ? (
                <div className='base-style base-detail' id='demoline'>
                    <h3 style={{ marginBottom: '10px' }}>
                        {state.reviewContent.status == 3 ? 'Pending for Review' : 'Content Pending for Review'}
                    </h3>
                    <div className='task-review-content'>
                        <h4>Upload imgs:</h4>
                        <div style={{ marginLeft: '20px' }}>
                            {state.reviewContent && state.reviewContent.type == 2 ? (
                                <div className='imgvideo'>
                                    {state.reviewContent.draft_images &&
                                        state.reviewContent.draft_images.map((item, index) => {
                                            return isVideo(item) ? (
                                                <video
                                                    className='marginleft5'
                                                    src={item}
                                                    controls='controls'
                                                    style={{ width: '150px', marginLeft: '4px' }}></video>
                                            ) : (
                                                <Image className='marginleft5' key={index} width={150} src={item} />
                                            )
                                        })}
                                </div>
                            ) : (
                                <div className='imgvideo'>
                                    {state.reviewContent.review_images &&
                                        state.reviewContent.review_images.map((item, index) => {
                                            return isVideo(item) ? (
                                                <video
                                                    src={item}
                                                    className='marginleft5'
                                                    controls='controls'
                                                    style={{ width: '150px', marginLeft: '4px' }}></video>
                                            ) : (
                                                <Image className='marginleft5' key={index} width={150} src={item} />
                                            )
                                            // return <Image key={index} width={150} src={item} />
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                    <Divider />
                    <div className='task-review-content'>
                        <h4>Links:</h4>
                        <div style={{ marginLeft: '20px' }}>
                            {state.reviewContent && state.reviewContent.type == 2 ? (
                                <div>
                                    {state.reviewContent.draft_content.map((item, index) => {
                                        return (
                                            <a key={index} href={item} target='_blank'>
                                                {item}
                                            </a>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div>
                                    {state.reviewContent.review_linkes.map((item, index) => {
                                        return (
                                            <a key={index} href={item} target='_blank'>
                                                {item}
                                            </a>
                                        )
                                    })}
                                </div>
                            )}
                            {/* {state.reviewContent &&
                                state.reviewContent.review_linkes &&
                                state.reviewContent.review_linkes.map((item, index) => {
                                    return (
                                        <a key={index} href={item} target='_blank'>
                                            {item}
                                        </a>
                                    )
                                })} */}
                        </div>
                    </div>

                    {state.reviewContent.type == 2 ? (
                        state.reviewContent.status == '8' || state.reviewContent.status == '9' ? null : (
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        agreeExamClick(state, '9') //9
                                    }}>
                                    Approve
                                </Button>
                                <Button
                                    type='dashed'
                                    onClick={() => {
                                        examClick(state, '8') //8
                                    }}
                                    style={{ marginLeft: '20px' }}>
                                    Reject
                                </Button>
                            </div>
                        )
                    ) : state.reviewContent.status == '4' || state.reviewContent.status == '5' ? null : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Button
                                type='primary'
                                onClick={() => {
                                    agreeExamClick(state, '5') //9
                                }}>
                                Approve
                            </Button>
                            <Button
                                type='dashed'
                                onClick={() => {
                                    examClick(state, '4') //8
                                }}
                                style={{ marginLeft: '20px' }}>
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            ) : null}

            <div className='base-style base-detail' id='demoline'>
                <Row>
                    <Col span={24}>
                        <h3>Reviewd logs</h3>
                        <Table columns={columns} dataSource={state.taskRecordList} />
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

// export default withRouter(CreateArea);
export default TaskDetail
