import { VStack , Heading, useToast} from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import {useState} from 'react'

import { api } from "../services/api";

import { useNavigation } from "@react-navigation/native";



export function Find() {

    const [isLoading, setIsLoading] = useState(false)

    const [code, setCode] = useState('');

    const toast = useToast();

    const {navigate} = useNavigation();

    async function handleJoinPool() {
        try {
            setIsLoading(true)

            if (!code.trim()) {
                return toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            await api.post('pools/join', {code});
            setCode('')
            navigate('pools')

            

            toast.show({
                title: 'Você entrou no bolão!',
                placement: 'top',
                bgColor: 'green.500'
            })
            
            
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if (error.response?.data?.message === 'Poll Not Found.') {
                setCode('')
                return toast.show({
                    title: 'Não foi possível encontrar o bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if (error.response?.data?.message === 'Already in the Poll') {
                setCode('')
                return toast.show({
                    title: 'Você já está nesse bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }
            setCode('')
            toast.show({
                title: 'Erro ao buscar o bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
            


        } 
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código"  showBackButton onShare={() => {}}/>
            
            <VStack mt={8} mx={5}  alignItems="center">
                
                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center" >
                    Encontrar o bolão através de seu código único
                </Heading>

                <Input 
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                    value={code}
                />

                <Button 
                   title="BUSCAR BOLÃO"
                   isLoading={isLoading}
                   onPress={handleJoinPool}
                />

            </VStack>

        </VStack>
    )
}