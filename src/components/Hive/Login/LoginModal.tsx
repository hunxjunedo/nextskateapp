"use client"

import useAuthHiveUser from "@/lib/useHiveAuth"
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  VStack,
  Image,
  Center
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useHiveUser } from "@/contexts/UserContext"
const environment = process.env.NODE_ENV

function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [errorMessage, setErrorMessage] = useState("")
  const [isLogginIn, setIsLogginIn] = useState(false)
  const [username, setUsername] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const { loginWithHive, logout } = useAuthHiveUser()
  const { hiveUser } = useHiveUser()
  const [isKeychainInstalled, setIsKeychainInstalled] = useState(false)

  useEffect(() => {
    if (window.hive_keychain) {
      setIsKeychainInstalled(true)
    } else {
      setIsKeychainInstalled(false)
    }
  }, [])

  async function doLogin(useLoginAs: boolean = false) {
    try {
      setIsLogginIn(true)
      await loginWithHive(username, useLoginAs, privateKey)
      onClose()
      console.log(hiveUser)
    } catch (error) {
      console.error(error)
      setErrorMessage(error ? error.toString() : "Unknown error")
      setIsLogginIn(false)
    }
  }
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      doLogin();
    }
  };
  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={"black"}
        mx={4}
        border={"1.2px solid limegreen"}
        boxShadow={"0 0 20px limegreen"}
      >
        {hiveUser ? (
          <>
            <ModalHeader>Connected as {hiveUser.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align={"normal"}>
                <Center>
                  <Image border={"1.2px solid limegreen"}
                    boxShadow={"0 0 20px limegreen"} mb={2} borderRadius={"10px"} boxSize={"120px"} src={`https://images.ecency.com/webp/u/${hiveUser.name}/avatar/small`} alt="Hive Logo" />
                </Center>
                <Button
                  w={"100%"}
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  colorScheme="red"
                  variant={"outline"}
                >
                  Log Out
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader>Hive Log In</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image mb={2} src="https://www.skatehive.app/assets/pepe_login.png" alt="Hive Logo" />
              <FormControl isInvalid={Boolean(errorMessage)}>
                <VStack align={"normal"}>
                  <Input
                    borderColor={"green.600"}
                    color={"limegreen"}
                    _placeholder={{ color: "limegreen", opacity: 0.4 }}
                    focusBorderColor="limegreen"
                    placeholder="Hive Username"
                    onChange={(event) =>
                      setUsername(event.target.value.toLowerCase())
                    }
                    onKeyDown={handleKeyDown}

                  />
                  {!isKeychainInstalled && (
                    <Input
                      type="password"
                      borderColor={"green.600"}
                      color={"limegreen"}
                      _placeholder={{ color: "limegreen", opacity: 0.4 }}
                      focusBorderColor="limegreen"
                      placeholder="Password"
                      onChange={(event1) => setPrivateKey(event1.target.value)}
                    />
                  )}
                </VStack>
                {Boolean(errorMessage) && (
                  <FormErrorMessage>{errorMessage}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                w={"100%"}
                onClick={() => doLogin()}
                colorScheme="green"
                variant={"outline"}
                disabled={isLogginIn}

              >
                {isLogginIn ? <Spinner size={"sm"} /> : "Continue"}
              </Button>
              {environment === "development" && (
                <Button
                  w={"100%"}
                  onClick={() => doLogin(true)}
                  colorScheme="red"
                  variant={"ghost"}
                >
                  Continue As (DEV)
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
