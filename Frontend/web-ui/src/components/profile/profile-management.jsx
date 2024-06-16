import * as React from "react";
import Container from "@/components/layout/container";
import { useState } from "react";

import ProfileNavbar from "./profile-navbar";
import ProfileProgressBar from "./profile-progress-bar";
import ProfileMain from "./profile-main";

const ProfileManagement = () => {
    return (
        <div className=" min-h-screen bg-gray-200">
            <ProfileNavbar />

            <Container className=" grid grid-cols-4 gap-6 pb-10 pt-4">
                {/* left box */}
                <ProfileProgressBar />
                {/* Right box */}
                <ProfileMain />
            </Container>
        </div>
    );
};

export default ProfileManagement;
