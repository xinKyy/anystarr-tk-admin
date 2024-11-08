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
	InputNumber,
	Form,
	DatePicker,
	Select,
	message
} from "antd";
import "@/style/view-style/table.less";
import {
	APIgetList,
	APIgetRewardList,
	APIrewardReceive,
	APIrewardRunningWater,
	APIgetSysConfig,
	APImodifySystemConfig,
	APIgetLevelscores,
	APIeditLevelScore
} from "@/mapi";
import { getKeyList } from "@/tools/action.js";

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

const columns = ({ handleGetReward }) => [
	{
		title: "段位",
		dataIndex: "level",
		key: "level"
	},
	{
		title: "积分兑换手续费率",
		dataIndex: "fee_rate",
		key: "fee_rate",
		render: (text, record) => <span>{`${text * 100}%`}</span>
	},
	{
		title: "积分额",
		dataIndex: "score",
		key: "score"
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

const ModifyModal = ({ visible, onCreate, onCancel, data }) => {
	const [ form ] = Form.useForm();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};

	const onProgressChange = (val) => {
		console.log("val", val);
		form.setFieldsValue({
			progress: val
		});
	};

	useEffect(() => {
		console.log("data重新加载", data);
		data.fee_rate = data.fee_rate * 100;
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
			onCancel={() => {
				form
					.validateFields()
					.then((values) => {
						form.resetFields();
						console.log("values", values);
						values.fee_rate = values.fee_rate / 100;
						console.log("values", values);
						onCancel(values);
					})
					.catch((info) => {
						console.log("err");
					});
			}}
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
				<Form.Item name="fee_rate" label="积分兑换手续费率" rules={[]} className="num-precent">
					<InputNumber />
				</Form.Item>
				<Form.Item name="level" label="段位" rules={[]}>
					<Input />
				</Form.Item>
				<Form.Item name="score" label="积分额" rules={[]}>
					<InputNumber />
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
		search: {},
		loading: true,
		visible: false,
		disabled: false,
		formData: {}
	});
	const [ detailState, setDetailState ] = useState({
		visible: false,
		data: {}
	});
	useEffect(() => {
		const { pagination } = state;
		// const params = { page_size: pagination.pageSize, start_row: pagination.current - 1 }

		getList();
	}, []);

	const handleGetReward = async (data) => {
		console.log("领取奖励", data);
		setDetailState({
			data: data,
			visible: true
		});

		// await APIrewardReceive({ id });
	};

	const convertName = (list) => {
		let res = [];
		return (res = list.map((item) => {
			item.name = item.key;
			return item;
		}));
	};

	const getList = () => {
		setState({ loading: true });
		APIgetLevelscores()
			.then((resp) => {
				console.log("resp", resp);
				setState({
					...state,
					list: resp.data && getKeyList(resp.data),
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
					loading: false,
					pagination: {
						total: resp.data.total
						// current: params.offset / params.limit + 1,
						// pageSize: params.limit
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
		const params = {
			limit: pagination.pageSize,
			offset: (pagination.current - 1) * pagination.pageSize
		};
		getList(params);
	};

	const onCreate = (data, oldData) => {
		console.log("aa", data);
		console.log("oldData", oldData);
		data.fee_rate = data.fee_rate / 100;
		let params = {
			...data
		};
		APIeditLevelScore(params)
			.then((resp) => {
				message.success("修改成功");
				setDetailState({
					...detailState,
					visible: false
				});
				getList();
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const onCancel = (data) => {
		setDetailState({
			...detailState,
			visible: false
		});
		getList();
	};

	return (
		<Layout className="animated fadeIn">
			<ModifyModal
				visible={detailState.visible}
				onCreate={onCreate}
				onCancel={onCancel}
				data={detailState.data}
			/>
			<div>
				<WebBreadcrumb arr={[ "段位积分配置" ]} />
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
