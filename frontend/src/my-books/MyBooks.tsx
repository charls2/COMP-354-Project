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

import React, {Component, ReactElement} from "react";
import {NavBar} from "../shared/navigation/NavBar";
import {Layout} from "../shared/components/Layout";
import BookList from '../shared/book-display/BookList';
import {Book} from '../shared/types/Book';
import "./MyBooks.css";
import {books} from "./books";


interface IState {
    bookList: Book[];
    favouriteBooks: Book[];
}


class MyBooks extends Component<Record<string, unknown>, IState> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            bookList: [],
            favouriteBooks: []
        };
        this.getBooks = this.getBooks.bind(this);
        this.getFavouriteBooks = this.getFavouriteBooks.bind(this);
    }

    componentDidMount(): void {
        this.getBooks();
        this.getFavouriteBooks();
    }

    getFavouriteBooks(): void {
        const favouriteBooks = Array.isArray(books) ? books.filter(book => book.isFavourite) : [];
        this.setState(state => ({
            favouriteBooks: [...favouriteBooks]
        }));
    }

    getBooks(): void {
        this.setState({
            bookList: books
        });
    }

    render(): ReactElement {
        return (
            <Layout title="My books" btn={<div className="my-book-top-buttons">
            </div>}>
                <NavBar />
                <div>
                    <BookList
                        key={this.state.bookList.length}
                        bookListData={this.state.bookList}/>
                </div>
            </Layout>
        );
    }
}

export default MyBooks;
