import React, { useState } from "react";
import Container from "@/components/layout/container";

import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    return (
        <Container className="h-vh-main flex flex-col  pt-8">
            <div className="container-lg bg-white">
                <div className="flex flex-col items-center justify-center p-4">
                    <img
                        className="w-40"
                        src="https://itviec.com/assets/robby/robby-subscription-65907a5d2a274578c6f959a5458bc84281c07cc97831d62609a719dee7cab69f.svg"
                        alt="img"
                    />
                    <div className="text-center">
                        <h1 className="mb-4 mt-5 text-3xl font-extrabold">
                            Verify your email address
                        </h1>
                        <div className="text-rich-grey paragraph mb-2">
                            We've sent a verification email to{" "}
                            <span className="font-bold">{email}</span> <br />
                            If you don't see any email, please look at Spam or
                            Junk folder.
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default VerifyEmail;
