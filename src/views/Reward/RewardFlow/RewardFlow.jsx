import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select } from 'antd'
import '@/style/view-style/table.less'
import { APIgetList, APIgetRewardList, APIrewardReceive, APIrewardRunningWater } from '@/mapi'
import { getKeyList } from '@/tools/action.js'

const { MonthPicker, RangePicker } = DatePicker
const { Option } = Select

const typeList = [
    { label: '法币', value: 'fiat' },
    { label: '积分', value: 'score' }
]

const TypeOptions = typeList.map((option, index) => {
    return (
        <Option key={index} value={option.value}>
            {option.label}
        </Option>
    )
})

const columns = ({ handleGetReward }) => [
    {
        title: '变化后的数量',
        dataIndex: 'after',
        key: 'after'
    },
    {
        title: '变化数量',
        dataIndex: 'change',
        key: 'change'
    },
    {
        title: '资产流向类型',
        dataIndex: 'reward_io_type',
        key: 'reward_io_type'
    },
    {
        title: '来源',
        dataIndex: 'source',
        key: 'source'
    },
    {
        title: '来源类型',
        dataIndex: 'source',
        key: 'source'
    },
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp'
    }
    // {
    //     title: "操作",
    //     dataIndex: "opeartion",
    //     key: "opeartion",
    //     render: (text, record) => (
    //         <Button onClick={() => handleGetReward(record.id)} style={{ padding: 0 }} type="link">
    //             领取奖励
    //         </Button>
    //     )
    // }
]

const SearchBar = props => {
    const [form] = Form.useForm()

    const onFinish = values => {
        console.log('Received values of form: ', values)
        props.changeSearch(values)
    }

    return (
        <Form form={form} name='advanced_search' className='ant-advanced-search-form' onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item name='types' label='类型'>
                        <Select allowClear>{TypeOptions}</Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type='primary' htmlType='submit'>
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields()
                        }}>
                        Clear
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

const SearchTableView = () => {
    const [state, setState] = useState({
        list: [],
        pagination: {
            current: 1,
            pageSize: 10
        },
        search: {},
        loading: true,
        visible: false,
        disabled: false,
        formData: {}
    })
    const [handleState, setHandleState] = useState({
        visible: false,
        data: {}
    })
    useEffect(() => {
        const { pagination } = state
        // const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }

        const params = { offset: 0, limit: state.pagination.pageSize }
        getList(params)
    }, [])

    const handleGetReward = async id => {
        console.log('领取奖励')
        await APIrewardReceive({ id })
    }
    const getList = params => {
        setState({ loading: true })
        APIrewardRunningWater(params)
            .then(resp => {
                setState({
                    ...state,
                    list: resp.data.list && getKeyList(resp.data.list),
                    // list: [
                    // 	{
                    // 		create_at: 0,
                    // 		id: 0,
                    // 		key: "1",
                    // 		receive_at: 0,
                    // 		received: true,
                    // 		reward: {
                    // 			additionalProp1: 0,
                    // 			additionalProp2: 0,
                    // 			additionalProp3: 0
                    // 		},
                    // 		source: "string",
                    // 		source_type: "string"
                    // 	}
                    // ],
                    loading: false,
                    pagination: {
                        total: resp.data.total,
                        current: params.offset / params.limit + 1,
                        pageSize: params.limit
                        // ...state.pagination
                        // total: resp.data.total
                        // current: resp.data.pager.start_row + 1,
                        // pageSize: resp.data.pager.page_size
                    }
                })
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const changeSearch = search => {
        console.log('search', search)

        const params = { ...search, limit: state.pagination.pageSize, offset: 0 }
        getList(params)
        setState({
            ...state,
            ...search
        })
    }

    const handleChange = pagination => {
        const params = {
            ...state.search,
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        }
        getList(params)
    }

    return (
        <Layout className='animated fadeIn'>
            <div>
                <WebBreadcrumb arr={['我的通知']} />
            </div>
            <div className='base-style'>
                <SearchBar changeSearch={changeSearch} />
            </div>
            <Row>
                <Col span={24}>
                    <div className='base-style'>
                        <Table
                            columns={columns({ handleGetReward })}
                            rowKey={record => record.key}
                            dataSource={state.list}
                            onChange={handleChange}
                            loading={state.loading}
                            pagination={state.pagination}
                        />
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default SearchTableView
