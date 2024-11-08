import React, { Component, useEffect, useState } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message } from "antd";
import "@/style/view-style/table.less";
import { APIgetList, APIgetRewardList, APIrewardReceive, APIgetRuleDetail, APImodifyRule } from "@/mapi";
import { getKeyList } from "@/tools/action.js";
import TextArea from "antd/lib/input/TextArea";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

const isSysConfig = JSON.parse(localStorage.getItem("u")).permission.config;

const typeList = [ { label: "人民币奖励规则", value: "reward_fiat" }, { label: "积分奖励规则", value: "reward_score" } ];

const TypeOptions = typeList.map((option, index) => {
	return (
		<Option key={index} value={option.value}>
			{option.label}
		</Option>
	);
});

const columns = ({ handleGetReward }) => [
	{
		title: "标题",
		dataIndex: "title",
		key: "title"
	},
	{
		title: "类型",
		dataIndex: "type",
		key: "type",
		render: (text, record) => (
			<div>
				{text == "task" ? "任务规则" : text == "reward_fiat" ? "人民币奖励规则" : text == "reward_score" ? "积分奖励规则" : ""}
			</div>
		)
	},
	{
		title: "内容",
		dataIndex: "content",
		key: "content"
	},
	{
		title: "操作",
		dataIndex: "opeartion",
		key: "opeartion",
		render: (text, record) => (
			<Button onClick={() => handleGetReward(record)} style={{ padding: 0 }} type="link">
				修改
			</Button>
		)
	}
];

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
						<Select defaultValue="reward_fiat" allowClear>
							{TypeOptions}
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

const ModifyModal = ({ visible, onCreate, onCancel, data }) => {
	const [ form ] = Form.useForm();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};

	useEffect(() => {
		console.log("data", data);
		form.setFieldsValue({
			...data
		});
	});

	return (
		<Modal
			visible={visible}
			title="修改配置"
			okText="保存"
			cancelText="Cancel"
			onCancel={onCancel}
			onOk={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						onCreate(values, data);
					})
					.catch((info) => {
						console.log("Validate Failed:", info);
					});
			}}
		>
			<Form {...layout} form={form} name="form_in_modal">
				<Form.Item name="type" label="类型" rules={[]}>
					<Select allowClear>{TypeOptions}</Select>
				</Form.Item>
				<Form.Item name="title" label="标题" rules={[]}>
					<Input disabled />
				</Form.Item>
				<Form.Item name="content" label="内容" rules={[]}>
					<TextArea />
				</Form.Item>
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
		search: { type: "task" },
		loading: true,
		visible: false,
		disabled: false,
		formData: {}
	});
	const [ handleState, setHandleState ] = useState({
		visible: false,
		data: {}
	});
	const [ detailState, setDetailState ] = useState({
		visible: false,
		data: {}
	});
	useEffect(() => {
		const { pagination } = state;
		// const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }

		const params = { offset: 0, limit: state.pagination.pageSize, type: "reward_fiat" };
		getList(params);
	}, []);

	const handleGetReward = (data) => {
		if (!isSysConfig) {
			return message.error("你没有权限");
		}
		console.log("data", data);
		setDetailState({
			data: data,
			visible: true
		});
	};
	const getList = (params) => {
		// params.area_id = localStorage.getItem('av')
		setState({ loading: true });
		APIgetRuleDetail(params)
			.then((resp) => {
				console.log("resp", resp);
				let res = [ resp.data ];
				setState({
					...state,
					list: res && getKeyList(res),
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
					loading: false
					// pagination: {
					// 	// total: resp.data.total,
					// 	// current: params.offset / params.limit + 1,
					// 	// pageSize: params.limit
					// 	// ...state.pagination
					// 	// total: resp.data.total
					// 	// current: resp.data.pager.start_row + 1,
					// 	// pageSize: resp.data.pager.page_size
					// }
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const changeSearch = (search) => {
		console.log("search", search);

		const params = { ...search, limit: state.pagination.pageSize, offset: 0 };
		getList(params);
		setState({
			...state,
			...search
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

	const onCreate = (data, oldData) => {
		console.log("aa", data);
		console.log("oldData", oldData);
		let params = {
			...data
		};
		APImodifyRule(params)
			.then((resp) => {
				message.success("修改成功");
				setDetailState({
					...detailState,
					visible: false
				});
				const params = { type: data.type };
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	return (
		<Layout className="animated fadeIn">
			<ModifyModal
				visible={detailState.visible}
				onCreate={onCreate}
				onCancel={() => {
					setDetailState({
						...detailState,
						visible: false,
						data: {}
					});
				}}
				data={detailState.data}
			/>
			<div>
				<WebBreadcrumb arr={[ "规则详情" ]} />
			</div>
			<div className="base-style">
				<SearchBar changeSearch={changeSearch} />
			</div>
			<Row>
				<Col span={24}>
					<div className="base-style">
						<Table
							columns={columns({ handleGetReward })}
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
