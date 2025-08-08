import { 
  Card as CardComponent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./Card";

import type { CardProps } from "./Card.types";

// Card 컴포넌트에 하위 컴포넌트를 속성으로 추가
const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

export { Card };

export type { CardProps }; 