'use client'

import { Send, Bot, User, ChevronDown, DollarSign, LineChart, Settings } from 'lucide-react'
import { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react'
import { Message } from '@/types'
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Heading,
  Icon,
  Circle,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Collapse,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import TradingView from './TradingView'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

interface TradeState {
  selectedToken: string;
  strategy: string;
  riskLevel: string;
  amount: number;
  isChartExpanded: boolean;
  trades: TradingActivity[];
  performance: TradePerformance;
}

interface TradingActivity {
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  timestamp: Date;
  fees: number;
}

interface TradePerformance {
  averageEntry: number;
  totalProfit: number;
  totalFees: number;
  roi: number;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [tradeState, setTradeState] = useState<TradeState>({
    selectedToken: '',
    strategy: '',
    riskLevel: '',
    amount: 0,
    isChartExpanded: false,
    trades: [],
    performance: {
      averageEntry: 0,
      totalProfit: 0,
      totalFees: 0,
      roi: 0,
    }
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgGradient = 'linear(to-b, gray.900, gray.800)'
  const borderColor = 'whiteAlpha.100'
  const inputBg = 'whiteAlpha.50'

  useEffect(() => {
    setMessages([
      {
        id: 1,
        content: 'Hello! I\'m your Marp Trades assistant built on starknet. I can help you analyze market trends, execute trades, and provide real-time insights. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTradeCommand = () => {
    const tokens = [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'PEPE', name: 'Pepe' },
      { symbol: 'WIF', name: 'Dogwifhat' },
    ]

    const tokenList = tokens.map(token => 
      `${token.symbol} - ${token.name}`
    ).join('\n')

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Please select a token to trade:\n\n${tokenList}\n\nJust type the symbol (e.g., "BTC") to select.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleTokenSelection = (token: string) => {
    setTradeState(prev => ({ ...prev, selectedToken: token }))
    const strategies = [
      'Dollar Cost Averaging (DCA)',
      'Grid Trading',
      'TWAP (Time Weighted Average Price)',
      'Momentum Trading',
    ]

    const botResponse: Message = {
      id: messages.length + 2,
      content: `You've selected ${token}. Please choose a trading strategy:\n\n${strategies.join('\n')}\n\nType the number (1-4) to select.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleStrategySelection = (strategyNumber: number) => {
    const strategies = [
      'Dollar Cost Averaging (DCA)',
      'Grid Trading',
      'TWAP',
      'Momentum Trading',
    ]
    const strategy = strategies[strategyNumber - 1]
    setTradeState(prev => ({ ...prev, strategy }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Strategy selected: ${strategy}\n\nPlease specify your risk level (Low/Medium/High):`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleRiskLevel = (risk: string) => {
    setTradeState(prev => ({ ...prev, riskLevel: risk }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Risk level set to ${risk}. How much would you like to invest? (in USD)`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleAmount = (amount: number) => {
    setTradeState(prev => ({ 
      ...prev, 
      amount,
      isChartExpanded: true,
      trades: [
        {
          type: 'BUY',
          price: 65000,
          amount: amount * 0.3,
          timestamp: new Date(),
          fees: amount * 0.001,
        },
        {
          type: 'BUY',
          price: 64000,
          amount: amount * 0.4,
          timestamp: new Date(Date.now() - 3600000),
          fees: amount * 0.001,
        },
        {
          type: 'SELL',
          price: 66000,
          amount: amount * 0.2,
          timestamp: new Date(Date.now() - 7200000),
          fees: amount * 0.001,
        },
      ],
      performance: {
        averageEntry: 64500,
        totalProfit: amount * 0.05,
        totalFees: amount * 0.003,
        roi: 5,
      }
    }))

    const botResponse: Message = {
      id: messages.length + 2,
      content: `Perfect! I've initiated the trading strategy with $${amount}. I'll now show you the trading dashboard with real-time updates.`,
      sender: 'bot',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, botResponse])
    onOpen()
  }

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Handle different stages of the trading flow
    if (input.toLowerCase() === 'trade') {
      handleTradeCommand()
    } else if (!tradeState.selectedToken && /^[A-Za-z]{2,5}$/.test(input)) {
      handleTokenSelection(input.toUpperCase())
    } else if (tradeState.selectedToken && !tradeState.strategy && /^[1-4]$/.test(input)) {
      handleStrategySelection(parseInt(input))
    } else if (tradeState.strategy && !tradeState.riskLevel && /^(LOW|MEDIUM|HIGH)$/i.test(input)) {
      handleRiskLevel(input.toUpperCase())
    } else if (tradeState.riskLevel && !tradeState.amount && /^\d+(\.\d+)?$/.test(input)) {
      handleAmount(parseFloat(input))
    } else {
      // If no specific command is matched, send a helpful message
      setTimeout(() => {
        let helpMessage = ''
        if (!tradeState.selectedToken) {
          helpMessage = 'Please enter a valid token symbol (e.g., BTC, ETH, SOL)'
        } else if (!tradeState.strategy) {
          helpMessage = 'Please select a strategy (1-4):\n1. Dollar Cost Averaging (DCA)\n2. Grid Trading\n3. TWAP\n4. Momentum Trading'
        } else if (!tradeState.riskLevel) {
          helpMessage = 'Please specify your risk level (LOW/MEDIUM/HIGH)'
        } else if (!tradeState.amount) {
          helpMessage = 'Please enter the amount you want to invest (in USD)'
        } else {
          helpMessage = 'I\'m analyzing your request. Please wait while I process the trading information.'
        }

        const botResponse: Message = {
          id: messages.length + 2,
          content: helpMessage,
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botResponse])
      }, 500)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <Flex direction="column" h="calc(100vh - 4rem)" position="relative" overflow="hidden" bg="gray.900">
      {/* Chat Header */}
      <Box borderBottom="1px" borderColor={borderColor} py={3} px={4} bg="gray.800">
        <Flex align="center" gap={2}>
          <Circle size="32px" bg="blue.500">
            <Icon as={Bot} color="white" boxSize={4} />
          </Circle>
          <Box>
            <Heading size="sm">Marp Trades</Heading>
            <Text fontSize="xs" color="gray.400">Powered by advanced market analysis</Text>
          </Box>
        </Flex>
      </Box>

      {/* Trading Dashboard */}
      <Collapse in={tradeState.isChartExpanded} animateOpacity>
        <Box borderBottom="1px" borderColor={borderColor} bg="gray.800">
          <Grid templateColumns="repeat(4, 1fr)" gap={4} p={4}>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Average Entry</StatLabel>
              <StatNumber fontSize="md">${tradeState.performance.averageEntry.toLocaleString()}</StatNumber>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Total Profit/Loss</StatLabel>
              <StatNumber fontSize="md" color={tradeState.performance.totalProfit >= 0 ? 'green.400' : 'red.400'}>
                ${Math.abs(tradeState.performance.totalProfit).toLocaleString()}
              </StatNumber>
              <StatHelpText fontSize="xs" mb={0}>
                <StatArrow type={tradeState.performance.totalProfit >= 0 ? 'increase' : 'decrease'} />
                {tradeState.performance.roi}%
              </StatHelpText>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Total Fees</StatLabel>
              <StatNumber fontSize="md">${tradeState.performance.totalFees.toLocaleString()}</StatNumber>
            </Stat>
            <Stat bg="whiteAlpha.50" p={2} rounded="md" size="sm">
              <StatLabel fontSize="xs">Active Strategy</StatLabel>
              <StatNumber fontSize="md">{tradeState.strategy || 'None'}</StatNumber>
            </Stat>
          </Grid>

          <Box px={4} pb={4}>
            <Heading size="xs" mb={2}>Recent Trading Activity</Heading>
            <Box bg="whiteAlpha.50" rounded="md" overflow="hidden">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontSize="xs" py={2}>Type</Th>
                    <Th fontSize="xs" py={2}>Price</Th>
                    <Th fontSize="xs" py={2}>Amount</Th>
                    <Th fontSize="xs" py={2}>Time</Th>
                    <Th fontSize="xs" py={2}>Fees</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tradeState.trades.map((trade, index) => (
                    <Tr key={index}>
                      <Td py={2}>
                        <Badge colorScheme={trade.type === 'BUY' ? 'green' : 'red'} fontSize="xs">
                          {trade.type}
                        </Badge>
                      </Td>
                      <Td py={2} fontSize="xs">${trade.price.toLocaleString()}</Td>
                      <Td py={2} fontSize="xs">${trade.amount.toLocaleString()}</Td>
                      <Td py={2} fontSize="xs">{trade.timestamp.toLocaleTimeString()}</Td>
                      <Td py={2} fontSize="xs">${trade.fees.toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Chat Messages */}
      <Box
        flex="1"
        overflowY="auto"
        px={4}
        pt={2}
        pb="80px"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={3} align="stretch">
          {messages.map((message) => (
            <Flex
              key={message.id}
              justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Flex
                maxW="70%"
                gap={2}
                align="start"
              >
                {message.sender === 'bot' && (
                  <Circle size="28px" bg="blue.500" flexShrink={0}>
                    <Icon as={Bot} color="white" boxSize={3} />
                  </Circle>
                )}
                <Box
                  bg={message.sender === 'user' ? 'blue.500' : 'whiteAlpha.100'}
                  color="white"
                  px={3}
                  py={2}
                  rounded="lg"
                  fontSize="sm"
                >
                  <Text whiteSpace="pre-line">{message.content}</Text>
                  <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                    {formatTime(message.timestamp)}
                  </Text>
                </Box>
                {message.sender === 'user' && (
                  <Circle size="28px" bg="gray.700" flexShrink={0}>
                    <Icon as={User} color="white" boxSize={3} />
                  </Circle>
                )}
              </Flex>
            </Flex>
          ))}
        </VStack>
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input - Fixed at bottom */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0}
        p={4}
        bg="gray.800"
        borderTop="1px"
        borderColor={borderColor}
        backdropFilter="blur(8px)"
        zIndex={100}
      >
        <InputGroup size="md">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type 'trade' to start trading or ask me anything..."
            bg="gray.700"
            border="1px"
            borderColor="gray.600"
            _focus={{
              outline: 'none',
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
            }}
            _hover={{
              borderColor: 'gray.500',
            }}
            color="white"
            _placeholder={{ color: 'gray.400' }}
            rounded="md"
            pr="4.5rem"
            fontSize="sm"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleSend}
              colorScheme="blue"
              rounded="md"
              fontSize="sm"
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Trading View Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.900" maxW="90vw" maxH="90vh" overflow="hidden">
          <ModalHeader p={0}>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody p={0}>
            <TradingView tradeState={tradeState} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default ChatInterface 