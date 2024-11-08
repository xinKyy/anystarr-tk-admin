import React, { Component, useEffect, useState } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import { Layout, Row, Col, Tag, Table, Button, Modal, Input, Form, DatePicker, Select, message } from "antd";
import "@/style/view-style/table.less";
import {
	APIgetList,
	APIgetRewardList,
	APIrewardReceive,
	APIgetAreaMemberList,
	APIdeleteAreaMember,
	APIgetAreaList,
	APIgetMemberPartyList,
	APIgetAreaRoles,
	APIgetGoldMaster,
	APImodifyAreaMember
} from "@/mapi";
import { getKeyList } from "@/tools/action.js";
import { search } from "../../../tools/host";

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
// let areaId = localStorage.getItem('av')
// let userRole = JSON.parse(localStorage.getItem('ur'))
// let role = userRole.filter(item => item.area_id == areaId)
// let roleLevel = role[0] && role[0].role_level

const columns = ({ handleGetReward, editClick }) => [
	{
		title: "操作",
		dataIndex: "opeartion",
		key: "opeartion",
		render: (text, record) => (
			<div>
				<Button onClick={() => editClick(record)} style={{ padding: 0 }} type="link">
					修改
				</Button>
				<Button onClick={() => handleGetReward(record)} style={{ padding: 0 }} type="link">
					删除
				</Button>
			</div>
		)
	},
	{
		title: "用户ID",
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

const SearchBar = (props) => {
	const [ form ] = Form.useForm();
	const [ state, setState ] = useState({
		list: []
	});

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
		props.changeSearch(values);
	};

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

	useEffect(() => {
		getAllArea();
	}, []);

	return (
		<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
			<Row gutter={24}>
				<Col span={8}>
					<Form.Item name="id" label="区域">
						<Select allowClear>
							{state.list.map((item, index) => {
								return (
									<Option key={item.id} value={item.id}>
										{item.name}
									</Option>
								);
							})}
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

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};
	const [ user, setUser ] = useState({});
	const [ allMemVisible, setAllMemVisible ] = useState(false);

	const [ project, setProject ] = useState({});
	const [ allProVisible, setAllProVisible ] = useState(false);
	const [ areaList, setAreaList ] = useState([]);
	const [ roleList, setRoleList ] = useState([]);
	const [ partyList, setPartyList ] = useState([]);

	// const partyList = [ { id: 5, name: "阿里哥哥", hide: false }, { id: 6, name: "金猪", hide: false } ];

	const PartyOption =
		partyList &&
		partyList.length &&
		partyList.map((option, index) => {
			return (
				<Option key={option.id} value={option.id}>
					{option.name}
				</Option>
			);
		});

	const AreaOption =
		areaList &&
		areaList.length &&
		areaList.map((option, index) => {
			return (
				<Option key={option.id} value={option.id}>
					{option.name}
				</Option>
			);
		});

	const RoleOption =
		roleList &&
		roleList.length &&
		roleList.map((option, index) => {
			return (
				<Option key={option.id} value={option.id} level={option.level}>
					{option.name}
				</Option>
			);
		});

	const onStartChange = (date, dateString) => {
		let startAt = dateString;
		form.setFieldsValue({
			start_at: date
		});
	};

	const getAreaList = () => {
		APIgetAreaList()
			.then((res) => {
				setAreaList(res.data);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};
	const getAreaRoles = () => {
		APIgetAreaRoles()
			.then((resp) => {
				setRoleList(resp.data);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};
	const getPartyList = () => {
		APIgetGoldMaster()
			.then((resp) => {
				setPartyList(resp.data);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const onAreaChange = (val) => {
		form.setFieldsValue({
			area_id: val
		});
	};

	const onRoleChange = (val, data) => {
		form.setFieldsValue({
			role_id: val
		});
	};

	useEffect(
		() => {
			getAreaList();
			getAreaRoles();
			getPartyList();
			if (formData && formData.user_id) {
				let partyIds = formData.party_ids.map((item) => {
					return item.id;
				});

				form.setFieldsValue({
					area_id: formData.area_id,
					role_id: formData.role_id,
					party_ids: partyIds
				});
			}
		},
		[ formData ]
	);

	return (
		<Modal
			visible={visible}
			title="区域成员"
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
				<Form.Item label="区域" name="area_id" rules={[ { required: true } ]}>
					<Select placeholder="请选择角色" onChange={onAreaChange} allowClear>
						{AreaOption}
					</Select>
				</Form.Item>
				<Form.Item name="role_id" label="角色" rules={[ { required: true } ]}>
					<Select placeholder="请选择角色" onChange={onRoleChange} allowClear>
						{RoleOption}
					</Select>
				</Form.Item>
				{formData && formData.party_ids && formData.party_ids.length ? (
					<Form.Item name="party_ids" label="金主" rules={[ { required: true } ]}>
						<Select mode="multiple" placeholder="请选择金主">
							{PartyOption}
						</Select>
					</Form.Item>
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

	const [ detailState, setDetailState ] = useState({
		visible: false,
		form: {}
	});

	useEffect(() => {
		const { pagination } = state;
		let params = {
			limit: pagination.pageSize,
			offset: 0
		};
		getList(params);
	}, []);

	const editClick = (item) => {
		const areaId = state.search.id;
		const params = {
			area_id: areaId,
			user_id: item.user_id
		};
		APIgetMemberPartyList(params)
			.then((resp) => {
				const formData = item;
				formData.party_ids = resp.data;
				formData.area_id = areaId;

				setDetailState({
					visible: true,
					formData: formData
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const handleGetReward = async (data) => {
		const areaId = state.search.id;
		const { pagination } = state;
		APIdeleteAreaMember({
			area_id: areaId,
			user_id: data.user_id
		})
			.then((res) => {
				let params = {
					limit: pagination.pageSize,
					offset: 0
				};
				getList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};
	const getList = (params) => {
		console.log("paramslll", params);
		if (!params.id) {
			params.id = state.search.id;
		}
		setState({ loading: true });
		APIgetAreaMemberList(params)
			.then((resp) => {
				setState({
					...state,
					list: resp.data && getKeyList(resp.data),
					loading: false,
					search: {
						id: params.id
					},
					visible: false,
					pagination: {
						total: resp.data.total,
						current: params.offset / params.limit + 1,
						pageSize: params.limit
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
			offset: (pagination.current - 1) * pagination.pageSize
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
	const onCreate = (data, formData) => {
		const params = {
			area_id: data.area_id,
			user_id: formData.user_id,
			role_id: data.role_id,
			party_ids: data.party_ids.join(",")
		};
		APImodifyAreaMember(params)
			.then((resp) => {
				const params = { limit: state.pagination.pageSize, offset: 0 };
				getList(params);
				setDetailState({
					...detailState,
					visible: false
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	return (
		<Layout className="animated fadeIn">
			<DetailModal
				visible={detailState.visible}
				onCreate={onCreate}
				onCancel={() => {
					setDetailState({ ...detailState, visible: false });
				}}
				formData={detailState.formData}
			/>
			<div>
				<WebBreadcrumb arr={[ "区域成员" ]} />
			</div>
			<div className="base-style">
				<SearchBar changeSearch={changeSearch} />
			</div>
			<Row>
				<Col span={24}>
					<div className="base-style">
						<Table
							columns={columns({ handleGetReward, editClick })}
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
