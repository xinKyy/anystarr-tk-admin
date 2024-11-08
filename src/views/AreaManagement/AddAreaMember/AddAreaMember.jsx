import React, { Component, useEffect, useState, useContext } from "react";
import { Layout, Row, Col, Divider, Select, Form, Input, Button, Checkbox, message, Modal, Table } from "antd";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import "@/style/view-style/index.less";
import {
	APIcreateArea,
	APIgetAreaRoles,
	APIgetAreaMemberList,
	APIAddAreaMember,
	APIgetAreaAddable,
	APIgetAreaList,
	APIgetGoldMaster
} from "@/mapi";
import axios from "@/api";
import { API } from "@/api/config";
import { getKeyList } from "@/tools/action.js";
import { AreaContext } from "../../../containers/DefaultLayout";
import { useForm } from "antd/lib/form/Form";
import AreaAllMember from "./AreaAllMember";
import { setAreaList } from "../../../actions/areaActions";

const Option = Select.Option;

const layout = {
	labelCol: {
		span: 8
	},
	wrapperCol: {
		span: 16
	}
};
const tailLayout = {
	wrapperCol: {
		offset: 8,
		span: 16
	}
};

const permissions = [
	{ label: "pmp_publish", value: "pmp_publish" },
	{ label: "pmp_execute", value: "pmp_execute" },
	{ label: "pmp_check", value: "pmp_check" },
	{ label: "pmt_allocation", value: "pmt_allocation" },
	{ label: "pmt_execute", value: "pmt_execute" },
	{ label: "pmt_check", value: "pmt_check" }
];

const columns = [
	{
		title: "user_id",
		dataIndex: "id"
	},
	{
		title: "用户名",
		dataIndex: "name"
	},
	{
		title: "头像",
		dataIndex: "avatar"
	}
];

const MemberModal = ({ visible, onCreate, onCancel }) => {
	const [ data, setData ] = useState([]);
	const [ permissionsData, setPermissionsData ] = useState([]);
	const [ selectObj, setSelectObj ] = useState({});
	const [ pagination, setPagination ] = useState({
		current: 1,
		pageSize: 10
	});
	useEffect(() => {
		let params = {
			limit: pagination.pageSize,
			offset: 0
		};
		getList(params);
	}, []);

	const getList = (params) => {
		params.id = localStorage.getItem("av");
		APIgetAreaAddable(params)
			.then((resp) => {
				setData(resp.data.list && getKeyList(resp.data.list));
				setPagination({
					total: resp.data.total
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};
	const handleChange = (pagination) => {
		const params = { limit: pagination.pageSize, offset: pagination.pageSize * (pagination.current - 1) };
		getList(params);
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setSelectObj(selectedRows[0]);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === "Disabled User",
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
				onCreate(selectObj);
			}}
			onCancel={onCancel}
		>
			{/* <Checkbox.Group options={permissions} onChange={onChange} /> */}
			{/* <Button type='primary' onClick={searchClick}>
                查询
            </Button> */}
			<Table
				rowSelection={{
					type: "radio",
					...rowSelection
				}}
				columns={columns}
				dataSource={data}
				pagination={pagination}
				onChange={handleChange}
			/>
		</Modal>
	);
};

const AddAreaMember = (props) => {
	const [ roleList, setRoleList ] = useState([]);
	const [ areaList, setAreaList ] = useState([]);
	const [ partyList, setPartyList ] = useState([]);

	const [ user, setUser ] = useState({});
	const [ allMemVisible, setAllMemVisible ] = useState(false);
	const [ partyVisible, setPartyVisible ] = useState(false);

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

	const areactx = useContext(AreaContext);

	const [ form ] = useForm();

	const onFinish = (values) => {
		console.log("Success:", values);
		if (values.party_ids) {
			values.party_ids = values.party_ids.join(",");
		}
		APIAddAreaMember(values)
			.then((resp) => {
				message.success("添加成功");
				form.resetFields();
				setUser({});
				props.history.push("/areaManagement/allArea");
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
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

	const onRoleChange = (val, data) => {
		form.setFieldsValue({
			role_id: val
		});
		if (data.level === 0) {
			setPartyVisible(true);
		} else {
			setPartyVisible(false);
		}
	};

	const onAreaChange = (val) => {
		form.setFieldsValue({
			area_id: val
		});
	};

	const onGoldMasterChange = (val) => {};

	const onCreate = (val) => {
		setUser(val);
		setAllMemVisible(false);
		form.setFieldsValue({
			user_id: val.id
		});
	};
	const { areaState, dispatch } = areactx;

	const getAreaList = () => {
		APIgetAreaList()
			.then((res) => {
				setAreaList(res.data);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const getGoldMasterList = () => {
		APIgetGoldMaster()
			.then((resp) => {
				console.log("resp金主", resp);
				let list = resp.data.filter((item) => {
					return !item.hide;
				});
				console.log("list", list);
				setPartyList(list);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	useEffect(() => {
		getAreaRoles();
		getAreaList();
		getGoldMasterList();
	}, []);

	return (
		<Layout className="index animated fadeIn">
			<MemberModal
				visible={allMemVisible}
				value={user}
				onCreate={onCreate}
				onCancel={() => {
					setAllMemVisible(false);
				}}
			/>
			<div>
				<WebBreadcrumb arr={[ "添加区域成员" ]} />
			</div>
			<div className="base-style" id="demoline">
				<Row>
					<Col span={12}>
						<Form
							form={form}
							{...layout}
							name="basic"
							initialValues={{
								remember: true
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item label="区域" name="area_id" rules={[ { required: true } ]}>
								<Select placeholder="请选择区域" onChange={onAreaChange} allowClear>
									{AreaOption}
								</Select>
							</Form.Item>
							<Form.Item name="role_id" label="角色" rules={[ { required: true } ]}>
								<Select placeholder="请选择角色" onChange={onRoleChange} allowClear>
									{RoleOption}
								</Select>
							</Form.Item>
							{partyVisible ? (
								<Form.Item name="party_ids" label="金主">
									<Select
										mode="multiple"
										placeholder="请选择金主"
										onChange={onGoldMasterChange}
										allowClear
									>
										{PartyOption}
									</Select>
								</Form.Item>
							) : null}
							<Form.Item name="user_id" label="用户" rules={[ { required: true } ]}>
								<div
									onClick={() => {
										setAllMemVisible(true);
									}}
								>
									<Input value={user ? user.name : ""} />
								</div>
							</Form.Item>
							<Form.Item {...tailLayout}>
								<Button type="primary" htmlType="submit">
									保存
								</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col span={12} />
				</Row>
			</div>
		</Layout>
	);
};

export default AddAreaMember;
