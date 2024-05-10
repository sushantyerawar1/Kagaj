import react, { useEffect, useState } from "react"
import axios from "axios";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    TableContainer,
    FormControl,
    FormLabel,
    Box,
    Stack,
    Select,
    Table,
    TableCaption,
    Thead,
    Tfoot,
    Th,
    Td,
    Tbody,
    Tr,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    Link,
    Text

} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/react";
import { ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';

const SearchByPlace = () => {


    const [option, setOption] = useState(0);
    const [total_requests, setTotal_Requests] = useState(false);
    const [search, setSearch] = useState("");
    const [total_done, setTotal_Done] = useState(false);
    const [total_reject, setTotal_Rejects] = useState(false);
    const [Issues, setIssues] = useState([]);
    const [pending, setPending] = useState([]);
    const [submitted, setSubmitted] = useState([]);
    const [rejected, setRejected] = useState([]);
    const [flag, setFlag] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const user = userInfo ? userInfo.User : null
    const path = window.location.pathname;
    const email = user?.emailId;
    const isAdmin = user?.isAdmin;
    const navigate = useNavigate();
    const toast = useToast();
    const [state, setState] = useState(null);
    const [statecity, setStatecity] = useState(null);
    const [city, setCity] = useState(null);
    const [Allcities, setAllcities] = useState([]);
    const countryCode = "IN";
    const AllState = State.getStatesOfCountry(countryCode);

    const SetStateAndCity = (e) => {
        const stateCode = e.target.value;
        const AllCity = City.getCitiesOfState(countryCode, stateCode);
        const nameState = State.getStateByCodeAndCountry(stateCode, countryCode);
        setCity(null);
        setState(nameState.name);
        setStatecity(null);
        setAllcities(AllCity);
    }

    const SetStateAndCitycity = (e) => {
        const stateCode = e.target.value;
        const AllCity = City.getCitiesOfState(countryCode, stateCode);
        const nameState = State.getStateByCodeAndCountry(stateCode, countryCode);
        setCity(null);
        setState(null)
        setStatecity(nameState.name);
        setAllcities(AllCity);
    }

    const SearchState = async () => {

        setOption(2);
        setTotal_Requests(false)
        setTotal_Rejects(false);
        setTotal_Done(false);


        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const Data = await axios.post(
                "http://localhost:5000/api/issue/getallbystate", {
                "state": state
            },
                config
            );

            if (Data) {
                setIssues(Data.data.Issue);
                setFlag(true);
                setPending([]);
                setSubmitted([]);
                setRejected([]);
            }
            else setIssues([])

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

    }
    const SearchCity = async () => {

        setOption(3);
        setTotal_Requests(false)
        setTotal_Rejects(false);
        setTotal_Done(false);
        console.log(city)

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const Data = await axios.post(
                "http://localhost:5000/api/issue/getallbycity", {
                "city": city
            },
                config
            );

            if (Data) {
                setIssues(Data.data.Issue);
                setFlag(true);
                setPending([]);
                setSubmitted([]);
                setRejected([]);
            }
            else setIssues([])

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

    }

    const SearchAll = async (e) => {

        e.preventDefault();
        setOption(1);
        setTotal_Requests(false)
        setTotal_Rejects(false);
        setTotal_Done(false);

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const Data = await axios.get(
                "http://localhost:5000/api/issue/getall",
                config
            );

            if (Data) {
                setIssues(Data.data.Issue);
                setFlag(true);
                setPending([]);
                setSubmitted([]);
                setRejected([]);
            }
            else setIssues([])

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

    }

    const Search_By_State = (e) => {
        setIssues([]);
        setFlag(true);
        setPending([]);
        setSubmitted([]);
        setRejected([]);
        setOption(2);
        setState();
        setCity();
    }

    const Search_By_City = (e) => {
        setIssues([]);
        setFlag(true);
        setPending([]);
        setSubmitted([]);
        setRejected([]);
        setOption(3);
        setState(null);
        setCity(null);
        setStatecity(null);
    }

    useEffect(() => {
        if (Issues && flag) {
            for (let i = 0; i < Issues.length; i++) {
                if (Issues[i].status == "pending") {
                    setPending(prevArray => [...prevArray, Issues[i]]);
                }
                else if (Issues[i].status == "Submitted") {
                    setSubmitted(prevArray => [...prevArray, Issues[i]]);
                }
                else if (Issues[i].status == "Rejected") {
                    setRejected(prevArray => [...prevArray, Issues[i]]);
                }
            }
            setFlag(false);
        }
    }, [Issues])

    useEffect(() => {
        if (state) {
            SearchState()
        }
    }, [state])


    useEffect(() => {
        if (city) {
            SearchCity()
        }
    }, [city])
    console.log(city)

    return (
        <Box
            padding={10}
            width="100%"
            maxH="90%"
            overflowY={"auto"}
        >

            <Box paddingBottom={2} textAlign="center">
                <Menu >
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="30%" >
                        Choose Option
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={(e) => SearchAll(e)}>All Issues</MenuItem>
                        <MenuItem onClick={(e) => Search_By_State(e)}>Search By State</MenuItem>
                        <MenuItem onClick={(e) => Search_By_City(e)}>Search By City</MenuItem>
                    </MenuList>
                </Menu>
            </Box>

            {
                option == 2 &&
                <FormControl id="state" isRequired>
                    {/* <FormLabel>State</FormLabel> */}
                    <Select placeholder='Select State' onChange={(e) => SetStateAndCity(e)} >
                        {
                            AllState.map((value, index) => (
                                <option value={value.isoCode} > {value.name}</option>
                            ))
                        }
                    </Select>
                </FormControl>
            }

            {
                option == 3 &&
                <>

                    <FormControl id="state" isRequired>
                        {/* <FormLabel>State</FormLabel> */}
                        <Select placeholder='Select State' onChange={(e) => SetStateAndCitycity(e)} >
                            {
                                AllState.map((value, index) => (
                                    <option value={value.isoCode} > {value.name}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl id="city" isRequired paddingTop={2}>
                        {/* <FormLabel>City</FormLabel> */}
                        <Select placeholder='Select City' onChange={(e) => { setCity(e.target.value) }} value={city} disabled={statecity ? false : true} >
                            {
                                Allcities.map((value, index) => (
                                    <option value={value.name} > {value.name}</option>
                                ))
                            }
                        </Select>

                    </FormControl>
                </>
            }

            {Issues.length ?
                <Stack spacing={3} paddingTop={3}>

                    <Button onClick={(e) => { setTotal_Requests(!total_requests) }} bg={total_requests ? "gray.300" : null}>Total Pending</Button>
                    {total_requests ?
                        <TableContainer>
                            <Table variant='simple'>

                                <Thead>
                                    <Tr>
                                        <Th>Index</Th>
                                        <Th>Email Id</Th>
                                        <Th>Name</Th>
                                        <Th>Document Requested</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>{
                                    pending.map((issue, index) => (
                                        (issue.status == "pending" ?
                                            <Tr>
                                                <Td>{index + 1}</Td>
                                                <Td>{issue.emailId}</Td>
                                                <Td>{issue.username}</Td>
                                                <Td>{issue.filename}</Td>
                                                <Td><Box backgroundColor={"yellow.200"} padding={2} borderRadius={4} w={"60%"}>Pending</Box></Td>
                                            </Tr> : null
                                        )
                                    ))
                                }

                                </Tbody>

                            </Table>
                        </TableContainer> : null
                    }



                    <Button onClick={(e) => { setTotal_Done(!total_done) }} bg={total_done ? "gray.300" : null} > Total Done</Button>
                    {total_done ?
                        <TableContainer>
                            <Table variant={'simple'}>

                                <Thead>
                                    <Tr>
                                        <Th>Index</Th>
                                        <Th>Email Id</Th>
                                        <Th>Name</Th>
                                        <Th>Document Requested</Th>
                                        <Th>Status</Th>

                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {submitted.map((issue, index) => (
                                        (issue.status == "Submitted" ?
                                            <Tr>
                                                <Td>{index + 1}</Td>
                                                <Td>{issue.emailId}</Td>
                                                <Td>{issue.username}</Td>
                                                <Td>
                                                    <Text as='u' color='blue'>
                                                        <Link href={issue.link} isExternal>
                                                            {issue.filename}
                                                        </Link>
                                                    </Text>
                                                </Td>
                                                <Td><Box backgroundColor={"green.200"} padding={2} borderRadius={4} w={"60%"}>Submitted</Box></Td>
                                            </Tr> : null
                                        )
                                    ))}


                                </Tbody>

                            </Table>
                        </TableContainer> : null
                    }

                    <Button onClick={(e) => { setTotal_Rejects(!total_reject) }} bg={total_reject ? "gray.300" : null}>Total Rejected </Button>
                    {total_reject ?
                        <TableContainer>
                            <Table variant={'simple'}>

                                <Thead>
                                    <Tr>
                                        <Th>Index</Th>
                                        <Th>Email Id</Th>
                                        <Th>Name</Th>
                                        <Th>Document Requested</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>

                                    {rejected.map((issue, index) => (
                                        (
                                            issue.status == "Rejected" ?
                                                <Tr>
                                                    <Td>{index + 1}</Td>
                                                    <Td>{issue.emailId}</Td>
                                                    <Td>{issue.username}</Td>
                                                    <Td>{issue.filename}</Td>
                                                    <Td><Box backgroundColor={"red.200"} padding={2} borderRadius={4} width={"60%"}>Rejected</Box></Td>
                                                </Tr> : null
                                        )
                                    ))}

                                </Tbody>

                            </Table>
                        </TableContainer> : null
                    }
                </Stack>
                : <Box textAlign={"center"}> !No Result Found!</Box>
            }

        </Box >
    )
};

export default SearchByPlace;