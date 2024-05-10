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
    Link,
    Text

} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/react";
import storage from "../Firebase/firebase.js"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid"



const Request = () => {

    const [total_requests, setTotal_Requests] = useState(false);
    const [total_done, setTotal_Done] = useState(false);
    const [total_reject, setTotal_Rejects] = useState(false);
    const [Issues, setIssues] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedid, setSelectedId] = useState(null);
    const [pending, setPending] = useState([]);
    const [submitted, setSubmitted] = useState([]);
    const [rejected, setRejected] = useState([]);
    const toast = useToast();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const user = userInfo ? userInfo.User : null
    const path = window.location.pathname;
    const [flag, setFlag] = useState(true);
    const email = user?.emailId;
    const isAdmin = user?.isAdmin;


    const handleFileChange = (event, id) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedId(id);
    };

    const handleUpload = async () => {

        if (selectedFile == null) {
            toast({
                title: "Please Select File",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (selectedFile.type === "application/pdf") {
            const path = selectedFile.name + v4();
            const url = `https://firebasestorage.googleapis.com/v0/b/kagaj-fe973.appspot.com/o/files%2F${path}?alt=media&token=7c3a0243-ebb5-40f6-a6f7-22ccaf96bf27&_gl=1*1jftra6*_ga*MTY1ODQxMTgxMy4xNjk2ODg1Nzc2*_ga_CW55HF8NVT*MTY5Njg4NTc3Ni4xLjEuMTY5Njg4ODYyNi41MS4wLjA.`
            const fileRef = ref(storage, `files/${path}`);
            uploadBytes(fileRef, selectedFile).then(() => {
                alert("File Uploaded");
            })

            setPdfUrl(url);

        } else {
            toast({
                title: "Only Pdf Accepted",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
    };

    const AppendUrl = async () => {
        if (!pdfUrl || !selectedid) {
            toast({
                title: "Please a file",
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
                "http://localhost:5000/api/issue/submitted",
                {
                    "url": pdfUrl,
                    "id": selectedid,
                },
                config
            );

            if (data) FetchAllRequets();

            toast({
                title: "File Submitted Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });


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

    useEffect(() => {
        if (pdfUrl && selectedid) {
            AppendUrl();
        }
    }, [pdfUrl])





    const FetchAllRequets = async () => {

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

    console.log(Issues)

    useEffect(() => {
        if (Issues && flag) {

            for (let i = 0; i < Issues.length; i++) {
                if (Issues[i].status == "pending") {

                    if (isAdmin)
                        setPending(prevArray => [...prevArray, Issues[i]]);
                    else if (Issues[i].emailId == email)
                        setPending(prevArray => [...prevArray, Issues[i]]);
                }

                else if (Issues[i].status == "Submitted") {
                    if (isAdmin)
                        setSubmitted(prevArray => [...prevArray, Issues[i]]);
                    else if (Issues[i].emailId == email)
                        setSubmitted(prevArray => [...prevArray, Issues[i]]);
                }

                else if (Issues[i].status == "Rejected") {
                    if (isAdmin)
                        setRejected(prevArray => [...prevArray, Issues[i]]);
                    else if (Issues[i].emailId == email)
                        setRejected(prevArray => [...prevArray, Issues[i]]);
                }

            }
            setFlag(false);
        }
    }, [Issues])



    useEffect(() => {
        FetchAllRequets()
    }, [])

    const RejectIssue = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "http://localhost:5000/api/issue/rejected",
                {
                    "id": id,
                },
                config
            );
            if (data)
                FetchAllRequets();
            toast({
                title: "File Rejected Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });


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


    return (
        <Box
            padding={10}
            width="100%"
            maxH="90%"
            overflowY={"auto"}
        >
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
                                    {isAdmin ?
                                        <>
                                            <Th>Upload</Th>
                                            <Th>Submit</Th>
                                            <Th>Reject</Th>
                                        </> :
                                        <Th>Status</Th>
                                    }
                                </Tr>
                            </Thead>
                            <Tbody>{
                                pending.map((issue, index) => (
                                    ((issue.status == "pending") ?
                                        <Tr>
                                            <Td>{index + 1}</Td>
                                            <Td>{issue.emailId}</Td>
                                            <Td>{issue.username}</Td>
                                            <Td>{issue.filename}</Td>
                                            {isAdmin ?
                                                <>
                                                    <Td><Input type="file" accept=".pdf" padding={2} width="60%" onChange={(e) => { handleFileChange(e, issue._id) }}></Input></Td>
                                                    <Td><Button onClick={handleUpload}>submit</Button></Td>
                                                    <Td><Button onClick={() => { RejectIssue(issue._id) }}>Reject</Button></Td></> :
                                                <Td><Box backgroundColor={"yellow.200"} padding={2} borderRadius={4} w={"55%"}>Pending</Box></Td>
                                            }
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
                                    ((issue.status == "Submitted") ?
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
                                        (issue.status == "Rejected") ?
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

        </Box >
    )
};

export default Request;