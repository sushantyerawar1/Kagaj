import react, { useState, useEffect } from "react"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Footer from "../Footer/footer";
import Header from "../Header/Header";
import { Country, State, City } from 'country-state-city';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    useColorModeValue,
    Select
} from '@chakra-ui/react'

const SignUp = () => {


    const [show, setShow] = useState(false);
    const toast = useToast();
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [isadmin, setIsAdmin] = useState(false);
    const [pic, setPic] = useState();
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [Allcities, setAllcities] = useState([]);
    const [picLoading, setPicLoading] = useState(false);
    const countryCode = "IN";
    const AllState = State.getStatesOfCountry(countryCode);
    const navigate = useNavigate();


    const userInfo = JSON.parse(localStorage.getItem('userInfo'));


    useEffect(() => {
        if (userInfo) navigate('/')
    }, [userInfo])


    const SetStateAndCity = (e) => {
        const stateCode = e.target.value;
        const AllCity = City.getCitiesOfState(countryCode, stateCode);
        const nameState = State.getStateByCodeAndCountry(stateCode, countryCode);
        setCity(null);
        setState(nameState.name);
        setAllcities(AllCity);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !state || !city) {
            toast({
                title: "Please Fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    "firstName": firstName,
                    "lastName": lastName,
                    "state": state,
                    "city": city,
                    "emailId": email,
                    "password": password,
                    "isAdmin": isadmin,
                    "profilePicture": pic
                },
                config
            );

            toast({
                title: "Account Created Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setTimeout(() => { navigate("/") }, 500);

        } catch (error) {

            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        }
    };


    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dojtv6qwl");

            fetch("https://api.cloudinary.com/v1_1/dojtv6qwl/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    // console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };

    return (
        <>
            <Header />
            <Flex
                // width="100%"
                minH={'80vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width="100%">
                    <Stack align={'center'}>
                        <Heading fontSize={'5xl'}>Create an Account </Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        // boxShadow={'lg'}
                        border="1px solid"
                        boxShadow="5px 10px 18px #888888"
                        p={8}>
                        <Stack spacing={4}>

                            <FormControl id="firstName" isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type="text"
                                    value={firstName}
                                    placeholder="Enter First Name"
                                    onChange={(e) => { setFirstName(e.target.value) }} />
                            </FormControl>

                            <FormControl id="lastName" isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type="text"
                                    value={lastName}
                                    placeholder="Enter Last Name"
                                    onChange={(e) => { setLastName(e.target.value) }} />
                            </FormControl>

                            <FormControl id="state" isRequired>
                                <FormLabel>State</FormLabel>
                                <Select placeholder='Select State' onChange={(e) => SetStateAndCity(e)} >
                                    {
                                        AllState.map((value, index) => (
                                            <option value={value.isoCode} > {value.name}</option>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <FormControl id="city" isRequired>
                                <FormLabel>City</FormLabel>
                                <Select placeholder='Select City' onChange={(e) => { setCity(e.target.value) }} value={city} disabled={state ? false : true} >
                                    {
                                        Allcities.map((value, index) => (
                                            <option value={value.name} > {value.name}</option>
                                        ))
                                    }
                                </Select>

                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    placeholder="Enter email"
                                    onChange={(e) => { setEmail(e.target.value) }} />
                            </FormControl>

                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup size="md">
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={show ? "text" : "password"}
                                        placeholder="Enter password"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                                            {show ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl id="pic" >
                                <FormLabel>Upload your Picture</FormLabel>
                                <Input
                                    type="file"
                                    p={1.5}
                                    accept="image/*"
                                    onChange={(e) => postDetails(e.target.files[0])}
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                {/* <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                            </Stack> */}
                                <Button
                                    onClick={submitHandler}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Create Account
                                </Button>
                                <Stack pt={4}>

                                    <Text align={'center'}>
                                        Already have an account?
                                        <Link href="/login" color={'blue.400'}> Login</Link>
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack >
            </Flex >
            <Footer />
        </>
    )
};

export default SignUp;