import host from '../tools/host'
import kolhost from '../tools/kolhost'
import request from '../tools/request'
import { param } from 'jquery'
import {newHost} from "../tools/new_host";
console.log('tytyoo', `${host}/web/promotion_news/find_promotion_newss.json`)

//获取列表
export const APIgetList = params => {
    return request.get(`${host}/web/promotion_news/find_promotion_newss.json`, params)
}

//获取成员参与过的项目列表
export const APIgetProjectList = params => {
    return request.get(`${host}/member/project/list`, params)
}

//创建区域项目
export const APIcreateProject = params => {
    return request.post(`${host}/member/project/create`, params)
}

//获取项目详情
export const APIgetProjectDetail = params => {
    return request.get(`${host}/member/project/detail`, params)
}

//编辑项目
export const APIEditProject = params => {
    return request.post(`${host}/member/project/edit`, params)
}

//处理项目
export const APIhandleProject = params => {
    return request.post(`${host}/member/project/handle`, params)
}

//获取成员参与过的项目任务列表
export const APIgetProjectTaskList = params => {
    return request.get(`${host}/member/project/task/list`, params)
}

//登录账号
export const APIlogin = params => {
    return request.post(`${host}/account/login`, params)
}

//新增临时账号
export const APIAddAccount = params => {
    return request.post(`${host}/account/create2`, params)
}

//管理员新增普通用户账号
export const APIcreateAccount = params => {
    return request.post(`${host}/admin/account/create`, params)
}

//账户列表
export const APIgetAccountList = params => {
    return request.get(`${host}/admin/account/list`, params)
}

//修改账户
export const APIeditAccount = params => {
    return request.post(`${host}/admin/account/edit`, params)
}

//修改区域
export const APIeditArea = params => {
    return request.post(`${host}/admin/area/edit`, params)
}

//获取所有区域
export const APIgetAreaList = params => {
    return request.get(`${host}/admin/area/list`, params)
}

//删除区域成员
export const APIdeleteArea = params => {
    return request.post(`${host}/area/member/del`, params)
}

//创建区域
export const APIcreateArea = params => {
    return request.post(`${host}/admin/area/create`, params)
}

//获取区域角色
export const APIgetAreaRoles = params => {
    return request.get(`${host}/system/config/arearoles`, params)
}

//获取某个区域内所有成员  已添加的
export const APIgetAreaMemberList = params => {
    return request.get(`${host}/area/member/list`, params)
}

//获取可添加到区域的用户列表 未添加的
export const APIgetAreaAddable = params => {
    return request.get(`${host}/area/user/addable`, params)
}

//添加区域成员
export const APIAddAreaMember = params => {
    return request.post(`${host}/area/member/add`, params)
}

//删除某个区域的成员 低于自己的
export const APIdeleteAreaMember = params => {
    return request.post(`${host}/area/member/del`, params)
}

//奖励列表
export const APIgetRewardList = params => {
    return request.get(`${host}/user/reward/list`, params)
}

//获取用户信息
export const APIgetUserInfo = params => {
    return request.get(`${host}/user/overview`, params)
}

//获取系统配置
export const APIgetSysConfig = params => {
    return request.get(`${host}/system/configs`, params)
}

//获取用户所有角色以及区域信息
export const APIgetUserRole = params => {
    return request.get(`${host}/user/role/list`, params)
}

//创建项目任务
export const APIcreateTask = params => {
    return request.post(`${host}/member/project/task/create`, params)
}

//获取任务详情
export const APIgetTaskDetail = params => {
    return request.get(`${host}/member/project/task/detail`, params)
}

//处理任务
export const APIhandleTask = params => {
    return request.post(`${host}/member/project/task/handle`, params)
}

//创建工单
export const APIcreateWorkorder = params => {
    return request.post(`${host}/member/workorder/create`, params)
}

//获取用户工单详情
export const APIgetWorkOrderDetail = params => {
    return request.get(`${host}/member/workorder/detail`, params)
}

//处理工单
export const APIhandleWorkOrder = params => {
    return request.post(`${host}/member/workorder/handle`, params)
}

//获取用户工单列表
export const APIgetWorkOrderList = params => {
    return request.get(`${host}/member/workorder/list`, params)
}

//修改系统配置
export const APImodifySystemConfig = params => {
    return request.post(`${host}/admin/system/config/edit`, params)
}

//获取等级配置
export const APIgetLevelscores = params => {
    return request.get(`${host}/system/config/levelscores`, params)
}

//等级配置修改
export const APIeditLevelScore = params => {
    return request.post(`${host}/admin/system/config/levelscore/edit`, params)
}

//获取积分排行榜
export const APIgetSystemRanking = params => {
    return request.get(`${host}/system/ranking`, params)
}

//获取规则详情
export const APIgetRuleDetail = params => {
    return request.get(`${host}/system/regulation`, params)
}

//修改规则
export const APImodifyRule = params => {
    return request.post(`${host}/admin/system/regulation/edit`, params)
}
// 表格这块先不接
//删除表格
export const APIdelTable = params => {
    return request.post(`${host}/admin/system/sheet/del`, params)
}

//表格列表
export const APIgetTable = params => {
    return request.get(`${host}/system/sheet/list`, params)
}

//上传表格文件
export const APIuploadTable = params => {
    return request.post(`${host}/admin/system/sheet/upload`, params)
}

// 模版这块可先不接
//添加模板
export const APIaddTemplate = params => {
    return request.post(`${host}/admin/system/template/add`, params)
}

//删除模版
export const APIdeleteTemplate = params => {
    return request.post(`${host}/admin/system/template/del`, params)
}
//获取模版详情
export const APIgetTemplateDetail = params => {
    return request.get(`${host}/system/template/detail`, params)
}

//编辑模版
export const APIeditTemplate = params => {
    return request.post(`${host}/admin/system/template/edit`, params)
}

//获取模板列表，不包括详情
export const APIgetTemplateList = params => {
    return request.get(`${host}/system/template/list`, params)
}

//获取用户通知列表
export const APIgetUserNotfiyList = params => {
    return request.get(`${host}/user/notification/list`, params)
}

//获取法币概览
export const APIgetFiatOverview = params => {
    return request.get(`${host}/user/reward/fiat/overview`, params)
}

//奖励提现申请
export const APIrewardApplication = params => {
    return request.post(`${host}/user/reward/fiat/withdraw/apply`, params)
}

//奖励提现申请处理
export const APIrewardApplicationHandle = params => {
    return request.post(`${host}/admin/user/reward/fiat/withdraw/handle`, params)
}

//奖励提现申请列表
export const APIrewardApplicationList = params => {
    return request.get(`${host}/admin/user/reward/fiat/withdraw/list`, params)
}

//奖励流水
export const APIrewardRunningWater = params => {
    return request.get(`${host}/user/reward/flow`, params)
}

//用户资产概览
export const APIrewardOverview = params => {
    return request.get(`${host}/user/reward/overview`, params)
}

//领取奖励
export const APIrewardReceive = params => {
    return request.post(`${host}/user/reward/receive`, params)
}

//积分兑换
export const APIredeem = params => {
    return request.post(`${host}/user/reward/score/convert`, params)
}

//积分概览
export const APIscoreOverview = params => {
    return request.get(`${host}/user/reward/score/overview`, params)
}

//获取金主
export const APIgetGoldMaster = params => {
    return request.get(`${host}/admin/party/list`, params)
}

//编辑金主
export const APIeditGoldMaster = params => {
    return request.post(`${host}/admin/party/edit`, params)
}

//创建金主
export const APIcreateGoldMaster = params => {
    return request.post(`${host}/admin/party/create`, params)
}

//获取用户金主列表
export const APIgetMemberPartyList = params => {
    return request.get(`${host}/member/party/list`, params)
}

//修改区域成员
export const APImodifyAreaMember = params => {
    return request.post(`${host}/area/member/edit`, params)
}

//导出用户奖励记录数据
export const APIexportRewardRecord = params => {
    return request.file(`${host}/admin/user/reward/record/export`, params)
}

//anyStarr 登录接口

export const APILogin = params => {
    return request.post(`${host}/web/crmuser/login`, params)
}

export const APILogout = params => {
    return request.post(`${host}/web/crmuser/logout`, params)
}

export const APICreateInvitecode = params => {
    return request.post(`${host}/web/user/create_user_invitation_code`, params)
}

export const APIGetInvitecodeList = params => {
    return request.post(`${host}/web/user/find_user_invitation_code`, params)
}

export const APIBatchCreateInvitecode = params => {
    return request.upload(`${host}/web/user/batch_create_user_invitation_code`, params)
}

export const APIGetUserList = params => {
    return request.post(`${host}/web/user/find_users`, params)
}

//campaign 后台列表
export const APIGetCampaignsList = params => {
    return request.post(`${host}/web/campaign/find_campaigns`, params)
}

//campaign 的创建或修改
export const APICreateModifyCampaign = params => {
    return request.post(`${host}/web/campaign/create_or_modify_campaign`, params)
}

//campaign 创建新方法
export const APICreateCampaign = params => {
    return request.postJson(`${host}/web/campaign/create_campaign`, params)
}

// campaign 修改新方法
export const APIModifyCampaign = params => {
    return request.postJson(`${host}/web/campaign/modify_campaign`, params)
}

//获取国家枚举
export const APIGetCountryList = params => {
    return request.get(`${host}/common/sys/find_countries`, params)
}

//上传文件
export const APIUploadFile = params => {
    return request.upload(`${host}/common/upload/upload_pic`, params)
}

//task 列表
export const APIFindTasks = params => {
    return request.post(`${host}/web/task/find_tasks`, params)
}

//上传 promo code
// export const APIUploadPromoCode = params => {
//     return request.upload(`${host}/common/upload/upload_promo_code`, params)
// }

export const APIUploadPromoCode = params => {
    return request.upload(`${host}/web/campaign/upload_promo_code`, params)
}

//crm 查看task详情
export const APIGetTaskDetail = params => {
    return request.post(`${host}/web/task/get_task_detail_crm`, params)
}

//审核task
export const APIExamineTask = params => {
    return request.post(`${host}/web/task/examine_task`, params)
}

//ticket  列表
export const APIGetMessages = params => {
    return request.post(`${host}/web/message/find_messages`, params)
}

//like this ticket
export const APILikeMessage = params => {
    return request.post(`${host}/web/message/like_it`, params)
}

//close ticket
export const APICloseTicket = params => {
    return request.post(`${host}/web/message/close_ticket`, params)
}

//on hold
export const APIOnHoldAction = params => {
    return request.post(`${host}/web/campaign/modify_campaigns_status`, params)
}

//code commission
export const APIGetCodeCommission = params => {
    return request.post(`${host}/web/payment/find_code_commission`, params)
}

//branding commission
export const APIGetBrandingCommission = params => {
    return request.post(`${host}/web/payment/find_branding_commission`, params)
}

// upload code commission
export const APIUploadCodeCommission = params => {
    return request.upload(`${host}/web/payment/upload_code_commission`, params)
}

//get payment
export const APIGetPayments = params => {
    return request.post(`${host}/web/payment/find_payments`, params)
}

//modify payment status
export const APIModifyPaymentStatus = params => {
    return request.post(`${host}/web/payment/modify_payment_status`, params)
}

// upload payout reult
export const APIUploadPayoutResult = params => {
    return request.upload(`${host}/web/payment/upload_payout_result`, params)
}

//post task list
export const APIGetPostList = params => {
    return request.post(`${host}/web/message/find_post_tasks`, params)
}

//post modify or create
export const APICreateOrModify = params => {
    return request.post(`${host}/web/message/create_or_modify_post_task`, params)
}

//post task receiver
export const APIUploadReceiver = params => {
    return request.uploadM(`${host}/web/message/upload_receiver_list`, params)
}

//post modify status
export const APIModifyPostStatus = params => {
    return request.post(`${host}/web/message/modify_post_task_status`, params)
}

//post task delete
export const APIDeletePost = params => {
    return request.post(`${host}/web/message/remove_post_task`, params)
}

//download receiver
export const APIDownloadReceiver = params => {
    return request.post(`${host}/web/message/download_receiver_list`, params)
}

export const APIGetUserDetail = params => {
    return request.post(`${host}/web/user/get_user_detail`, params)
}

//downlaod invitecode
export const APIDownloadInvitecode = params => {
    return request.post(`${host}/web/user/download_invitation_code`, params)
}

//campaign 详情
export const APIGetCampaignDetail = params => {
    return request.post(`${host}/web/campaign/get_campaign`, params)
}

//delete code commission
export const APIDeleteCodeCommission = params => {
    return request.post(`${host}/web/payment/remove_code_commission`, params)
}

// get merchant list
export const APIGetMerchantList = params => {
    return request.post(`${host}/web/merchant/find_merchants`, params)
}

//create campaign get all merchant
export const APIGetAllMerchant = params => {
    return request.post(`${host}/web/merchant/find_all_merchants`, params)
}

// create or modify merchant
export const APICreateOrModifyMerchant = params => {
    return request.post(`${host}/web/merchant/create_or_mdify_merchant`, params)
}

//delete merchant
export const APIDeleteMerchant = params => {
    return request.post(`${host}/web/merchant/remove_merchant`, params)
}

//ticket detail
export const APIGetMessageDetail = params => {
    return request.post(`${host}/web/message/get_message_detail`, params)
}

//ticket reply
export const APIMessageReply = params => {
    return request.post(`${host}/web/message/reply_message`, params)
}

//campaign white list
export const APIUploadWhiteList = params => {
    return request.uploadM(`${host}/web/campaign/upload_white_list`, params)
}

//download white list
export const APIDownloadWhiteList = params => {
    // return request.post(`${host}/web/campaign/download_white_list`, params)
    return `${host}/web/campaign/download_white_list?id=${params}`
}

//sku list
export const APIGetSkuList = params => {
    return request.post(`${host}/web/category/find_categorys`, params)
}

//create sku
export const APICreateOrModifySku = params => {
    return request.post(`${host}/web/category/create_or_mdify_category`, params)
}

//sku detail
export const APIGetSkuDetail = params => {
    return request.post(`${host}/web/category/get_category_detail`, params)
}

//delete sku
export const APIDeleteSku = params => {
    return request.post(`${host}/web/category/remove_category`, params)
}

// find all category
export const APIFindAllCategory = params => {
    return request.post(`${host}/web/category/find_all_category`, params)
}

//find permissions
export const APIGetPermissions = params => {
    return request.post(`${host}/web/authorization/permission/find_permissions`, params)
}

//reload permissions
export const APIReloadPermission = params => {
    return request.post(`${host}/web/authorization/permission/reload`, params)
}

// download user
export const APIDownloadUser = params => {
    return request.post(`${host}/web/user/find_users`, params)
}

//permissions   get role
export const APIGetRoles = params => {
    return request.post(`${host}/web/authorization/role/find_roles`, params)
}

//get role detail
export const APIGetRoleDetail = params => {
    return request.post(`${host}/web/authorization/role/get_role_detail`, params)
}

//create Role
export const APICreateOrModifyRole = params => {
    return request.post(`${host}/web/authorization/role/create_or_modify_role`, params)
}

//create role need permissions
export const APIGetRoleNeedPermissions = params => {
    return request.post(`${host}/web/authorization/permission/find_all_permissions`, params)
}

//delete Role
export const APIDeleteRole = params => {
    return request.post(`${host}/web/authorization/role/remove_role`, params)
}

//get user need role
export const APIGetUserNeedRole = params => {
    return request.post(`${host}/web/authorization/role/find_all_role`, params)
}

//crm user list
export const APIGetCrmUser = params => {
    return request.post(`${host}/web/crmuser/find_crmuser`, params)
}

//createOrModify Crm user
export const APICreateOrModifyCrmUser = params => {
    return request.post(`${host}/web/crmuser/create_or_modify_crmuser`, params)
}

//get Crm User detail
export const APIGetCrmUserDetail = params => {
    return request.post(`${host}/web/crmuser/get_crmuser_detail`, params)
}

//get sampel list
export const APIGetSampleList = params => {
    return request.post(`${host}/web/sample/find_sample_orders`, params)
}

//get sample detail
export const APIGetSampleDetail = params => {
    return request.post(`${host}/web/sample/get_sample_detail`, params)
}

//bind tracking number
export const APIBindTrackingNumber = params => {
    return request.post(`${host}/web/sample/bind_tracking_number`, params)
}

//get user acquisition data
export const APIGetUserAcquisition = params => {
    return request.post(`${host}/web/statistics/kol_acquisition`, params)
}

export const APIGetKolDemInfl = params => {
    return request.post(`${host}/web/statistics/kol_demographic_and_influential`, params)
}

//get campaign performance
export const APGetCampaignPerformance = params => {
    return request.post(`${host}/web/statistics/campaign_performance`, params)
}

// get pending task
export const APIGetPendingTasks = params => {
    return request.post(`${host}/web/statistics/pending_tasks`, params)
}

//download sample
export const APIDownloadSample = params => {
    // return request.post(`${host}/web/sample/download_sample_orders`)
    return `${host}/web/sample/download_sample_orders`
}

//download campaign
export const APIDownloadCampaign = params => {
    return `${host}/web/statistics/download_campaign_task`
}

//user retention
export const APIGetUserRetention = params => {
    return request.post(`${host}/web/statistics/user_retention`, params)
}

//
export const APImodifyPwd = params => {
    return request.post(`${host}/web/crmuser/modify_password`, params)
}

//change user status
export const APIModifyUserStatus = params => {
    return request.post(`${host}/web/user/modify_user_status`, params)
}

//change crm user status
export const APIModifyCrmUserStatus = params => {
    return request.post(`${host}/web/crmuser/modify_crmuser_status`, params)
}

//export promo code
export const APIDownloadpromoCode = params => {
    return request.post(`${host}/web/campaign/download_promo_code`, params)
}

// admin create user
export const APICreateUser = params => {
    return request.post(`${host}/web/user/create_user`, params)
}

//admin modify social account
export const APISetSocial = params => {
    return request.post(`${host}/web/user/set_user_social`, params)
}

//admin modify user password
export const APIChangePassword = params => {
    return request.post(`${host}/web/user/change_password`, params)
}

//admin create or modify address
export const APICreateOrModifyAddress = params => {
    return request.post(`${host}/web/user/create_or_modify_user_address`, params)
}

//delete address
export const APIDeleteAddress = params => {
    return request.post(`${host}/web/user/remove_user_address`, params)
}

//admin create or modify account
export const APICreateOrModifyAccount = params => {
    return request.post(`${host}/web/user/create_or_modify_pay_account`, params)
}

//delete pay  account
export const APIDelectPayAccount = params => {
    return request.post(`${host}/web/user/remove_user_pay_account`, params)
}

export const APIgetBankList = params => {
    return request.get(`${host}/common/sys/find_bank`, params)
}

export const APIbatchUploadUserList = params => {
    return request.upload(`${host}/web/user/batch_create_user`, params)
}

export const APIDownloadCodeCommission = params => {
    return `${host}/web/payment/download_code_commission`
}

export const APIDownloadBrandingCommission = params => {
    return `${host}/web/payment/download_branding_commission`
}

export const APIDownloadUserNew = params => {
    return `${host}/web/user/download_user`
}

export const APICreateOrModifyDraftCampaign = params => {
    return request.post(`${host}/web/campaign/create_or_modify_draft_campaign`, params)
}

export const APIReviewSampleOrder = params => {
    return request.post(`${host}/web/sample/examine_sample`, params)
}

export const APISendActiveEmail = params => {
    return request.post(`${host}/web/user/send_active_email`, params)
}

export const APIGetPromotionList = params => {
    return request.postJson(`${host}/web/promotion/promotion_list`, params)
}

export const APICreatePromotion = params => {
    return request.postJson(`${host}/web/promotion/create_promotion`, params)
}

export const APIGetPromotionDetail = params => {
    return request.get(`${host}/web/promotion/promotion_detail`, params)
}

export const APIEditPromotion = params => {
    return request.postJson(`${host}/web/promotion/edit_promotion`, params)
}

export const APIGetPromotionLog = params => {
    return request.get(`${host}/web/promotion/promotion_message_logs`, params)
}

export const APIPromotionUploadWhiteList = params => {
    return request.uploadM(`${host}/web/promotion/upload_white_list`, params)
}

export const APIPromotionDownloadWhiteList = params => {
    return `${host}/web/promotion/download_white_list?id=${params}`
    // return request.post(`${host}/web/promotion/download_white_list`, params)
}

export const APIPromotionWhiteList = params => {
    return request.get(`${host}/web/promotion/promotion_white_list`, params)
}

export const APIGetShopifyOrder = params => {
    return request.get(`${host}/web/shopifyOrder/search`, params)
}

export const APIGetEmailTem = params => {
    return request.postJson(`${host}/web/message/message_template_list`, params)
}

export const APIGetEmailTemDetail = params => {
    return request.post(`${host}/web/message/message_template_detail`, params)
}

export const APICreateEmailTem = params => {
    return request.postJson(`${host}/web/message/create_message_template`, params)
}

export const APIModifyEmailTem = params => {
    return request.postJson(`${host}/web/message/edit_message_template`, params)
}

export const APIModifyRewardAmount = params => {
    return request.post(`${host}/web/task/modify_commission`, params)
}

export const APIModifyRewardAmountNew = params => {
    return request.post(`${host}/web/new_task/modify_commission`, params)
}

export const APICloseTask = params => {
    return request.post(`${host}/web/task/close_task`, params)
}

export const APIUploadTrackNumber = params => {
    return request.upload(`${host}/web/sample/upload_tracking_numbers`, params)
}

export const APIMessageTemType = params => {
    return request.get(`${host}/web/message/message_template_types`, params)
}

export const APIModifyCampaignContent = params => {
    return request.post(`${host}/web/campaign/modify_campaign_content`, params)
}

export const APIGetCampaignContent = params => {
    return request.get(`${host}/web/campaign/get_campaign_content`, params)
}

export const APIGetProductList = params => {
    return request.postJson(`${host}/web/product/product_list`, params)
}

export const APIUploadProductCode = params => {
    return request.upload(`${host}/web/product/upload_product_code`, params)
}

export const APICreateProduct = params => {
    return request.postJson(`${host}/web/product/create_product`, params)
}

export const APIGetProductDetail = params => {
    return request.get(`${host}/web/product/product_detail`, params)
}

export const APIEditProduct = params => {
    return request.postJson(`${host}/web/product/edit_product`, params)
}

export const APIDownloadProductCode = params => {
    return `${host}/web/product/download_product_codes?id=${params}`
}

//template type
export const APIGetTemplateType = params => {
    return request.get(`${host}/web/message/message_template_types`, params)
}

export const APIDownloadShopifyOrder = params => {
    return `${host}/web/shopifyOrder/export?`
}

// upload approve  sample order
export const APIUploadBatchApprovalSample = params => {
    return request.upload(`${host}/web/sample/batch_approval_sample`, params)
}

// referral code list
export const APIGetReferralCode = params => {
    return request.post(`${host}/web/user/referral_code_list`, params)
}

// referral code generat
export const APIGeneratReferralCode = params => {
    return request.get(`${host}/web/user/generat_referral_code`, params)
}

// referral user list
export const APIGetUserReferralList = params => {
    return request.get(`${host}/web/user/user_referral_list`, params)
}

//kol persona
export const APIGetKolPersona = params => {
    return request.get(`${kolhost}/kol/info/search`, params)
}

//create module
export const APICreateTaskModule = params => {
    return request.post(`${host}/web/new_task/add_task_module`, params)
}

// module list
export const APIGetTaskModuleList = params => {
    return request.post(`${host}/web/new_task/task_module_list`, params)
}

// module list for select
export const APIGetTaskModule = params => {
    return request.get(`${host}/web/new_task/task_modules`, params)
}

// enable module
export const APIEnableModule = params => {
    return request.post(`${host}/web/new_task/enable_module`, params)
}

//disbale module
export const APIDisableModule = params => {
    return request.post(`${host}/web/new_task/disable_module`, params)
}

//add task module
export const APIAddTaskFlow = params => {
    return request.post(`${host}/web/new_task/add_task_flow`, params)
}

//edit task module
export const APIEditTaskFlow = params => {
    return request.postJson(`${host}/web/new_task/modify_task_flow`, params)
}

//new campaign detail
export const APICampaignDetailNew = params => {
    return request.post(`${host}/web/campaign/campaign_detail`, params)
}

//task retention
export const APIGetTaskRetention = params => {
    return request.get(`${host}/web/statistics/task_retention`, params)
}

//task flow delete
export const APIDeleteTaskFlow = params => {
    return request.post(`${host}/web/new_task/remove_task_flow`, params)
}

//task list new
export const APIGetTaskListNew = params => {
    return request.post(`${host}/web/new_task/task_list`, params)
}

//task detail new
export const APIGetTaskDetailNew = params => {
    return request.get(`${host}/web/new_task/task_detail`, params)
}

//task approved
export const APITaskApprovedNew = params => {
    return request.post(`${host}/web/new_task/approved`, params)
}

//task reject
export const APITaskRejectNew = params => {
    return request.post(`${host}/web/new_task/reject`, params)
}

//查看post 详情
export const APIShareMediaDetail = params => {
    return request.get(`${host}/web/task/share/media/detail`, params)
}

//post detail
export const APIPostTaskDetail = params => {
    return request.get(`${host}/web/message/post_tasks_detail`, params)
}

//translate
export const APITranslateCampaign = params => {
    return request.post(`${host}/web/campaign/translate_campaign`, params)
}

export const APIGetTikTokUserList = params => {
  return request.postJson(`${newHost}/admin/api/v1/user/list`, params)
}

export const APIDeleteByUid = params => {
  return request.get(`${newHost}/admin/api/v1/user/delete`, params)
}

export const APIGetEventList = params => {
  return request.post(`${newHost}/admin/api/v1/usageHistory/list`, params)
}
