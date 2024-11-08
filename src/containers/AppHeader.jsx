/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown, Layout, Avatar, Badge, Select, Progress, Tooltip } from 'antd'
import { EditOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'
import { AreaContext } from './DefaultLayout'
import { setArea, setAreaList } from '../actions/areaActions'
import { APIgetUserInfo, APIgetSysConfig } from '@/mapi'
import HeaderC from '@/components/HeaderC'
import Cookies from 'js-cookie'

const { Header } = Layout
const { Option } = Select

// const HeaderC = props => {
//     const userInfo = Cookies.get('crm_user_info') ? JSON.parse(Cookies.get('crm_user_info')) : {}
//     let nickName = decodeURIComponent(userInfo.c_nk)
//     console.log('nickName', nickName)
//     let resNick = nickName.split('')[0]
//     console.log('resNick', resNick)

//     return (
//         <div
//             style={{
//                 borderRadius: '50%',
//                 backgroundColor: '#1890ff',
//                 color: '#fff',
//                 overflow: 'hidden',
//                 width: '25px',
//                 height: '25px',
//                 lineHeight: '25px',
//                 textAlign: 'center',
//                 fontSize: '12px',
//                 fontWeight: 'lighter',
//                 cursor: 'pointer'
//             }}>
//             {resNick}
//         </div>
//     )
// }

const AppHeader = props => {
    let { menuClick, avatar, menuToggle, loginOut, gotoModifyPwd, gotoRuleConfig } = props

    const areactx = useContext(AreaContext)

    const userInfo = Cookies.get('crm_user_info') ? JSON.parse(Cookies.get('crm_user_info')) : {}

    console.log('userInfo....', userInfo)
    console.log('yyy', decodeURI(userInfo.c_nk))

    const menuOnClick = ({ key }) => {
        console.log('key', key)
        switch (key) {
            case '1':
                gotoModifyPwd()
                break
            case '2':
                loginOut()
                break
            default:
                console.log('1')
        }
    }
    const permission = JSON.parse(localStorage.getItem('u')) ? JSON.parse(localStorage.getItem('u')).permission : {}

    const menu = (
        <Menu onClick={menuOnClick}>
            <Menu.Item key='1'>
                <EditOutlined /> Change password
            </Menu.Item>
            <Menu.Item key='2'>
                <LogoutOutlined /> Log out
            </Menu.Item>
        </Menu>
    )

    // const [userInfo, setUserInfo] = useState({})

    useEffect(() => {}, [])

    return (
        <Header className='header'>
            <div className='left'>
                {menuToggle ? <MenuUnfoldOutlined onClick={menuClick} /> : <MenuFoldOutlined onClick={menuClick} />}
                {/* <img src={require('@/imgs/a_logo.png')} style={{height:'30px'}} /> */}
            </div>
            <div className='right'>
                {/* <div className='mr15 flex' style={{ height: '64px',fontWeight:'bold',cursor:'pointer' }} onClick={loginOut}>
                    

                    <div>
                        <LogoutOutlined />
                    </div>
                    <div className='info'>
                        <div className='user'>Log out</div>
                    </div>
                </div>
                <div className='mr15 flex' style={{ height: '64px',fontWeight:'bold',cursor:'pointer' }} onClick={loginOut}>
                    

                    <div>
                        <LogoutOutlined />
                    </div>
                    <div className='info'>
                        <div className='user'>Change Password</div>
                    </div>
                </div> */}
                <div>
                    <Dropdown overlay={menu} overlayStyle={{ width: '20rem' }} trigger={['click']}>
                        <div className='ant-dropdown-link'>
                            {/* <SettingOutlined style={{ fontSize: '20px', cursor: 'pointer' }} rotate='30' /> */}
                            <HeaderC />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}

AppHeader.propTypes = {
    menuClick: PropTypes.func,
    avatar: PropTypes.string,
    menuToggle: PropTypes.bool,
    loginOut: PropTypes.func
}

export default AppHeader
