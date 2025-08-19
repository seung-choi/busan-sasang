import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './Card';
import { Button } from '@plug/ui';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    closable: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부',
      defaultValue: false
    },
    onClose: {
      action: 'closed',
      description: '닫기 버튼 클릭 시 호출되는 함수'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
        <CardDescription>카드에 대한 간단한 설명입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>카드 내용이 여기에 들어갑니다. 텍스트, 이미지 등 다양한 콘텐츠를 포함할 수 있습니다.</p>
      </CardContent>
      <CardFooter>
        <Button size="small">확인</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage: Story = {
  render: (args) => (
    <Card className="w-[350px]" {...args}>
      <div className="w-full h-[200px] bg-gray-200 rounded-t-lg flex items-center justify-center">
        <span className="text-gray-500">이미지 영역</span>
      </div>
      <CardHeader>
        <CardTitle>이미지가 있는 카드</CardTitle>
        <CardDescription>이미지와 함께 정보를 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>이미지 아래에 표시되는 콘텐츠입니다.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="small">취소</Button>
        <Button size="small">확인</Button>
      </CardFooter>
    </Card>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <Card className="flex flex-row w-[600px]" {...args}>
      <div className="w-[200px] bg-gray-200 rounded-l-lg flex items-center justify-center">
        <span className="text-gray-500">이미지</span>
      </div>
      <div className="flex-1">
        <CardHeader>
          <CardTitle>가로형 카드</CardTitle>
          <CardDescription>가로 레이아웃으로 정보를 표시합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>가로형 카드는 이미지와 텍스트를 나란히 배치하여 공간을 효율적으로 사용합니다.</p>
        </CardContent>
        <CardFooter>
          <Button size="small">자세히 보기</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <Card className="w-[250px] hover:shadow-md transition-shadow cursor-pointer" {...args}>
        <CardHeader>
          <CardTitle>인터랙티브 카드</CardTitle>
          <CardDescription>호버 시 그림자 효과</CardDescription>
        </CardHeader>
        <CardContent>
          <p>이 카드에 마우스를 올리면 그림자 효과가 나타납니다.</p>
        </CardContent>
      </Card>
      
      <Card className="w-[250px] border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer" {...args}>
        <CardHeader>
          <CardTitle>강조 카드</CardTitle>
          <CardDescription>호버 시 배경색 변경</CardDescription>
        </CardHeader>
        <CardContent>
          <p>이 카드에 마우스를 올리면 배경색이 변경됩니다.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// 닫기 가능한 카드 예제를 위한 컴포넌트
const ClosableCardExample = (args: React.ComponentProps<typeof Card>) => {
  const [cards, setCards] = useState([
    { id: 1, title: '닫기 가능한 카드 1', content: '오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.' },
    { id: 2, title: '닫기 가능한 카드 2', content: '각 카드는 독립적으로 닫을 수 있습니다.' },
    { id: 3, title: '닫기 가능한 카드 3', content: '닫기 버튼은 접근성을 고려하여 설계되었습니다.' }
  ]);

  const handleClose = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      {cards.map(card => (
        <Card 
          key={card.id} 
          className="w-[350px]" 
          closable 
          onClose={() => handleClose(card.id)}
          {...args}
        >
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{card.content}</p>
          </CardContent>
        </Card>
      ))}
      {cards.length === 0 && (
        <div className="text-center p-4">
          <p className="text-gray-500">모든 카드가 닫혔습니다.</p>
          <Button 
            className="mt-2" 
            size="small"
            onClick={() => setCards([
              { id: 1, title: '닫기 가능한 카드 1', content: '오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.' },
              { id: 2, title: '닫기 가능한 카드 2', content: '각 카드는 독립적으로 닫을 수 있습니다.' },
              { id: 3, title: '닫기 가능한 카드 3', content: '닫기 버튼은 접근성을 고려하여 설계되었습니다.' }
            ])}
          >
            카드 다시 보기
          </Button>
        </div>
      )}
    </div>
  );
};

export const Closable: Story = {
  render: (args) => <ClosableCardExample {...args} />
}; 