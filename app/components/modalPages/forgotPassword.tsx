import {
  FormControl,
  FormLabel,
  Input,
  Button,
  ModalFooter,
  ModalBody,
  InputGroup,
  InputRightElement,
  Link,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function ForgotPasswordModalComponent() {
  const [passwordShown, setPasswordVisibility] = useState(false);
  const toggleVisibility = () => setPasswordVisibility(!passwordShown);

  return (
    <>
      <ModalBody pb={6}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            //  ref={initialRef}
            placeholder="Enter your email"
          />
        </FormControl>

        <FormControl my={4}>
          <FormLabel>Password</FormLabel>
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
        <Link fontSize="14px">Forgot Password?</Link>
        <Button bgColor="#F8A730" width="100%" my="16px">
          Sign in
        </Button>

        <Flex alignItems="stretch">
          <Button
            bgColor="transparent"
            border="1px"
            borderColor="#F8A730"
            color="#F8A730"
            borderRadius={0}
            flex={1}
          >
            Create Account
          </Button>
          <Button
            bgColor="transparent"
            border="1px"
            borderColor="#F8A730"
            color="#F8A730"
            borderRadius={0}
            flex={1}
          >
            I am a Guest
          </Button>
        </Flex>
      </ModalBody>

      <ModalFooter justifyContent="center" gap="12px">
        <Link>Privacy Policy</Link>
        <Link>Terms & Condition</Link>
      </ModalFooter>
    </>
  );
}
