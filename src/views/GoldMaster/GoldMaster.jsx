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
import {
	APIgetAreaList,
	APIdeleteArea,
	APIeditArea,
	APIgetGoldMaster,
	APIeditGoldMaster,
	APIcreateGoldMaster
} from "@/mapi";
import { getKeyList } from "@/tools/action.js";
let handleActionId = -1;
const Option = Select.Option;

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
		if (formData && formData.id) {
			form.setFieldsValue({
				party: formData.name,
				hide: formData.hide
			});
		}
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
			title="金主信息"
			okText="保存"
			cancelText="Cancel"
			onCancel={() => {
				setProject({});
				setUser({});
				onCancel();
			}}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						onCreate(values, formData);
					})
					.catch((info) => {
						console.log("Validate Failed:", info);
					});
			}}
		>
			<Form {...layout} form={form} name="form_in_modal">
				<Form.Item name="party" label="金主名称" rules={[ { required: true, message: "请输入金主名称" } ]}>
					<Input />
				</Form.Item>
				<Form.Item name="hide" label="是否隐藏" rules={[]}>
					<Select allowClear>
						<Option value="true">是</Option>
						<Option value="false">否</Option>
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

const TableView = () => {
	const user = JSON.parse(localStorage.getItem("u"));

	const columns = ({ clickDetail, handleTaskStatus, actionVisible, setActionVisible }) => [
		{
			title: "操作",
			dataIndex: "id",
			key: "id",
			render: (text, item) =>
				user.permission.account ? (
					<Button
						type="link"
						onClick={() => {
							clickDetail(item);
						}}
					>
						修改
					</Button>
				) : null
		},
		{
			title: "金主id",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "区域名称",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "是否隐藏",
			dataIndex: "hide",
			key: "hide",
			render: (text, item) => <span>{text ? "是" : "否"}</span>
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
	];

	const [ state, setState ] = useState({
		list: []
	});
	const [ actionVisible, setActionVisible ] = useState(false);

	const getGoldMaster = () => {
		APIgetGoldMaster()
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
		if (oldData.id) {
			data.id = oldData.id;
			data.name = data.party;
			console.log("编辑修改", data);
			APIeditGoldMaster(data)
				.then((resp) => {
					message.success("修改成功");
					getGoldMaster();
				})
				.catch((err) => {
					console.log("err", err);
				});
			setState({
				visible: false
			});
		} else {
			APIcreateGoldMaster(data)
				.then((resp) => {
					message.success("创建成功");
					getGoldMaster();
				})
				.catch((err) => {
					console.log("err", err);
				});
		}
	};

	useEffect(() => {
		getGoldMaster();
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
				<WebBreadcrumb arr={[ "金主" ]} />
			</div>
			<Row>
				<Col span={24}>
					<div className="base-style">
						<Row>
							<Col span={24} style={{ textAlign: "left", marginBottom: "15px" }}>
								<Button
									type="primary"
									onClick={() => {
										setState({
											...state,
											formData: {},
											visible: true
										});
									}}
								>
									创建金主
								</Button>
							</Col>
						</Row>
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
