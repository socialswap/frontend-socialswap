import React, { useState } from 'react';
import { Card, Typography, Input, Button, message, Steps, Divider } from 'antd';
import { BankOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axiosInstance from '../../API/api';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BankDetails = styled.div`
  background-color: #f0f2f5;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  background-color: #F83758;
  border-color: #F83758;
  &:hover, &:focus {
    background-color: #D62D4C;
    border-color: #D62D4C;
  }
`;

const PaymentGateway = ({ amount=100 }) => {
    const [utrNumber, setUtrNumber] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchParams,] = useSearchParams()
    const searchParam = useParams()
    const channelId = searchParam?.channel
    const bankDetails = {
        accountName: "YTube Market",
        accountNumber: "1234567890",
        ifscCode: "ABCD0001234",
        bankName: "Example Bank",
    };

    const handleUtrSubmit = async () => {
        if (!utrNumber) {
            message.error('Please enter the UTR number');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/payments/submit-utr', {
                channelId,
                amount,
                utrNumber
            });

            if (response.data.success) {
                message.success('UTR number submitted successfully. Waiting for admin approval.');
                setCurrentStep(2);
            } else {
                message.error('Failed to submit UTR number. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting UTR:', error);
            message.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-20">
            <StyledCard>
                <Steps current={currentStep}>
                    <Step title="Bank Transfer" icon={<BankOutlined />} />
                    <Step title="Submit UTR" icon={currentStep === 1 ? <LoadingOutlined /> : <CheckCircleOutlined />} />
                    <Step title="Admin Review" icon={<CheckCircleOutlined />} />
                </Steps>

                <Divider />

                {currentStep === 0 && (
                    <>
                        <Title level={4}>Bank Transfer Details</Title>
                        <BankDetails>
                            <Paragraph>
                                <Text strong>Account Name:</Text> {bankDetails.accountName}
                            </Paragraph>
                            <Paragraph>
                                <Text strong>Account Number:</Text> {bankDetails.accountNumber}
                            </Paragraph>
                            <Paragraph>
                                <Text strong>IFSC Code:</Text> {bankDetails.ifscCode}
                            </Paragraph>
                            <Paragraph>
                                <Text strong>Bank Name:</Text> {bankDetails.bankName}
                            </Paragraph>
                        </BankDetails>
                        <Paragraph>
                            <Text strong>Amount to Transfer:</Text> ${amount}
                        </Paragraph>
                        <Button type="primary" onClick={() => setCurrentStep(1)}>
                            I've Made the Payment
                        </Button>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <Title level={4}>Submit UTR Number</Title>
                        <Paragraph>
                            Please enter the UTR (Unique Transaction Reference) number you received after making the payment.
                        </Paragraph>
                        <StyledInput
                            placeholder="Enter UTR Number"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                        />
                        <StyledButton type="primary" onClick={handleUtrSubmit} loading={loading}>
                            Submit UTR Number
                        </StyledButton>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <Title level={4}>Payment Under Review</Title>
                        <Paragraph>
                            Your payment is currently under review by our admin team. This process usually takes 1-2 business days.
                            We'll notify you once your payment is confirmed.
                        </Paragraph>
                    </>
                )}
            </StyledCard>
        </div>
    );
};

export default PaymentGateway;