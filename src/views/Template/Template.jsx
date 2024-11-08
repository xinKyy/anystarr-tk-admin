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
import { APIgetWorkOrderDetail, APIgetTemplateList, APIaddTemplate, APIdeleteTemplate } from "@/mapi";
import { getKeyList } from "@/tools/action.js";
import MemberModal from "@/components/MemberModal";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

let handleActionId = -1;

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
					<Form.Item name="type" label="类型">
						<Select>
							<Option value="workorder">请求</Option>
							<Option value="task">任务</Option>
							<Option value="project">项目</Option>
						</Select>
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

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
	const [ form ] = Form.useForm();

	const [ user, setUser ] = useState({});
	const [ allMemVisible, setAllMemVisible ] = useState(false);

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};
	const rangeConfig = {
		rules: [
			{
				type: "array",
				message: "Please select time!"
			}
		]
	};

	useEffect(() => {
		if (Object.keys(formData).length) {
			form.setFieldsValue(formData);
		} else {
			form.resetFields();
		}
	}, []);

	const onGenderChange = (value) => {
		form.setFieldsValue({ Gender: value });
	};

	const onCreateNew = (val) => {
		setUser(val);
		setAllMemVisible(false);
		form.setFieldsValue({
			user_id: val.user_id
		});
	};

	return (
		<Modal
			visible={visible}
			title="创建模板"
			okText="保存"
			cancelText="Cancel"
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						onCreate(values);
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
			<Form {...layout} form={form} name="form_in_modal">
				<Form.Item name="type" label="模板类型" rules={[ { required: true } ]}>
					<Select>
						<Option value="workorder">请求</Option>
						<Option value="task">任务</Option>
						<Option value="project">项目</Option>
					</Select>
				</Form.Item>
				<Form.Item name="name" label="模板名称" rules={[ { required: true } ]}>
					<Input />
				</Form.Item>
				<Form.Item name="template" label="模板内容" rules={[ { required: true } ]}>
					<TextArea />
				</Form.Item>
			</Form>
		</Modal>
	);
};

const columns = ({ clickDetail, handleTaskStatus, actionVisible, setActionVisible }) => [
	{
		title: "模板ID",
		dataIndex: "id",
		key: "id"
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name"
	},
	{
		title: "操作",
		dataIndex: "action",
		key: "action",
		render: (_, record) => (
			<Popconfirm
				visible={record.id === handleActionId && actionVisible}
				title="请确认操作状态"
				onConfirm={() => {
					setActionVisible(false);
					handleTaskStatus("pass", record.id);
				}}
				onCancel={() => {
					setActionVisible(false);
					handleTaskStatus("reject", record.id);
				}}
				okText="通过"
				cancelText="拒绝"
			>
				<a
					href="#"
					onClick={() => {
						handleActionId = record.id;
						setActionVisible(true);
					}}
				>
					删除
				</a>
			</Popconfirm>
		)
	}
];

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
	const [ actionVisible, setActionVisible ] = useState(false);

	useEffect(() => {
		const params = { ...state.search };
		getList(params);
	}, []);

	const handleTaskStatus = async (type, id) => {
		let permission = JSON.parse(localStorage.getItem("u")).permission;
		if (permission.config) {
			APIdeleteTemplate({ id: id })
				.then((res) => {
					message.success("删除成功");
					const params = {};
					getList(params);
				})
				.catch((err) => {
					console.log("err", err);
				});
		} else {
			message.error("你没有权限");
		}
	};

	const clickDetail = async (data) => {
		const detailData = await APIgetWorkOrderDetail({ id: data });
		setState({
			...state,
			visible: true,
			formData: data
		});
	};

	const changeSearch = (searchData, page) => {
		setState({
			search: { ...state.search, ...searchData }
		});
		const params = { ...searchData, limit: state.pagination.pageSize, offset: 0 };
		getList(params);
	};

	const getList = (params) => {
		console.log("params", params);
		APIgetTemplateList(params)
			.then((resp) => {
				setState({
					...state,
					list: resp.data && getKeyList(resp.data),
					loading: false,
					visible: false
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const handleChange = (pagination) => {
		const params = {
			...state.search,
			limit: pagination.pageSize,
			offset: (pagination.current - 1) * pagination.pageSize
		};
		getList(params);
	};

	const onCreate = (data) => {
		console.log("data", data);
		APIaddTemplate(data)
			.then((resp) => {
				message.success("创建成功");

				const params = { ...state.search };
				setState({
					...state,
					visible: false
				});
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	return (
		<Layout className="animated fadeIn">
			<DetailModal
				visible={state.visible}
				onCreate={onCreate}
				onCancel={() => {
					setState({ ...state, visible: false });
				}}
				formData={state.formData}
				disabled={state.disabled}
			/>
			<div>
				<WebBreadcrumb arr={[ "我的请求" ]} />
			</div>
			<div className="base-style">
				<SearchBar changeSearch={changeSearch} />
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
									创建模板
								</Button>
							</Col>
						</Row>
						<Table
							columns={columns({ clickDetail, handleTaskStatus, actionVisible, setActionVisible })}
							rowKey={(record) => record.id}
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
