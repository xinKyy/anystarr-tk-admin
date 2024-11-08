import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
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
  message,
  Upload,
  Badge, Image
} from 'antd'
import '@/style/view-style/table.less'
import {
    APIexportRewardRecord,
    APIGetUserList,
    APIDownloadUser,
    APIModifyUserStatus,
    APIbatchUploadUserList,
    APIDownloadUserNew,
    APISendActiveEmail
} from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { UploadOutlined, FormOutlined, CloudDownloadOutlined, SearchOutlined } from '@ant-design/icons'
import webhost from '@/tools/webhost.js'
import Aset from '@/imgs/aset1.png'
import { getYearMonthDayTimeNew, getCleanedParams } from '@/tools/help.js'
import {APIDeleteByUid, APIGetTikTokUserList} from "../../mapi";
const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select

const statusList = [
    { label: 'Active', value: '1' },
    { label: 'Banned', value: '2' },
    { label: 'Locked', value: '5' }
]

const StatusOptions = statusList.map((option, index) => {
    return (
        <Option key={index} value={option.value}>
            {option.label}
        </Option>
    )
})

const getLocalTime = nS => {
    return new Date(Date.parse(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ')
}

const columns = (deleteById) => [
    {
        title: 'Avatar',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        align: 'center',
        render: (avatarUrl, item) => avatarUrl ? <Image style={{
          width:"60px",
          height:"60px"
        }} src={avatarUrl}></Image> : null
    },
    {
        title: 'Nick Name',
        dataIndex: 'displayName',
        key: 'displayName',
        align: 'center'
    },
    {
        title: 'Profile DeepLink',
        dataIndex: 'profileDeepLink',
        key: 'profileDeepLink',
        align: 'center',
        render:(v, item)=>{
          return v ? <a href={v} target={"_blank"}>Profile</a> : null
        }
    },
    {
        title: 'Registered Time',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
    },
    {
        title: 'Followers',
        dataIndex: 'followerCount',
        key: 'followerCount',
        align: 'center'
        // render: (text, item) => <span>{getLocalTime(item.create_time)}</span>
    },
    {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render:(v, item)=>{
          return <Button onClick={()=>deleteById(v)}>Delete</Button>
        }
    }
]

const searchLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        props.changeSearch(values)
    }

    return (
        <Form
            {...searchLayout}
            form={form}
            name='advanced_search'
            className='ant-advanced-search-form'
            onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='searchName' label='Nick Name'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button icon={<SearchOutlined />} type='primary' htmlType='submit' loading={props.loading}>
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields()
                        }}>
                        Reset
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

const DetailModal = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    const [user, setUser] = useState({})
    const [allMemVisible, setAllMemVisible] = useState(false)

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

    useEffect(() => {}, [])

    return (
        <Modal
            visible={visible}
            title=''
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
                <Form.Item name='status' label='status' rules={[{ required: true }]}>
                    <Select>{StatusOptions}</Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const SearchTableView = props => {
    const [dataSource, setDataSource] = useState([]);
    const [state, setState] = useState({
        list: [],
        search: {},
        loading: true,
        visible: false,
        disabled: false,
        formData: {},
        startRow: 0,
        userId: '',
        downloadUserUrl: ''
    })
    const [loading, setLoading] = useState(false);

    const [pageI, setPageI] = useState( {
      current: 1,
      pageSize: 20,
      total:0,
    })

    useEffect(() => {
      getList(1, 20);
    }, [])

    const getList = (page, pageSize, searchName) => {
      setLoading(true);
      APIGetTikTokUserList(JSON.stringify({
        page,
        pageSize,
        searchName
      })).then(resp=>{
        console.log(resp.data.result, "USER DATA")
        if(resp.data.result){
          setDataSource(resp.data.result.records)
          setPageI({
            page:resp.data.result.current,
            pageSize: 20,
            total:resp.data.result.total
          })
        }
      }).finally(()=>{
        setLoading(false)
      })
    }

    const deleteById = (uid) =>{
      setLoading(true);
      APIDeleteByUid({
        uid:uid,
      }).then(resp=>{
        if(resp.data.result){
          message.success("Delete success!")
        }
      }).finally(()=>{
        setLoading(false);
        getList(pageI.current, pageI.pageSize, state.search.searchName)
      })
    }

    const handleChange = pagination => {
      console.log(pagination, "currentcurrentcurrent")
        getList(pagination.current, pagination.pageSize, state.search.searchName)
    }

    const changeSearch = search => {
        setState({
            ...state,
            ...search
        })
        getList(1, state.pagination.pageSize, search.searchName)
    }

    return (
        <Layout className='animated fadeIn'>
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['User List']} />
                <h3>User List</h3>
                <img src={Aset} className='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar changeSearch={changeSearch} loading={state.loading} />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Table
                                columns={columns(deleteById)}
                                rowKey={record => record.key}
                                dataSource={dataSource}
                                onChange={handleChange}
                                bordered
                                loading={state.loading}
                                pagination={state.pagination}
                                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default SearchTableView
