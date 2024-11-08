import React, { Component, useEffect, useState } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message } from "antd";
import "@/style/view-style/table.less";
import { APIgetList, APIrewardApplicationList, APIrewardApplicationHandle, APIexportRewardRecord } from "@/mapi";
import { getKeyList } from "@/tools/action.js";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

const typeList = [ { label: "待处理", value: "to_handle" }, { label: "已处理", value: "handled" } ];

const TypeOptions = typeList.map((option, index) => {
	return (
		<Option key={index} value={option.value}>
			{option.label}
		</Option>
	);
});

const u = JSON.parse(localStorage.getItem("u"));
const isFinance = u.permission.finance;
const userId = localStorage.getItem("uid");
const getLocalTime = (nS) => {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, " ");
};

const columns = ({ handleGetReward }) => [
	{
		title: "金额",
		dataIndex: "amount",
		key: "amount"
	},
	{
		title: "申请时间",
		dataIndex: "apply_at",
		key: "apply_at",
		render: (text, item) => <span>{getLocalTime(item.apply_at)}</span>
	},
	{
		title: "提现时间",
		dataIndex: "handled_at",
		key: "handled_at",
		render: (text, item) => <span>{text < 0 ? "未提现" : getLocalTime(text)}</span>
	},
	{
		title: "用户名",
		dataIndex: "user_name",
		key: "user_name"
	},
	{
		title: "操作",
		dataIndex: "opeartion",
		key: "opeartion",
		render: (text, record) =>
			record.handled_at < 0 ? (
				<Button onClick={() => handleGetReward(record.id)} style={{ padding: 0 }} type="link">
					提现
				</Button>
			) : null
	}
];

const SearchBar = (props) => {
	const [ form ] = Form.useForm();

	const onFinish = (values) => {
		props.changeSearch(values);
	};

	return (
		<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				<Col span={8}>
					<Form.Item name="type" label="类型">
						<Select defaultValue="to_handle" allowClear>
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
		const params = { offset: 0, limit: state.pagination.pageSize };
		getList(params);
	}, []);

	const handleGetReward = async (id) => {
		const { pagination, search } = state;
		if (isFinance) {
			const params = { id: id };
			APIrewardApplicationHandle(params)
				.then((resp) => {
					message.success("提现成功");
					getList({
						...search,
						limit: pagination.pageSize,
						offset: pagination.pageSize * (pagination.current - 1)
					});
				})
				.catch((err) => {
					console.log("err", err);
				});
		} else {
			message.error("你没有权限");
		}

		// await APIrewardReceive({ id })
	};
	const getList = (params) => {
		if (isFinance) {
			params.user_id = 0;
		} else {
			params.user_id = userId;
		}
		setState({ loading: true });
		APIrewardApplicationList(params)
			.then((resp) => {
				setState({
					...state,
					list: resp.data.list && getKeyList(resp.data.list),
					loading: false,
					pagination: {
						...state.pagination,
						total: resp.data.total
					}
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
			offset: pagination.pageSize * (pagination.current - 1)
		};
		getList(params);
	};

	const changeSearch = (search) => {
		const params = { ...search, limit: state.pagination.pageSize, offset: 0 };
		getList(params);
		setState({
			...state,
			...search
		});
	};

	const exportRecord = () => {
		APIexportRewardRecord()
			.then((xhr) => {
				return;
			})
			.catch((err, status, xhr) => {});
	};

	return (
		<Layout className="animated fadeIn">
			<div>
				<WebBreadcrumb arr={[ "奖励提现申请" ]} />
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
									导出奖励记录数据
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
