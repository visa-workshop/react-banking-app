import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sentry } from '../sentry';

// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import RecipientList from '../components/Send/RecipientList';
import AmountInput from '../components/Send/AmountInput';
import TransferConfirmation from '../components/Send/TransferConfirmation';
import TransferSuccess from '../components/Send/TransferSuccess';

// interfaces
import type { Recipient } from '../components/Send/RecipientList';
import { useScreenLoadMonitor } from '../hooks/useScreenLoadMonitor';

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

const SendMoney: React.FC = () => {
  const navigate = useNavigate();
  const setLoadComplete = useScreenLoadMonitor({ screenName: 'SendMoney' });

  useEffect(() => {
    setLoadComplete();
  }, [setLoadComplete]);

  const [step, setStep] = useState<Step>('recipient');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState<number>(0);

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
      // Simulate a transfer processing error
      processTransfer(selectedRecipient, amount);
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
    }

    setStep('success');
  };

  const handleCancel = (): void => {
    setStep('recipient');
    setSelectedRecipient(null);
    setAmount(0);
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
 * Simulates transfer processing that encounters an error.
 * This intentionally throws to demonstrate Sentry error capture.
 */
function processTransfer(recipient: Recipient, amount: number): void {
  throw new Error(
    `Transfer failed: unable to process payment of \u20ac${amount.toFixed(2)} to ${recipient.name} (${recipient.accountInfo}). Gateway timeout after 30000ms.`
  );
}

export default SendMoney;
