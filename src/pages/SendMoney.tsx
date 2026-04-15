import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sentry } from '../sentry';

// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import RecipientList from '../components/Send/RecipientList';
import AmountInput from '../components/Send/AmountInput';
import TransferConfirmation from '../components/Send/TransferConfirmation';
import TransferSuccess from '../components/Send/TransferSuccess';
import TransferError from '../components/Send/TransferError';

// interfaces
import type { Recipient } from '../components/Send/RecipientList';

type Step = 'recipient' | 'amount' | 'confirm' | 'success' | 'error';

const SendMoney: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('recipient');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSelectRecipient = (recipient: Recipient): void => {
    setSelectedRecipient(recipient);
    setStep('amount');
  };

  const handleAmountContinue = (value: number): void => {
    setAmount(value);
    setStep('confirm');
  };

  const handleConfirm = (): void => {
    if (!selectedRecipient) return;

    try {
      // Process the transfer
      processTransfer(selectedRecipient, amount);
      setStep('success');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          feature: 'send_money',
          step: 'transfer_processing',
        },
        extra: {
          recipientName: selectedRecipient.name,
          recipientAccount: selectedRecipient.accountInfo,
          amount,
          currency: 'EUR',
        },
      });

      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(message);
      setStep('error');
    }
  };

  const handleRetry = (): void => {
    setErrorMessage('');
    setStep('confirm');
  };

  const handleCancel = (): void => {
    setStep('recipient');
    setSelectedRecipient(null);
    setAmount(0);
    setErrorMessage('');
  };

  const handleDone = (): void => {
    navigate('/home', { replace: true });
  };

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Send Money</h1>

      {step === 'recipient' && (
        <>
          <p className='information text-shadow'>Select a recipient to send money to.</p>
          <Divider />
          <RecipientList onSelect={handleSelectRecipient} selectedId={selectedRecipient?.id} />
        </>
      )}

      {step === 'amount' && selectedRecipient && (
        <>
          <p className='information text-shadow center'>Sending to {selectedRecipient.name}</p>
          <AmountInput onContinue={handleAmountContinue} />
        </>
      )}

      {step === 'confirm' && selectedRecipient && (
        <TransferConfirmation
          recipientName={selectedRecipient.name}
          recipientAccountInfo={selectedRecipient.accountInfo}
          amount={amount}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {step === 'error' && (
        <TransferError errorMessage={errorMessage} onRetry={handleRetry} onCancel={handleCancel} />
      )}

      {step === 'success' && selectedRecipient && (
        <TransferSuccess
          amount={amount}
          recipientName={selectedRecipient.name}
          onDone={handleDone}
        />
      )}

      <Divider />
    </Layout>
  );
};

/**
 * Processes a money transfer to the given recipient.
 * In a real application this would call a backend API.
 */
function processTransfer(recipient: Recipient, amount: number): void {
  // Log the transfer for observability
  Sentry.addBreadcrumb({
    category: 'transaction',
    message: `Transfer of \u20ac${amount.toFixed(2)} to ${recipient.name} (${recipient.accountInfo})`,
    level: 'info',
  });
}

export default SendMoney;
