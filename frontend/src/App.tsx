import React from 'react';
import {
    BrowserRouter,
    Route,
} from "react-router-dom";
import MyBooks from "./my-books/MyBooks";
import BookOverview from "./book-overview/BookOverview";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    HOME,
    BOOK_OVERVIEW,
    MY_BOOKS,
} from "./shared/routes"
function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Route exact path={HOME} component={MyBooks} />
            <Route path={BOOK_OVERVIEW + "/:id"} component={BookOverview} />
            <Route path={MY_BOOKS} component={MyBooks} />
        </BrowserRouter>
    )
}

export default App;