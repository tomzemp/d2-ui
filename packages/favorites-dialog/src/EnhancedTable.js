import React from 'react';
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import i18n from '@dhis2/d2-i18n';

import { getVisTypeLabel, visTypeIcons } from './visTypes';

import {
    changePage,
    setRowsPerPage,
    sortData,
    selectFavorite,
} from './actions';

const Time = ({ date }) => {
    const d = new Date(date);
    const time = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${(
        '0' + d.getDate()
    ).slice(-2)}`;

    return <time dateTime={d.toISOString()}>{time}</time>;
};

const EnhancedTableHead = props => {
    const { order, column, sortData, showTypeColumn } = props;
    const columns = [
        { id: 'displayName', label: i18n.t('Name') },
        { id: 'created', label: i18n.t('Created') },
        { id: 'lastUpdated', label: i18n.t('Last updated') },
    ];

    if (showTypeColumn) {
        columns.splice(1, 0, { id: 'type', label: i18n.t('Type') });
    }

    const createSortHandler = column => event => {
        sortData(event, column);
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map(c => {
                    return (
                        <TableCell key={c.id}>
                            <TableSortLabel
                                active={column === c.id}
                                direction={order}
                                onClick={createSortHandler(c.id)}
                            >
                                {c.label}
                            </TableSortLabel>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

const EnhancedTable = props => {
    const {
        data,
        rowsPerPage,
        totalRecords,
        page,
        changePage,
        order,
        column,
        sortData,
        onFavoriteSelect,
        showTypeColumn,
    } = props;

    const clickHandler = id => event => {
        onFavoriteSelect(id);
    };

    return (
        <div>
            <Table>
                <EnhancedTableHead
                    order={order}
                    column={column}
                    sortData={sortData}
                    showTypeColumn={showTypeColumn}
                />
                <TableBody>
                    {data.map(favorite => {
                        const visTypeIcon = visTypeIcons[favorite.type];

                        return (
                            <TableRow hover={true} key={favorite.id}>
                                <TableCell
                                    padding="dense"
                                    onClick={clickHandler(favorite.id)}
                                    style={{ width: '60%', cursor: 'pointer' }}
                                >
                                    {favorite.displayName}
                                </TableCell>
                                {showTypeColumn && (
                                    <TableCell padding="dense">
                                        <Tooltip
                                            title={getVisTypeLabel(
                                                favorite.type
                                            )}
                                        >
                                            {visTypeIcon}
                                        </Tooltip>
                                    </TableCell>
                                )}
                                <TableCell padding="dense">
                                    <Time date={favorite.created} />
                                </TableCell>
                                <TableCell padding="dense">
                                    <Time date={favorite.lastUpdated} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            count={totalRecords}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={changePage}
                            labelDisplayedRows={({ from, to, count }) => {
                                return count !== -1
                                    ? `${from}-${to} / ${count}`
                                    : `${from}-${to} / ${to}`;
                            }}
                            //onChangeRowsPerPage={setRowsPerPage}
                            //rowsPerPageOptions={[5, 10, 15, 20]}
                            rowsPerPageOptions={[]}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    order: state.sorting.order,
    column: state.sorting.column,
    page: state.pagination.page,
    rowsPerPage: state.pagination.rowsPerPage,
    totalRecords: state.data.totalRecords,
    data: state.data.records,
});

const mapDispatchToProps = {
    setRowsPerPage,
    changePage,
    sortData,
    selectFavorite,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EnhancedTable);
