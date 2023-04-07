"use client";

import Image from "next/image";
import errorimg from "../../public/error.png"


export default function Error({error}:{error:Error}){
    return (
        <div className="h-screen bg-gray flex flex-col justify-center items-center">
            <Image className="w-56 mb-8" src={errorimg} alt="Image of an error" ></Image>
            <div className="bg-white px-9 py-14 shadow rounded">
                <h3 className="text-3xl font-bold">Unlucky</h3>
                <p className="text-reg font-bold">We could not find this restaurant</p>
                <p className="mt-6 text-sm font-light">Error Code: 404</p>
            </div>
        </div>
    )
}