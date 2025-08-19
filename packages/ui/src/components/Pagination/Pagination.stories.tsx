import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@plug/ui';
import { PaginationProps } from './Pagination.types';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      defaultValue: 1,
    },
    totalPages: {
      control: 'number',
      defaultValue: 20,
    },
    pageBlock: {
      control: 'number',
      defaultValue: 5,
    },
    onPageChange: { action: 'onPageChange' },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const ControlledPagination = (props: Omit<PaginationProps, 'onPageChange'>) => {
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1);

  const onPageChange = (page: number) => {
    console.log(`Page changed to: ${page}`);
    setCurrentPage(page);
  }
  return (
    <Pagination
      {...props}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
};

export const Default: Story = {
  render: () => (
    <ControlledPagination
      currentPage={1}
      totalPages={20}
      pageBlock={5}
    />
  ),
};

export const CustomPageBlock: Story = {
  render: () => (
    <ControlledPagination
      currentPage={1}
      totalPages={50}
      pageBlock={10}
    />
  ),
};

export const ManyPages: Story = {
  render: () => (
    <ControlledPagination
      currentPage={10}
      totalPages={100}
      pageBlock={10}
    />
  ),
};