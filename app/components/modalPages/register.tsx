// "use client"
import { LoginModal } from "@/app/constants";
import { closeModal, openModal } from "@/redux/features/modalSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  ModalFooter,
  ModalBody,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Link,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function SignupModalComponent() {
  const [passwordShown, setPasswordVisibility] = useState(false);
  const toggleVisibility = () => setPasswordVisibility(!passwordShown);

  const router = useRouter();

  return (
    <>
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel fontSize="12px">Phone number</FormLabel>
          <Input placeholder="Enter your email" />
        </FormControl>

        <Flex mt="24px" columnGap="16px">
          <FormControl>
            <FormLabel fontSize="12px">First name</FormLabel>
            <Input placeholder="Enter your first name" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="12px">Last name</FormLabel>
            <Input placeholder="Enter your last name" />
          </FormControl>
        </Flex>

        <FormControl mt="24px">
          <FormLabel fontSize="12px">Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="2.5rem"
              type={passwordShown ? "text" : "password"}
              placeholder="Enter your password"
            />
            <InputRightElement width="2.5rem">
              <IconButton
                aria-label="Password visibility"
                icon={passwordShown ? <FaRegEye /> : <FaRegEyeSlash />}
                bgColor="transparent"
                _hover={{ bgColor: "transparent" }}
                onClick={toggleVisibility}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl mt="24px">
          <FormLabel fontSize="12px">Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="2.5rem"
              type={passwordShown ? "text" : "password"}
              placeholder="Enter your password"
            />
            <InputRightElement width="2.5rem">
              <IconButton
                aria-label="Password visibility"
                icon={passwordShown ? <FaRegEye /> : <FaRegEyeSlash />}
                bgColor="transparent"
                _hover={{ bgColor: "transparent" }}
                onClick={toggleVisibility}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl mt="24px" mb="12px">
          <FormLabel fontSize="12px">User role(s)</FormLabel>
          <Input placeholder="Enter your first name" />
        </FormControl>

        {/* <Link fontSize="14px">Forgot Password?</Link> */}

        <Checkbox defaultChecked colorScheme="orange">
          <Box as="span" fontSize="12px" lineHeight="5px">
            By clicking Create account, I agree that I have read and accepted
            the <Link color="#1373E6">Terms of Use</Link> and{" "}
            <Link color="#1373E6">Privacy Policy</Link>.
          </Box>
        </Checkbox>

        <Button
          bgColor="#F8A730"
          color="white"
          width="100%"
          my="16px"
          height="48px"
        >
          Create Account
        </Button>

        <Flex>
        <Box as="span">
          Already have an account? <Link as="button" onClick={()=> router.push('/login')}>Sign in</Link>
        </Box>
        </Flex>
      </ModalBody>

      {/* <ModalFooter justifyContent="center" gap="12px">
        <Box as="span">
          Already have an account? <Link as="button" onClick={()=> openModal(LoginModal)}>Sign in</Link>
        </Box>
      </ModalFooter> */}
    </>
  );
}
