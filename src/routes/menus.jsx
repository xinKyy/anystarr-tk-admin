import React from 'react'
import {
    HomeOutlined,
    AppstoreOutlined,
    CompassOutlined,
    FormOutlined,
    PieChartOutlined,
    PaperClipOutlined,
    BarsOutlined,
    UserOutlined,
    FundViewOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'

const menus = [
    {
        key: '/index',
        title: 'Home',
        icon: <HomeOutlined />,
        au: 'super'
    },
    {
        key: '/tiktok',
        title: 'Tiktok',
        icon: <HomeOutlined />,
        subs: [
            { title: 'User management', key: '/tiktok/userList', icon: <UserOutlined /> },
            { title: 'Event management', key: '/tiktok/event', icon: <AppstoreOutlined /> },
            { title: 'Product Collection', key: '/tiktok/product', icon: <ShoppingCartOutlined /> }
        ]
    },
    {
        key: '/statistic',
        title: 'Statistic',
        icon: <FundViewOutlined />,
        au: 'super'
    },
    {
        key: '/account',
        title: 'User management',
        icon: <UserOutlined />,
        subs: [
            { key: '/account/invitecode', title: 'Invitation Code' },
            { key: '/account/account', title: 'User list' },
            { key: '/account/referral_code', title: 'Referral Code ' }
        ]
    },
    {
        key: '/campaigns_ma',
        title: 'Campaign management',
        icon: <CompassOutlined />,
        au: 'super',
        subs: [
            { key: '/campaigns_ma/campaigns', title: 'Campaign management', icon: <FundViewOutlined />, au: 'super' },
            { key: '/campaigns_ma/merchant', title: 'Merchant management', icon: <FundViewOutlined />, au: 'super' },
            {
                key: '/campaigns_ma/email_tem',
                title: 'Email Template management',
                icon: <FundViewOutlined />,
                au: 'super'
            }
        ]
    },
    {
        key: '/tasks_ma',
        title: 'Task management',
        icon: <AppstoreOutlined />,
        // au: 'super',
        subs: [
            { title: 'Task management', key: '/tasks_ma/tasks', icon: <CompassOutlined /> },
            {
                title: 'Sample application management',
                key: '/tasks_ma/sample_application',
                icon: <CompassOutlined />
                // au: 'super'
            },
            {
                title: 'Task module',
                key: '/tasks_ma/task_module',
                icon: <CompassOutlined />,
                au: 'super'
            }
        ]
    },
    {
        key: '/messages',
        title: 'Ticket management',
        icon: <UserOutlined />
    },

    {
        title: 'Payout management',
        key: '/payManagement',
        icon: <UserOutlined />,
        au: 'super',
        subs: [
            { title: 'Payments', key: '/payManagement/payments', au: 'super' },
            { title: 'Code commission', key: '/payManagement/codeCommission', au: 'super' },
            { title: 'Branding commission', key: '/payManagement/branding_commission', au: 'super' }
        ]
    },
    {
        title: 'Post management',
        key: '/postManagement',
        icon: <CompassOutlined />,
        au: 'super',
        subs: [
            { title: 'Post List', key: '/postManagement/postList', au: 'super' }
            // { title: 'Edit Post', key: '/postManagement/editPost' }
        ]
    },
    {
        title: 'SKU management',
        key: '/sku',
        icon: <CompassOutlined />,
        au: 'super'
    },
    {
        title: 'Permissions management',
        key: '/permissions',
        icon: <FundViewOutlined />,
        au: 'super',
        subs: [
            { title: 'Users List', key: '/permissions/system_user', au: 'super' },
            { title: 'Roles List', key: '/permissions/role', au: 'super' },
            { title: 'Permissions List', key: '/permissions/permissions', au: 'super' }
        ]
    },
    {
        title: 'Mobile App managemet',
        key: '/mobile_app_management',
        icon: <CompassOutlined />,
        au: 'super',
        subs: [{ title: 'Promotion activity', key: '/mobile_app_management/promotions', au: 'super' }]
    },
    {
        title: 'Order management',
        key: '/order_management',
        icon: <FundViewOutlined />,
        au: 'super',
        subs: [
            { title: 'abComo Order List', key: '/order_management/order_list', au: 'super' },
            { title: 'abComo Sample List', key: '/order_management/sample_list', au: 'super' }
        ]
    },
    {
        title: 'Kol Persona',
        key: '/kol_persona',
        icon: <CompassOutlined />,
        au: 'super'
    }

    // {
    //     title: 'Sample application review',
    //     key: '/sample_application_review',
    //     icon: <FundViewOutlined/>,
    //     au: 'super'
    // }
]

export default menus
