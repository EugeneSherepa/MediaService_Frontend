import React, { FC } from 'react';
import './Search.scss';

type Props = {
  searchValue: string;
  onSearch: (value: string) => void;
};

export const Search: FC<Props> = ({ onSearch, searchValue }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSearch(value);
  };

  return (
    <input
      className="search-input"
      type="text"
      placeholder="Пошук за назвою..."
      value={searchValue}
      onChange={handleInputChange}
    />
  );
};
