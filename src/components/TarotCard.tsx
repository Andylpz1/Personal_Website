import React from 'react';
import TarotCard1 from './TarotCard1';
import TarotCard2 from './TarotCard2';
import { TarotCard as TarotCardType } from '../data/tarotCards';

interface TarotCardProps {
  card: TarotCardType;
  variant?: 'normal' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
  deckStyle?: 'original' | 'image';
}

const TarotCard: React.FC<TarotCardProps> = ({ 
  card, 
  variant = 'normal',
  size = 'md',
  deckStyle = 'image'
}) => {
  if (deckStyle === 'original') {
    return <TarotCard1 card={card} variant={variant} size={size} />;
  } else {
    return <TarotCard2 card={card} variant={variant} size={size} />;
  }
};

export default TarotCard;