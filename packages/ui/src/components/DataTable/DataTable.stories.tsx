import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '@plug/ui';
import { Column } from './DataTable.types';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    pageSize: {
      control: 'number',
      defaultValue: 3,
    },
    showPagination: {
      control: 'boolean',
      defaultValue: true,
    },
    onPageChange: {
      action: 'onPageChange',
    },
    filterFunction: {
      action: 'filterFunction',
    },
    selectable: {
      control: 'boolean',
      defaultValue: false,
    }
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const sampleData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', email: 'diana@example.com' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
  { id: 6, name: 'Frank', email: 'frank@example.com' },
  { id: 7, name: 'Grace', email: 'grace@example.com' },
  { id: 8, name: 'Hank', email: 'hank@example.com' },
  { id: 9, name: 'Ivy', email: 'ivy@example.com' },
  { id: 10, name: 'Jack', email: 'jack@example.com' },
  { id: 11, name: 'Karen', email: 'karen@example.com' },
  { id: 12, name: 'Leo', email: 'leo@example.com' },
  { id: 13, name: 'Mona', email: 'mona@example.com' },
  { id: 14, name: 'Nina', email: 'nina@example.com' },
  { id: 15, name: 'Oscar', email: 'oscar@example.com' },
  { id: 16, name: 'Paul', email: 'paul@example.com' },
  { id: 17, name: 'Quinn', email: 'quinn@example.com' },
  { id: 18, name: 'Rachel', email: 'rachel@example.com' },
  { id: 19, name: 'Steve', email: 'steve@example.com' },
  { id: 20, name: 'Tina', email: 'tina@example.com' },
];

const columns: Column<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

export const ClientSidePagination: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      pageSize={5}
      filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
    />
  ),
};

export const NoPagination: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      showPagination={false} // Pagination 비활성화
    />
  ),
};

export const WithSearch: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      showSearch={true} // Search 활성화
      filterFunction={(item, search) => {
        const lowerSearch = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(lowerSearch) ||
          item.email.toLowerCase().includes(lowerSearch)
        );
      }}
    />
  ),
};

export const CustomPageSizeAndBlock: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      pageSize={3}
      pageBlock={3} 
      filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
    />
  ),
};

export const SelectTable: Story = {
  render: () => (
    <DataTable
      data={sampleData}
      columns={columns}
      pageSize={5}
      filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
      selectable={true}
    />
  ),
};

export const ControlledSelectTable: Story = {
  render:() => {
    const ControlledSelectTable = () => {
      const [selectState, setSelectState] = useState<Set<User>>(new Set());
      
      return(
        <>
            <div className="mt-4 mb-2">선택된 사용자: {selectState.size}</div>
            <div className="mt-4 mb-2">선택된 사용자 ID: {Array.from(selectState).map(user => user.id).join(',')}</div>
            <DataTable
              data={sampleData}
              columns={columns}
              pageSize={5}
              filterFunction={(item, search) => item.name.toLowerCase().includes(search.toLowerCase())}
              selectable={true}
              selectedRows={selectState}
              onSelectChange={setSelectState}
            />
        </>
      )
    }
    return <ControlledSelectTable />;
  }
}