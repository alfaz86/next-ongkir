import Head from 'next/head'
import React, { useState } from "react";
import Navbar from '../components/navbar';
import FromAddress from '../components/from';
import ToAddress from '../components/to';
import Logistic from '../components/logistic';
import { useRouter } from 'next/router';

export default function Home(props) {
    const [fromAddress, setFromAddress] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [weight, setWeight] = useState('')
    const [logistic, setLogistic] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [displayTable, setDisplayTable] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const router = useRouter();

    const refreshData = () => {
        console.log("refresh");
        router.replace(router.asPath);
    };

    const setDataFromAddress = (input) => {
        setFromAddress(input)
    }

    const setDataToAddress = (input) => {
        setToAddress(input)
    }

    const setDataWeight = (input) => {
        setWeight(input)
    }

    const setDataLogistic = (input) => {
        setLogistic(input)
    }

    const resultTable = props.display.detail.length == 0 ? 
        <tr key="0" className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td colSpan="4" scope="col" className="py-3 px-6 text-center">tidak ada data.</td>
        </tr>
        : props.display.detail.map( value => 
            <tr key={value.service} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td scope="col" className="py-3 px-6">
                    <p> { value.service } </p>
                    <p> { value.description } </p>
                </td>
                <td scope="col" className="py-3 px-6">Rp { value.cost[0].value }</td>
                <td scope="col" className="py-3 px-6">
                    <p>Estimasi : {value.cost[0].etd == '' ? '3-6' : value.cost[0].etd.replace(/[^0-9-]/g, "") } Hari </p>
                    <p>Note : { value.cost[0].note == '' ? '-' : value.cost[0].note } </p>
                </td>
            </tr>
        )

    const resetVar = async () => {
        setFromAddress('')
        document.getElementById("search-from").value = ''
        setToAddress('')
        document.getElementById("search-to").value = ''
        setWeight('')
        document.getElementById("weight").value = ''
        setLogistic('')
        document.getElementById("logistic").value = 'DEFAULT'

        const data = {
            name: null,
            detail: [],
        }

        const putData = await fetch(`http://localhost:3000/api/display/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const putDataResult = await putData.json()
        refreshData()
    }

    const checkInput = () => {
        if (fromAddress && toAddress && weight && logistic) {
            setDisplayTable(false)
            setIsLoading(true)
            calculateCost()
            return false
        }
        console.log({
            fromAddress,
            toAddress,
            weight,
            logistic
        });
        setShowModal(true)
    }

    const calculateCost = async () => {
        const data = {
            origin: fromAddress.id,
            originType: 'subdistrict',
            destination: toAddress.id,
            destinationType: 'subdistrict',
            weight,
            courier: logistic
        }

        const response = await fetch('http://localhost:3000/api/cost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        const result = await response.json()

        if (result.data) {
            const data = {
                name: result.data.rajaongkir.results[0].name ?? null,
                detail: result.data.rajaongkir.results[0].costs,
            }

            const putData = await fetch(`http://localhost:3000/api/display/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const putDataResult = await putData.json()
            refreshData()
        }

        setDisplayTable(true)
        setIsLoading(false)
    }

    return (
        <>
            <Head>
                <title>Next Ongkir</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <div className="container pt-20 px-4 mx-auto">

                <div className="w-full p-6 bg-white border border-gray-200 shadow-md">
                    <div className="flex justify-center ">
                        <FromAddress onClick={setDataFromAddress} fromAddress={fromAddress} />
                        
                        <ToAddress onClick={setDataToAddress} toAddress={toAddress} />
                    </div>
                    <div className="flex justify-center m-3">
                        <div className="mt-3 flex-initial w-4/12 xl:w-96">
                            <h3 className="text-md font-semibold text-center">
                                BERAT
                            </h3>
                            <div className="flex flex-wrap items-stretch w-full mb-4 relative">
                                <input
                                    type="number"
                                    className="
                                        flex-shrink flex-grow flex-auto leading-normal w-px border h-10 border-grey-light rounded rounded-r-none relative
                                        px-5
                                        py-2.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                                    "
                                    id="weight"
                                    placeholder="0"
                                    autoComplete="off"
                                    onInput={(e) => {
                                        if (e.target.value < 0) {
                                            e.target.value = 0
                                        } else {
                                            setDataWeight(Number(e.target.value))
                                        }
                                    }}
                                />
                                    <div className="flex -mr-px">
                                        <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-l-none border border-l-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">Gram</span>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center m-3">
                        <div className="flex-initial w-4/12 xl:w-96">
                            <h3 className="text-md font-semibold text-center">
                                KURIR
                            </h3>
                            <div className="flex justify-center">
                                <div className="mb-3 w-full xl:w-96">
                                    <select className="form-select appearance-none
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding bg-no-repeat
                                        border border-solid border-gray-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        defaultValue={'DEFAULT'}
                                        id="logistic"
                                        onChange={e => setDataLogistic(e.target.value)}>
                                            <Logistic />
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center m-3">
                        <h3 className="text-md font-semibold">
                            <button
                                className="text-white bg-gray-500 rounded-md text-sm px-6 py-2.5 dark:bg-gray-500 dark:hover:bg-gray-600 mr-5"
                                type="button"
                                onClick={() => resetVar()}
                            >
                                RESET
                            </button>
                        </h3>
                        <h3 className="text-md font-semibold">
                            <button
                                className="text-white bg-green-500 rounded-md text-sm px-6 py-2.5 dark:bg-green-500 dark:hover:bg-green-600"
                                type="button"
                                onClick={() => checkInput()}
                            >
                                SEARCH
                            </button>
                        </h3>
                    </div>
                </div>

                <div className="w-full p-6 bg-white border border-gray-200 shadow-md mt-8">
                    <div className="flex justify-center ">
                        { displayTable && (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th colSpan="3" scope="col" className="py-3 px-6 text-center">
                                            { props.display.name ?? "KURIR" }
                                        </th>
                                    </tr>
                                </thead>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-t border-b border-slate-500">
                                    <tr>
                                        <th scope="col" className="w-4/12 py-3 px-6 text-center">
                                            SERVICE
                                        </th>
                                        <th scope="col" className="w-4/12 py-3 px-6 text-center">
                                            COST
                                        </th>
                                        <th scope="col" className="w-4/12 py-3 px-6 text-center">
                                            DESCRIPTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { resultTable }
                                </tbody>
                            </table>
                        ) }

                        { isLoading && (
                            <>
                                <div className="text-black font-bold px-4 py-2">
                                    <svg viewBox="-25 -25 100 100" preserveAspectRatio="none meet">
                                        <circle fill="#000" stroke="none" cx="6" cy="25" r="6">
                                            <animateTransform
                                                attributeName="transform"
                                                dur="1s"
                                                type="translate"
                                                values="0 15 ; 0 -15; 0 15"
                                                repeatCount="indefinite"
                                                begin="0.1" />
                                            <animate
                                                attributeName="opacity"
                                                dur="1s"
                                                values="0;1;0"
                                                repeatCount="indefinite"
                                                begin="0.1" />
                                        </circle>
                                        <circle fill="#000" stroke="none" cx="30" cy="25" r="6">
                                            <animateTransform
                                                attributeName="transform"
                                                dur="1s"
                                                type="translate"
                                                values="0 10 ; 0 -10; 0 10"
                                                repeatCount="indefinite"
                                                begin="0.2" />
                                            <animate
                                                attributeName="opacity"
                                                dur="1s"
                                                values="0;1;0"
                                                repeatCount="indefinite"
                                                begin="0.2" />
                                        </circle>
                                        <circle fill="#000" stroke="none" cx="54" cy="25" r="6">
                                            <animateTransform
                                                attributeName="transform"
                                                dur="1s"
                                                type="translate"
                                                values="0 5 ; 0 -5; 0 5"
                                                repeatCount="indefinite"
                                                begin="0.3" />
                                            <animate
                                                attributeName="opacity"
                                                dur="1s"
                                                values="0;1;0"
                                                repeatCount="indefinite"
                                                begin="0.3" />
                                        </circle>
                                    </svg>
                                </div>
                            </>
                        ) }
                    </div>
                </div>
            </div>

            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-6/12 my-6 mx-auto max-w-3xl">
                                <div className="relative p-6 flex-auto space-y-6">
                                    <div role="alert">
                                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                            Alert
                                        </div>
                                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                            <p>{fromAddress == '' && "Alamat asal belum diisi!"}</p>
                                            <p>{toAddress == '' && "Alamat tujuan belum diisi!"}</p>
                                            <p>{weight == '' && "Berat belum diisi!"}</p>
                                            <p>{logistic == '' && "Logistik belum dipilih!"}</p>
                                            <div className="flex items-center justify-end rounded-b">
                                                <button
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:3000/api/display`)
    const data = await res.json()

    const display = {
        name: data.data.name,
        detail: JSON.parse(data.data.detail) 
    }

    return {
        props: { display }
    }
}
