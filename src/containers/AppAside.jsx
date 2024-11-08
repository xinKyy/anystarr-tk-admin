import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import SideMenu from '@/components/SideMenu'
import Cookies from 'js-cookie'

const { Sider } = Layout

const userInfo = Cookies.get('crm_user_info')? JSON.parse(Cookies.get('crm_user_info')):{}  

const AppAside = props => {
    let { menuToggle, menu } = props
    return (
        <Sider className='aside' trigger={null} collapsible collapsed={menuToggle} width={225}>
            <div className='logo' style={{ marginBottom:'20px',marginTop:'32px' }}>
                <a rel='noopener noreferrer' href='/'>
                    <img src={require('@/imgs/logo.png')}  style={{ maxWidth:'60px' }}/>
                    <div className='user' style={{ color:'#fff',marginTop:'4px' }} >{userInfo.c_nk ? decodeURI(userInfo.c_nk):'' }</div>
                    
                    {/* <GithubOutlined type='github' style={{ fontSize: '3.8rem', color: '#fff' }} /> */}
                </a>
            </div>
            <SideMenu menu={menu} collapsed={menuToggle}></SideMenu>
        </Sider>
    )
}

AppAside.propTypes = {
    menuToggle: PropTypes.bool,
    menu: PropTypes.array.isRequired
}

export default AppAside
