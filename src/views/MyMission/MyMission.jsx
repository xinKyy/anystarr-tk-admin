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
	Checkbox,
	message,
	InputNumber
} from "antd";
import "@/style/view-style/table.less";
import {
	APIgetList,
	APIgetProjectTaskList,
	APIcreateTask,
	APIgetProjectList,
	APIgetAreaMemberList,
	APIgetTaskDetail,
	APIhandleTask
} from "@/mapi";
import { getKeyList } from "@/tools/action.js";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const userId = localStorage.getItem("uid");

const columnss = [
	{
		title: "user_id",
		dataIndex: "user_id"
	},
	{
		title: "用户名",
		dataIndex: "user_name"
	},
	{
		title: "角色",
		dataIndex: "role_name"
	}
];

const columnPro = [
	{
		title: "项目名",
		dataIndex: "name"
	},
	{
		title: "进度",
		dataIndex: "progress"
	},
	{
		title: "项目长",
		dataIndex: "executor_name"
	}
];

const permissions = [
	{ label: "项目发布", value: "pmp_publish" },
	{ label: "项目执行", value: "pmp_execute" },
	{ label: "项目审核", value: "pmp_check" },
	{ label: "任务分配", value: "pmt_allocation" },
	{ label: "任务执行", value: "pmt_execute" },
	{ label: "任务审核", value: "pmt_check" }
];

const typeList = [
	{ label: "发布", value: "publish" },
	{ label: "执行", value: "execute" },
	{ label: "任务执行", value: "task_execute" }
];
const TypeOptions = typeList.map((option, index) => {
	return (
		<Option key={index} value={option.value}>
			{option.label}
		</Option>
	);
});
const stateList = [
	{ label: "待完成", value: "to_complete" },
	{ label: "待审核", value: "to_audit" },
	{ label: "已审核", value: "audited" },
	{ label: "已Cancel", value: "cancelled" }
];
const StateOptions = stateList.map((option, index) => {
	return (
		<Option key={index} value={option.value}>
			{option.label}
		</Option>
	);
});

//搜索tab
const SearchBar = (props) => {
	const [ form ] = Form.useForm();

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
		props.changeSearch(values);
	};

	return (
		<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				<Col span={8}>
					<Form.Item name="id" label="任务状态">
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name="test" label="编号">
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={24} style={{ textAlign: "right" }}>
					<Button type="primary" htmlType="submit">
						搜索
					</Button>
					<Button
						style={{ margin: "0 8px" }}
						onClick={() => {
							form.resetFields();
						}}
					>
						重置
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

const MemberModal = ({ visible, onCreateNew, onCancel }) => {
	const [ data, setData ] = useState([]);
	const [ permissionsData, setPermissionsData ] = useState([]);
	const [ selectObj, setSelectObj ] = useState({});
	const [ pagination, setPagination ] = useState({
		current: 1,
		pageSize: 10
	});
	const onChange = (val) => {
		console.log("21kl", val);
		setPermissionsData(val);
	};
	const searchClick = () => {
		let areaId = localStorage.getItem("av");
		let userRole = JSON.parse(localStorage.getItem("ur"));
		console.log("userRole", userRole);
		let role = userRole.filter((item) => item.area_id == areaId);
		let roleLevel = role[0] && role[0].role_level;
		let params = {
			id: localStorage.getItem("av"),
			permissions: permissionsData.toString(),
			level: roleLevel + 1
			// limit: pagination.pageSize,
			// offset: 0
		};
		console.log("params", params);
		APIgetAreaMemberList(params)
			.then((resp) => {
				setData(resp.data && getKeyList(resp.data));
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
			setSelectObj(selectedRows[0]);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === "Disabled User",
			// Column configuration not to be checked
			name: record.name
		})
	};

	return (
		<Modal
			visible={visible}
			title="获取成员"
			okText="保存"
			cancelText="Cancel"
			onOk={() => {
				onCreateNew(selectObj);
			}}
			onCancel={onCancel}
		>
			<Checkbox.Group options={permissions} onChange={onChange} />
			<Button type="primary" onClick={searchClick} style={{ margin: "10px auto" }}>
				查询
			</Button>
			<Table
				rowSelection={{
					type: "radio",
					...rowSelection
				}}
				columns={columnss}
				dataSource={data}
				pagination={pagination}
			/>
		</Modal>
	);
};

const ProjectModal = ({ visible, onCreatePro, onCancelPro }) => {
	const [ form ] = Form.useForm();
	const [ data, setData ] = useState([]);
	const [ selectObj, setSelectObj ] = useState({});
	const [ pagination, setPagination ] = useState({
		current: 1,
		pageSize: 10
	});
	const searchClick = (val) => {
		console.log("val", val);
		let areaId = localStorage.getItem("av");
		let params = {
			area_id: areaId,
			status: val.status ? val.status.toString() : "",
			types: val.types ? val.types.toString() : "",
			offset: 0,
			limit: 999
		};
		console.log("params", params);
		APIgetProjectList(params)
			.then((resp) => {
				setData(resp.data.list && getKeyList(resp.data.list));
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
			setSelectObj(selectedRows[0]);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === "Disabled User",
			// Column configuration not to be checked
			name: record.name
		})
	};

	return (
		<Modal
			visible={visible}
			title="获取项目"
			okText="保存"
			cancelText="Cancel"
			onOk={() => {
				onCreatePro(selectObj);
			}}
			onCancel={onCancelPro}
		>
			<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={searchClick}>
				<Row gutter={24}>
					<Col span={8}>
						<Form.Item name="status" label="状态">
							<Select mode="multiple">{StateOptions}</Select>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name="types" label="类型">
							<Select mode="multiple">{TypeOptions}</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24} style={{ textAlign: "right", marginBottom: "10px" }}>
						<Button type="primary" htmlType="submit">
							搜索
						</Button>
						<Button
							style={{ margin: "0 8px" }}
							onClick={() => {
								form.resetFields();
							}}
						>
							重置
						</Button>
					</Col>
				</Row>
			</Form>
			<Table
				rowSelection={{
					type: "radio",
					...rowSelection
				}}
				columns={columnPro}
				dataSource={data}
				pagination={pagination}
			/>
		</Modal>
	);
};

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

	useEffect(() => {});

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
			title="发布任务"
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
						onCreate(values);
						setProject({});
						setUser({});
					})
					.catch((info) => {
						console.log("Validate Failed:", info);
					});
			}}
		>
			<MemberModal
				visible={allMemVisible}
				value={user}
				onCreateNew={onCreateNew}
				onCancel={() => {
					setAllMemVisible(false);
				}}
			/>
			<ProjectModal
				visible={allProVisible}
				value={project}
				onCreatePro={onCreatePro}
				onCancelPro={() => {
					setAllProVisible(false);
				}}
			/>
			<Form {...layout} form={form} name="form_in_modal">
				<Form.Item name="project_id" label="项目">
					<div
						onClick={() => {
							setAllProVisible(true);
						}}
					>
						<Input value={project ? project.name : ""} />
					</div>
				</Form.Item>
				<Form.Item name="description" label="项目任务描述" rules={[]}>
					<TextArea />
				</Form.Item>
				<Form.Item name="fiat_reward" label="法币奖励" rules={[]}>
					<Input />
				</Form.Item>
				<Form.Item name="score_reward" label="积分奖励" rules={[]}>
					<Input />
				</Form.Item>
				<Form.Item name="executor" label="执行人" rules={[]}>
					<div
						onClick={() => {
							setAllMemVisible(true);
						}}
					>
						<Input value={user ? user.user_name : ""} />
					</div>
				</Form.Item>
				<Form.Item name="start_at" label="起始时间" rules={[]}>
					<DatePicker onChange={onStartChange} />
				</Form.Item>
				<Form.Item name="due_at" label="截止时间" rules={[]}>
					<DatePicker onChange={onDueChange} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

const columns = (clickDetail) => [
	{
		title: "操作",
		dataIndex: "id",
		key: "id",
		render: (text, item) => (
			<Button
				type="link"
				onClick={() => {
					clickDetail(item);
				}}
			>
				处理
			</Button>
		)
	},
	{
		title: "项目名",
		dataIndex: "project_name",
		key: "project_name"
	},
	{
		title: "description",
		dataIndex: "description",
		key: "description"
	},
	{
		title: "描述",
		dataIndex: "description",
		key: "description"
	},
	{
		title: "截止时间",
		dataIndex: "due_at",
		key: "due_at"
	},
	{
		title: "法币奖励",
		dataIndex: "FiatReward",
		key: "FiatReward"
	},
	{
		title: "积分奖励",
		dataIndex: "ScoreReward",
		key: "ScoreReward"
	}
];

const HandleModal = ({ visible, onHandleCreate, onHandleCancel, data }) => {
	const [ form ] = Form.useForm();
	console.log("yuyudata", data);

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};

	return (
		<Modal
			visible={visible}
			title="处理项目"
			okText="保存"
			cancelText="Cancel"
			onCancel={onHandleCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						onHandleCreate(values, data);
					})
					.catch((info) => {
						console.log("Validate Failed:", info);
					});
			}}
		>
			<Form {...layout} form={form} name="form_in_modal_1">
				<Form.Item name="action" label="操作" rules={[]}>
					{userId == data.publisher ? (
						<Select>
							<Option value="cancel">Cancel</Option>
							<Option value="pass">通过</Option>
						</Select>
					) : (
						<Select>
							<Option value="finish">结束</Option>
						</Select>
					)}
				</Form.Item>
				{data.state === "audited" ? (
					<div>
						<Form.Item name="fiat_percent" label="法币奖励度">
							<InputNumber />
						</Form.Item>
						<Form.Item name="score_percent" label="积分奖励度">
							<InputNumber />
						</Form.Item>
					</div>
				) : null}
			</Form>
		</Modal>
	);
};

const SearchTableView = () => {
	const [ state, setState ] = useState({
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
	});
	const [ handleState, setHandleState ] = useState({
		visible: false,
		data: {}
	});
	useEffect(() => {
		const { pagination } = state;
		// const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }

		const params = { limit: pagination.pageSize, offset: 0 };
		getList(params);
	}, []);

	const clickDetail = (data) => {
		console.log("detail", data);
		let params = {
			id: data.id
		};
		APIgetTaskDetail(params)
			.then((res) => {
				console.log("resss", res);
				let userId = localStorage.getItem("uid");
				if (userId == res.data.publisher || userId == res.data.executor) {
					setHandleState({
						visible: true,
						data: res.data
					});
				} else {
					message.error("你没有权限");
					// setHandleState({
					// 	visible: true,
					// 	data: res.data
					// });
				}
			})
			.catch((err) => {
				console.log("err", err);
			});

		// setState({
		// 	visible: true,
		// 	formData: data
		// });
	};

	const changeSearch = (search, page) => {
		const params = { ...search, page_size: 10, start_row: 0 };
		getList(params);
		setState({
			search: search
		});
	};

	const getList = (params) => {
		params.area_id = localStorage.getItem("av");
		setState({ loading: true });
		APIgetProjectTaskList(params)
			.then((resp) => {
				console.log("resp", resp);
				console.log("ty", getKeyList(resp.data.list));
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
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const handleChange = (pagination) => {
		console.log("pagination", pagination);
		const params = { limit: pagination.pageSize, offset: pagination.pageSize * (pagination.current - 1) };
		getList(params);
	};

	const onCreate = (data) => {
		console.log("data", data);
		data.due_at = parseInt(data.due_at._d.getTime() / 1000);
		data.start_at = parseInt(data.start_at._d.getTime() / 1000);

		APIcreateTask(data)
			.then((resp) => {
				message.success("添加成功");
				const params = { limit: state.pagination.pageSize, offset: 0 };
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
		setState({
			visible: false
		});
	};

	const onHandleCreate = (data, oldData) => {
		console.log("dtdtdt", data);
		console.log("oldData", oldData);
		data.id = oldData.id;
		APIhandleTask(data)
			.then((resp) => {
				message.success("处理成功");
				setHandleState({
					...handleState,
					visible: false
				});
				const { pagination } = state;
				// const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }

				const params = { limit: pagination.pageSize, offset: 0 };
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const canPublishProject = () => {
		let areaId = localStorage.getItem("av");
		let r = JSON.parse(localStorage.getItem("r"));
		let userRole = JSON.parse(localStorage.getItem("ur"));
		if (!userRole) {
			return false;
		}
		let role = userRole.filter((item) => item.area_id == areaId);
		console.log("rolell", role);
		let roleLevel = role[0] && role[0].role_level;
		console.log("roleLevel", roleLevel);
		let myRole = r.filter((item) => item.level == roleLevel);
		console.log("myRole", myRole);
		if (myRole[0] && myRole[0].permissions && myRole[0].permissions.pmp_publish) {
			return true;
		} else {
			return false;
		}
	};

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
				disabled={state.disabled}
			/>
			<HandleModal
				visible={handleState.visible}
				onHandleCreate={onHandleCreate}
				onHandleCancel={() => {
					setHandleState({
						...handleState,
						visible: false,
						data: {}
					});
				}}
				data={handleState.data}
			/>
			<div>
				<WebBreadcrumb arr={[ "我的任务" ]} />
			</div>
			{/* <div className="base-style">
				<SearchBar changeSearch={changeSearch} />
			</div> */}
			<Row>
				<Col span={24}>
					<div className="base-style">
						{canPublishProject() ? (
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
										发布任务
									</Button>
								</Col>
							</Row>
						) : null}
						<Table
							columns={columns(clickDetail)}
							rowKey={(record) => record.key}
							dataSource={state.list}
							onChange={handleChange}
							loading={state.loading}
							pagination={state.pagination}
						/>
					</div>
				</Col>
			</Row>
		</Layout>
	);
};

export default SearchTableView;
