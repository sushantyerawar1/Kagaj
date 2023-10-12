import react, { useEffect } from "react"
import Header from "../../Header/Header";

import { useNavigate } from 'react-router-dom';
import Footer from "../../Footer/footer";
import Home from "./home";

import {
    Stack,
    Select
} from '@chakra-ui/react'

const Homepage = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const user = userInfo ? userInfo.User : null
    const path = window.location.pathname;

    useEffect(() => {
        if (!user) navigate('/login')
    }, [user])

    return (
        <>
            <Header />
            <Home />
            <Footer />
        </>
    )
}

export default Homepage;