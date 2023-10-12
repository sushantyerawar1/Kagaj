import react, { useEffect } from "react"
import Header from "../../Header/Header";
import Footer from "../../Footer/footer";
import Issue from "./Issue";
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    Image
} from '@chakra-ui/react'

const IssuePage = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const user = userInfo ? userInfo.User : null
    const path = window.location.pathname;
    const email = user?.emailId;
    const isAdmin = user?.isAdmin;
    const navigate = useNavigate();


    useEffect(() => {
        if (isAdmin) navigate('/')
    })

    return (
        <div style={{ width: "100%" }}>
            <Header />
            <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                <Issue />
            </Box>
            <Footer />
        </div>
    )
};

export default IssuePage;