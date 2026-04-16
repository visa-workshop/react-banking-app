import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

import Card from '../components/Card/Card';
import Layout from '../components/Layout/Layout';
import History from '../components/History/History';
import Divider from '../components/Divider/Divider';
import { useScreenLoadMonitor } from '../hooks/useScreenLoadMonitor';

interface CardData {
  id: number;
  number: string;
  cvc_number: string;
  valid_until: string;
  card_holder: string;
  balance: number;
  card_limit: number;
}

const Cards: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const setLoadComplete = useScreenLoadMonitor({
    screenName: 'Cards',
  });

  useEffect(() => {
    apiGet<CardData[]>('/api/cards')
      .then((data) => {
        setCards(data);
        setIsDataLoaded(true);
      })
      .catch(() => {
        setIsDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      setLoadComplete();
    }
  }, [isDataLoaded, setLoadComplete]);

  if (!isDataLoaded) {
    return (
      <Layout>
        <Divider />
        <h1 className='title no-select'>Cards</h1>
        <div className='flex flex-h-center flex-v-center' style={{ minHeight: '200px' }}>
          <p>Loading cards...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Divider />

      <h1 className='title no-select'>Cards</h1>

      <div className='cards'>
        {cards.map((card) => (
          <Card
            key={card.id}
            number={card.number}
            cvcNumber={card.cvc_number}
            validUntil={card.valid_until}
            cardHolder={card.card_holder}
            balance={card.balance}
            cardLimit={card.card_limit}
          />
        ))}
      </div>

      <Divider />

      <History detailed date='May 6' dateBalance='-€127.78' />

      <Divider />
    </Layout>
  );
};

export default Cards;
