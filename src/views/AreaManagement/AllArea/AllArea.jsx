import React, { Component, useEffect, useState } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
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
	Popconfirm,
	message
} from "antd";
import "@/style/view-style/table.less";
import { APIgetAreaList, APIdeleteArea, APIeditArea } from "@/mapi";
import { getKeyList } from "@/tools/action.js";
let handleActionId = -1;

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
	const [ form ] = Form.useForm();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};
	const [ user, setUser ] = useState({});
	const [ allMemVisible, setAllMemVisible ] = useState(false);

	const [ project, setProject ] = useState({});
	const [ allProVisible, setAllProVisible ] = useState(false);

	const onStartChange = (date, dateString) => {
		console.log(date, dateString);
		let startAt = dateString;
		form.setFieldsValue({
			start_at: date
		});
	};

	const onDueChange = (date, dateString) => {
		console.log(date, dateString);
		let dueAt = dateString;
		form.setFieldsValue({
			due_at: date
		});
	};

	useEffect(() => {
		console.log("formData", formData);
		if (!formData) {
			return;
		}
		let permission = formData.permission;
		let perArr = [];
		for (let i in permission) {
			if (permission[i]) {
				perArr.push(i);
			}
		}
		form.setFieldsValue({
			account: formData.account,
			name: formData.name,
			permissions: perArr
		});
	});

	const onCreateNew = (val) => {
		console.log("val", val);
		setUser(val);
		setAllMemVisible(false);
		form.setFieldsValue({
			executor: val.user_id
		});
	};
	const onCreatePro = (val) => {
		setProject(val);
		setAllProVisible(false);
		form.setFieldsValue({
			project_id: val.id
		});
	};

	return (
        <Modal
            visible={visible}
            title='修改账号信息'
            okText='保存'
            cancelText='Cancel'
            onCancel={() => {
                setProject({})
                setUser({})
                onCancel()
            }}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields()
                        onCreate(values, formData)
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info)
                    })
            }}>
            <Form {...layout} form={form} name='form_in_modal'>
                <Form.Item name='name' label='区域名' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
};



const TableView = () => {

	const user = JSON.parse(localStorage.getItem('u'))

	const columns = ({ clickDetail, handleTaskStatus, actionVisible, setActionVisible }) => [
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (text, item) =>
                user.permission.account ? (
                    <>
                        <Button
                            type='link'
                            onClick={() => {
                                clickDetail(item)
                            }}>
                            修改
                        </Button>
						<Popconfirm
        			visible={item.id === handleActionId && actionVisible}
        			title="请确认操作状态"
        			onConfirm={() => {
        				setActionVisible(false);
        				handleTaskStatus("pass", item.id);
        			}}
        			onCancel={() => {
        				setActionVisible(false);
        				handleTaskStatus("reject", item.id);
        			}}
        			okText="Submit"
        			cancelText="Cancel"
        		>
        			<a
        				href="#"
        				onClick={() => {
        					handleActionId = item.id;
        					setActionVisible(true);
        				}}
        			>
        				删除
        			</a>
        		</Popconfirm>
                    </>
                ) : null
        },
        {
            title: '区域id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '区域名',
            dataIndex: 'name',
            key: 'name'
        }
        // {
        // 	title: "操作",
        // 	dataIndex: "action",
        // 	key: "action",
        // 	render: (_, record) => (
        // 		<Popconfirm
        // 			visible={record.id === handleActionId && actionVisible}
        // 			title="请确认操作状态"
        // 			onConfirm={() => {
        // 				setActionVisible(false);
        // 				handleTaskStatus("pass", record.id);
        // 			}}
        // 			onCancel={() => {
        // 				setActionVisible(false);
        // 				handleTaskStatus("reject", record.id);
        // 			}}
        // 			okText="Submit"
        // 			cancelText="Cancel"
        // 		>
        // 			<a
        // 				href="#"
        // 				onClick={() => {
        // 					handleActionId = record.id;
        // 					setActionVisible(true);
        // 				}}
        // 			>
        // 				删除
        // 			</a>
        // 		</Popconfirm>
        // 	)
        // }
    ]

	const [ state, setState ] = useState({
		list: []
	});
	const [ actionVisible, setActionVisible ] = useState(false);

	const getAllArea = () => {
		APIgetAreaList()
			.then((resp) => {
				setState({
					list: resp.data && getKeyList(resp.data)
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const clickDetail = (data) => {
		console.log("clickDetaildata", data);
		setState({
			...state,
			visible: true,
			formData: data
		});
	};
	const handleTaskStatus = (type, id) => {
		console.log("type", type);
		console.log("itdataem", id);
		message.error("接口待开发");
	};
	const onCreate = (data, oldData) => {
		console.log("data", data);
		console.log("oldData", oldData);
		data.id = oldData.id;
		data.name = data.name;
		APIeditArea(data)
			.then((resp) => {
				message.success("修改成功");
				getAllArea();
			})
			.catch((err) => {
				console.log("err", err);
			});
		setState({
			visible: false
		});
	};

	useEffect(() => {
		getAllArea();
	}, []);

	return (
		<Layout className="animated fadeIn">
			<DetailModal
				visible={state.visible}
				onCreate={onCreate}
				onCancel={() => {
					setState({
						...state,
						visible: false
					});
				}}
				formData={state.formData}
			/>
			<div>
				<WebBreadcrumb arr={[ "所有区域" ]} />
			</div>
			<Row>
				<Col span={24}>
					<div className="base-style">
						<Table
							columns={columns({ clickDetail, handleTaskStatus, actionVisible, setActionVisible })}
							// rowKey={record => record.key}
							dataSource={state.list}
							// onChange={this.handleChange}
							// loading={this.state.loading}
							// pagination={this.state.pagination}
						/>
					</div>
				</Col>
			</Row>
		</Layout>
	);
};

export default TableView;
