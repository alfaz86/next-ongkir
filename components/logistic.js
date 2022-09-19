import React, { useState } from "react";
import Link from 'next/link';

export default function Navbar() {
    const courierCode = 'jne,pos,tiki,rpx,pandu,wahana,sicepat,jnt,pahala,sap,jet,indah,dse,slis,first,ncs,star,ninja,lion,idl,rex,ide,sentral'
    
    const listSelect = courierCode.split(',').map((value) => 
        <option key={value} value={value}>{value.toUpperCase()}</option>
    );
    
    return (
        <>
            <option value="DEFAULT" disabled> - PILIH - </option>
            {listSelect }
        </>
    );
}