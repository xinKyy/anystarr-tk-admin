import React, { Component, useEffect, useState } from 'react'
import { APIgetAreaMemberList } from '@/mapi'
import { getKeyList } from '@/tools/action.js'
import { Table, Button, Modal, Checkbox } from 'antd'

const columnss = [
    {
        title: 'user_id',
        dataIndex: 'user_id'
    },
    {
        title: '用户名',
        dataIndex: 'user_name'
    },
    {
        title: '角色',
        dataIndex: 'role_name'
    }
]

const permissions = [
    {
        label: '项目发布',
        value: 'pmp_publish'
    },
    {
        label: '项目执行',
        value: 'pmp_execute'
    },
    {
        label: '项目审核',
        value: 'pmp_check'
    },
    {
        label: '任务分配',
        value: 'pmt_allocation'
    },
    {
        label: '任务执行',
        value: 'pmt_execute'
    },
    {
        label: '任务审核',
        value: 'pmt_check'
    }
]

const MemberModal = ({ visible, onCreateNew, onCancel }) => {
    const [data, setData] = useState([])
    const [permissionsData, setPermissionsData] = useState([])
    const [selectObj, setSelectObj] = useState({})
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10
    })
    const onChange = val => {
        console.log('21kl', val)
        setPermissionsData(val)
    }
    const searchClick = () => {
        let areaId = localStorage.getItem('av')
        let userRole = JSON.parse(localStorage.getItem('ur'))
        let role = userRole.filter(item => item.area_id == areaId)
        let roleLevel = role[0] && role[0].role_level
        let params = {
            id: localStorage.getItem('av'),
            permissions: permissionsData.toString(),
            level: roleLevel + 1
            // limit: pagination.pageSize,
            // offset: 0
        }
        console.log('params', params)
        APIgetAreaMemberList(params)
            .then(resp => {
                setData(resp.data && getKeyList(resp.data))
            })
            .catch(err => {
                console.log('err', err)
            })
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            setSelectObj(selectedRows[0])
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    }

    return (
        <Modal
            visible={visible}
            title='获取成员'
            okText='保存'
            cancelText='Cancel'
            onOk={() => {
                onCreateNew(selectObj)
            }}
            onCancel={onCancel}>
            <Checkbox.Group options={permissions} onChange={onChange} />{' '}
            <Button
                type='primary'
                onClick={searchClick}
                style={{
                    margin: '10px auto'
                }}>
                查询{' '}
            </Button>{' '}
            <Table
                rowSelection={{
                    type: 'radio',
                    ...rowSelection
                }}
                columns={columnss}
                dataSource={data}
                pagination={pagination}
            />{' '}
        </Modal>
    )
}

export default MemberModal
