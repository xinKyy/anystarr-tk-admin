import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Divider, Select, Form, Input, Progress, Button, notification, Modal } from "antd";
import "@/style/view-style/index.less";
import screenfull from "screenfull";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import { Line, Pie } from "@ant-design/charts";
import { FullscreenOutlined } from "@ant-design/icons";
import "./integralDetail.less";
import { APIscoreOverview, APIredeem, APIgetRuleDetail } from "@/mapi";

const { Option } = Select;

const DemoLine = () => {
	const data = [
		{
			year: "1",
			value: 0
		}
	];
	const config = {
		title: {
			visible: true,
			text: ""
		},
		description: {
			visible: true,
			text: ""
		},
		padding: "auto",
		forceFit: true,
		data,
		xField: "year",
		yField: "value",
		label: {
			visible: true,
			type: "point"
		},
		point: {
			visible: true,
			size: 5,
			shape: "diamond",
			style: {
				fill: "white",
				stroke: "#2593fc",
				lineWidth: 2
			}
		}
	};
	return <Line {...config} />;
};

const IntegralExchange = ({ visible, onCreate, onCancel }) => {
	const [ form ] = Form.useForm();

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 14 }
	};

	const integralChange = (e) => {
		let sysConfig = JSON.parse(localStorage.getItem("s"));
		let res = sysConfig.filter((item) => {
			return item.key === "score_convert_rate";
		});
		const integralNum = e.target.value;
		let rmb = integralNum * res[0].value + "";
		form.setFieldsValue({
			rmb: rmb
		});
	};

	return (
		<Modal
			visible={visible}
			title="积分兑换"
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
			<Form {...layout} form={form} name="form_in_modal">
				<Form.Item name="amount" label="积分" rules={[]}>
					<Input type="number" onChange={integralChange} />
				</Form.Item>
				<Form.Item name="rmb" label="兑换为人民币" rules={[]}>
					<Input disabled />
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

const IntegralDetail = (props) => {
	const [ visible, SetVisible ] = useState(false);

	const [ rule, setRule ] = useState({
		content: "",
		title: "",
		type: "reward_score"
	});

	const fullToggle = () => {
		if (screenfull.isEnabled) {
			screenfull.request(document.getElementById("demoline"));
		}
	};
	const [ componentSize, setComponentSize ] = useState("default");

	const [ scoreState, setScoreState ] = useState({
		balance: 0, //剩余
		converted: 0 // 已转换
	});

	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	const close = () => {
		console.log("Notification was closed. Either the close button was clicked or duration time elapsed.");
	};

	const getScoreRule = () => {
		const params = {
			type: "reward_score"
		};
		APIgetRuleDetail(params)
			.then((resp) => {
				console.log("resp", resp);
				setRule(resp.data);
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const ruleForm = (
		<Form
			labelCol={{
				span: 2
			}}
			wrapperCol={{
				span: 22
			}}
			layout="horizontal"
			initialValues={{
				size: componentSize
			}}
			onValuesChange={onFormLayoutChange}
			size={componentSize}
		>
			<Form.Item label="">
				<div>{rule.content}</div>
			</Form.Item>
		</Form>
	);

	const integralRule = () => {
		const key = `open${Date.now()}`;
		notification.open({
			message: rule.title,
			key,
			description: ruleForm,
			duration: null,
			onClose: close
		});
	};

	const exchangeClick = (val) => {
		const params = {
			amount: val.amount
		};
		console.log("valll", val);
		SetVisible(false);
		APIredeem(params)
			.then((resp) => {
				console.log("resp", resp);
				props.loadData();
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	const getScoreData = () => {
		APIscoreOverview()
			.then((resp) => {
				console.log("resp", resp);
				setScoreState({
					balance: resp.data.balance,
					converted: resp.data.converted
				});
			})
			.catch((err) => {
				console.log("err", err);
			});
	};

	useEffect(() => {
		getScoreData();
		getScoreRule();
	}, []);

	return (
		<Layout className="index animated fadeIn">
			<IntegralExchange
				visible={visible}
				onCreate={exchangeClick}
				onCancel={() => {
					SetVisible(false);
				}}
				loadData={getScoreData}
			/>
			<div>
				<WebBreadcrumb arr={[ "积分详情" ]} />
			</div>
			<Row>
				<Col span={24}>
					<div className="base-style" id="demoline">
						<div className="bar-header">
							<div>图形全屏展示</div>
							<FullscreenOutlined style={{ cursor: "pointer" }} onClick={fullToggle} />
						</div>
						<Divider />
						<Row>
							<Col span={4} offset={20}>
								<div className="my-integral">
									<Form
										labelCol={{
											span: 10
										}}
										wrapperCol={{
											span: 10
										}}
										layout="horizontal"
										initialValues={{
											size: componentSize
										}}
										onValuesChange={onFormLayoutChange}
										size={componentSize}
									>
										<Form.Item label="我的积分">
											<div>{scoreState.balance}</div>
										</Form.Item>
										<Form.Item label="已兑换">
											<div>{scoreState.converted}</div>
										</Form.Item>
										<Form.Item label="待兑换">
											<div>{scoreState.balance}</div>
										</Form.Item>
									</Form>
								</div>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<div
									style={{
										background: "#e4e4e4",
										width: "300px",
										height: "300px",
										margin: "10px auto 10px"
									}}
								/>
								<div className="integral-num">
									<div>白银</div>
									<Progress percent={30} />
								</div>
							</Col>
							<Col span={16}>
								<DemoLine />
							</Col>
						</Row>
						<Row>
							<Col span={8} offset={8}>
								<div className="integral-rule">
									<Button type="primary" onClick={integralRule}>
										积分奖励规则
									</Button>
									<Button onClick={SetVisible} type="primary">
										积分兑现
									</Button>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</Layout>
	);
};

export default IntegralDetail;
