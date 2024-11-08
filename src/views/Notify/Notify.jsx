import React, { Component, useEffect, useState } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table } from 'antd'
import '@/style/view-style/table.less'
import { APIgetUserNotfiyList } from '@/mapi'
import { getKeyList } from '@/tools/action.js'
const userId = localStorage.getItem('uid')

const columns = [
    {
        title: '通知内容',
        dataIndex: 'content',
        key: 'content'
    },
    {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at'
    },
    {
        title: '是否已读',
        dataIndex: 'has_read',
        key: 'has_read'
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
    },
    {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    }
]

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

        const params = { limit: pagination.pageSize, offset: 0 }
        getList(params)
    }, [])

    const getList = params => {
        setState({ loading: true })
        APIgetUserNotfiyList(params)
            .then(resp => {
                console.log('resp', resp)
                console.log('ty', getKeyList(resp.data.list))
                setState({
                    ...state,
                    list: resp.data.list && getKeyList(resp.data.list),
                    loading: false,
                    pagination: {
                        total: resp.data.total
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

    const handleChange = pagination => {
        console.log('pagination', pagination)
        const params = { limit: pagination.pageSize, offset: pagination.pageSize * (pagination.current - 1) }
        getList(params)
    }

    return (
        <Layout className='animated fadeIn'>
            <div>
                <WebBreadcrumb arr={['我的通知']} />
            </div>
            {/* <div className="base-style">
				<SearchBar changeSearch={changeSearch} />
			</div> */}
            <Row>
                <Col span={24}>
                    <div className='base-style'>
                        <Table
                            columns={columns}
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
