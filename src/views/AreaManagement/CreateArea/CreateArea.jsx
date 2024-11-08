import React from "react";
import { Layout, Row, Col, Divider, Select, Form, Input, Button, Checkbox, message } from "antd";
import WebBreadcrumb from "@/components/WebBreadcrumb";
import "@/style/view-style/index.less";
import { APIcreateArea } from "@/mapi";
import axios from "@/api";
import { API } from "@/api/config";
// import { withRouter } from "react-router-dom";

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

const CreateArea = (props) => {
	const onFinish = (values) => {
		console.log("Success:", values);
		APIcreateArea(values)
			.then((resp) => {
				console.log("resp", resp);
				message.success("创建成功");
				props.history.push("/areaManagement/allArea");
			})
			.catch((err) => {
				console.log("err", err);
			});
		// axios
		//     .post(`${API}/account/create2`, { ...values })
		//     .then(res => {
		//         if (res.data.code === 0) {
		//         } else {
		//         }
		//     })
		//     .catch(err => {})
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
		// this.props.history.push("/index");
	};
	return (
		<Layout className="index animated fadeIn">
			<div>
				<WebBreadcrumb arr={[ "新增区域" ]} />
			</div>
			<div className="base-style" id="demoline">
				<Row>
					<Col span={12}>
						<Form
							{...layout}
							name="basic"
							initialValues={{
								remember: true
							}}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item
								label="区域名称"
								name="area"
								rules={[
									{
										required: true,
										message: "请输入区域名称"
									}
								]}
							>
								<Input />
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

// export default withRouter(CreateArea);
export default CreateArea;
