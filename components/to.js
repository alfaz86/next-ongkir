import React, { useState } from "react";

export default function From({ onClick, toAddress }) {
    const [datas, setDatas] = useState([])
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [showNoResult, setShowNoResult] = useState("masukan minimal 3 karakter");

    const handleSubmit = async (event) => {
        event.preventDefault()

        const q = event.target.value
        onClick(q)

        if (q.length < 3) {
            setShowSearchResult(false)
            return false
        }

        setShowNoResult("mencari...")
        await new Promise(resolve => {
            setTimeout(resolve, 1000)
        });

        setShowSearchResult(true)

        const response = await fetch(`/api/address/search?q=${q}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const result = await response.json()

        if (result.data.length == 0) {
            setDatas([])
            setShowNoResult("data tidak ditemukan")
            return false
        }
        setDatas(result.data)
    }

    const handleClick = (input) => {
        onClick(input)
        document.getElementById("search-to").value = `${input.subdistrict_name} - ${input.city_name}`
        setShowSearchResult(false)
    }

    const list = datas.length == 0 ?
        <div>{showNoResult}</div>
        : datas.map((v) => (
            <div className="w-full h-full cursor-pointer hover:bg-gray-100 p-1"
                key={v.id}
                onClick={() => {
                    handleClick(v)
                }}
            >{v.subdistrict_name} - {v.city_name}</div>
        ))

    return (
        <>
            <div className="m-3 flex-initial w-6/12 xl:w-96">
                <h3 className="text-md font-semibold">
                    ALAMAT TUJUAN
                </h3>
                <input
                    type="search"
                    className="
                        form-control
                        block
                        w-full
                        px-5
                        py-2.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                    "
                    id="search-to"
                    placeholder="masukan minimal 3 karakter"
                    autoComplete="off"
                    onInput={(e) => handleSubmit(e)}
                    onClick={(e) => {
                        if (e.target.value.length < 3 && toAddress == '') {
                            setShowNoResult("masukan minimal 3 karakter")
                            setDatas([])
                        }
                    }}
                />
                {showSearchResult && (
                    <div className="w-full p-3 bg-white border border-gray-200 shadow-md mb-3 overflow-auto max-h-40">
                        {list}
                    </div>
                )}
            </div>
        </>
    )
}