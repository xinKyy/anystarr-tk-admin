import React, { Component, useEffect, useState } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message } from "antd";
import "@/style/view-style/table.less";
import { APIgetList, APIgetRewardList, APIrewardReceive } from "@/mapi";
import { getKeyList, myTimeToLocal, getLocalTime } from "@/tools/action.js";
import { render } from "react-dom";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

const typeList = [ { label: "法币", value: "fiat" }, { label: "积分", value: "score" } ];

const TypeOptions = typeList.map((option, index) => {
	return (
		<Option key={index} value={option.value}>
			{option.label}
		</Option>
	);
});

const columns = ({ handleGetReward }) => [
	{
		title: "操作",
		dataIndex: "opeartion",
		key: "opeartion",
		render: (text, record) =>
			!record.received ? (
				<Button onClick={() => handleGetReward(record.id)} style={{ padding: 0 }} type="link">
					领取奖励
				</Button>
			) : null
	},
	{
		title: "领取时间",
		dataIndex: "receive_at",
		key: "receive_at",
		render: (text, record) => <span>{!record.received ? "未领取" : getLocalTime(record.receive_at)}</span>
	},
	// {
	//     title: '奖励',
	//     dataIndex: 'reward',
	//     key: 'reward'
	// },
	{
		title: "初始法币奖励",
		dataIndex: "fiat_original",
		key: "fiat_original",
		render: (text, record) => <span>{record.reward.fiat_original}</span>
	},
	{
		title: "初始积分奖励",
		dataIndex: "score_original",
		key: "score_original",
		render: (text, record) => <span>{record.reward.score_original}</span>
	},
	{
		title: "法币奖励度",
		dataIndex: "fiat_percent",
		key: "fiat_percent",
		render: (text, record) => (
			<span>{record.reward.fiat_percent ? record.reward.fiat_percent * 100 + "%" : ""}</span>
		)
	},
	{
		title: "积分奖励度",
		dataIndex: "score_percent",
		key: "score_percent",
		render: (text, record) => (
			<span>{record.reward.score_percent ? record.reward.score_percent * 100 + "%" : ""}</span>
		)
	},
	{
		title: "来源类型",
		dataIndex: "source_type",
		key: "source_type",
		render: (text, record) => (
			<span>{text === "task" ? `任务ID：${record.source}` : text === "project" ? `项目ID：${record.source}` : ""}</span>
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
						<Select allowClear>{TypeOptions}</Select>
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

		const params = { offset: 0, limit: state.pagination.pageSize };
		getList(params);
	}, []);

	const handleGetReward = async (id) => {
		console.log("领取奖励");
		APIrewardReceive({ id })
			.then((res) => {
				message.success("领取成功");
				const params = { offset: 0, limit: state.pagination.pageSize };
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};
	const getList = (params) => {
		// params.area_id = localStorage.getItem('av')
		setState({ loading: true });
		APIgetRewardList(params)
			.then((resp) => {
				console.log("resp", resp);
				console.log("ty", getKeyList(resp.data.list));
				setState({
					...state,
					list: resp.data.list && getKeyList(resp.data.list),
					// list: [
					// 	{
					// 		create_at: 220,
					// 		id: 0,
					// 		key: "1",
					// 		receive_at: 210,
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

	const exportRecord = () => {};

	return (
		<Layout className="animated fadeIn">
			<div>
				<WebBreadcrumb arr={[ "奖励记录" ]} />
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
										exportRecord();
									}}
								>
									导出数据
								</Button>
							</Col>
						</Row>
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
