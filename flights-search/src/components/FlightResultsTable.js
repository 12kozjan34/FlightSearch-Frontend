import React from 'react';
import { useTable, usePagination } from 'react-table';
import './FlightResultsTable.css';

const FlightResultsTable = ({ data, numberOfPassengers }) => {
    const flightData = Array.isArray(data) ? data : [];

    const columns = React.useMemo(() => [
        { Header: 'Departure', accessor: 'departureAirport' },
        { Header: 'Destination', accessor: 'destinationAirport' },
        { Header: 'Departure Date', accessor: 'departureDate' },
        { Header: 'Arrival Date', accessor: 'arrivalDate' },
        { Header: 'Transfers', accessor: 'numberOfTransfers' },
        { Header: 'Passengers', accessor: 'numberOfPassengers' },
        { Header: 'Currency', accessor: 'currency' },
        { Header: 'Price per Seat', accessor: 'totalPrice' },
        { Header: 'Total Price', accessor: 'totalPriceForAll' },
    ], []);

    const dataWithTotalPrice = React.useMemo(() => 
        flightData.map(row => ({
            ...row,
            totalPriceForAll: row.totalPrice * numberOfPassengers,
        })),
        [flightData, numberOfPassengers]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: dataWithTotalPrice,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    if (flightData.length === 0) return <p>No results found</p>;

    return (
        <div className="table-container">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} key={column.id}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} key={cell.column.id}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FlightResultsTable;
