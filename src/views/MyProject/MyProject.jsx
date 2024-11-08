import React, { Component, useEffect, useState, useContext } from "react";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import moment from "moment";
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
	Pagination,
	Spin,
	Select,
	message,
	Checkbox
} from "antd";
import "@/style/view-style/table.less";
import { APIgetProjectList, APIcreateProject, APIgetAreaMemberList } from "@/mapi";
import { getKeyList } from "@/tools/action.js";
import BoxList from "./BoxList.jsx";
import { AreaContext } from "../../containers/DefaultLayout";

const { MonthPicker, RangePicker } = DatePicker;

const { Option } = Select;

const pageSizeOptions = [ "1", "4", "8", "12", "16", "32", "64", "100", "200" ];

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

const permissions = [
	{ label: "项目发布", value: "pmp_publish" },
	{ label: "项目执行", value: "pmp_execute" },
	{ label: "项目审核", value: "pmp_check" },
	{ label: "任务分配", value: "pmt_allocation" },
	{ label: "任务执行", value: "pmt_execute" },
	{ label: "任务审核", value: "pmt_check" }
];

//搜索tab
// const SearchBar = props => {
//     const [form] = Form.useForm()

//     const onFinish = values => {
//         console.log('Received values of form: ', values)
//         props.changeSearch(values)
//     }

//     return (
//         <Form form={form} name='advanced_search' className='ant-advanced-search-form' onFinish={onFinish}>
//             <Row gutter={24}>
//                 <Col span={8}>
//                     <Form.Item name='id' label='项目名'>
//                         <Input />
//                     </Form.Item>
//                 </Col>
//                 <Col span={8}>
//                     <Form.Item name='test' label='项目长'>
//                         <Input />
//                     </Form.Item>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col span={24} style={{ textAlign: 'right' }}>
//                     <Button type='primary' htmlType='submit'>
//                         Search
//                     </Button>
//                     <Button
//                         style={{ margin: '0 8px' }}
//                         onClick={() => {
//                             form.resetFields()
//                         }}>
//                         Clear
//                     </Button>
//                 </Col>
//             </Row>
//         </Form>
//     )
// }

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

const DetailModal = ({ visible, onCreate, onCancel, formData, disabled }) => {
	const [ form ] = Form.useForm();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};

	const [ user, setUser ] = useState({});
	const [ allMemVisible, setAllMemVisible ] = useState(false);

	const rangeConfig = {
		rules: [
			{
				type: "array",
				message: "Please select time!"
			}
		]
	};

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
		if (Object.keys(formData).length) {
			form.setFieldsValue(formData);
		} else {
			console.log("zikong");
			form.resetFields();
		}
	}, []);

	const onCreateNew = (val) => {
		console.log("val", val);
		setUser(val);
		setAllMemVisible(false);
		form.setFieldsValue({
			executor: val.user_id
		});
	};

	return (
		<Modal
			visible={visible}
			title="发布项目"
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
				<Form.Item name="name" label="项目名" rules={[]}>
					<Input disabled={disabled} />
				</Form.Item>
				<Form.Item name="description" label="项目描述" rules={[]}>
					<Input disabled={disabled} />
				</Form.Item>
				<Form.Item name="fiat_reward" label="法币奖励" rules={[]}>
					<Input disabled={disabled} />
				</Form.Item>
				<Form.Item name="score_reward" label="积分奖励" rules={[]}>
					<Input disabled={disabled} />
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
				{/* <Form.Item name='range-picker' label='时间期限' {...rangeConfig}>
                    <RangePicker />
                </Form.Item> */}
				<Form.Item name="tunnage" label="总吨数" rules={[]}>
					<Input disabled={disabled} />
				</Form.Item>
				<Form.Item name="start_at" label="起始时间14343" rules={[]}>
					<DatePicker
						onChange={onStartChange}
						format="YYYY-MM-DD HH:mm:ss"
						showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
					/>
				</Form.Item>
				<Form.Item name="due_at" label="截止时间" rules={[]}>
					<DatePicker onChange={onDueChange} />
				</Form.Item>

				{/* <Form.Item name='modifier' className='collection-create-form_last-form-item'>
                    <Radio.Group>
                        <Radio value='public'>Public</Radio>
                        <Radio value='private'>Private</Radio>
                    </Radio.Group>
                </Form.Item> */}
			</Form>
		</Modal>
	);
};

const SearchBar = (props) => {
	const [ form ] = Form.useForm();

	const { areaState, dispatch } = useContext(AreaContext);

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
		console.log("areaState", areaState);
		props.changeSearch(values);
	};

	return (
		<Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish}>
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
				<Col span={24} style={{ textAlign: "right" }}>
					<Button type="primary" htmlType="submit">
						Search
					</Button>
					<Button
						style={{ margin: "0 8px" }}
						onClick={() => {
							form.resetFields();
						}}
					>
						Clear
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

class SearchTableView extends Component {
	state = {
		list: [],
		pagination: {
			current: 1,
			pageSize: 1
		},
		search: {},
		loading: true,
		visible: false,
		disabled: false,
		formData: {},
		columns: [
			{
				title: "项目长",
				dataIndex: "id",
				key: "id",
				render: (text, item) => (
					<Button
						type="link"
						onClick={() => {
							this.clickDetail(item);
						}}
					>
						{text}
					</Button>
				)
			},
			{
				title: "项目名",
				dataIndex: "tag",
				key: "tag"
			},
			{
				title: "description",
				dataIndex: "description",
				key: "description"
			}
		]
	};

	componentDidMount() {
		const { pagination } = this.state;
		const params = { limit: pagination.pageSize, offset: pagination.current };
		this.getProjectList(params);
	}

	clickDetail = (data) => {
		console.log("detail", data);
		this.setState({
			visible: true,
			formData: data
		});
	};

	changeSearch = (search) => {
		console.log("search", search);
		search.status = search.status ? search.status.toString() : "";
		search.types = search.types ? search.types.toString() : "";
		const params = { ...search, limit: this.state.pagination.pageSize, offset: 0 };
		this.getProjectList(params);
		this.setState({
			search: search
		});
	};
	loadList = () => {
		const { search, pagination } = this.state;
		let params = { ...search, limit: pagination.pageSize, offset: (pagination.current - 1) * pagination.pageSize };
		this.getProjectList(params);
	};

	getProjectList = (params) => {
		let self = this;
		console.log("params", params);
		let areaId = localStorage.getItem("av");
		params.area_id = areaId;
		self.setState({ loading: true });
		APIgetProjectList(params)
			.then((resp) => {
				console.log("resp", resp);
				console.log("ty", getKeyList(resp.data.list));
				console.log("this.state.pagination", this.state.pagination);
				self.setState({
					list: resp.data.list && getKeyList(resp.data.list),
					// list: [{ key: '1' }, { key: '2' }, { key: '3' }],
					loading: false,
					pagination: {
						// total: 3,
						// current: this.state.pagination.current,
						// pageSize: this.state.pagination.pageSize
						...this.state.pagination,
						total: resp.data.total
						// current: resp.data.pager.start_row + 1,
						// pageSize: resp.data.pager.page_size
					}
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	handleChange = (pagination) => {
		let search = this.state.search;
		console.log("search", search);

		const params = {
			...search,
			limit: pagination.pageSize,
			offset: (pagination.current - 1) * pagination.pageSize
		};
		this.getProjectList(params);
	};

	onCreate = (data) => {
		console.log("data///", data.due_at._d.getTime());
		const { pagination } = this.state;
		const params = { limit: pagination.pageSize, offset: pagination.current };

		data.due_at = parseInt(data.due_at._d.getTime() / 1000);
		data.start_at = parseInt(data.start_at._d.getTime() / 1000);
		console.log("dartaa..", data);
		let areaId = localStorage.getItem("av");
		data.area_id = areaId;
		this.setState({
			visible: false
		});
		APIcreateProject(data)
			.then((resp) => {
				message.success("添加成功");
				this.getProjectList(params);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	pageChange = (page, pageSize) => {
		let search = this.state.search;
		console.log("search", search);
		let pagination = this.state.pagination;
		pagination.current = page;
		this.setState({
			pagination: pagination
		});
		const params = {
			...search,
			limit: pageSize,
			offset: (page - 1) * pageSize
		};
		this.getProjectList(params);
	};

	pageSizeChange = (current, size) => {
		let search = this.state.search;
		console.log("search", search);
		let pagination = this.state.pagination;
		pagination.pageSize = size;
		this.setState({
			pagination: pagination
		});
		const params = {
			...search,
			limit: size,
			offset: (current - 1) * size
		};
		this.getProjectList(params);
	};

	canPublishProject = () => {
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

	render() {
		return (
			<Layout className="animated fadeIn">
				<DetailModal
					visible={this.state.visible}
					onCreate={this.onCreate}
					onCancel={() => {
						this.setState({ visible: false });
					}}
					formData={this.state.formData}
					disabled={this.state.disabled}
				/>
				<div>
					<WebBreadcrumb arr={[ "我的项目" ]} />
				</div>
				<div className="base-style">
					<SearchBar changeSearch={this.changeSearch} />
				</div>
				<Row>
					<Col span={24}>
						<div className="base-style">
							{this.canPublishProject() ? (
								<Row>
									<Col span={24} style={{ textAlign: "left", marginBottom: "15px" }}>
										<Button
											type="primary"
											onClick={() => {
												this.setState({
													formData: {},
													visible: true
												});
											}}
										>
											发布项目
										</Button>
									</Col>
								</Row>
							) : null}

							{this.state.loading ? (
								<div
									className="base-style"
									style={{ textAlign: "center", height: "100px", lineHeight: "100px" }}
								>
									<Spin />
								</div>
							) : (
								<BoxList
									dataSource={this.state.list}
									pagination={this.state.pagination}
									clickDetail={this.clickDetail}
									loadList={this.loadList}
								/>
							)}
							<div className="pagination-box" style={{ textAlign: "right" }}>
								<Pagination
									// defaultCurrent={1}
									showSizeChanger
									pageSizeOptions={pageSizeOptions}
									current={this.state.pagination.current}
									pageSize={this.state.pagination.pageSize}
									total={this.state.pagination.total}
									onChange={this.pageChange}
									onShowSizeChange={this.pageSizeChange}
									showTotal={(total) => `共 ${this.state.pagination.total} 条`}
								/>
							</div>
						</div>
					</Col>
				</Row>
			</Layout>
		);
	}
}

export default SearchTableView;
