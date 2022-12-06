/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2020  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/

import React, { ReactElement } from 'react'
import './ShelfCarousel.css'
import { Icon, Paper } from '@material-ui/core';
import { Book } from '../types/Book';
import { Component } from 'react';
import BookList from "./BookList";
import myBooks from "../../my-books/MyBooks";

function ShelfBook(props: BookProps): JSX.Element {
    const bookClass = 'book' + (props.img === "" ? '' : ' image');
    const displayTitle = props.title.length > 12 ? (props.title.substring(0, 12) + "...") : props.title;

    return (
        <Paper className={bookClass} variant="elevation" square={false}>
            {(bookClass !== "book") && <div className="book-spine"></div>}
            {displayTitle}
        </Paper>
    )
}

type BookProps = {
    title: string;
    img: string;
}

interface IShelfCarouselState {
    title: string;
    books: Book[];
}

/**
 * Added for Sorting by Genre Extension
 */
interface SortingConfig {
    propertyName: string;
    ascendingOrder: boolean,
}

function AddBook() {
    return (
        <div className="book add-new">
            <Icon className="icon">add</Icon>
            <p className="book-title add-new">Add book</p>
        </div>
    )
}

export default class ShelfCarousel extends Component<ShelfCarouselProps, IShelfCarouselState> {
    
    constructor(props: ShelfCarouselProps) {
        super(props);
        this.state = {
            title: props.title,
            books: props.books,
        }
        this.searchText = props.searchText
    }

    componentDidMount(): void {
        if(this.searchText !== '') {
            this.setState({
                books: this.filterBooks()
            })
        } 
    }
    searchText = '';
  
    /**
     * Added for Sorting by Genre Extension
     */
    sortingConfigs: SortingConfig[] = [];
    nameToOrder = new Map<string, boolean>();
    /**/

    filterBooks(): Book[] {
        return this.state.books.filter(book => {
          return book.title.toLowerCase().includes(this.searchText.toLowerCase());
        });
    }
    /**
     * Added for Sorting by Genre Extension
     */
    sortBooks(books: Book[]): Book[] {
        const sortedBooks = [...books];
        this.sortingConfigs.forEach(config => {
            const sortingMechanism = getSortingMechanism(config);
            sortedBooks.sort(sortingMechanism)
        })
        return sortedBooks;
    }
    /**
     * Added for Sorting by Genre Extension
     */
    sortBy = (propertyName: string): void => {
        const pendingChange = [...this.sortingConfigs];
        const sortingIndex = this.sortingConfigs
            .findIndex(configuration => configuration.propertyName === propertyName);
        if (sortingIndex !== -1) {
            const configuration: SortingConfig = this.sortingConfigs[sortingIndex];
            if (configuration.ascendingOrder) {
                pendingChange[sortingIndex] = {propertyName, ascendingOrder: false};
            } else {
                pendingChange.splice(sortingIndex, 1);
            }
        } else {
            pendingChange.push({propertyName, ascendingOrder: true});
        }
        this.sortingConfigs = pendingChange;
        this.nameToOrder =  getNameToOrder(pendingChange);
        this.setState(this.state);
    }

    render(): JSX.Element {
        return (
            <div className="shelf-container">
                <span className="shelf-title">{this.state.title}</span>
                <span className="view-all">View All</span>
                <span
                    className="view-all"
                    onClick={() => this.sortBy('genre')}>
                    By Genre
                </span>
                <div className="clear" />
                <div className="books-and-shelf">
                    <div className="book-wrap">
                        {
                            //this.renderShelfBook(this.state.books)
                            this.sortBooks(this.state.books).map(book => (
                                <ShelfBook key={book.id} title={book.title} img={book.img} />
                            ))
                        }
                        <AddBook />
                        <div className="clear" />
                    </div>
                    <div className="shelf"></div>
                </div>
            </div>
        );
    }

}

/**
 * Added for Sorting by Genre Extension
 */
function getSortingMechanism(config: SortingConfig): (book1: Book, book2: Book) => number {
    const orderIndex = config.ascendingOrder ? 1 : -1;
    switch (config.propertyName) {
        default:
        case 'title':
            return ((book1: Book, book2: Book) =>
                orderIndex * book1.title.localeCompare(book2.title));
        case 'author':
            return ((book1: Book, book2: Book) =>
                orderIndex * book1.author.fullName.localeCompare(book2.author.fullName));
        case 'shelf':
            return ((book1: Book, book2: Book) =>
                orderIndex * book1.predefinedShelf.shelfName
                    .localeCompare(book2.predefinedShelf.shelfName));
        case 'genre':
            return ((book1: Book, book2: Book) =>
                orderIndex * book1.bookGenre.toString().localeCompare(book2.bookGenre.toString()));
    }
}

/**
 * Added for Sorting by Genre Extension
 */
function getNameToOrder(configurations: SortingConfig[]): Map<string, boolean> {
    const nameToOrder = new Map<string, boolean>();
    configurations.forEach(configuration =>
        nameToOrder.set(configuration.propertyName, configuration.ascendingOrder));
    return nameToOrder;
}

type ShelfCarouselProps = {
    title: string;
    books: Book[];
    searchText: string;
}
