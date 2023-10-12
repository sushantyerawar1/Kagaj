import react, { useEffect, useState } from "react"
import axios from "axios";
import {
    TableContainer,
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


const SearchByUser = () => {

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


    const HandleSearch = (e) => {
        setSearch(e.target.value);
        setIssues([]);
        setPending([]);
        setSubmitted([]);
        setRejected([]);
    };



    const SearchUser = async (e) => {

        e.preventDefault();
        setTotal_Requests(false)
        setTotal_Rejects(false);
        setTotal_Done(false);
        if (!search) {
            toast({
                title: "Please Enter User Email id",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        } else {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };



                const Data = await axios.post(
                    "http://localhost:5000/api/issue/getallbyemail", {
                    emailid: search
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


    return (
        <Box
            padding={10}
            width="100%"
            maxH="90%"
            overflowY={"auto"}
        >

            <Box paddingBottom={2} >

                <InputGroup borderRadius={20} backgroundColor="white"  >
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300' />
                    </InputLeftElement>
                    <Input type='text' value={search} placeholder='Search By User Email Id' borderRadius={20} onChange={(e) => { HandleSearch(e) }} />
                    <InputRightAddon><Button width="100%" onClick={(e) => { SearchUser(e) }}>Search</Button></InputRightAddon>
                </InputGroup>

            </Box>
            {
                Issues.length ?
                    <Stack spacing={3}>

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
                                                    <Td><Box backgroundColor={"yellow.200"} padding={2} borderRadius={4} w={"45%"}>Pending</Box></Td>
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
                                                    <Td><Box backgroundColor={"green.200"} padding={2} borderRadius={4} w={"40%"}>Submitted</Box></Td>
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
                                                        <Td><Box backgroundColor={"red.200"} padding={2} borderRadius={4} width={"40%"}>Rejected</Box></Td>
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

export default SearchByUser;