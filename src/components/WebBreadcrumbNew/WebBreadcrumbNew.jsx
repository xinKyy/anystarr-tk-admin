import React, { Component, useEffect, useState } from 'react'
import { Table, Button, Modal, Checkbox } from 'antd'
import WebBreadcrumb from '../WebBreadcrumb'
import Aset from '@/imgs/aset1.png'

const WebBreadcrumbNew = ({ title }) => {
    return (
        <div className='web-bread-c'>
            <WebBreadcrumb arr={[title]} />
            <h3>{title}</h3>
            <img src={Aset} className='aset' alt='aset' />
        </div>
    )
}

export default WebBreadcrumbNew
