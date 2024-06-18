import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import './App.scss';
import productsFromServer from './api/products';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchField, setSearchField] = useState('');

  const filterUser = userId => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const clearFilter = () => {
    setSelectedUser(null);
    setSearchField('');
  };

  const changeSearch = event => {
    setSearchField(event.target.value);
  };

  const filteredProducts = productsFromServer.filter(product =>
    product.name.toLowerCase().includes(searchField.toLowerCase()),
  );

  const userFilteredProducts = selectedUser
    ? filteredProducts.filter(product => {
        const category = categoriesFromServer.find(
          cat => cat.id === product.categoryId,
        );
        const user = usersFromServer.find(usr => usr.id === category.ownerId);

        return user.id === selectedUser;
      })
    : filteredProducts;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <nav className="panel">
          <p className="panel-heading">Filters</p>

          <div className="panel-block">
            <div className="buttons has-addons is-centered">
              <button
                type="button"
                className={`button ${selectedUser === null ? 'is-active' : ''}`}
                onClick={() => filterUser(null)}
                data-cy="FilterAllUsers"
              >
                All
              </button>
              {usersFromServer.map(user => (
                <button
                  data-cy="FilterUser"
                  type="button"
                  key={user.id}
                  className={`button ${selectedUser === user.id ? 'is-active' : ''}`}
                  onClick={() => filterUser(user.id)}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-block">
            <p className="control has-icons-left has-icons-right is-expanded">
              <input
                type="text"
                className="input"
                placeholder="Search"
                value={searchField}
                onChange={changeSearch}
                data-cy="SearchField"
              />
              <span className="icon is-left">
                <i className="fas fa-search" />
              </span>
              {searchField && (
                <span className="icon is-right">
                  <button
                    type="button"
                    className="delete is-small"
                    onClick={() => setSearchField('')}
                    data-cy="ClearButton"
                  />
                </span>
              )}
            </p>
          </div>

          <div className="panel-block">
            <button
              type="button"
              className="button is-link is-outlined is-fullwidth"
              onClick={clearFilter}
              data-cy="ResetAllButton"
            >
              Reset all filters
            </button>
          </div>
        </nav>

        <div className="box">
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {userFilteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" data-cy="NoMatchingMessage">
                    No products matching the current criteria
                  </td>
                </tr>
              ) : (
                userFilteredProducts.map(product => {
                  const category = categoriesFromServer.find(
                    cat => cat.id === product.categoryId,
                  );
                  const user = usersFromServer.find(
                    usr => usr.id === category.ownerId,
                  );

                  return (
                    <tr key={product.id} data-cy="Product">
                      <td data-cy="ProductId">{product.id}</td>
                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="SortIcon">
                        {category.icon} {category.title}
                      </td>
                      <td
                        data-cy="ProductUser"
                        className={
                          user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                        }
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
