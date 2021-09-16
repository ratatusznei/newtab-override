import React from 'react';
import ReactDOM from 'react-dom';
import { BookmarkListComponent } from './BookmarkListComponent.tsx';

(window as any).onload = () => {
	let bm = (
		<BookmarkListComponent/>
	);

	ReactDOM.render(bm, document.getElementById('root'));
};
