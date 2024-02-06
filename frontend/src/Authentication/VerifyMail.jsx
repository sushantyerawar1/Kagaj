import react, { useState, useEffect } from "react"
import { Flex, useToast, useColorModeValue, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import Header from "../Header/Header";
import Footer from "../Footer/footer";
import verifyemail from "../verifyemail.png"


const VerifiedMail = () => {


    return (
        <>
            <Header />
            <Flex
                minH={'80vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <div>
                    <Text fontSize={"50px"} textAlign={"center"}>Verify Your Email</Text>
                    <Image
                        src={verifyemail}
                        alt='verifyemail'
                        align={'center'}
                    />
                </div>
            </Flex>
            <Footer />
        </>
    )
};

export default VerifiedMail;