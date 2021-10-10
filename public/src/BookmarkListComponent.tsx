import React from 'react';
import ReactDOM from 'react-dom';

class BookmarkComponent extends React.Component {
	public constructor (
		private props
	) {
		super(props);
	}

	public render () {
		return (
			<div className="bookmark">
				<a href={ this.props.url }> { this.props.title } <small className="bookmark-detail">{ this.props.url }</small>
				</a>
			</div>
		);
	}
}

export class BookmarkListComponent extends React.Component {
	private bookmarkList: chrome.bookmarks.BookmarkTreeNode[] = [];

	public constructor (
		private props
	) {
		super(props);

		this.state = {
			done: false,
			query: '',
		};

		this.getBookmarks();
	}

	private getBookmarks () {
		chrome.bookmarks.search(
			'Tab$',
			roots => {
				if (roots.length > 0) {
					roots.forEach(root => {
						chrome.bookmarks.getChildren(root.id, bookmarks => {
							this.bookmarkList = this.bookmarkList.concat(bookmarks);
							this.setState({ done: true });
						});
					});
				}
				else {
					this.bookmarkList = [];
					this.setState({ done: true });
				}
			}
		);
	}

	public componentDidMount () {
		const box = (document as any).getElementById('filterBox');
		let timerId: number;

		box?.addEventListener('input', () => {
			clearTimeout(timerId);

			timerId = setTimeout(() => {
				this.setState({
					query: box.value,
				});
			}, 400);
		});
	}

	public render () {
		if (this.state.done) {
			const filteredList = this.bookmarkList
				.filter(bm =>
					bm.title.toLowerCase().includes(this.state.query)
						|| bm.url.toLowerCase().includes(this.state.query)
				)
				.map(bm => <BookmarkComponent key={ bm.url } url={ bm.url } title={ bm.title } />);

			if (filteredList.length > 0) {
				return filteredList;
			}
			else {
				return <h6> "{ this.state.query }" not found </h6>;
			}
		}
		else {
			return <h6> Reading Bookmarks ... </h6>;
		}
	}
}
