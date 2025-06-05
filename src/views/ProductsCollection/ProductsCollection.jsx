import React, { useState, useEffect } from 'react'
import {
    Layout,
    Form,
    Row,
    Col,
    Button,
    Table,
    Input,
    Select,
    Modal,
    Checkbox,
    Upload,
    message,
    Space,
    Tag
} from 'antd'
import Aset from '@/imgs/aset1.png'
import WebBreadcrumb from '@/components/WebBreadcrumb'
import { PlusOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons'
import { APIGetPromotionSectionList, APIPromotionSectionCreate, APIPromotionSectionEdit } from '@/mapi'
import * as XLSX from 'xlsx'

const { Option } = Select

const searchLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}

const SearchBar = ({ changeSearch, loading, onSuccess, editRecord, onEditRecordChange, onTypeChange, onSearch }) => {
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [fileList, setFileList] = useState([])
    const [pidList, setPidList] = useState([])
    const [currentPid, setCurrentPid] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [currentRecord, setCurrentRecord] = useState(null)
    const [sectionType, setSectionType] = useState('')

    useEffect(() => {
        if (editRecord) {
            showModal(editRecord)
        }
    }, [editRecord])

    const onFinish = values => {
        changeSearch(values)
    }

    const handleTypeChange = value => {
        setSectionType(value)
        onTypeChange(value)
    }

    const showModal = (record = null) => {
        setIsModalVisible(true)
        if (record) {
            setIsEdit(true)
            setCurrentRecord(record)
            // 设置表单初始值
            modalForm.setFieldsValue({
                pageName: record.sectionName,
                position: record.sectionType === 1,
                url: record.url
            })
            // 设置 PID 列表
            if (Array.isArray(record.products)) {
                setPidList(record.products.map(item => item.productId))
            }
        } else {
            setIsEdit(false)
            setCurrentRecord(null)
        }
    }

    const handleAddPid = () => {
        if (currentPid.trim()) {
            setPidList([...pidList, currentPid.trim()])
            setCurrentPid('')
            modalForm.setFieldsValue({ pid: '' })
        }
    }

    const handleRemovePid = pidToRemove => {
        setPidList(prevList => {
            // 创建一个新数组，只保留不等于要删除的PID的元素
            return prevList.filter((pid, index) => {
                // 使用严格比较，确保只删除完全匹配的PID
                return pid !== pidToRemove
            })
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        modalForm.resetFields()
        setFileList([])
        setPidList([])
        setCurrentPid('')
        setIsEdit(false)
        setCurrentRecord(null)
        onEditRecordChange(null)
    }

    const handleOk = () => {
        modalForm.validateFields().then(values => {
            const params = {
                sectionName: values.pageName,
                sectionType: values.position ? 1 : 2,
                productIds: pidList,
                url: values.url || ''
            }

            if (isEdit) {
                params.id = currentRecord.id
                APIPromotionSectionEdit(JSON.stringify(params))
                    .then(resp => {
                        message.success('Update successfully')
                        setIsModalVisible(false)
                        modalForm.resetFields()
                        setPidList([])
                        setCurrentPid('')
                        setIsEdit(false)
                        setCurrentRecord(null)
                        onSuccess()
                    })
                    .catch(error => {
                        message.error('Update failed')
                    })
            } else {
                APIPromotionSectionCreate(JSON.stringify(params))
                    .then(resp => {
                        message.success('Create successfully')
                        setIsModalVisible(false)
                        modalForm.resetFields()
                        setPidList([])
                        setCurrentPid('')
                        setIsEdit(false)
                        setCurrentRecord(null)
                        onSuccess()
                    })
                    .catch(error => {
                        message.error('Create failed')
                    })
            }
        })
    }

    const handleUpload = info => {
        const { file } = info

        // 检查文件类型
        const isExcel =
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel'
        if (!isExcel) {
            message.error('只能上传Excel文件！')
            return
        }

        // 检查文件大小（限制为5MB）
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
            message.error('文件大小不能超过5MB！')
            return
        }

        // 更新文件列表
        setFileList([file])

        // 读取Excel文件
        const reader = new FileReader()
        reader.onload = e => {
            try {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })

                // 检查是否有工作表
                if (workbook.SheetNames.length === 0) {
                    message.error('Excel文件为空！')
                    return
                }

                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]

                // 检查工作表是否为空
                if (!worksheet || !worksheet['!ref']) {
                    message.error('工作表为空！')
                    return
                }

                const jsonData = XLSX.utils.sheet_to_json(worksheet)

                // 检查是否有数据
                if (jsonData.length === 0) {
                    message.error('未找到数据！')
                    return
                }

                // 提取pid列数据
                const pids = jsonData
                    .map(row => {
                        // 尝试不同的可能的列名
                        const pid = row.pid || row.PID || row.Pid || row['pid'] || row['PID'] || row['Pid']
                        return pid ? String(pid).trim() : null
                    })
                    .filter(pid => pid !== null)

                if (pids.length === 0) {
                    message.error('未找到pid列数据！请确保Excel文件中包含pid列。')
                    return
                }

                // 去重处理
                const uniquePids = [...new Set(pids)]

                // 更新pidList，同时去重
                setPidList(prevList => {
                    const newList = [...prevList]
                    uniquePids.forEach(pid => {
                        if (!newList.includes(pid)) {
                            newList.push(pid)
                        }
                    })
                    return newList
                })

                message.success(`成功导入 ${uniquePids.length} 个PID`)
            } catch (error) {
                console.error('Excel读取错误:', error)
                message.error('文件读取失败！请确保文件格式正确。')
            }
        }

        reader.onerror = () => {
            message.error('文件读取失败！请重试。')
        }

        try {
            reader.readAsArrayBuffer(file)
        } catch (error) {
            console.error('文件读取错误:', error)
            message.error('文件读取失败！请重试。')
        }
    }

    return (
        <>
            <Form form={form} name='advanced_search' className='ant-advanced-search-form' onFinish={onFinish}>
                <Row justify='space-between' align='middle'>
                    <Col>
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => showModal()}>
                            Create Page
                        </Button>
                    </Col>
                    <Col>
                        <Space>
                            <Input
                                placeholder='Search by name'
                                style={{
                                    width: 200,
                                    fontWeight: 'normal',
                                    borderRadius: '5px',
                                    border: '1px solid #e5ecfc',
                                    color: '#333'
                                }}
                                prefix={<SearchOutlined style={{ color: '#d9d9d9' }} />}
                                className='custom-input'
                                onBlur={e => {
                                    const value = e.target.value
                                    onSearch(value)
                                }}
                            />
                            <Select
                                style={{ width: 200 }}
                                placeholder='All'
                                value={sectionType}
                                onChange={handleTypeChange}>
                                <Option value=''>All</Option>
                                <Option value='1'>Home List</Option>
                                <Option value='2'>Empty</Option>
                            </Select>
                        </Space>
                    </Col>
                </Row>
            </Form>

            <Modal
                title={isEdit ? 'Edit Collection Page' : 'Create Collection Page'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
                okText={isEdit ? 'Update' : 'Create'}
                maskClosable={true}
                afterClose={() => {
                    onEditRecordChange(null)
                }}>
                <Form form={modalForm} layout='vertical'>
                    <Form.Item
                        name='pageName'
                        label='Page Name'
                        rules={[{ required: true, message: 'Enter page name' }]}>
                        <Input placeholder='Enter page name' />
                    </Form.Item>

                    <Form.Item name='position' valuePropName='checked'>
                        <Checkbox>Homepage Featured</Checkbox>
                    </Form.Item>

                    <Form.Item name='pid' label='Add PIDs' rules={[{ required: false, message: 'Enter PID' }]}>
                        <Input.Group compact>
                            <Input
                                style={{ width: 'calc(100% - 80px)' }}
                                placeholder='Enter PID'
                                value={currentPid}
                                onChange={e => setCurrentPid(e.target.value)}
                                onPressEnter={handleAddPid}
                            />
                            <Button type='primary' onClick={handleAddPid} style={{ width: '80px' }}>
                                + Add
                            </Button>
                        </Input.Group>
                        <div style={{ marginTop: '8px' }}>
                            <Upload
                                fileList={fileList}
                                onChange={handleUpload}
                                beforeUpload={() => false}
                                accept='.xlsx,.xls'
                                style={{ marginBottom: '8px' }}>
                                <Button icon={<UploadOutlined />}>Batch Upload PIDs</Button>
                            </Upload>
                            <div
                                style={{
                                    padding: '8px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                    minHeight: '40px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    alignItems: 'flex-start'
                                }}>
                                {pidList.length > 0 ? (
                                    pidList.map((pid, index) => (
                                        <Tag
                                            key={`${pid}-${index}`}
                                            closable
                                            onClose={() => handleRemovePid(pid)}
                                            style={{ margin: 0 }}>
                                            {pid}
                                        </Tag>
                                    ))
                                ) : (
                                    <span style={{ color: '#999' }}>No PIDs added yet</span>
                                )}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item name='url' label='URL' rules={[{ required: false }]}>
                        <Input placeholder='Enter URL' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const ProductsCollection = () => {
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [editRecord, setEditRecord] = useState(null)
    const [state, setState] = useState({
        search: {}
    })

    const [pageI, setPageI] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    })

    const changeSearch = search => {
        setState({
            ...state,
            search: {
                ...search
            }
        })
        getList(1, pageI.pageSize)
    }

    const handleTypeChange = sectionType => {
        getList(1, 20, sectionType)
    }

    const handleTableChange = pagination => {
        getList(pagination.current, pagination.pageSize, state.search.sectionType)
    }

    const columns = () => [
        {
            title: 'Page Name',
            dataIndex: 'sectionName',
            key: 'sectionName',
            align: 'center',
            render: text => text || '-'
        },
        {
            title: 'Product Count',
            dataIndex: 'products',
            key: 'products',
            align: 'center',
            render: (text, record) => (Array.isArray(record.products) ? record.products.length : '0')
        },
        {
            title: 'Position',
            dataIndex: 'sectionType',
            key: 'sectionType',
            align: 'center',
            render: text => (text === 1 ? 'Homepage Featured' : '-')
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            align: 'center',
            render: text =>
                text ? (
                    <a href={text} target='_blank' rel='noopener noreferrer'>
                        {text}
                    </a>
                ) : (
                    '-'
                )
        },
        {
            title: 'Created At',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
            render: text => text || '-'
        },
        {
            title: 'Last Updated',
            dataIndex: 'updateTime',
            key: 'updateTime',
            align: 'center',
            render: text => text || '-'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button type='link' onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                </Space>
            )
        }
    ]

    useEffect(() => {
        getList(1, 20)
    }, [])

    const getList = (page, pageSize, type, sectionName) => {
        setLoading(true)
        APIGetPromotionSectionList({
            page,
            pageSize,
            sectionType: type,
            sectionName
        })
            .then(resp => {
                setDataSource(resp?.records)
                setPageI({
                    current: resp.current,
                    pageSize: resp.size,
                    total: resp.total
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleEdit = record => {
        setEditRecord(record)
    }

    return (
        <Layout className='animated fadeIn'>
            <style>
                {`
          .custom-input .ant-input {
            border: none !important;
          }
        `}
            </style>
            <div className='web-bread-c'>
                <WebBreadcrumb arr={['Products Collection']} />
                <h3>Product Collection Management</h3>
                <img src={Aset} className='aset' />
            </div>
            <div className='base-wr'>
                <div className='base-style'>
                    <SearchBar
                        changeSearch={changeSearch}
                        loading={loading}
                        onSuccess={() => getList(1, pageI.pageSize)}
                        editRecord={editRecord}
                        onEditRecordChange={setEditRecord}
                        onTypeChange={handleTypeChange}
                        onSearch={value => getList(1, 20, state.search.sectionType, value)}
                    />
                </div>
                <Row>
                    <Col span={24}>
                        <div className='base-style'>
                            <Table
                                columns={columns()}
                                rowKey={record => record.id || record.sectionId}
                                dataSource={dataSource}
                                onChange={handleTableChange}
                                bordered
                                loading={loading}
                                pagination={pageI}
                                scroll={{ scrollToFirstRowOnChange: true, x: 1000 }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}
export default ProductsCollection
