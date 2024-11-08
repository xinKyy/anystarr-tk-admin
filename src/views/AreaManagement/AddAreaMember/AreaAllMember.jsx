import React, { Component, useEffect, useState, useContext } from 'react'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Pagination, Spin, Checkbox } from 'antd'
import '@/style/view-style/table.less'
import './allmember.less'
import { APIgetProjectList, APIgetAreaMemberList } from '@/mapi'
import { AreaContext } from '../../../containers/DefaultLayout'

const permissions = [
    { label: 'pmp_publish', value: 'pmp_publish' },
    { label: 'pmp_execute', value: 'pmp_execute' },
    { label: 'pmp_check', value: 'pmp_check' },
    { label: 'pmt_allocation', value: 'pmt_allocation' },
    { label: 'pmt_execute', value: 'pmt_execute' },
    { label: 'pmt_check', value: 'pmt_check' }
]

const columns = [
    {
        title: 'user_id',
        dataIndex: 'user_id'
    },
    {
        title: 'role_id',
        dataIndex: 'role_id'
    },
    {
        title: 'role_name',
        dataIndex: 'role_name'
    },
    {
        title: 'user_name',
        dataIndex: 'user_name'
    },
    {
        title: 'role_level',
        dataIndex: 'role_level'
    }
]

const MenberModal = ({ visible, onCreate, onCancel }) => {
    const [data, setData] = useState([])
    const [permissionsData, setPermissionsData] = useState([])
    const [selectObj, setSelectObj] = useState({})
    const onChange = val => {
        console.log('21kl', val)
        setPermissionsData(val)
    }
    const searchClick = () => {
        console.log('search', permissionsData)
        let params = {
            id: 1,
            level: 0,
            permissions: permissionsData.toString()
        }
        APIgetAreaMemberList(params)
            .then(resp => {
                let data = [
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号1',
                        key: '1'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号2',
                        key: '2'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号3',
                        key: '3'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号4',
                        key: '4'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号5',
                        key: '5'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号6',
                        key: '6'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号7',
                        key: '7'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号8',
                        key: '8'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号9',
                        key: '9'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号10',
                        key: '10'
                    },
                    {
                        role_id: '1',
                        role_level: 0,
                        role_name: '角色',
                        user_id: 0,
                        user_name: '大括号11',
                        key: '11'
                    }
                ]
                setData(data)
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
                onCreate(selectObj)
            }}
            onCancel={onCancel}>
            <Checkbox.Group options={permissions} onChange={onChange} />
            <Button type='primary' onClick={searchClick}>
                查询
            </Button>
            <Table
                rowSelection={{
                    type: 'radio',
                    ...rowSelection
                }}
                columns={columns}
                dataSource={data}
            />
        </Modal>
    )
}

class AreaAllMember extends Component {
    state = {}

    handleClick = () => {
        console.log('21', this.props)
        this.props.setAllMemVisible(true)
    }

    onCreate = val => {
        console.log('onCreate', val)
        // this.props.setUserValue(val)
        this.props.setAllMemVisible(false)
    }

    onCancel = () => {
        console.log('oncancelllll')
        this.props.setAllMemVisible(false)
    }

    render() {
        console.log('props...', this.props)
        return (
            <div className='area-all-member' onClick={this.handleClick}>
                <MenberModal visible={this.props.visible} onCreate={this.onCreate} onCancel={this.onCancel} />
                {/* <span> {this.props.value ? this.props.value.user_name : ''} </span> */}
            </div>
        )
    }
}

export default AreaAllMember
