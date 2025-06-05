import AsyncLoadable from '@/utils/AsyncLoadable'
import { post } from 'jquery'
import Message from '../views/Messages'
import Permission from '../views/Permissions'

// 首页
const Index = AsyncLoadable(() => import(/* webpackChunkName: 'index' */ '@/views/Index'))
const TiktokUser = AsyncLoadable(() => import(/* webpackChunkName: 'index' */ '@/views/TiktokUserList'))
const TiktokUserEvent = AsyncLoadable(() => import(/* webpackChunkName: 'index' */ '@/views/EventList'))
const TiktokProductCollect = AsyncLoadable(() => import('@/views/ProductsCollection'))

//修改密码
const ModifyPwd = AsyncLoadable(() => import('@/views/ModifyPwd'))

//获取所有账号
const Account = AsyncLoadable(() => import('@/views/Account'))

//邀请码
const Invitecode = AsyncLoadable(() => import('@/views/Invitecode'))

const Campaigns = AsyncLoadable(() => import('@/views/Campaigns'))

const CreateCampaign = AsyncLoadable(() => import('@/views/AddCampaign'))

const Tasks = AsyncLoadable(() => import('@/views/Tasks'))

const TaskDetail = AsyncLoadable(() => import('@/views/TaskDetail'))

const Messages = AsyncLoadable(() => import('@/views/Messages'))

const MessageDetail = AsyncLoadable(() => import('@/views/MessageDetail'))

const Payout = AsyncLoadable(() => import('@/views/Payout'))

const Merchant = AsyncLoadable(() => import('@/views/Merchant'))

const MerchantDetail = AsyncLoadable(() => import('@/views/MerchantDetail'))

const EmailTem = AsyncLoadable(() => import('@/views/EmailTem'))

const EmailTemDetail = AsyncLoadable(() => import('@/views/EmailTemDetail'))

const CodeCommission = AsyncLoadable(() => import('@/views/CodeCommission'))

const Post = AsyncLoadable(() => import('@/views/PostList'))

const CreatePost = AsyncLoadable(() => import('@/views/CreatePost'))

const UserDetail = AsyncLoadable(() => import('@/views/UserDetail'))

const Sku = AsyncLoadable(() => import('@/views/Sku'))

const Permissions = AsyncLoadable(() => import('@/views/Permissions'))

const Role = AsyncLoadable(() => import('@/views/Role'))

const AddRole = AsyncLoadable(() => import('@/views/AddRole'))

const SystemUser = AsyncLoadable(() => import('@/views/SystemUser'))

const AddSystemUser = AsyncLoadable(() => import('@/views/AddSystemUser'))

const SampleApplication = AsyncLoadable(() => import('@/views/SampleApplication'))

const SampleDetail = AsyncLoadable(() => import('@/views/SampleDetail'))

const Statistic = AsyncLoadable(() => import('@/views/Statistic'))

const AddUser = AsyncLoadable(() => import('@/views/AddUser'))

const SampleApplicationReview = AsyncLoadable(() => import('@/views/SampleApplicationReview'))

const Promotions = AsyncLoadable(() => import('@/views/Promotions'))

const PromotionDetail = AsyncLoadable(() => import('@/views/PromotionDetail'))

const OrderList = AsyncLoadable(() => import('@/views/OrderList'))

const SampleList = AsyncLoadable(() => import('@/views/SampleList'))

const CreateProduct = AsyncLoadable(() => import('@/views/CreateProduct'))

const BrandingCommission = AsyncLoadable(() => import('@/views/BrandingCommission'))

const ReferralCode = AsyncLoadable(() => import('@/views/ReferralCode'))

const ReferralUser = AsyncLoadable(() => import('@/views/ReferralUser'))

const KolPersona = AsyncLoadable(() => import('@/views/KolPersona'))

const CreateCampaignNew = AsyncLoadable(() => import('@/views/CreateCampaignNew'))

const TaskModule = AsyncLoadable(() => import('@/views/TaskModule'))

const TasksNew = AsyncLoadable(() => import('@/views/TasksNew'))

const TaskDetailNew = AsyncLoadable(() => import('@/views/TaskDetailNew'))

const routes = [
    {
        path: '/index',
        exact: true,
        name: 'Index',
        component: Index,
        auth: [1]
    },
    {
        path: '/tiktok/userList',
        exact: false,
        name: 'Tiktok',
        component: TiktokUser,
        auth: [0]
    },
    {
        path: '/tiktok/event',
        exact: false,
        name: 'Tiktok',
        component: TiktokUserEvent,
        auth: [0]
    },
    {
        path: '/tiktok/product',
        exact: false,
        name: 'Tiktok',
        component: TiktokProductCollect,
        auth: [0]
    },

    {
        path: '/statistic',
        exact: true,
        component: Statistic,
        auth: [1]
    },
    {
        path: '/account/account',
        exact: false,
        component: Account,
        auth: [1]
    },
    {
        path: '/account/invitecode',
        exact: false,
        component: Invitecode,
        auth: [1]
    },
    {
        path: '/account/referral_code',
        exact: false,
        component: ReferralCode,
        auth: [1]
    },
    {
        path: '/campaigns_ma/campaigns',
        exact: false,
        component: Campaigns,
        auth: [1]
    },
    {
        path: '/createCampaign/:id',
        exact: false,
        component: CreateCampaign,
        auth: [1]
    },

    {
        path: '/tasks_ma/tasks',
        exact: false,
        component: Tasks,
        auth: [1]
    },
    {
        path: '/taskDetail/:id',
        exact: false,
        component: TaskDetail,
        auth: [1]
    },
    {
        path: '/messages',
        exact: false,
        component: Messages,
        auth: [1]
    },
    {
        path: '/messageDetail/:id',
        exact: false,
        component: MessageDetail,
        auth: [1]
    },
    {
        path: '/payManagement/payments',
        exact: false,
        component: Payout,
        auth: [1]
    },
    {
        path: '/campaigns_ma/merchant',
        exact: false,
        component: Merchant,
        auth: [1]
    },
    {
        path: '/merchantDetail',
        exact: false,
        component: MerchantDetail,
        auth: [1]
    },
    {
        path: '/campaigns_ma/email_tem',
        exact: false,
        component: EmailTem,
        auth: [1]
    },
    {
        path: '/email_tem_detail/:id',
        exact: false,
        component: EmailTemDetail,
        auth: [1]
    },
    {
        path: '/payManagement/codeCommission',
        exact: false,
        component: CodeCommission,
        auth: [1]
    },
    {
        path: '/postManagement/postList',
        exact: false,
        component: Post,
        auth: [1]
    },
    {
        path: '/postManagement/create_post/:id',
        exact: false,
        component: CreatePost,
        auth: [1]
    },
    {
        path: '/userDetail/:id',
        exact: false,
        component: UserDetail,
        auth: [1]
    },
    {
        path: '/sku',
        exact: false,
        component: Sku,
        auth: [1]
    },
    {
        path: '/permissions/permissions',
        exact: false,
        component: Permissions,
        auth: [1]
    },
    {
        path: '/permissions/role',
        exact: false,
        component: Role,
        auth: [1]
    },
    {
        path: '/permissions/user',
        exact: false,
        component: Role,
        auth: [1]
    },
    {
        path: '/permissions/addRole/:id',
        exact: false,
        component: AddRole,
        auth: [1]
    },
    {
        path: '/permissions/system_user',
        exact: false,
        component: SystemUser,
        auth: [1]
    },
    {
        path: '/permissions/add_system_user/:id',
        exact: false,
        component: AddSystemUser,
        auth: [1]
    },
    {
        path: '/tasks_ma/sample_application',
        exact: false,
        component: SampleApplication,
        auth: [1]
    },
    {
        path: '/sample_detail/:id',
        exact: false,
        component: SampleDetail,
        auth: [1]
    },
    {
        path: '/modify_pwd',
        exact: false,
        component: ModifyPwd,
        auth: [1]
    },
    {
        path: '/add_user',
        exact: false,
        component: AddUser,
        auth: [1]
    },
    {
        path: '/mobile_app_management/promotions',
        exact: false,
        component: Promotions,
        auth: [1]
    },
    {
        path: '/mobile_app_management/promotion_detail/:id',
        exact: false,
        component: PromotionDetail,
        auth: [1]
    },
    {
        path: '/order_management/order_list',
        exact: false,
        component: OrderList,
        auth: [1]
    },
    {
        path: '/order_management/sample_list',
        exact: false,
        component: SampleList,
        auth: [1]
    },
    {
        path: '/order_management/create_product/:id',
        exact: false,
        component: CreateProduct,
        auth: [1]
    },
    {
        path: '/payManagement/branding_commission',
        exact: false,
        component: BrandingCommission,
        auth: [1]
    },
    {
        path: '/account/referral_user',
        exact: false,
        component: ReferralUser,
        auth: [1]
    },
    {
        path: '/kol_persona',
        exact: false,
        component: KolPersona,
        auth: [1]
    },
    // {
    //     path: '/sample_application_review',
    //     exact: false,
    //     component: SampleApplicationReview,
    //     auth: [1]
    // }
    {
        path: '/createCampaignNew/:id',
        exact: false,
        component: CreateCampaignNew,
        auth: [1]
    },
    {
        path: '/tasks_ma/task_module',
        exact: false,
        component: TaskModule,
        auth: [1]
    },
    {
        path: '/tasks_ma/tasks_new',
        exact: false,
        component: TasksNew,
        auth: [1]
    },
    {
        path: '/task_detail_new/:id',
        exact: false,
        component: TaskDetailNew,
        auth: [1]
    }
]

export default routes
